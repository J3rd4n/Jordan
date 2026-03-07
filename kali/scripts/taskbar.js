// Kali Linux Simulator - 任务栏JavaScript文件
document.addEventListener('DOMContentLoaded', function() {
    console.log('任务栏系统已初始化');
    
    // 初始化任务栏系统
    initTaskbarSystem();
    
    // 绑定任务栏事件
    bindTaskbarEvents();
    
    // 初始化任务栏菜单
    initTaskbarMenu();
    
    // 初始化系统托盘
    initSystemTray();
});

// 初始化任务栏系统
function initTaskbarSystem() {
    // 绑定开始按钮
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', function() {
        toggleStartMenu();
    });
    
    // 绑定时钟
    const clock = document.getElementById('clock');
    clock.addEventListener('click', function() {
        showCalendar();
    });
    
    // 绑定系统托盘
    const systemTray = document.querySelector('.system-tray');
    systemTray.addEventListener('click', function(e) {
        if (e.target.closest('.system-tray-item')) {
            showSystemTrayMenu(e);
        }
    });
    
    // 绑定任务栏右键菜单
    const taskbar = document.getElementById('taskbar');
    taskbar.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showContextMenu(e, 'taskbar', this);
    });
}

// 绑定任务栏事件
function bindTaskbarEvents() {
    // 点击其他地方关闭开始菜单
    document.addEventListener('click', function(e) {
        const startMenu = document.getElementById('start-menu');
        if (startMenu && !startMenu.contains(e.target) && e.target !== document.getElementById('start-button')) {
            if (!startMenu.classList.contains('hidden')) {
                startMenu.classList.remove('show');
                startMenu.classList.add('hide');
                
                setTimeout(() => {
                    startMenu.classList.add('hidden');
                }, 300);
            }
        }
    });
    
    // 点击其他地方关闭任务栏菜单
    document.addEventListener('click', function(e) {
        const taskbarMenus = document.querySelectorAll('.taskbar-context-menu');
        taskbarMenus.forEach(menu => {
            if (!menu.contains(e.target)) {
                menu.classList.add('hidden');
                setTimeout(() => {
                    menu.remove();
                }, 300);
            }
        });
    });
    
    // 任务栏应用点击事件
    const taskbarApps = document.getElementById('taskbar-apps');
    if (taskbarApps) {
        taskbarApps.addEventListener('click', function(e) {
            const taskbarApp = e.target.closest('.taskbar-app');
            if (taskbarApp) {
                const appName = taskbarApp.getAttribute('data-app');
                if (appName) {
                    openApplication(appName);
                }
            }
        });
    }
}

// 初始化任务栏菜单
function initTaskbarMenu() {
    // 绑定开始菜单应用
    const startMenuApps = document.querySelectorAll('.start-menu-app, .start-menu-tool');
    startMenuApps.forEach(app => {
        app.addEventListener('click', function() {
            const appName = this.getAttribute('data-app');
            if (appName) {
                openApplication(appName);
            }
            toggleStartMenu();
        });
    });
    
    // 绑定关机按钮
    const shutdownButton = document.getElementById('shutdown-button');
    shutdownButton.addEventListener('click', function() {
        showShutdownDialog();
    });
    
    // 绑定开始菜单搜索
    const startMenuSearch = document.querySelector('.start-menu-search input');
    if (startMenuSearch) {
        startMenuSearch.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            filterStartMenuApps(query);
        });
    }
}

