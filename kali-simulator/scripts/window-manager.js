// Window Manager for Kali Linux Simulator
class WindowManager {
    constructor() {
        this.windows = [];
        this.activeWindow = null;
        this.zIndex = 1000;
        this.dragState = null;
        this.resizeState = null;
        
        this.init();
    }

    init() {
        this.bindGlobalEvents();
    }

    bindGlobalEvents() {
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', () => this.handleMouseUp());
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    createWindow(options) {
        const defaults = {
            title: 'Window',
            icon: 'terminal',
            width: 800,
            height: 600,
            x: Math.random() * 200 + 50,
            y: Math.random() * 100 + 50,
            content: '',
            minimizable: true,
            maximizable: true,
            closable: true,
            resizable: true,
            onClose: null,
            onMinimize: null,
            onMaximize: null
        };

        const config = { ...defaults, ...options };

        const window = document.createElement('div');
        window.className = 'app-window';
        window.style.width = config.width + 'px';
        window.style.height = config.height + 'px';
        window.style.left = config.x + 'px';
        window.style.top = config.y + 'px';
        window.style.zIndex = ++this.zIndex;
        window.dataset.windowId = Date.now();

        window.innerHTML = `
            <div class="app-header">
                <div class="app-title">
                    <div class="app-icon ${config.icon}-icon">
                        ${this.getIconSVG(config.icon)}
                    </div>
                    <span>${config.title}</span>
                </div>
                <div class="app-controls">
                    ${config.minimizable ? '<div class="app-control minimize" data-action="minimize"></div>' : ''}
                    ${config.maximizable ? '<div class="app-control maximize" data-action="maximize"></div>' : ''}
                    ${config.closable ? '<div class="app-control close" data-action="close"></div>' : ''}
                </div>
            </div>
            <div class="app-body">
                <div class="app-content">${config.content}</div>
            </div>
            ${config.resizable ? '<div class="window-resizer" data-resize="se"></div>' : ''}
        `;

        document.getElementById('window-container').appendChild(window);

        const windowData = {
            element: window,
            config: config,
            id: window.dataset.windowId,
            minimized: false,
            maximized: false,
            previousState: null
        };

        this.windows.push(windowData);
        this.bindWindowEvents(windowData);
        this.activateWindow(windowData);

        return window;
    }

    getIconSVG(iconName) {
        const icons = {
            terminal: `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--kali-blue)">
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="var(--kali-blue)" stroke-width="2" fill="none"/>
                <polyline points="6 8 10 12 6 16" stroke="var(--kali-blue)" stroke-width="2" fill="none"/>
                <line x1="12" y1="16" x2="18" y2="16" stroke="var(--kali-blue)" stroke-width="2"/>
            </svg>`,
            files: `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--kali-blue)">
                <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
            </svg>`,
            firefox: `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--kali-blue)">
                <circle cx="12" cy="12" r="10" stroke="var(--kali-blue)" stroke-width="2" fill="none"/>
            </svg>`,
            nmap: `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--kali-blue)">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2ZM12 4.5L19.5 8.25V15.75L12 19.5L4.5 15.75V8.25L12 4.5Z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>`,
            wireshark: `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--kali-blue)">
                <path d="M3 3H21V5H3V3ZM3 7H21V9H3V7ZM3 11H21V13H3V11ZM3 15H21V17H3V15ZM3 19H21V21H3V19Z"/>
            </svg>`,
            metasploit: `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--kali-blue)">
                <path d="M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17V7L12 12L2 7V17Z"/>
            </svg>`,
            burpsuite: `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--kali-blue)">
                <circle cx="12" cy="12" r="8"/>
                <path d="M12 6V18M6 12H18" stroke="#fff" stroke-width="2"/>
            </svg>`,
            john: `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--kali-blue)">
                <rect x="4" y="4" width="16" height="16" rx="2"/>
                <text x="12" y="16" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">JtR</text>
            </svg>`,
            hydra: `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--kali-blue)">
                <path d="M12 2L4 8V20H20V8L12 2ZM12 4.5L18 9V18H6V9L12 4.5Z"/>
                <circle cx="12" cy="14" r="2"/>
            </svg>`,
            aircrack: `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--kali-blue)">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/>
                <path d="M12 6V12L16 14"/>
            </svg>`,
            gobuster: `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--kali-blue)">
                <path d="M12 2L2 12H12V22L22 12H12V2Z"/>
            </svg>`,
            sqlmap: `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--kali-blue)">
                <path d="M4 4H20V20H4V4ZM6 6V18H18V6H6Z"/>
                <text x="12" y="15" text-anchor="middle" fill="var(--kali-blue)" font-size="8" font-weight="bold">SQL</text>
            </svg>`,
            settings: `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--kali-blue)">
                <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.01 15.6 8.4 13.99 8.4 12C8.4 10.01 10.01 8.4 12 8.4C13.99 8.4 15.6 10.01 15.6 12C15.6 13.99 13.99 15.6 12 15.6Z"/>
            </svg>`
        };

        return icons[iconName] || icons.terminal;
    }

    bindWindowEvents(windowData) {
        const window = windowData.element;
        const header = window.querySelector('.app-header');
        const controls = window.querySelectorAll('.app-control');
        const resizer = window.querySelector('.window-resizer');

        // Window activation
        window.addEventListener('mousedown', () => {
            this.activateWindow(windowData);
        });

        // Dragging
        if (header) {
            header.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('app-control')) return;
                this.startDrag(e, windowData);
            });
        }

        // Controls
        controls.forEach(control => {
            control.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = control.dataset.action;
                this.handleWindowAction(windowData, action);
            });
        });

        // Resizing
        if (resizer) {
            resizer.addEventListener('mousedown', (e) => {
                this.startResize(e, windowData);
            });
        }
    }

    startDrag(e, windowData) {
        if (windowData.maximized || windowData.minimized) return;

        const window = windowData.element;
        const rect = window.getBoundingClientRect();

        this.dragState = {
            windowData: windowData,
            startX: e.clientX,
            startY: e.clientY,
            startLeft: rect.left,
            startTop: rect.top
        };

        window.style.transition = 'none';
    }

    startResize(e, windowData) {
        if (windowData.maximized || windowData.minimized) return;

        const window = windowData.element;
        const rect = window.getBoundingClientRect();

        this.resizeState = {
            windowData: windowData,
            startX: e.clientX,
            startY: e.clientY,
            startWidth: rect.width,
            startHeight: rect.height
        };

        window.style.transition = 'none';
    }

    handleMouseMove(e) {
        // Handle dragging
        if (this.dragState) {
            const { windowData, startX, startY, startLeft, startTop } = this.dragState;
            const window = windowData.element;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            let newLeft = startLeft + dx;
            let newTop = startTop + dy;

            // Constrain to desktop area
            const desktop = document.getElementById('desktop-area');
            const desktopRect = desktop.getBoundingClientRect();

            newLeft = Math.max(0, Math.min(newLeft, desktopRect.width - 100));
            newTop = Math.max(48, Math.min(newTop, desktopRect.height - 100));

            window.style.left = newLeft + 'px';
            window.style.top = newTop + 'px';
        }

        // Handle resizing
        if (this.resizeState) {
            const { windowData, startX, startY, startWidth, startHeight } = this.resizeState;
            const window = windowData.element;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            const newWidth = Math.max(400, startWidth + dx);
            const newHeight = Math.max(300, startHeight + dy);

            window.style.width = newWidth + 'px';
            window.style.height = newHeight + 'px';
        }
    }

    handleMouseUp() {
        if (this.dragState) {
            const { windowData } = this.dragState;
            windowData.element.style.transition = '';
            this.dragState = null;
        }

        if (this.resizeState) {
            const { windowData } = this.resizeState;
            windowData.element.style.transition = '';
            this.resizeState = null;
        }
    }

    handleKeyDown(e) {
        // Alt+F4 to close active window
        if (e.altKey && e.key === 'F4' && this.activeWindow) {
            this.closeWindow(this.activeWindow);
        }

        // Ctrl+W to close active window
        if (e.ctrlKey && e.key === 'w' && this.activeWindow) {
            e.preventDefault();
            this.closeWindow(this.activeWindow);
        }

        // F11 to maximize active window
        if (e.key === 'F11' && this.activeWindow) {
            e.preventDefault();
            this.maximizeWindow(this.activeWindow);
        }
    }

    activateWindow(windowData) {
        if (this.activeWindow && this.activeWindow !== windowData) {
            this.activeWindow.element.style.zIndex = this.zIndex;
        }

        windowData.element.style.zIndex = ++this.zIndex;
        this.activeWindow = windowData;

        // Update dock
        this.updateDock();
    }

    closeWindow(windowData) {
        if (windowData.config.onClose) {
            windowData.config.onClose();
        }

        windowData.element.remove();
        this.windows = this.windows.filter(w => w.id !== windowData.id);

        if (this.activeWindow === windowData) {
            this.activeWindow = this.windows.length > 0 ? this.windows[this.windows.length - 1] : null;
        }

        this.updateDock();
    }

    minimizeWindow(windowData) {
        windowData.minimized = true;
        windowData.element.style.display = 'none';

        if (windowData.config.onMinimize) {
            windowData.config.onMinimize();
        }

        if (this.activeWindow === windowData) {
            this.activeWindow = this.windows.find(w => !w.minimized) || null;
        }

        this.updateDock();
    }

    restoreWindow(windowData) {
        windowData.minimized = false;
        windowData.element.style.display = 'flex';
        this.activateWindow(windowData);
        this.updateDock();
    }

    maximizeWindow(windowData) {
        if (windowData.maximized) {
            // Restore
            const state = windowData.previousState;
            windowData.element.style.width = state.width + 'px';
            windowData.element.style.height = state.height + 'px';
            windowData.element.style.left = state.left + 'px';
            windowData.element.style.top = state.top + 'px';
            windowData.maximized = false;
        } else {
            // Maximize
            const rect = windowData.element.getBoundingClientRect();
            windowData.previousState = {
                width: rect.width,
                height: rect.height,
                left: rect.left,
                top: rect.top
            };

            const desktop = document.getElementById('desktop-area');
            const desktopRect = desktop.getBoundingClientRect();

            windowData.element.style.width = desktopRect.width + 'px';
            windowData.element.style.height = desktopRect.height + 'px';
            windowData.element.style.left = '0px';
            windowData.element.style.top = '0px';
            windowData.maximized = true;
        }

        if (windowData.config.onMaximize) {
            windowData.config.onMaximize(windowData.maximized);
        }
    }

    handleWindowAction(windowData, action) {
        switch (action) {
            case 'close':
                this.closeWindow(windowData);
                break;
            case 'minimize':
                this.minimizeWindow(windowData);
                break;
            case 'maximize':
                this.maximizeWindow(windowData);
                break;
        }
    }

    updateDock() {
        const dockItems = document.querySelectorAll('.dock-item');
        dockItems.forEach(item => {
            const app = item.dataset.app;
            const window = this.windows.find(w => w.config.icon === app);
            
            if (window) {
                item.classList.add('active');
                if (window === this.activeWindow) {
                    item.style.background = 'rgba(85, 119, 153, 0.3)';
                } else {
                    item.style.background = 'transparent';
                }
            } else {
                item.classList.remove('active');
                item.style.background = 'transparent';
            }
        });
    }

    minimizeAllWindows() {
        this.windows.forEach(window => {
            this.minimizeWindow(window);
        });
    }

    restoreAllWindows() {
        this.windows.forEach(window => {
            this.restoreWindow(window);
        });
    }

    getActiveWindow() {
        return this.activeWindow;
    }

    getWindowById(id) {
        return this.windows.find(w => w.id === id);
    }

    closeAllWindows() {
        [...this.windows].forEach(window => {
            this.closeWindow(window);
        });
    }
}

// Export the WindowManager class
window.WindowManager = WindowManager;