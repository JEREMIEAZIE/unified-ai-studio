window.API = { 
    chat: "https://coroner-relock-wrath.ngrok-free.dev", 
    image: "https://concrete-gossip-outpost.ngrok-free.dev", 
    video: "https://satin-keep-cupping.ngrok-free.dev" 
};

window.apiCall = async function(endpoint, formData) {
    try {
        const res = await fetch(endpoint, { method: 'POST', body: formData });
        if (!res.ok) throw new Error(`Server returned ${res.status}. Is your Kaggle notebook running?`);
        return await res.json();
    } catch (e) {
        throw new Error(e.message);
    }
};
