// Kali Linux Simulator - 窗口JavaScript文件
document.addEventListener('DOMContentLoaded', function() {
    console.log('窗口系统已初始化');
    
    // 初始化窗口系统
    initWindowSystem();
    
    // 绑定窗口事件
    bindWindowEvents();
    
    // 初始化窗口菜单栏
    initWindowMenubar();
    
    // 初始化窗口工具栏
    initWindowToolbar();
});

// 初始化窗口系统
function initWindowSystem() {
    // 绑定窗口控制按钮
    bindWindowControls();
    
    // 绑定窗口拖拽
    bindWindowDragging();
    
    // 绑定窗口缩放
    bindWindowResizing();
    
    // 绑定窗口焦点
    bindWindowFocus();
    
    // 初始化窗口状态
    initWindowState();
}

// 绑定窗口事件
function bindWindowEvents() {
    // 窗口点击事件
    const windows = document.querySelectorAll('.window');
    windows.forEach(window => {
        window.addEventListener('mousedown', function() {
            // 将窗口置于顶层
            let zIndex = 1000;
            document.querySelectorAll('.window').forEach(w => {
                zIndex = Math.max(zIndex, parseInt(w.style.zIndex) || 0);
            });
            this.style.zIndex = zIndex + 1;
            
            // 更新任务栏图标状态
            updateTaskbarIcons();
        });
    });
    
    // 窗口双击标题栏事件
    const windowHeaders = document.querySelectorAll('.window-header');
    windowHeaders.forEach(header => {
        header.addEventListener('dblclick', function() {
            const window = this.closest('.window');
            if (window) {
                toggleMaximize(window);
            }
        });
    });
    
    // 窗口右键菜单
    windowHeaders.forEach(header => {
        header.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            showContextMenu(e, 'window', this);
        });
    });
    
    // 窗口关闭按钮
    const closeButtons = document.querySelectorAll('.window-controls .close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const window = this.closest('.window');
            if (window) {
                closeWindow(window);
            }
        });
    });
    
    // 窗口最小化按钮
    const minimizeButtons = document.querySelectorAll('.window-controls .minimize');
    minimizeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const window = this.closest('.window');
            if (window) {
                minimizeWindow(window);
            }
        });
    });
    
    // 窗口最大化按钮
    const maximizeButtons = document.querySelectorAll('.window-controls .maximize');
    maximizeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const window = this.closest('.window');
            if (window) {
                toggleMaximize(window);
            }
        });
    });
}

// 绑定窗口控制按钮
function bindWindowControls() {
    const windowControls = document.querySelectorAll('.window-controls button');
    
    windowControls.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const window = this.closest('.window');
            const action = this.className.split('-')[1];
            
            switch(action) {
                case 'minimize':
                    minimizeWindow(window);
                    break;
                case 'maximize':
                    toggleMaximize(window);
                    break;
                case 'close':
                    closeWindow(window);
                    break;
            }
        });
    });
}

// 绑定窗口拖拽
function bindWindowDragging() {
    let currentWindow = null;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    
    document.addEventListener('mousedown', function(e) {
        if (e.target.closest('.window-header')) {
            currentWindow = e.target.closest('.window');
            isDragging = true;
            
            const rect = currentWindow.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            currentWindow.classList.add('dragging');
            currentWindow.style.zIndex = '1003';
        }
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isDragging && currentWindow) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            // 限制窗口在屏幕范围内
            const maxX = window.innerWidth - currentWindow.offsetWidth;
            const maxY = window.innerHeight - currentWindow.offsetHeight - 40; // 任务栏高度
            
            const boundedX = Math.max(0, Math.min(x, maxX));
            const boundedY = Math.max(0, Math.min(y, maxY));
            
            currentWindow.style.left = boundedX + 'px';
            currentWindow.style.top = boundedY + 'px';
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (isDragging && currentWindow) {
            currentWindow.classList.remove('dragging');
            isDragging = false;
            currentWindow = null;
        }
    });
}

