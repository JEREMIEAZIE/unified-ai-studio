// js/pages/image.js
export default {
    render(container) {
        container.innerHTML = `
            <div class="page-workspace">
                <div class="workspace-layout">
                    <div class="workspace-main">
                        <div class="mode-tabs">
                            <button class="mode-tab active">Image Studio</button>
                        </div>
                        <div class="style-chips">
                            <span style="font-size:11px; color:var(--text-dim); margin-right:4px; align-self:center;">Styles:</span>
                            <span class="chip" onclick="applyStyle(this, 'cinematic')">Cinematic</span>
                            <span class="chip" onclick="applyStyle(this, 'photorealistic')">Photorealistic</span>
                            <span class="chip" onclick="applyStyle(this, 'anime')">Anime</span>
                            <span class="chip" onclick="applyStyle(this, 'cyberpunk')">Cyberpunk</span>
                            <span class="chip" onclick="applyStyle(this, 'fantasy')">Fantasy</span>
                            <span class="chip" onclick="applyStyle(this, '3d')">3D Render</span>
                        </div>
                        <div class="result-stage" id="result-stage">
                            <div class="result-placeholder">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                <h3>Your image will appear here</h3>
                                <p>Use the input bar below to generate</p>
                            </div>
                        </div>
                    </div>
                    <div class="settings-panel">
                        <div class="settings-title"><span>Image Settings</span></div>
                        <div class="setting-group">
                            <label class="setting-label">Resolution</label>
                            <select class="setting-select" id="img-res">
                                <option value="1024">1024px</option>
                                <option value="768">768px (Faster)</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Aspect Ratio</label>
                            <select class="setting-select" id="img-ar">
                                <option value="1:1">1:1 Square</option>
                                <option value="16:9">16:9 Landscape</option>
                                <option value="9:16">9:16 Portrait</option>
                                <option value="4:3">4:3 Standard</option>
                            </select>
                        </div>
                        <div class="setting-row">
                            <div class="setting-group">
                                <label class="setting-label">Steps</label>
                                <input type="number" class="setting-input" id="img-steps" value="4" min="1" max="50">
                            </div>
                            <div class="setting-group">
                                <label class="setting-label">Images</label>
                                <input type="number" class="setting-input" id="img-num" value="1" min="1" max="4">
                            </div>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Seed (-1 = random)</label>
                            <input type="number" class="setting-input" id="img-seed" value="-1">
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Negative Prompt</label>
                            <input type="text" class="setting-input" id="img-neg" placeholder="ugly, blurry, distorted">
                        </div>
                        <button class="generate-btn" id="generate-btn" onclick="window.handleImageGenerate(document.getElementById('main-input').value)">Generate</button>
                    </div>
                </div>
            </div>
        `;
    },

    onLoad() {
        document.getElementById('topbar-title').textContent = 'Image Studio';
        const input = document.getElementById('main-input');
        if (input) {
            input.placeholder = 'Describe the image you want to create...';
        }
    },

    onUnload() {
        console.log('Image Studio unloaded');
    }
};

window.handleImageGenerate = async function(prompt) {
    if (!prompt) {
        window.showToast('Please enter a prompt', 'error');
        return;
    }
    
    if (window.isGenerating) return;
    window.isGenerating = true;
    
    const btn = document.getElementById('generate-btn');
    const stage = document.getElementById('result-stage');
    if (btn) btn.disabled = true;
    
    if (stage) {
        stage.innerHTML = `
            <div class="loading-overlay">
                <div class="spinner"></div>
                <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
                <div class="loading-text">Generating image...</div>
            </div>`;
    }
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 8;
        if (progress > 92) progress = 92;
        const fill = document.getElementById('progress-fill');
        if (fill) fill.style.width = progress + '%';
    }, 1500);

    try {
        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('resolution', document.getElementById('img-res').value);
        formData.append('aspect_ratio', document.getElementById('img-ar').value);
        formData.append('steps', document.getElementById('img-steps').value);
        formData.append('num_images', document.getElementById('img-num').value);
        formData.append('seed', document.getElementById('img-seed').value);
        formData.append('negative_prompt', document.getElementById('img-neg').value);
        
        const data = await window.apiCall(`${window.API.image}/generate`, formData);
        clearInterval(progressInterval);
        
        if (data.error) throw new Error(data.error);
        
        if (stage) {
            if (data.result_urls && data.result_urls.length > 0) {
                stage.innerHTML = `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:12px; padding:16px; width:100%;">${
                    data.result_urls.map(url => {
                        const fullUrl = `${window.API.image}${url}`;
                        window.addToGallery(fullUrl, 'image', prompt);
                        return `<img src="${fullUrl}" style="width:100%; border-radius:8px; cursor:pointer;" onclick="window.open(this.src)">`;
                    }).join('')
                }</div>`;
            } else if (data.result_url) {
                const fullUrl = `${window.API.image}${data.result_url}`;
                window.addToGallery(fullUrl, 'image', prompt);
                stage.innerHTML = `<img src="${fullUrl}" style="max-width:100%; max-height:100%; border-radius:8px;" onclick="window.open(this.src)">`;
            } else {
                throw new Error('No result returned');
            }
        }
        
        window.showToast('Image generated successfully', 'success');
    } catch (e) {
        clearInterval(progressInterval);
        if (stage) {
            stage.innerHTML = `<div class="result-placeholder"><h3 style="color:var(--danger);">Generation failed</h3><p>${e.message}</p></div>`;
        }
        window.showToast('Error: ' + e.message, 'error');
    } finally {
        window.isGenerating = false;
        if (btn) btn.disabled = false;
    }
};

window.addToGallery = function(url, type, prompt) {
    if (!window.gallery) window.gallery = [];
    window.gallery.unshift({ id: Date.now().toString(36), url, type, prompt, createdAt: Date.now() });
    if (window.gallery.length > 100) window.gallery = window.gallery.slice(0, 100);
    localStorage.setItem('ss_gallery', JSON.stringify(window.gallery));
    const count = document.getElementById('gallery-count');
    if (count) count.textContent = window.gallery.length;
};
