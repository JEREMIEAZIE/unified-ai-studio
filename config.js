// config.js - Navigation Tree (Arborescence)

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
        id: 'models',
        label: 'Models',
        icon: 'cpu',
        path: '/models'
    }
];

export const PAGE_REGISTRY = {
    '/create/image': () => import('./js/pages/image.js'),
    '/create/video': () => import('./js/pages/video.js'),
    '/chat': () => import('./js/pages/chat.js'),
    '/gallery': () => import('./js/pages/gallery.js'),
    '/models': () => import('./js/pages/models.js')
};

export const DEFAULT_PATH = '/create/image';
