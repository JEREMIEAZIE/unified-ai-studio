// js/router.js
import { NAV_TREE, PAGE_REGISTRY, DEFAULT_PATH } from '../config.js';

class Router {
    constructor() {
        this.currentPath = null;
        this.currentPage = null;
        this.expandedMenus = new Set();
    }

    init() {
        // Build navigation from config
        this.buildNavigation();
        
        // Handle browser back/forward
        window.addEventListener('popstate', () => this.navigate(window.location.hash.slice(1) || DEFAULT_PATH, false));
        
        // Initial route
        const initialPath = window.location.hash.slice(1) || DEFAULT_PATH;
        this.navigate(initialPath, false);
    }

    buildNavigation() {
        const navContainer = document.getElementById('nav-tree');
        if (!navContainer) return;

        navContainer.innerHTML = this.renderNavItems(NAV_TREE, 0);
        this.attachNavListeners();
    }

    renderNavItems(items, depth = 0) {
        return items.map(item => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = this.expandedMenus.has(item.id);
            const isActive = this.currentPath === item.path || 
                            (hasChildren && item.children.some(c => c.path === this.currentPath));

            return `
                <div class="nav-group" data-depth="${depth}">
                    <div class="nav-item ${isActive ? 'active' : ''} ${hasChildren ? 'has-children' : ''}" 
                         data-path="${item.path}" 
                         data-id="${item.id}">
                        ${hasChildren ? `<span class="nav-arrow ${isExpanded ? 'expanded' : ''}">›</span>` : '<span class="nav-spacer"></span>'}
                        <span class="nav-icon">${this.getIcon(item.icon)}</span>
                        <span class="nav-label">${item.label}</span>
                    </div>
                    ${hasChildren && isExpanded ? `
                        <div class="nav-children">
                            ${this.renderNavItems(item.children, depth + 1)}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    getIcon(name) {
        const icons = {
            layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
            image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
            video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
            message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
            gallery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
            settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
            cog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/></svg>',
            cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>',
            star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
        };
        return icons[name] || icons.star;
    }

    attachNavListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const path = item.dataset.path;
                const id = item.dataset.id;
                
                // Toggle submenu if has children
                if (item.classList.contains('has-children')) {
                    if (this.expandedMenus.has(id)) {
                        this.expandedMenus.delete(id);
                    } else {
                        this.expandedMenus.add(id);
                    }
                    this.buildNavigation();
                }
                
                // Navigate to page
                if (path && PAGE_REGISTRY[path]) {
                    this.navigate(path);
                } else if (item.classList.contains('has-children')) {
                    // If parent has no page, navigate to first child
                    const firstChild = this.findFirstChild(id);
                    if (firstChild) this.navigate(firstChild.path);
                }
            });
        });
    }

    findFirstChild(parentId) {
        const parent = NAV_TREE.find(n => n.id === parentId);
        if (parent && parent.children && parent.children.length > 0) {
            return parent.children[0];
        }
        return null;
    }

    async navigate(path, updateHistory = true) {
        if (!PAGE_REGISTRY[path]) {
            console.warn(`Page not found: ${path}`);
            return;
        }

        // Unload current page
        if (this.currentPage && this.currentPage.onUnload) {
            this.currentPage.onUnload();
        }

        this.currentPath = path;
        
        // Update URL
        if (updateHistory) {
            window.history.pushState({}, '', `#${path}`);
        }

        // Update nav highlighting
        this.buildNavigation();
        
        // Auto-expand parent menu
        this.expandParentOf(path);

        // Load page module
        const content = document.getElementById('page-content');
        content.innerHTML = '<div class="page-loading"><div class="spinner"></div></div>';

        try {
            const module = await PAGE_REGISTRY[path]();
            this.currentPage = module.default || module;
            
            if (this.currentPage.render) {
                content.innerHTML = '';
                this.currentPage.render(content);
            }
            
            if (this.currentPage.onLoad) {
                this.currentPage.onLoad();
            }
        } catch (e) {
            console.error('Failed to load page:', e);
            content.innerHTML = `<div class="page-error"><h3>Failed to load page</h3><p>${e.message}</p></div>`;
        }
    }

    expandParentOf(path) {
        NAV_TREE.forEach(item => {
            if (item.children && item.children.some(c => c.path === path)) {
                this.expandedMenus.add(item.id);
            }
        });
    }
}

// Export singleton
window.router = new Router();
export default window.router;