// 绑定窗口缩放
function bindWindowResizing() {
    let currentWindow = null;
    let isResizing = false;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    
    // 创建缩放句柄
    const resizers = document.querySelectorAll('.window-resizer');
    resizers.forEach(resizer => {
        resizer.addEventListener('mousedown', function(e) {
            e.preventDefault();
            currentWindow = this.closest('.window');
            isResizing = true;
            
            startX = e.clientX;
            startY = e.clientY;
            startWidth = currentWindow.offsetWidth;
            startHeight = currentWindow.offsetHeight;
            
            currentWindow.classList.add('resizing');
        });
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isResizing && currentWindow) {
            const width = startWidth + (e.clientX - startX);
            const height = startHeight + (e.clientY - startY);
            
            // 设置最小尺寸
            const minWidth = 300;
            const minHeight = 200;
            
            if (width >= minWidth && height >= minHeight) {
                currentWindow.style.width = width + 'px';
                currentWindow.style.height = height + 'px';
            }
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (isResizing && currentWindow) {
            currentWindow.classList.remove('resizing');
            isResizing = false;
            currentWindow = null;
        }
    });
}

// 绑定窗口焦点
function bindWindowFocus() {
    const windows = document.querySelectorAll('.window');
    
    windows.forEach(window => {
        window.addEventListener('mousedown', function() {
            // 将窗口置于顶层
            let zIndex = 1000;
            document.querySelectorAll('.window').forEach(w => {
                zIndex = Math.max(zIndex, parseInt(w.style.zIndex) || 0);
            });
            this.style.zIndex = zIndex + 1;
            
            // 更新任务栏图标状态
            updateTaskbarIcons();
        });
    });
}

// 初始化窗口状态
function initWindowState() {
    // 检查是否有窗口需要恢复状态
    const windows = document.querySelectorAll('.window');
    windows.forEach(window => {
        const state = window.getAttribute('data-state');
        if (state === 'maximized') {
            maximizeWindow(window);
        }
    });
}

// 切换窗口最大化状态
function toggleMaximize(window) {
    if (window.classList.contains('maximized')) {
        // 恢复窗口
        restoreWindow(window);
    } else {
        // 最大化窗口
        maximizeWindow(window);
    }
}

// 最小化窗口
function minimizeWindow(window) {
    window.classList.add('minimized');
    window.classList.remove('focused');
    
    // 更新任务栏图标状态
    updateTaskbarIcons();
    
    // 显示窗口动画
    setTimeout(() => {
        window.classList.remove('minimized');
    }, 300);
}

// 最大化窗口
function maximizeWindow(window) {
    if (window.classList.contains('maximized')) {
        // 恢复窗口
        restoreWindow(window);
        return;
    }
    
    // 保存原始位置和大小
    window.dataset.originalLeft = window.style.left;
    window.dataset.originalTop = window.style.top;
    window.dataset.originalWidth = window.style.width;
    window.dataset.originalHeight = window.style.height;
    
    // 保存窗口状态
    window.setAttribute('data-state', 'maximized');
    
    // 最大化窗口
    window.classList.add('maximized');
    window.style.left = '0px';
    window.style.top = '0px';
    window.style.width = '100%';
    window.style.height = 'calc(100% - 40px)';
    
    // 更新最大化按钮图标
    const maximizeBtn = window.querySelector('.window-controls .maximize');
    if (maximizeBtn) {
        const icon = maximizeBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-restore';
        }
    }
}

// 恢复窗口
function restoreWindow(window) {
    // 恢复窗口位置和大小
    window.style.left = window.dataset.originalLeft || '100px';
    window.style.top = window.dataset.originalTop || '100px';
    window.style.width = window.dataset.originalWidth || '600px';
    window.style.height = window.dataset.originalHeight || '400px';
    
    // 清除窗口状态
    window.removeAttribute('data-state');
    
    // 移除最大化类
    window.classList.remove('maximized');
    
    // 更新最大化按钮图标
    const maximizeBtn = window.querySelector('.window-controls .maximize');
    if (maximizeBtn) {
        const icon = maximizeBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-square';
        }
    }
}

// 关闭窗口
function closeWindow(window) {
    // 保存窗口状态
    const state = window.classList.contains('maximized') ? 'maximized' : 'normal';
    window.setAttribute('data-state', state);
    
    window.classList.add('hide');
    
    setTimeout(() => {
        window.remove();
        
        // 更新任务栏图标状态
        updateTaskbarIcons();
        
        // 如果没有窗口，隐藏任务栏
        const remainingWindows = document.querySelectorAll('.window');
        if (remainingWindows.length === 0) {
            document.getElementById('taskbar').classList.add('hidden');
        }
    }, 300);
}

