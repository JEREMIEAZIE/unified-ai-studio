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
                            <span class="chip" onclick="applyStyle(this, 'cinematic')">Cinematic</span>
                            <span class="chip" onclick="applyStyle(this, 'photorealistic')">Photorealistic</span>
                            <span class="chip" onclick="applyStyle(this, 'anime')">Anime</span>
                            <span class="chip" onclick="applyStyle(this, 'cyberpunk')">Cyberpunk</span>
                        </div>
                        <div class="result-stage" id="result-stage">
                            <div class="result-placeholder">
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
                                <option value="768">768px</option>
                            </select>
                        </div>
                        <div class="setting-group">
                            <label class="setting-label">Aspect Ratio</label>
                            <select class="setting-select" id="img-ar">
                                <option value="1:1">1:1 Square</option>
                                <option value="16:9">16:9 Landscape</option>
                                <option value="9:16">9:16 Portrait</option>
                            </select>
                        </div>
                        <div class="setting-row">
                            <div class="setting-group">
                                <label class="setting-label">Steps</label>
                                <input type="number" class="setting-input" id="img-steps" value="4">
                            </div>
                            <div class="setting-group">
                                <label class="setting-label">Images</label>
                                <input type="number" class="setting-input" id="img-num" value="1">
                            </div>
                        </div>
                        <button class="generate-btn" id="generate-btn" onclick="handleImageGenerate(document.getElementById('main-input').value)">Generate</button>
                    </div>
                </div>
            </div>
        `;
    },

    onLoad() {
        console.log('📸 Image Studio loaded');
        document.getElementById('topbar-title').textContent = 'Image Studio';
        // Set up input bar for image mode
        const input = document.getElementById('main-input');
        if (input) {
            input.placeholder = 'Describe the image you want to create...';
        }
    },

    onUnload() {
        console.log('📸 Image Studio unloaded');
    }
};