export default {
    render(container) {
        container.innerHTML = `
            <div class="gallery-header">
                <h2>Your Gallery</h2>
                <div class="gallery-filters">
                    <button class="filter-btn active" onclick="window.filterGallery('all', this)">All</button>
                    <button class="filter-btn" onclick="window.filterGallery('image', this)">Images</button>
                    <button class="filter-btn" onclick="window.filterGallery('video', this)">Videos</button>
                </div>
            </div>
            <div class="gallery-grid" id="gallery-grid">
                <div class="gallery-empty"><h3 style="font-size:18px; margin-bottom:8px; color:var(--text-muted);">No creations yet</h3><p>Generate something to see it here</p></div>
            </div>
        `;
    },
    onLoad() {
        document.getElementById('topbar-title').textContent = 'Gallery';
        this.renderGallery('all');
    },
    onUnload() { console.log('Gallery unloaded'); },
    renderGallery(filter = 'all') {
        const grid = document.getElementById('gallery-grid');
        if (!grid) return;
        const gallery = JSON.parse(localStorage.getItem('ss_gallery') || '[]');
        const filtered = filter === 'all' ? gallery : gallery.filter(g => g.type === filter);
        const count = document.getElementById('gallery-count');
        if (count) count.textContent = gallery.length;
        if (filtered.length === 0) {
            grid.innerHTML = `<div class="gallery-empty"><h3 style="font-size:18px; margin-bottom:8px; color:var(--text-muted);">No ${filter === 'all' ? '' : filter} creations yet</h3><p>Generate something to see it here</p></div>`;
            return;
        }
        grid.innerHTML = filtered.map(item => 
            `<div class="gallery-item" onclick="window.openGalleryItem('${item.id}')">
                ${item.type === 'image' ? `<img src="${item.url}" loading="lazy">` : `<video src="${item.url}" muted></video>`}
                <div class="overlay">
                    <div class="meta">
                        <strong>${item.type === 'image' ? 'Image' : 'Video'}</strong>
                        <div>${item.prompt ? item.prompt.substring(0, 60) + '...' : 'No prompt'}</div>
                    </div>
                </div>
            </div>`
        ).join('');
    }
};

window.filterGallery = function(filter, el) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    const galleryPage = window.router?.currentPage;
    if (galleryPage && galleryPage.renderGallery) galleryPage.renderGallery(filter);
};

window.openGalleryItem = function(id) {
    const gallery = JSON.parse(localStorage.getItem('ss_gallery') || '[]');
    const item = gallery.find(g => g.id === id);
    if (!item) return;
    if (item.type === 'image') {
        window.open(item.url);
    } else {
        const w = window.open('', '_blank');
        w.document.write(`<html><body style="margin:0; background:#000; display:flex; align-items:center; justify-content:center; height:100vh;"><video src="${item.url}" controls autoplay style="max-width:100%; max-height:100%;"></video></body></html>`);
    }
};