// 初始化系统托盘
function initSystemTray() {
    // 初始化系统托盘图标
    const systemTray = document.querySelector('.system-tray');
    
    // 添加网络图标
    const networkItem = document.createElement('div');
    networkItem.className = 'system-tray-item system-tray-network';
    networkItem.innerHTML = '<i class="fas fa-wifi"></i>';
    networkItem.addEventListener('click', function() {
        showNetworkMenu();
    });
    systemTray.appendChild(networkItem);
    
    // 添加电池图标
    const batteryItem = document.createElement('div');
    batteryItem.className = 'system-tray-item system-tray-battery';
    batteryItem.innerHTML = '<i class="fas fa-battery-three-quarters"></i>';
    batteryItem.addEventListener('click', function() {
        showBatteryMenu();
    });
    systemTray.appendChild(batteryItem);
    
    // 添加音量图标
    const volumeItem = document.createElement('div');
    volumeItem.className = 'system-tray-item system-tray-volume';
    volumeItem.innerHTML = '<i class="fas fa-volume-up"></i>';
    volumeItem.addEventListener('click', function() {
        showVolumeMenu();
    });
    systemTray.appendChild(volumeItem);
    
    // 绑定系统托盘鼠标悬停事件
    systemTray.addEventListener('mouseenter', function() {
        showSystemTrayTooltip();
    });
    
    systemTray.addEventListener('mouseleave', function() {
        hideSystemTrayTooltip();
    });
}

// 切换开始菜单
function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    const isHidden = startMenu.classList.contains('hidden');
    
    if (isHidden) {
        startMenu.classList.remove('hidden');
        startMenu.classList.add('show');
    } else {
        startMenu.classList.remove('show');
        startMenu.classList.add('hide');
        
        setTimeout(() => {
            startMenu.classList.add('hidden');
        }, 300);
    }
}

// 显示日历
function showCalendar() {
    // 创建日历对话框
    const calendar = document.createElement('div');
    calendar.className = 'system-calendar';
    calendar.innerHTML = `
        <div class="system-calendar-header">
            <div class="system-calendar-title">日历</div>
            <button class="system-calendar-close">&times;</button>
        </div>
        <div class="system-calendar-content">
            <div class="system-calendar-days">
                <div class="system-calendar-day">日</div>
                <div class="system-calendar-day">一</div>
                <div class="system-calendar-day">二</div>
                <div class="system-calendar-day">三</div>
                <div class="system-calendar-day">四</div>
                <div class="system-calendar-day">五</div>
                <div class="system-calendar-day">六</div>
            </div>
            <div class="system-calendar-dates" id="calendar-dates">
                <!-- 日期将在这里生成 -->
            </div>
        </div>
    `;
    
    document.body.appendChild(calendar);
    
    // 生成日期
    generateCalendarDates();
    
    // 绑定关闭按钮
    const closeBtn = calendar.querySelector('.system-calendar-close');
    closeBtn.addEventListener('click', function() {
        calendar.classList.add('hidden');
        setTimeout(() => {
            calendar.remove();
        }, 300);
    });
    
    // 绑定背景遮罩
    const overlay = document.createElement('div');
    overlay.className = 'system-calendar-overlay';
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', function() {
        calendar.classList.add('hidden');
        setTimeout(() => {
            calendar.remove();
            overlay.remove();
        }, 300);
    });
}

// 生成日历日期
function generateCalendarDates() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // 获取当前月的第一天
    const firstDay = new Date(year, month, 1);
    // 获取当前月的最后一天
    const lastDay = new Date(year, month + 1, 0);
    // 获取第一天是星期几
    const startDay = firstDay.getDay();
    // 获取最后一天是星期几
    const endDay = lastDay.getDay();
    // 获取最后一天的日期
    const lastDate = lastDay.getDate();
    
    const calendarDates = document.getElementById('calendar-dates');
    calendarDates.innerHTML = '';
    
    // 添加上个月的日期
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
        const date = document.createElement('div');
        date.className = 'system-calendar-date other-month';
        date.textContent = prevMonthLastDay - i;
        calendarDates.appendChild(date);
    }
    
    // 添加本月的日期
    for (let i = 1; i <= lastDate; i++) {
        const date = document.createElement('div');
        date.className = 'system-calendar-date';
        date.textContent = i;
        
        // 标记今天
        if (i === now.getDate()) {
            date.classList.add('today');
        }
        
        date.addEventListener('click', function() {
            // 这里可以处理日期选择逻辑
            console.log('选择日期:', i);
        });
        
        calendarDates.appendChild(date);
    }
    
    // 添加下个月的日期
    const nextMonthDays = 6 - endDay;
    for (let i = 1; i <= nextMonthDays; i++) {
        const date = document.createElement('div');
        date.className = 'system-calendar-date other-month';
        date.textContent = i;
        calendarDates.appendChild(date);
    }
}

