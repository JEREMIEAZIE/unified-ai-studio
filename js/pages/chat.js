// js/pages/chat.js - Updated render() function
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
                    
                    <!-- LoRA Selector -->
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
        if (input) {
            input.placeholder = 'Message the AI...';
        }
        this.renderChatList();
        await this.loadLoraSelector();
        
        if (window.currentConvId) {
            const conv = window.conversations.find(c => c.id === window.currentConvId);
            if (conv) this.renderMessages(conv);
        }
    },

    async loadLoraSelector() {
        const selector = document.getElementById('lora-selector');
        if (!selector) return;

        try {
            const response = await fetch(`${window.API.chat}/list_loras`);
            const data = await response.json();
            
            if (data.loras && data.loras.length > 0) {
                const options = data.loras.map(lora => 
                    `<option value="${lora}">${lora}</option>`
                ).join('');
                selector.innerHTML = `<option value="None">None (Base Model)</option>${options}`;
            }
        } catch (e) {
            console.error('Failed to load LoRAs:', e);
        }
    },

    // ... rest of the chat.js functions remain the same
};