// 显示窗口
function showWindow(window) {
    window.classList.remove('hidden');
    window.classList.add('focused');
    window.style.zIndex = '1002';
    
    // 更新任务栏图标
    updateTaskbarIcons();
    
    // 显示窗口动画
    setTimeout(() => {
        window.classList.remove('hide');
    }, 10);
}

// 隐藏窗口
function hideWindow(window) {
    window.classList.add('hide');
    
    setTimeout(() => {
        window.classList.add('hidden');
    }, 300);
}

// 激活窗口
function activateWindow(window) {
    // 将窗口置于顶层
    let zIndex = 1000;
    document.querySelectorAll('.window').forEach(w => {
        zIndex = Math.max(zIndex, parseInt(w.style.zIndex) || 0);
    });
    window.style.zIndex = zIndex + 1;
    
    // 添加焦点状态
    window.classList.add('focused');
    
    // 移除其他窗口的焦点状态
    document.querySelectorAll('.window').forEach(w => {
        if (w !== window) {
            w.classList.remove('focused');
        }
    });
    
    // 更新任务栏图标状态
    updateTaskbarIcons();
}

// 禁用窗口
function disableWindow(window) {
    window.classList.add('disabled');
    window.style.opacity = '0.5';
}

// 启用窗口
function enableWindow(window) {
    window.classList.remove('disabled');
    window.style.opacity = '1';
}

// 窗口置顶
function bringToFront(window) {
    let zIndex = 1000;
    document.querySelectorAll('.window').forEach(w => {
        zIndex = Math.max(zIndex, parseInt(w.style.zIndex) || 0);
    });
    window.style.zIndex = zIndex + 1;
}

// 窗口置底
function sendToBack(window) {
    window.style.zIndex = '1000';
}

// 获取窗口位置
function getWindowPosition(window) {
    return {
        left: parseInt(window.style.left) || 0,
        top: parseInt(window.style.top) || 0,
        width: window.offsetWidth,
        height: window.offsetHeight
    };
}

// 设置窗口位置
function setWindowPosition(window, position) {
    window.style.left = position.left + 'px';
    window.style.top = position.top + 'px';
    window.style.width = position.width + 'px';
    window.style.height = position.height + 'px';
}

// 获取窗口状态
function getWindowState(window) {
    if (window.classList.contains('maximized')) {
        return 'maximized';
    } else if (window.classList.contains('minimized')) {
        return 'minimized';
    } else {
        return 'normal';
    }
}

// 设置窗口状态
function setWindowState(window, state) {
    switch(state) {
        case 'maximized':
            maximizeWindow(window);
            break;
        case 'minimized':
            minimizeWindow(window);
            break;
        case 'normal':
            restoreWindow(window);
            break;
    }
}

// 窗口全屏
function fullscreenWindow(window) {
    // 保存原始位置和大小
    window.dataset.originalLeft = window.style.left;
    window.dataset.originalTop = window.style.top;
    window.dataset.originalWidth = window.style.width;
    window.dataset.originalHeight = window.style.height;
    
    // 保存窗口状态
    window.setAttribute('data-state', 'fullscreen');
    
    // 全屏窗口
    window.classList.add('fullscreen');
    window.style.left = '0px';
    window.style.top = '0px';
    window.style.width = '100%';
    window.style.height = '100%';
    
    // 隐藏任务栏
    document.getElementById('taskbar').classList.add('hidden');
}

// 退出全屏
function exitFullscreen(window) {
    // 恢复窗口位置和大小
    window.style.left = window.dataset.originalLeft || '100px';
    window.style.top = window.dataset.originalTop || '100px';
    window.style.width = window.dataset.originalWidth || '600px';
    window.style.height = window.dataset.originalHeight || '400px';
    
    // 清除窗口状态
    window.removeAttribute('data-state');
    
    // 移除全屏类
    window.classList.remove('fullscreen');
    
    // 显示任务栏
    document.getElementById('taskbar').classList.remove('hidden');
}

