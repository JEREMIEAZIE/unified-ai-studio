export default {
    render(container) {
        container.innerHTML = `
            <div class="page-workspace">
                <div class="workspace-layout">
                    <div class="workspace-main">
                        <div class="mode-tabs"><button class="mode-tab active">Video Studio</button></div>
                        <div class="result-stage" id="result-stage">
                            <div class="result-placeholder">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                                <h3>Your video will appear here</h3>
                                <p>Use the input bar below to generate</p>
                            </div>
                        </div>
                    </div>
                    <div class="settings-panel">
                        <div class="settings-title"><span>Video Settings</span></div>
                        <div class="setting-group">
                            <label class="setting-label">Duration</label>
                            <select class="setting-select" id="vid-dur"><option value="49">2s</option><option value="73">3s</option><option value="121" selected>5s</option><option value="193">8s</option></select>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Resolution</label>
                            <select class="setting-select" id="vid-res"><option value="720p" selected>720p</option><option value="540p">540p</option><option value="480p">480p</option></select>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Aspect Ratio</label>
                            <select class="setting-select" id="vid-ar"><option value="16:9">16:9</option><option value="9:16">9:16</option><option value="1:1">1:1</option></select>
                        </div>
                        <div class="setting-row">
                            <div class="setting-group"><label class="setting-label">Steps</label><input type="number" class="setting-input" id="vid-steps" value="8" min="2" max="50"></div>
                            <div class="setting-group"><label class="setting-label">Guide Scale</label><input type="number" class="setting-input" id="vid-guide" value="3.0" step="0.5" min="1" max="8"></div>
                        </div>
                        <div class="setting-group"><label class="setting-label">Seed (-1 = random)</label><input type="number" class="setting-input" id="vid-seed" value="-1"></div>
                        <button class="generate-btn" id="generate-btn" onclick="window.handleVideoGenerate(document.getElementById('main-input').value)">Generate</button>
                    </div>
                </div>
            </div>
        `;
    },
    onLoad() {
        document.getElementById('topbar-title').textContent = 'Video Studio';
        const input = document.getElementById('main-input');
        if (input) input.placeholder = 'Describe the video scene...';
    },
    onUnload() { console.log('Video Studio unloaded'); }
};

window.handleVideoGenerate = async function(prompt) {
    if (!prompt) { window.showToast('Please enter a prompt', 'error'); return; }
    if (window.isGenerating) return;
    window.isGenerating = true;
    
    const btn = document.getElementById('generate-btn');
    const stage = document.getElementById('result-stage');
    if (btn) btn.disabled = true;
    if (stage) {
        stage.innerHTML = `<div class="loading-overlay"><div class="spinner"></div><div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div><div class="loading-text">Rendering video...</div></div>`;
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
        formData.append('duration', document.getElementById('vid-dur').value);
        formData.append('resolution', document.getElementById('vid-res').value);
        formData.append('aspect_ratio', document.getElementById('vid-ar').value);
        formData.append('steps', document.getElementById('vid-steps').value);
        formData.append('guide_scale', document.getElementById('vid-guide').value);
        formData.append('seed', document.getElementById('vid-seed').value);
        
        const data = await window.apiCall(`${window.API.video}/generate`, formData);
        clearInterval(progressInterval);
        if (data.error) throw new Error(data.error);
        
        if (stage) {
            if (data.result_url) {
                const fullUrl = `${window.API.video}${data.result_url}`;
                window.addToGallery(fullUrl, 'video', prompt);
                stage.innerHTML = `<video controls autoplay loop src="${fullUrl}" style="max-width:100%; max-height:100%; border-radius:8px;"></video>`;
                window.showToast('Video generated successfully', 'success');
            } else { throw new Error('No result returned'); }
        }
    } catch (e) {
        clearInterval(progressInterval);
        if (stage) stage.innerHTML = `<div class="result-placeholder"><h3 style="color:var(--danger);">Generation failed</h3><p>${e.message}</p></div>`;
        window.showToast('Error: ' + e.message, 'error');
    } finally {
        window.isGenerating = false;
        if (btn) btn.disabled = false;
    }
};
