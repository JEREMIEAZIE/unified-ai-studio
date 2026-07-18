import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, deleteDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBY9mSpUeat1zu70i4JpcB-7fYxZj5YfCk",
    authDomain: "slk-1-58b0d.firebaseapp.com",
    projectId: "slk-1-58b0d",
    storageBucket: "slk-1-58b0d.firebasestorage.app",
    messagingSenderId: "1018460322951",
    appId: "1:1018460322951:web:b05f8be9adfb323b36cc22"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.currentUserId = null;
window.currentConvId = null;
window.conversations = [];
window.unsubscribeChats = null;

signInAnonymously(auth).catch(e => console.error("Auth error:", e));
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.currentUserId = user.uid;
        setupChats();
    }
});

function setupChats() {
    const q = query(collection(db, `users/${window.currentUserId}/chats`), orderBy("updatedAt", "desc"));
    if (window.unsubscribeChats) window.unsubscribeChats();
    
    window.unsubscribeChats = onSnapshot(q, (snap) => {
        const dbChats = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        window.conversations = dbChats.map(dbChat => {
            const localChat = window.conversations.find(c => c.id === dbChat.id);
            const dbTime = dbChat.updatedAt?.toMillis ? dbChat.updatedAt.toMillis() : (dbChat.updatedAt || 0);
            const localTime = localChat ? (localChat.updatedAt || 0) : 0;
            if (localChat && localTime > dbTime) return localChat;
            return dbChat;
        });
        
        window.conversations.sort((a, b) => {
            const tA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : (a.updatedAt || 0);
            const tB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : (b.updatedAt || 0);
            return tB - tA;
        });

        if (window.renderChatList) window.renderChatList();
        
        if (!window.isGenerating && window.currentConvId) {
            const active = window.conversations.find(c => c.id === window.currentConvId);
            if (active && window.renderMessages) window.renderMessages(active);
        }
    }, (err) => console.error("Firestore error:", err));
}

window.db = db;
window.serverTimestamp = serverTimestamp;
window.setDoc = setDoc;
window.deleteDoc = deleteDoc;
window.doc = doc;
window.setupChats = setupChats;