// 窗口最小化到任务栏
function minimizeToTaskbar(window) {
    minimizeWindow(window);
    
    // 在任务栏显示窗口图标
    const taskbarApp = document.createElement('div');
    taskbarApp.className = 'taskbar-app';
    taskbarApp.setAttribute('data-app', window.getAttribute('data-app'));
    
    const icon = document.createElement('i');
    icon.className = getApplicationIcon(window.getAttribute('data-app'));
    taskbarApp.appendChild(icon);
    
    const title = document.createElement('span');
    title.textContent = getApplicationTitle(window.getAttribute('data-app'));
    taskbarApp.appendChild(title);
    
    taskbarApp.addEventListener('click', function() {
        if (window.classList.contains('minimized')) {
            window.classList.remove('minimized');
        }
        window.style.zIndex = '1002';
        window.classList.add('focused');
        updateTaskbarIcons();
    });
    
    document.getElementById('taskbar-apps').appendChild(taskbarApp);
}

// 窗口从任务栏恢复
function restoreFromTaskbar(window) {
    // 从任务栏移除窗口图标
    const taskbarApps = document.getElementById('taskbar-apps');
    const taskbarApp = taskbarApps.querySelector(`[data-app="${window.getAttribute('data-app')}"]`);
    if (taskbarApp) {
        taskbarApp.remove();
    }
    
    // 恢复窗口
    restoreWindow(window);
    activateWindow(window);
}

// 初始化窗口菜单栏
function initWindowMenubar() {
    // 创建菜单栏
    const menubars = document.querySelectorAll('.window-menubar');
    menubars.forEach(menubar => {
        createMenubar(menubar);
    });
}

// 创建菜单栏
function createMenubar(menubar) {
    // 添加菜单项
    const menuItems = [
        { text: '文件', items: ['新建', '打开', '保存', '另存为', '-', '退出'] },
        { text: '编辑', items: ['撤销', '重做', '-', '剪切', '复制', '粘贴'] },
        { text: '视图', items: ['工具栏', '状态栏', '全屏'] },
        { text: '帮助', items: ['关于', '帮助'] }
    ];
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'window-menubar-item';
        menuItem.textContent = item.text;
        
        // 添加子菜单
        if (item.items) {
            const submenu = document.createElement('div');
            submenu.className = 'window-submenu';
            
            item.items.forEach(subItem => {
                if (subItem === '-') {
                    const divider = document.createElement('div');
                    divider.className = 'window-divider';
                    submenu.appendChild(divider);
                } else {
                    const subMenuItem = document.createElement('div');
                    subMenuItem.className = 'window-submenu-item';
                    subMenuItem.textContent = subItem;
                    submenu.appendChild(subMenuItem);
                }
            });
            
            menuItem.appendChild(submenu);
        }
        
        menubar.appendChild(menuItem);
    });
}

// 初始化窗口工具栏
function initWindowToolbar() {
    // 创建工具栏
    const toolbars = document.querySelectorAll('.window-toolbar');
    toolbars.forEach(toolbar => {
        createToolbar(toolbar);
    });
}

// 创建工具栏
function createToolbar(toolbar) {
    // 添加工具栏按钮
    const toolbarItems = [
        { icon: 'fas fa-plus', title: '新建' },
        { icon: 'fas fa-folder-open', title: '打开' },
        { icon: 'fas fa-save', title: '保存' },
        { icon: 'fas fa-print', title: '打印' },
        { icon: 'fas fa-cut', title: '剪切' },
        { icon: 'fas fa-copy', title: '复制' },
        { icon: 'fas fa-paste', title: '粘贴' },
        { icon: 'fas fa-undo', title: '撤销' },
        { icon: 'fas fa-redo', title: '重做' }
    ];
    
    toolbarItems.forEach(item => {
        const toolbarBtn = document.createElement('div');
        toolbarBtn.className = 'window-toolbar-btn';
        toolbarBtn.innerHTML = `<i class="${item.icon}"></i>`;
        toolbarBtn.title = item.title;
        
        toolbarBtn.addEventListener('click', function() {
            handleToolbarAction(item.title);
        });
        
        toolbar.appendChild(toolbarBtn);
    });
}

// 处理工具栏操作
function handleToolbarAction(action) {
    switch(action) {
        case '新建':
            openNewFile();
            break;
        case '打开':
            openFile();
            break;
        case '保存':
            saveFile();
            break;
        case '打印':
            printFile();
            break;
        case '剪切':
            cutSelection();
            break;
        case '复制':
            copySelection();
            break;
        case '粘贴':
            pasteSelection();
            break;
        case '撤销':
            undoAction();
            break;
        case '重做':
            redoAction();
            break;
    }
}