// 显示系统托盘菜单
function showSystemTrayMenu(event) {
    const menuItem = event.target.closest('.system-tray-item');
    if (!menuItem) return;
    
    // 移除现有的系统托盘菜单
    const existingMenu = document.querySelector('.system-tray-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // 创建新的系统托盘菜单
    const menu = document.createElement('div');
    menu.className = 'system-tray-menu';
    
    let menuHTML = '';
    
    if (menuItem.classList.contains('system-tray-network')) {
        menuHTML = `
            <div class="system-tray-menu-item">
                <i class="fas fa-wifi"></i>
                <span>网络设置</span>
            </div>
            <div class="system-tray-menu-item divider"></div>
            <div class="system-tray-menu-item">
                <i class="fas fa-signal"></i>
                <span>信号强度</span>
            </div>
            <div class="system-tray-menu-item">
                <i class="fas fa-cog"></i>
                <span>网络配置</span>
            </div>
        `;
    } else if (menuItem.classList.contains('system-tray-battery')) {
        menuHTML = `
            <div class="system-tray-menu-item">
                <i class="fas fa-battery-three-quarters"></i>
                <span>电池状态</span>
            </div>
            <div class="system-tray-menu-item divider"></div>
            <div class="system-tray-menu-item">
                <i class="fas fa-plug"></i>
                <span>电源管理</span>
            </div>
            <div class="system-tray-menu-item">
                <i class="fas fa-cog"></i>
                <span>电池设置</span>
            </div>
        `;
    } else if (menuItem.classList.contains('system-tray-volume')) {
        menuHTML = `
            <div class="system-tray-menu-item">
                <i class="fas fa-volume-up"></i>
                <span>音量控制</span>
            </div>
            <div class="system-tray-menu-item divider"></div>
            <div class="system-tray-menu-item">
                <i class="fas fa-headphones"></i>
                <span>音频输出</span>
            </div>
            <div class="system-tray-menu-item">
                <i class="fas fa-microphone"></i>
                <span>音频输入</span>
            </div>
            <div class="system-tray-menu-item divider"></div>
            <div class="system-tray-menu-item">
                <i class="fas fa-cog"></i>
                <span>声音设置</span>
            </div>
        `;
    }
    
    menu.innerHTML = menuHTML;
    
    // 设置位置
    const rect = menuItem.getBoundingClientRect();
    menu.style.left = (rect.left + rect.width / 2 - menu.offsetWidth / 2) + 'px';
    menu.style.top = (rect.bottom + 5) + 'px';
    
    document.body.appendChild(menu);
    
    // 绑定菜单项事件
    bindSystemTrayMenuItems(menu);
    
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

// 绑定系统托盘菜单项事件
function bindSystemTrayMenuItems(menu) {
    const menuItems = menu.querySelectorAll('.system-tray-menu-item');
    
    menuItems.forEach(item => {
        if (!item.classList.contains('divider')) {
            item.addEventListener('click', function() {
                const text = this.querySelector('span').textContent;
                handleSystemTrayMenuItem(text);
            });
        }
    });
}

// 处理系统托盘菜单项
function handleSystemTrayMenuItem(text) {
    switch(text) {
        case '网络设置':
            openApplication('browser');
            break;
        case '电池状态':
            showBatteryStatus();
            break;
        case '音量控制':
            showVolumeControl();
            break;
        case '电源管理':
            openApplication('settings');
            break;
        case '声音设置':
            openApplication('settings');
            break;
    }
}

// 显示系统托盘工具提示
function showSystemTrayTooltip() {
    // 这里可以实现系统托盘工具提示
    console.log('显示系统托盘工具提示');
}

// 隐藏系统托盘工具提示
function hideSystemTrayTooltip() {
    // 这里可以实现系统托盘工具提示
    console.log('隐藏系统托盘工具提示');
}

// 显示网络菜单
function showNetworkMenu() {
    // 这里可以实现网络菜单
    console.log('显示网络菜单');
}

// 显示电池菜单
function showBatteryMenu() {
    // 这里可以实现电池菜单
    console.log('显示电池菜单');
}

// 显示音量菜单
function showVolumeMenu() {
    // 这里可以实现音量菜单
    console.log('显示音量菜单');
}

// 显示电池状态
function showBatteryStatus() {
    // 这里可以实现电池状态显示
    console.log('显示电池状态');
}

// 显示音量控制
function showVolumeControl() {
    // 这里可以实现音量控制
    console.log('显示音量控制');
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
        case 'taskbar':
            items.push({ icon: 'fas fa-cog', text: '任务栏设置', action: 'settings' });
            items.push({ icon: 'fas fa-expand', text: '显示桌面', action: 'show-desktop' });
            items.push({ icon: 'fas fa-lock', text: '锁定屏幕', action: 'lock' });
            items.push({ icon: 'fas fa-power-off', text: '关机', action: 'shutdown' });
            break;
            
        case 'desktop-icon':
            items.push({ icon: 'fas fa-folder-open', text: '打开', action: 'open' });
            items.push({ icon: 'fas fa-copy', text: '复制', action: 'copy' });
            items.push({ icon: 'fas fa-cut', text: '剪切', action: 'cut' });
            items.push({ icon: 'fas fa-trash', text: '删除', action: 'delete' });
            items.push({ icon: 'fas fa-cog', text: '属性', action: 'properties' });
            break;
            
        case 'window':
            items.push({ icon: 'fas fa-window-minimize', text: '最小化', action: 'minimize' });
            items.push({ icon: 'fas fa-window-maximize', text: '最大化', action: 'maximize' });
            items.push({ icon: 'fas fa-times', text: '关闭', action: 'close' });
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
        case 'settings':
            openApplication('settings');
            break;
            
        case 'show-desktop':
            showDesktop();
            break;
            
        case 'lock':
            lockScreen();
            break;
            
        case 'shutdown':
            showShutdownDialog();
            break;
            
        case 'open':
            if (contextType === 'desktop-icon') {
                const appName = element.getAttribute('data-app');
                if (appName) {
                    openApplication(appName);
                }
            }
            break;
            
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
                    maximizeWindow(window);
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
    }
}

// 显示桌面
function showDesktop() {
    const windows = document.querySelectorAll('.window');
    windows.forEach(window => {
        if (!window.classList.contains('minimized')) {
            minimizeWindow(window);
        }
    });
}

// 锁定屏幕
function lockScreen() {
    // 这里可以实现锁定屏幕的逻辑
    console.log('锁定屏幕');
}

// 显示关机对话框
function showShutdownDialog() {
    // 这里可以实现关机对话框的逻辑
    console.log('显示关机对话框');
}

// 过滤开始菜单应用
function filterStartMenuApps(query) {
    const apps = document.querySelectorAll('.start-menu-app, .start-menu-tool');
    
    apps.forEach(app => {
        const appName = app.getAttribute('data-app');
        const appTitle = app.querySelector('span').textContent.toLowerCase();
        
        if (appName.includes(query) || appTitle.includes(query)) {
            app.style.display = 'flex';
        } else {
            app.style.display = 'none';
        }
    });
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
        window.classList.remove('maximized');
        window.style.left = window.dataset.originalLeft || '100px';
        window.style.top = window.dataset.originalTop || '100px';
        window.style.width = window.dataset.originalWidth || '600px';
        window.style.height = window.dataset.originalHeight || '400px';
    } else {
        // 保存原始位置和大小
        window.dataset.originalLeft = window.style.left;
        window.dataset.originalTop = window.style.top;
        window.dataset.originalWidth = window.style.width;
        window.dataset.originalHeight = window.style.height;
        
        // 最大化窗口
        window.classList.add('maximized');
        window.style.left = '0px';
        window.style.top = '0px';
        window.style.width = '100%';
        window.style.height = 'calc(100% - 40px)';
    }
}

// 关闭窗口
function closeWindow(window) {
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