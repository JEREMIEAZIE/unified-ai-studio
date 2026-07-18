window.showToast = function(msg, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        toast.style.transition = 'all 0.3s';
    }, 2500);
    setTimeout(() => toast.remove(), 2800);
};

const STYLE_KEYWORDS = {
    cinematic: ', cinematic lighting, dramatic shadows, film grain, 8k, masterpiece',
    photorealistic: ', photorealistic, highly detailed, natural lighting, 8k, sharp focus',
    anime: ', anime style, vibrant colors, clean line art, masterpiece, detailed',
    cyberpunk: ', cyberpunk, neon lights, futuristic, rain, reflections, 8k',
    fantasy: ', fantasy art, magical atmosphere, ethereal lighting, detailed, 8k',
    '3d': ', 3D render, octane render, Unreal Engine, highly detailed, 8k'
};

window.applyStyle = function(el, style) {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    const input = document.getElementById('main-input');
    if (!input) return;
    let text = input.value;
    Object.values(STYLE_KEYWORDS).forEach(kw => { text = text.replace(kw, ''); });
    input.value = text + STYLE_KEYWORDS[style];
    input.focus();
};

window.handleInput = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
};

window.handleSend = async function() {
    const input = document.getElementById('main-input');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    input.style.height = 'auto';

    const currentPath = window.router?.currentPath;
    
    if (currentPath === '/chat') {
        if (window.handleChatSend) await window.handleChatSend(text);
    } else if (currentPath === '/create/image') {
        if (window.handleImageGenerate) window.handleImageGenerate(text);
    } else if (currentPath === '/create/video') {
        if (window.handleVideoGenerate) window.handleVideoGenerate(text);
    }
};
