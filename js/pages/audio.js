export default {
    render(container) {
        container.innerHTML = `<h1>Audio Studio</h1><p>Coming soon...</p>`;
    },
    onLoad() {
        document.getElementById('topbar-title').textContent = 'Audio Studio';
    }
};