// 打开新文件
function openNewFile() {
    // 这里可以实现打开新文件的逻辑
    console.log('打开新文件');
}

// 打开文件
function openFile() {
    // 这里可以实现打开文件的逻辑
    console.log('打开文件');
}

// 保存文件
function saveFile() {
    // 这里可以实现保存文件的逻辑
    console.log('保存文件');
}

// 打印文件
function printFile() {
    // 这里可以实现打印文件的逻辑
    console.log('打印文件');
}

// 剪切选择
function cutSelection() {
    // 这里可以实现剪切选择的逻辑
    console.log('剪切选择');
}

// 复制选择
function copySelection() {
    // 这里可以实现复制选择的逻辑
    console.log('复制选择');
}

// 粘贴选择
function pasteSelection() {
    // 这里可以实现粘贴选择的逻辑
    console.log('粘贴选择');
}

// 撤销操作
function undoAction() {
    // 这里可以实现撤销操作的逻辑
    console.log('撤销操作');
}

// 重做操作
function redoAction() {
    // 这里可以实现重做操作的逻辑
    console.log('重做操作');
}

// 显示右键菜单
function showContextMenu(event, contextType, element) {
    // 移除现有的右键菜单
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // 创建新的右键菜单
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.innerHTML = generateContextMenuHTML(contextType, element);
    
    // 设置位置
    menu.style.left = event.clientX + 'px';
    menu.style.top = event.clientY + 'px';
    
    // 防止菜单超出屏幕
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
        menu.style.left = (event.clientX - rect.width) + 'px';
    }
    if (rect.bottom > window.innerHeight) {
        menu.style.top = (event.clientY - rect.height) + 'px';
    }
    
    document.body.appendChild(menu);
    
    // 绑定菜单项事件
    bindContextMenuItems(menu, contextType, element);
    
    // 绑定关闭菜单事件
    function closeMenu() {
        menu.classList.add('hidden');
        setTimeout(() => {
            menu.remove();
        }, 300);
    }
    
    // 点击其他地方关闭菜单
    document.addEventListener('click', closeMenu, { once: true });
}

// 生成右键菜单HTML
function generateContextMenuHTML(contextType, element) {
    const items = [];
    
    switch(contextType) {
        case 'window':
            items.push({ icon: 'fas fa-window-minimize', text: '最小化', action: 'minimize' });
            items.push({ icon: 'fas fa-window-maximize', text: '最大化', action: 'maximize' });
            items.push({ icon: 'fas fa-window-restore', text: '恢复', action: 'restore' });
            items.push({ icon: 'fas fa-times', text: '关闭', action: 'close' });
            items.push({ icon: 'fas fa-window-restore', text: '置顶', action: 'bring-to-front' });
            items.push({ icon: 'fas fa-window-restore', text: '置底', action: 'send-to-back' });
            break;
            
        case 'desktop-icon':
            items.push({ icon: 'fas fa-folder-open', text: '打开', action: 'open' });
            items.push({ icon: 'fas fa-copy', text: '复制', action: 'copy' });
            items.push({ icon: 'fas fa-cut', text: '剪切', action: 'cut' });
            items.push({ icon: 'fas fa-trash', text: '删除', action: 'delete' });
            items.push({ icon: 'fas fa-cog', text: '属性', action: 'properties' });
            break;
            
        case 'file':
            items.push({ icon: 'fas fa-folder-open', text: '打开', action: 'open' });
            items.push({ icon: 'fas fa-rename', text: '重命名', action: 'rename' });
            items.push({ icon: 'fas fa-copy', text: '复制', action: 'copy' });
            items.push({ icon: 'fas fa-cut', text: '剪切', action: 'cut' });
            items.push({ icon: 'fas fa-trash', text: '删除', action: 'delete' });
            break;
    }
    
    let html = '';
    items.forEach(item => {
        html += `
            <div class="context-menu-item" data-action="${item.action}">
                <i class="${item.icon}"></i>
                <span>${item.text}</span>
            </div>
        `;
    });
    
    return html;
}

// 绑定右键菜单项事件
function bindContextMenuItems(menu, contextType, element) {
    const menuItems = menu.querySelectorAll('.context-menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleContextMenuAction(action, contextType, element);
        });
    });
}

