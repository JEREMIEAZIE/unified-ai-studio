// js/pages/chat.js
export default {
    render(container) {
        container.innerHTML = `
            <div class="chat-container">
                <!-- Sidebar: History & Settings -->
                <aside class="chat-sidebar">
                    <div class="chat-sidebar-header">
                        <h3>Conversations</h3>
                        <button class="btn btn-primary btn-small" onclick="window.newChat()" title="New Chat">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            New
                        </button>
                    </div>
                    
                    <div class="chat-list" id="chat-list">
                        <div class="chat-list-empty">Loading history...</div>
                    </div>
                    
                    <div class="chat-sidebar-footer">
                        <div class="lora-selector">
                            <label class="form-label">Active Model / LoRA</label>
                            <select class="form-select" id="lora-selector">
                                <option value="None">Base Model (Uncensored)</option>
                            </select>
                        </div>
                    </div.>
                </aside>

                <!-- Main Chat Area -->
                <main class="chat-main">
                    <div class="chat-messages" id="chat-messages">
                        <!-- Welcome Screen (Shown when empty) -->
                        <div class="chat-welcome" id="chat-welcome">
                            <div class="welcome-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                            </div>
                            <h1>How can I assist you today?</h1>
                            <p>Powered by an uncensored, highly capable AI with live web access.</p>
                            
                            <div class="suggestion-grid">
                                <div class="suggestion-card" onclick="window.useSuggestion(this)">
                                    <div class="suggestion-icon">💡</div>
                                    <div class="suggestion-text">Explain quantum computing in simple terms</div>
                                </div>
                                <div class="suggestion-card" onclick="window.useSuggestion(this)">
                                    <div class="suggestion-icon">✍️</div>
                                    <div class="suggestion-text">Write a cyberpunk story opening</div>
                                </div>
                                <div class="suggestion-card" onclick="window.useSuggestion(this)">
                                    <div class="suggestion-icon">🔍</div>
                                    <div class="suggestion-text">What are the latest trends in AI?</div>
                                </div>
                                <div class="suggestion-card" onclick="window.useSuggestion(this)">
                                    <div class="suggestion-icon">💻</div>
                                    <div class="suggestion-text">Help me debug this Python code</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
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

    onUnload() {
        console.log('Chat page unloaded');
    },

    renderChatList() {
        const list = document.getElementById('chat-list');
        if (!list) return;
        
        if (window.conversations.length === 0) { 
            list.innerHTML = `<div class="chat-list-empty">No conversations yet</div>`; 
            return; 
        }
        
        list.innerHTML = window.conversations.map(c => `
            <div class="chat-item ${c.id === window.currentConvId ? 'active' : ''}" onclick="window.loadChat('${c.id}')">
                <svg class="chat-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span class="chat-item-title">${c.title || 'New Chat'}</span>
                <button class="chat-item-delete" onclick="window.deleteChat('${c.id}', event)" title="Delete">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
            </div>
        `).join('');
    },

    renderMessages(conv) {
        const container = document.getElementById('chat-messages');
        const welcomeScreen = document.getElementById('chat-welcome');
        if (!container) return;
        
        // Hide welcome screen if there are messages
        if (welcomeScreen) {
            welcomeScreen.style.display = (conv && conv.messages && conv.messages.length > 0) ? 'none' : 'flex';
        }

        // Clear existing messages (except welcome screen)
        const existingMessages = container.querySelectorAll('.chat-message');
        existingMessages.forEach(msg => msg.remove());

        if (!conv || !conv.messages || conv.messages.length === 0) {
            return;
        }
        
        // Render messages
        conv.messages.forEach(m => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `chat-message ${m.role}`;
            
            const avatar = m.role === 'user' ? 'U' : `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                </svg>
            `;
            
            // Enhanced markdown-like formatting for code blocks
            const formattedContent = m.content
                .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
                .replace(/\n/g, '<br>');
            
            msgDiv.innerHTML = `
                <div class="chat-avatar">${avatar}</div>
                <div class="chat-bubble">${formattedContent}</div>
            `;
            container.appendChild(msgDiv);
        });
        
        // Smooth scroll to bottom
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    },

    async loadLoraSelector() {
        const selector = document.getElementById('lora-selector');
        if (!selector) return;
        try {
            const response = await fetch(`${window.API.chat}/list_loras`);
            const data = await response.json();
            if (data.loras && data.loras.length > 0) {
                const options = data.loras.map(lora => `<option value="${lora}">${lora}</option>`).join('');
                selector.innerHTML = `<option value="None">Base Model (Uncensored)</option>${options}`;
            }
        } catch (e) { 
            console.error('Failed to load LoRAs:', e); 
        }
    }
};

// ==========================================
// GLOBAL CHAT FUNCTIONS
// ==========================================

window.useSuggestion = function(el) {
    const text = el.querySelector('.suggestion-text').textContent;
    const input = document.getElementById('main-input');
    if (input) { 
        input.value = text; 
        // Trigger send immediately
        const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
        input.dispatchEvent(event);
    }
};

window.handleChatSend = async function(text) {
    if (!window.currentConvId) await window.newChat();
    window.isGenerating = true;
    await window.addMsg('user', text);
    
    const btn = document.getElementById('send-btn');
    btn.disabled = true;
    
    const container = document.getElementById('chat-messages');
    const welcomeScreen = document.getElementById('chat-welcome');
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    
    const loadingId = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.id = loadingId;
    loadingDiv.className = 'chat-message assistant';
    loadingDiv.innerHTML = `
        <div class="chat-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
        </div>
        <div class="chat-bubble">
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    container.appendChild(loadingDiv);
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });

    const conv = window.conversations.find(c => c.id === window.currentConvId);
    const messagesForApi = conv ? conv.messages.filter(m => m.id !== loadingId).map(m => ({role: m.role, content: m.content})) : [{role: 'user', content: text}];
    
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
        await window.addMsg('assistant', `⚠️ Error: ${e.message}`);
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
    
    const msgObj = { role, content, timestamp: Date.now(), id: 'msg-' + Date.now() };
    conv.messages.push(msgObj);
    
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
                messages: conv.messages, 
                title: conv.title, 
                updatedAt: window.serverTimestamp()
            }, { merge: true });
        } catch (e) { console.error("Firestore save error:", e); }
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
    if (!confirm('Delete this conversation permanently?')) return;
    
    window.conversations = window.conversations.filter(c => c.id !== id);
    if (window.currentConvId === id) {
        window.currentConvId = window.conversations.length > 0 ? window.conversations[0].id : null;
    }
    
    const chatPage = window.router.currentPage;
    if (chatPage && chatPage.renderChatList) chatPage.renderChatList();
    if (window.currentConvId) {
        const conv = window.conversations.find(c => c.id === window.currentConvId);
        if (conv && chatPage && chatPage.renderMessages) chatPage.renderMessages(conv);
    } else if (chatPage && chatPage.renderMessages) {
        chatPage.renderMessages({ messages: [] }); // Show welcome screen
    }
    
    if (window.currentUserId) {
        try { await window.deleteDoc(window.doc(window.db, `users/${window.currentUserId}/chats`, id)); } 
        catch (e) { console.error("Delete error:", e); }
    }
};
