// config.js - Navigation Tree (Arborescence)
// Add/remove/reorder pages here. Nav updates automatically.

export const NAV_TREE = [
    {
        id: 'create',
        label: 'Create',
        icon: 'layers',
        path: '/create',
        children: [
            { id: 'image', label: 'Image Studio', icon: 'image', path: '/create/image' },
            { id: 'video', label: 'Video Studio', icon: 'video', path: '/create/video' }
        ]
    },
    {
        id: 'chat',
        label: 'Chat',
        icon: 'message',
        path: '/chat'
    },
    {
        id: 'gallery',
        label: 'Gallery',
        icon: 'gallery',
        path: '/gallery'
    },
    {
        id: 'tools',
        label: 'Tools',
        icon: 'settings',
        path: '/tools',
        children: [
            { id: 'settings', label: 'Settings', icon: 'cog', path: '/tools/settings' },
            { id: 'models', label: 'Models', icon: 'cpu', path: '/tools/models' }
        ]
    },
    {
        id: 'new-feature',
        label: 'New Feature',
        icon: 'star',
        path: '/new-feature'
    },
    {
    id: 'audio',
    label: 'Audio Studio',
    icon: 'star',
    path: '/audio'
}

 

];

// Page registry - maps paths to modules
export const PAGE_REGISTRY = {
    '/create/image': () => import('./js/pages/image.js'),
    '/create/video': () => import('./js/pages/video.js'),
    '/chat': () => import('./js/pages/chat.js'),
    '/gallery': () => import('./js/pages/gallery.js'),
    '/audio': () => import('./js/pages/audio.js'),
    '/tools/settings': () => import('./js/pages/settings.js'),
    '/tools/models': () => import('./js/pages/models.js')
};

// Default page when app loads
export const DEFAULT_PATH = '/create/image';