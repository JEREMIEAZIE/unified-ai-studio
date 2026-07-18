export default {
    render(container) {
        container.innerHTML = `
            <div class="page-workspace">
                <div class="models-layout">
                    <div class="models-header">
                        <h1>Model Management</h1>
                        <p>Download and manage LoRAs for your AI models</p>
                    </div>
                    <div class="models-section">
                        <h2>Download New LoRA</h2>
                        <div class="lora-form">
                            <div class="form-group">
                                <label class="form-label">LoRA Name</label>
                                <input type="text" class="form-input" id="lora-name" placeholder="e.g., Creative Writing LoRA">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Download URL</label>
                                <input type="text" class="form-input" id="lora-url" placeholder="https://huggingface.co/... or https://civitai.com/...">
                            </div>
                            <button class="btn btn-primary" onclick="window.downloadLora()" id="download-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="7 10 12 15 17 10"/>
                                    <line x1="12" y1="15" x2="12" y2="3"/>
                                </svg>
                                Download & Register
                            </button>
                        </div>
                    </div>
                    <div class="models-section">
                        <h2>Registered LoRAs</h2>
                        <div id="lora-list" class="lora-list">
                            <div class="loading-spinner"><div class="spinner"></div></div>
                        </div>
                    </div>
                    <div class="models-section">
                        <h2>Where to Find LoRAs</h2>
                        <div class="info-cards">
                            <div class="info-card">
                                <h3>CivitAI</h3>
                                <p>Search for "uncensored" or "DPO" LoRAs</p>
                                <a href="https://civitai.com" target="_blank" class="btn btn-ghost">Visit CivitAI</a>
                            </div>
                            <div class="info-card">
                                <h3>HuggingFace</h3>
                                <p>Search for GGUF format LoRAs</p>
                                <a href="https://huggingface.co/models?search=uncensored+lora+gguf" target="_blank" class="btn btn-ghost">Browse Models</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    onLoad() {
        document.getElementById('topbar-title').textContent = 'Model Management';
        this.loadLoraList();
    },
    onUnload() { console.log('Models page unloaded'); },
    async loadLoraList() {
        const listContainer = document.getElementById('lora-list');
        if (!listContainer) return;
        try {
            const response = await fetch(`${window.API.chat}/list_loras`);
            const data = await response.json();
            if (data.loras && data.loras.length > 0) {
                listContainer.innerHTML = data.loras.map(lora => `
                    <div class="lora-item">
                        <div class="lora-info">
                            <div class="lora-name">${lora}</div>
                            <div class="lora-status">Ready to use</div>
                        </div>
                        <button class="btn btn-ghost btn-small" onclick="window.deleteLora('${lora}')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                            Delete
                        </button>
                    </div>
                `).join('');
            } else {
                listContainer.innerHTML = `<div class="empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p>No LoRAs registered yet</p><p class="text-muted">Download your first LoRA above</p></div>`;
            }
        } catch (e) {
            listContainer.innerHTML = `<div class="error-state"><p>Failed to load LoRA list</p><p class="text-muted">${e.message}</p><p class="text-muted">Make sure the chat server is running</p></div>`;
        }
    }
};

window.downloadLora = async function() {
    const nameInput = document.getElementById('lora-name');
    const urlInput = document.getElementById('lora-url');
    const btn = document.getElementById('download-btn');
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    if (!name || !url) { window.showToast('Please fill in both fields', 'error'); return; }
    try { new URL(url); } catch { window.showToast('Please enter a valid URL', 'error'); return; }
    
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> Downloading...';
    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('url', url);
        const response = await fetch(`${window.API.chat}/register_lora`, { method: 'POST', body: formData });
        const data = await response.json();
        if (data.status === 'success') {
            window.showToast(`LoRA "${name}" downloaded successfully!`, 'success');
            nameInput.value = '';
            urlInput.value = '';
            const modelsPage = window.router.currentPage;
            if (modelsPage && modelsPage.loadLoraList) modelsPage.loadLoraList();
        } else { throw new Error(data.message || 'Download failed'); }
    } catch (e) {
        window.showToast(`Download failed: ${e.message}`, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download & Register`;
    }
};

window.deleteLora = async function(name) {
    if (!confirm(`Delete LoRA "${name}"?`)) return;
    window.showToast('LoRA deletion not yet implemented', 'error');
};
