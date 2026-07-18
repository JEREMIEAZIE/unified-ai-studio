// js/pages/image.js
export default {
    render(container) {
        container.innerHTML = `
            <div class="image-workspace">
                <!-- Header Section -->
                <div class="workspace-header">
                    <div class="header-content">
                        <h1>Image Studio</h1>
                        <p>Create stunning AI-generated images with advanced controls</p>
                    </div>
                </div>

                <!-- Main Layout -->
                <div class="workspace-grid">
                    <!-- Left: Result Display -->
                    <div class="workspace-preview">
                        <div class="result-stage" id="result-stage">
                            <div class="result-placeholder">
                                <div class="placeholder-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                                        <circle cx="8.5" cy="8.5" r="1.5"/>
                                        <polyline points="21 15 16 10 5 21"/>
                                    </svg>
                                </div>
                                <h3>Your creation will appear here</h3>
                                <p>Enter a prompt below and click Generate</p>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Settings Panel -->
                    <div class="workspace-controls">
                        <!-- Style Selector -->
                        <div class="control-section">
                            <h3 class="section-title">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                                </svg>
                                Art Style
                            </h3>
                            <div class="style-chips">
                                <span class="chip" onclick="window.applyStyle(this, 'cinematic')">
                                    <span class="chip-icon">🎬</span> Cinematic
                                </span>
                                <span class="chip" onclick="window.applyStyle(this, 'photorealistic')">
                                    <span class="chip-icon">📸</span> Photorealistic
                                </span>
                                <span class="chip" onclick="window.applyStyle(this, 'anime')">
                                    <span class="chip-icon">🎨</span> Anime
                                </span>
                                <span class="chip" onclick="window.applyStyle(this, 'cyberpunk')">
                                    <span class="chip-icon">🌃</span> Cyberpunk
                                </span>
                                <span class="chip" onclick="window.applyStyle(this, 'fantasy')">
                                    <span class="chip-icon">✨</span> Fantasy
                                </span>
                                <span class="chip" onclick="window.applyStyle(this, '3d')">
                                    <span class="chip-icon">🎮</span> 3D Render
                                </span>
                            </div>
                        </div>

                        <!-- Dimensions -->
                        <div class="control-section">
                            <h3 class="section-title">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                                </svg>
                                Dimensions
                            </h3>
                            <div class="setting-group">
                                <label class="setting-label">Resolution</label>
                                <select class="setting-select" id="img-res">
                                    <option value="1024">1024px (High Quality)</option>
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
                        </div>

                        <!-- Generation Settings -->
                        <div class="control-section">
                            <h3 class="section-title">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="3"/>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                                </svg>
                                Advanced Settings
                            </h3>
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
                                <input type="text" class="setting-input" id="img-neg" placeholder="ugly, blurry, distorted...">
                            </div>
                        </div>

                        <!-- Generate Button -->
                        <button class="generate-btn" id="generate-btn" onclick="window.handleImageGenerate(document.getElementById('main-input').value)">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                            </svg>
                            Generate Image
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    onLoad() {
        document.getElementById('topbar-title').textContent = 'Image Studio';
        const input = document.getElementById('main-input');
        if (input) input.placeholder = 'Describe the image you want to create...';
    },

    onUnload() {
        console.log('Image Studio unloaded');
    }
};

window.handleImageGenerate = async function(prompt) {
    if (!prompt) {
        window.showToast('Please enter a prompt in the input bar', 'error');
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
                <div class="loading-spinner-large"></div>
                <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
                <div class="loading-text">Generating your image...</div>
            </div>
        `;
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
                stage.innerHTML = `
                    <div class="result-grid">
                        ${data.result_urls.map(url => {
                            const fullUrl = `${window.API.image}${url}`;
                            window.addToGallery(fullUrl, 'image', prompt);
                            return `
                                <div class="result-item">
                                    <img src="${fullUrl}" onclick="window.open(this.src)">
                                    <div class="result-actions">
                                        <a href="${fullUrl}" download class="action-btn" title="Download">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7 10 12 15 17 10"/>
                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            } else if (data.result_url) {
                const fullUrl = `${window.API.image}${data.result_url}`;
                window.addToGallery(fullUrl, 'image', prompt);
                stage.innerHTML = `
                    <div class="result-single">
                        <img src="${fullUrl}" onclick="window.open(this.src)">
                        <div class="result-actions">
                            <a href="${fullUrl}" download class="action-btn" title="Download">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="7 10 12 15 17 10"/>
                                    <line x1="12" y1="15" x2="12" y2="3"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                `;
            } else {
                throw new Error('No result returned from server');
            }
        }
        
        window.showToast('Image generated successfully!', 'success');
    } catch (e) {
        clearInterval(progressInterval);
        if (stage) {
            stage.innerHTML = `
                <div class="result-error">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <h3>Generation Failed</h3>
                    <p>${e.message}</p>
                </div>
            `;
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