// 处理右键菜单操作
function handleContextMenuAction(action, contextType, element) {
    switch(action) {
        case 'minimize':
            if (contextType === 'window') {
                const window = element.closest('.window');
                if (window) {
                    minimizeWindow(window);
                }
            }
            break;
            
        case 'maximize':
            if (contextType === 'window') {
                const window = element.closest('.window');
                if (window) {
                    toggleMaximize(window);
                }
            }
            break;
            
        case 'restore':
            if (contextType === 'window') {
                const window = element.closest('.window');
                if (window) {
                    restoreWindow(window);
                }
            }
            break;
            
        case 'close':
            if (contextType === 'window') {
                const window = element.closest('.window');
                if (window) {
                    closeWindow(window);
                }
            }
            break;
            
        case 'bring-to-front':
            if (contextType === 'window') {
                const window = element.closest('.window');
                if (window) {
                    bringToFront(window);
                }
            }
            break;
            
        case 'send-to-back':
            if (contextType === 'window') {
                const window = element.closest('.window');
                if (window) {
                    sendToBack(window);
                }
            }
            break;
            
        case 'open':
            if (contextType === 'desktop-icon') {
                const appName = element.getAttribute('data-app');
                if (appName) {
                    openApplication(appName);
                }
            }
            break;
    }
}

// 打开应用程序
function openApplication(appName) {
    const windowId = appName + '-window';
    const existingWindow = document.getElementById(windowId);
    
    if (existingWindow) {
        // 如果窗口已存在，激活它
        existingWindow.classList.remove('minimized');
        existingWindow.style.zIndex = '1002';
        existingWindow.classList.add('focused');
        updateTaskbarIcons();
        return;
    }
    
    // 创建新窗口
    const window = document.getElementById(windowId);
    if (window) {
        window.classList.remove('hidden');
        window.classList.add('focused');
        window.style.zIndex = '1002';
        
        // 更新任务栏图标
        updateTaskbarIcons();
        
        // 显示窗口动画
        setTimeout(() => {
            window.classList.remove('hide');
        }, 10);
    }
}

// 更新任务栏图标
function updateTaskbarIcons() {
    const taskbarApps = document.getElementById('taskbar-apps');
    taskbarApps.innerHTML = '';
    
    const windows = document.querySelectorAll('.window:not(.hidden)');
    
    windows.forEach(window => {
        const appName = window.getAttribute('data-app');
        if (!appName) return;
        
        const taskbarApp = document.createElement('div');
        taskbarApp.className = 'taskbar-app';
        taskbarApp.setAttribute('data-app', appName);
        
        // 添加图标
        const icon = document.createElement('i');
        icon.className = getApplicationIcon(appName);
        taskbarApp.appendChild(icon);
        
        // 添加标题
        const title = document.createElement('span');
        title.textContent = getApplicationTitle(appName);
        taskbarApp.appendChild(title);
        
        // 添加关闭按钮
        const closeBtn = document.createElement('div');
        closeBtn.className = 'taskbar-app-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeWindow(window);
        });
        taskbarApp.appendChild(closeBtn);
        
        // 点击事件
        taskbarApp.addEventListener('click', function() {
            if (window.classList.contains('minimized')) {
                window.classList.remove('minimized');
            }
            window.style.zIndex = '1002';
            window.classList.add('focused');
            updateTaskbarIcons();
        });
        
        taskbarApps.appendChild(taskbarApp);
    });
}

// 获取应用程序图标
function getApplicationIcon(appName) {
    const icons = {
        'terminal': 'fas fa-terminal',
        'browser': 'fas fa-globe',
        'files': 'fas fa-folder',
        'settings': 'fas fa-cog',
        'nmap': 'fas fa-network-wired',
        'metasploit': 'fas fa-bug',
        'wireshark': 'fas fa-eye'
    };
    return icons[appName] || 'fas fa-window-restore';
}

// 获取应用程序标题
function getApplicationTitle(appName) {
    const titles = {
        'terminal': '终端',
        'browser': '浏览器',
        'files': '文件管理器',
        'settings': '设置',
        'nmap': 'Nmap',
        'metasploit': 'Metasploit',
        'wireshark': 'Wireshark'
    };
    return titles[appName] || appName;
}