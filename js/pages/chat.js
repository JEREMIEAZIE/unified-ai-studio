export default {
    render(container) {
        container.innerHTML = `
            <div class="chat-layout">
                <div class="chat-sidebar">
                    <div class="chat-sidebar-header">
                        <h3>Chats</h3>
                        <button class="btn btn-primary btn-small" onclick="window.newChat()">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            New
                        </button>
                    </div>
                    <div class="chat-list" id="chat-list"></div>
                    <div class="lora-selector">
                        <label class="form-label">Active LoRA</label>
                        <select class="form-select" id="lora-selector">
                            <option value="None">None (Base Model)</option>
                        </select>
                    </div>
                </div>
                <div class="chat-main">
                    <div class="chat-messages" id="chat-messages">
                        <div class="chat-welcome">
                            <h1>How can I help?</h1>
                            <p>Powered by Dolphin 2.9.4 (Uncensored) with live web access</p>
                            <div class="suggestion-grid">
                                <div class="suggestion" onclick="window.useSuggestion(this)">Explain quantum computing simply</div>
                                <div class="suggestion" onclick="window.useSuggestion(this)">Write a cyberpunk story opening</div>
                                <div class="suggestion" onclick="window.useSuggestion(this)">What's trending in AI today?</div>
                                <div class="suggestion" onclick="window.useSuggestion(this)">Help me debug Python code</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async onLoad() {
        document.getElementById('topbar-title').textContent = 'Chat';
        const input = document.getElementById('main-input');
        if (input) input.placeholder = 'Message the AI...';
        this.renderChatList();
        await this.loadLoraSelector();
        if (window.currentConvId) {
            const conv = window.conversations.find(c => c.id === window.currentConvId);
            if (conv) this.renderMessages(conv);
        }
    },

    onUnload() { console.log('Chat unloaded'); },

    renderChatList() {
        const list = document.getElementById('chat-list');
        if (!list) return;
        if (window.conversations.length === 0) { 
            list.innerHTML = `<div style="padding:12px; color:var(--text-dim); font-size:11px;">No chats yet</div>`; 
            return; 
        }
        list.innerHTML = window.conversations.map(c => 
            `<div class="chat-item ${c.id === window.currentConvId ? 'active' : ''}" onclick="window.loadChat('${c.id}')">
                <span>${c.title || 'New Chat'}</span>
                <button onclick="window.deleteChat('${c.id}', event)" title="Delete">×</button>
            </div>`
        ).join('');
    },

    renderMessages(conv) {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        if (!conv || !conv.messages || conv.messages.length === 0) {
            this.render(container);
            return;
        }
        container.innerHTML = conv.messages.map(m => 
            `<div class="msg ${m.role}">
                <div class="avatar">${m.role === 'user' ? 'U' : 'AI'}</div>
                <div class="bubble">${m.content.replace(/\n/g, '<br>').replace(/```([\s\S]*?)```/g, '<pre>$1</pre>')}</div>
            </div>`
        ).join('');
        container.scrollTop = container.scrollHeight;
    },

    async loadLoraSelector() {
        const selector = document.getElementById('lora-selector');
        if (!selector) return;
        try {
            const response = await fetch(`${window.API.chat}/list_loras`);
            const data = await response.json();
            if (data.loras && data.loras.length > 0) {
                const options = data.loras.map(lora => `<option value="${lora}">${lora}</option>`).join('');
                selector.innerHTML = `<option value="None">None (Base Model)</option>${options}`;
            }
        } catch (e) { console.error('Failed to load LoRAs:', e); }
    }
};

window.useSuggestion = function(el) {
    const input = document.getElementById('main-input');
    if (input) { input.value = el.textContent; handleSend(); }
};

window.handleChatSend = async function(text) {
    if (!window.currentConvId) await window.newChat();
    window.isGenerating = true;
    await window.addMsg('user', text);
    
    const btn = document.getElementById('send-btn');
    btn.disabled = true;
    
    const container = document.getElementById('chat-messages');
    const loadingId = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.id = loadingId;
    loadingDiv.className = 'msg assistant';
    loadingDiv.innerHTML = `<div class="avatar">AI</div><div class="bubble"><div class="spinner" style="width:16px; height:16px;"></div></div>`;
    container.appendChild(loadingDiv);
    container.scrollTop = container.scrollHeight;

    const conv = window.conversations.find(c => c.id === window.currentConvId);
    const messagesForApi = conv ? conv.messages.filter(m => m.role !== 'loading').map(m => ({role: m.role, content: m.content})) : [{role: 'user', content: text}];
    
    const loraSelector = document.getElementById('lora-selector');
    const selectedLora = loraSelector ? loraSelector.value : 'None';
    
    try {
        const formData = new FormData();
        formData.append('messages', JSON.stringify(messagesForApi));
        formData.append('search_web', 'true');
        formData.append('lora_name', selectedLora);
        
        const data = await window.apiCall(`${window.API.chat}/generate_chat`, formData);
        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();
        await window.addMsg('assistant', data.result_text || 'No response.');
    } catch (e) {
        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();
        await window.addMsg('assistant', `Error: ${e.message}`);
    } finally {
        window.isGenerating = false;
        btn.disabled = false;
    }
};

window.addMsg = async function(role, content) {
    if (!window.currentConvId) return;
    let conv = window.conversations.find(c => c.id === window.currentConvId);
    if (!conv) { 
        conv = { id: window.currentConvId, title: 'New Chat', messages: [], updatedAt: Date.now() }; 
        window.conversations.unshift(conv); 
    }
    conv.messages.push({ role, content, timestamp: Date.now() });
    if (conv.title === 'New Chat' && role === 'user') {
        conv.title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
    }
    conv.updatedAt = Date.now();
    
    const chatPage = window.router.currentPage;
    if (chatPage && chatPage.renderMessages) chatPage.renderMessages(conv);
    if (chatPage && chatPage.renderChatList) chatPage.renderChatList();
    
    if (window.currentUserId) {
        try {
            await window.setDoc(window.doc(window.db, `users/${window.currentUserId}/chats`, window.currentConvId), {
                messages: conv.messages, title: conv.title, updatedAt: window.serverTimestamp()
            }, { merge: true });
        } catch (e) { console.error(e); }
    }
};

window.newChat = async function() {
    const newId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    window.currentConvId = newId;
    const newConv = { id: newId, title: 'New Chat', messages: [], updatedAt: Date.now() };
    window.conversations.unshift(newConv);
    const chatPage = window.router.currentPage;
    if (chatPage && chatPage.renderChatList) chatPage.renderChatList();
    if (chatPage && chatPage.renderMessages) chatPage.renderMessages(newConv);
    if (window.currentUserId) {
        try { 
            await window.setDoc(window.doc(window.db, `users/${window.currentUserId}/chats`, newId), { 
                title: 'New Chat', messages: [], createdAt: window.serverTimestamp(), updatedAt: window.serverTimestamp() 
            }); 
        } catch (e) { console.error(e); }
    }
    if (window.router) window.router.navigate('/chat');
};

window.loadChat = function(id) {
    window.currentConvId = id;
    const chatPage = window.router.currentPage;
    if (chatPage && chatPage.renderChatList) chatPage.renderChatList();
    const conv = window.conversations.find(c => c.id === id);
    if (conv && chatPage && chatPage.renderMessages) chatPage.renderMessages(conv);
    if (window.router) window.router.navigate('/chat');
};

window.deleteChat = async function(id, event) {
    if (event) event.stopPropagation();
    if (!confirm('Delete this chat?')) return;
    window.conversations = window.conversations.filter(c => c.id !== id);
    if (window.currentConvId === id) {
        window.currentConvId = window.conversations.length > 0 ? window.conversations[0].id : null;
    }
    const chatPage = window.router.currentPage;
    if (chatPage && chatPage.renderChatList) chatPage.renderChatList();
    if (window.currentConvId) {
        const conv = window.conversations.find(c => c.id === window.currentConvId);
        if (conv && chatPage && chatPage.renderMessages) chatPage.renderMessages(conv);
    }
    if (window.currentUserId) {
        try { await window.deleteDoc(window.doc(window.db, `users/${window.currentUserId}/chats`, id)); } 
        catch (e) {}
    }
};
