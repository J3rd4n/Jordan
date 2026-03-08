// 2D跑酷游戏主逻辑文件

// 游戏配置
const CONFIG = {
    GRAVITY: 0.6,
    JUMP_FORCE: -14,
    MOVE_SPEED: 6,
    FRICTION: 0.85,
    PLAYER_SIZE: 30,
    PLATFORM_HEIGHT: 20,
    SPIKE_SIZE: 30,
    COIN_SIZE: 20,
    CANVAS_WIDTH: 1200,
    CANVAS_HEIGHT: 700,
    DEVELOPER_PASSWORD: '119079'
};

// 游戏状态
const GameState = {
    MENU: 'menu',
    LEVEL_SELECT: 'level_select',
    PLAYING: 'playing',
    LEVEL_COMPLETE: 'level_complete',
    GAME_OVER: 'game_over'
};

class Game {
    constructor() {
        this.state = GameState.MENU;
        this.currentLevel = 1;
        this.unlockedLevels = 1;
        this.completedLevels = [];
        this.isDeveloperMode = false;
        this.time = 0;
        this.deaths = 0;
        this.coins = 0;
        this.totalTime = 0;
        this.totalDeaths = 0;
        this.totalCoins = 0;
        
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        this.player = null;
        this.platforms = [];
        this.spikes = [];
        this.coinItems = [];
        this.goals = [];
        this.movingPlatforms = [];
        this.enemies = [];
        this.teleporters = [];
        this.iceBlocks = [];
        this.lava = [];
        
        // 摄像头系统
        this.camera = {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            smoothing: 0.1
        };
        
        this.keys = {};
        this.touchControls = { left: false, right: false, jump: false };
        this.lastTime = 0;
        
        this.init();
    }
    
    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.gameLoop();
    }
    
    resizeCanvas() {
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;
    }
    
    setupEventListeners() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === 'Escape' && this.state === GameState.PLAYING) {
                this.exitGame();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // 触摸事件
        const jumpBtn = document.getElementById('jump-btn');
        if (jumpBtn) {
            jumpBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.touchControls.jump = true;
            });
            jumpBtn.addEventListener('touchend', () => {
                this.touchControls.jump = false;
            });
        }
        
        // 滑动控制
        let touchStartX = 0;
        this.canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touchX = e.touches[0].clientX;
            const diff = touchX - touchStartX;
            
            if (Math.abs(diff) > 30) {
                this.touchControls.left = diff < 0;
                this.touchControls.right = diff > 0;
            }
        });
        
        this.canvas.addEventListener('touchend', () => {
            this.touchControls.left = false;
            this.touchControls.right = false;
        });
        
        // UI按钮事件
        document.getElementById('start-btn').addEventListener('click', () => {
            this.showLevelSelect();
        });
        
        const instructionsBtn = document.getElementById('instructions-btn');
        if (instructionsBtn) {
            instructionsBtn.addEventListener('click', () => {
                console.log('操作说明按钮被点击');
                this.showInstructions();
            });
            console.log('操作说明按钮事件监听器已绑定');
        } else {
            console.error('找不到instructions-btn元素');
        }
        
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showSettings();
        });
        
        document.getElementById('developer-mode-btn').addEventListener('click', () => {
            this.toggleDeveloperMode();
        });
        
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetProgress();
        });
        
        document.getElementById('close-settings-btn').addEventListener('click', () => {
            this.hideSettings();
        });
        
        document.getElementById('close-instructions-btn').addEventListener('click', () => {
            this.hideInstructions();
        });
        
        document.getElementById('back-to-menu-btn').addEventListener('click', () => {
            this.showMenu();
        });
        
        document.getElementById('exit-btn').addEventListener('click', () => {
            this.exitGame();
        });
        
        document.getElementById('next-level-btn').addEventListener('click', () => {
            this.nextLevel();
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('menu-btn').addEventListener('click', () => {
            this.showMenu();
        });
    }
    
    showMenu() {
        this.state = GameState.MENU;
        document.getElementById('start-screen').style.display = 'block';
        document.getElementById('level-select-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('game-over-screen').style.display = 'none';
        document.getElementById('level-complete-screen').style.display = 'none';
    }
    
    showLevelSelect() {
        this.state = GameState.LEVEL_SELECT;
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('level-select-screen').style.display = 'block';
        document.getElementById('game-screen').style.display = 'none';
        this.renderLevelGrid();
    }
    
    renderLevelGrid() {
        const grid = document.getElementById('level-grid');
        grid.innerHTML = '';
        
        const totalLevels = Math.min(100, window.LEVELS.length);
        
        for (let i = 1; i <= totalLevels; i++) {
            const levelItem = document.createElement('div');
            levelItem.className = 'level-item';
            levelItem.textContent = i;
            
            const isUnlocked = this.isDeveloperMode || i <= this.unlockedLevels;
            const isCompleted = this.completedLevels.includes(i);
            
            if (!isUnlocked) {
                levelItem.classList.add('locked');
            } else {
                if (isCompleted) {
                    levelItem.classList.add('completed');
                }
                levelItem.addEventListener('click', () => {
                    this.startLevel(i);
                });
            }
            
            grid.appendChild(levelItem);
        }
    }
    
    startLevel(levelNumber) {
        if (levelNumber > window.LEVELS.length) {
            alert('关卡未加载完成，请刷新页面重试');
            return;
        }
        
        this.currentLevel = levelNumber;
        this.state = GameState.PLAYING;
        this.time = 0;
        this.deaths = 0;
        this.coins = 0;
        
        this.loadLevelData(levelNumber);
        
        document.getElementById('level-select-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        document.getElementById('level-display').textContent = `关卡: ${levelNumber}/${window.LEVELS.length}`;
        
        this.lastTime = performance.now();
    }
    
    loadLevelData(levelNumber) {
        const levelData = window.LEVELS[levelNumber - 1];
        
        if (!levelData) {
            console.error(`关卡 ${levelNumber} 数据不存在`);
            return;
        }
        
        // 重置关卡数据
        this.platforms = [];
        this.spikes = [];
        this.coinItems = [];
        this.goals = [];
        this.movingPlatforms = [];
        this.enemies = [];
        this.teleporters = [];
        this.iceBlocks = [];
        this.lava = [];
        
        // 加载平台
        if (levelData.platforms) {
            levelData.platforms.forEach(p => {
                this.platforms.push({
                    x: p.x,
                    y: p.y,
                    width: p.width,
                    height: p.height
                });
            });
        }
        
        // 加载尖刺
        if (levelData.spikes) {
            levelData.spikes.forEach(s => {
                this.spikes.push({
                    x: s.x,
                    y: s.y,
                    width: s.width || CONFIG.SPIKE_SIZE,
                    height: s.height || CONFIG.SPIKE_SIZE
                });
            });
        }
        
        // 加载金币
        if (levelData.coins) {
            levelData.coins.forEach(c => {
                this.coinItems.push({
                    x: c.x,
                    y: c.y,
                    width: CONFIG.COIN_SIZE,
                    height: CONFIG.COIN_SIZE,
                    collected: false
                });
            });
        }
        
        // 加载终点
        if (levelData.goal) {
            this.goals.push({
                x: levelData.goal.x,
                y: levelData.goal.y,
                width: levelData.goal.width || 40,
                height: levelData.goal.height || 60
            });
        }
        
        // 加载移动平台
        if (levelData.movingPlatforms) {
            levelData.movingPlatforms.forEach(m => {
                this.movingPlatforms.push({
                    x: m.x,
                    y: m.y,
                    width: m.width,
                    height: m.height,
                    startX: m.startX,
                    endX: m.endX,
                    speed: m.speed || 2,
                    direction: 1
                });
            });
        }
        
        // 加载敌人
        if (levelData.enemies) {
            levelData.enemies.forEach(e => {
                this.enemies.push({
                    x: e.x,
                    y: e.y,
                    width: e.width || 30,
                    height: e.height || 30,
                    startX: e.startX,
                    endX: e.endX,
                    speed: e.speed || 2,
                    direction: 1
                });
            });
        }
        
        // 加载传送门
        if (levelData.teleporters) {
            levelData.teleporters.forEach(t => {
                this.teleporters.push({
                    x: t.x,
                    y: t.y,
                    width: t.width || 40,
                    height: t.height || 60,
                    targetX: t.targetX,
                    targetY: t.targetY,
                    used: false
                });
            });
        }
        
        // 加载冰块
        if (levelData.iceBlocks) {
            levelData.iceBlocks.forEach(i => {
                this.iceBlocks.push({
                    x: i.x,
                    y: i.y,
                    width: i.width,
                    height: i.height
                });
            });
        }
        
        // 加载岩浆
        if (levelData.lava) {
            levelData.lava.forEach(l => {
                this.lava.push({
                    x: l.x,
                    y: l.y,
                    width: l.width,
                    height: l.height
                });
            });
        }
        
        // 创建玩家
        if (levelData.playerStart) {
            this.player = {
                x: levelData.playerStart.x,
                y: levelData.playerStart.y,
                width: CONFIG.PLAYER_SIZE,
                height: CONFIG.PLAYER_SIZE,
                vx: 0,
                vy: 0,
                onGround: false,
                onIce: false
            };
        }
    }
    
    gameLoop() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        if (this.state === GameState.PLAYING) {
            this.update(deltaTime);
            this.render();
            this.updateUI();
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update(deltaTime) {
        if (!this.player) return;
        
        // 更新时间
        this.time += deltaTime;
        
        // 处理输入
        const moveSpeed = CONFIG.MOVE_SPEED;
        const friction = this.player.onIce ? 0.98 : CONFIG.FRICTION;
        
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A'] || this.touchControls.left) {
            this.player.vx -= moveSpeed * 0.15;
        }
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D'] || this.touchControls.right) {
            this.player.vx += moveSpeed * 0.15;
        }
        
        // 限制最大速度
        this.player.vx = Math.max(-moveSpeed, Math.min(moveSpeed, this.player.vx));
        
        // 应用摩擦力
        this.player.vx *= friction;
        
        // 重力
        this.player.vy += CONFIG.GRAVITY;
        
        // 跳跃
        if ((this.keys['ArrowUp'] || this.keys['w'] || this.keys['W'] || this.keys[' '] || this.touchControls.jump) && this.player.onGround) {
            this.player.vy = CONFIG.JUMP_FORCE;
            this.player.onGround = false;
        }
        
        // 更新位置
        this.player.x += this.player.vx;
        this.player.y += this.player.vy;
        
        // 碰撞检测
        this.handleCollisions();
        
        // 更新移动平台
        this.updateMovingPlatforms();
        
        // 更新敌人
        this.updateEnemies();
        
        // 边界检测
        this.checkBoundaries();
        
        // 检查是否死亡
        if (this.checkDeath()) {
            this.resetPlayer();
        }
        
        // 检查是否到达终点
        if (this.checkGoal()) {
            this.levelComplete();
        }
    }
    
    handleCollisions() {
        if (!this.player) return;
        
        this.player.onGround = false;
        this.player.onIce = false;
        
        // 平台碰撞
        const allPlatforms = [...this.platforms, ...this.movingPlatforms, ...this.iceBlocks];
        
        allPlatforms.forEach(platform => {
            if (this.checkCollision(this.player, platform)) {
                this.resolveCollision(this.player, platform);
            }
        });
        
        // 检测是否在冰块上
        this.iceBlocks.forEach(ice => {
            if (this.checkOnTop(this.player, ice)) {
                this.player.onIce = true;
            }
        });
        
        // 金币碰撞
        this.coinItems.forEach(coin => {
            if (!coin.collected && this.checkCollision(this.player, coin)) {
                coin.collected = true;
                this.coins++;
            }
        });
        
        // 传送门碰撞
        this.teleporters.forEach(teleporter => {
            if (!teleporter.used && this.checkCollision(this.player, teleporter)) {
                teleporter.used = true;
                this.player.x = teleporter.targetX;
                this.player.y = teleporter.targetY;
                this.player.vx = 0;
                this.player.vy = 0;
            }
        });
    }
    
    checkCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }
    
    checkOnTop(player, platform) {
        const playerBottom = player.y + player.height;
        const playerCenterX = player.x + player.width / 2;
        
        return playerBottom >= platform.y - 5 &&
               playerBottom <= platform.y + 10 &&
               playerCenterX > platform.x &&
               playerCenterX < platform.x + platform.width &&
               player.vy >= 0;
    }
    
    resolveCollision(player, platform) {
        const overlapLeft = (player.x + player.width) - platform.x;
        const overlapRight = (platform.x + platform.width) - player.x;
        const overlapTop = (player.y + player.height) - platform.y;
        const overlapBottom = (platform.y + platform.height) - player.y;
        
        const minOverlapX = Math.min(overlapLeft, overlapRight);
        const minOverlapY = Math.min(overlapTop, overlapBottom);
        
        if (minOverlapY < minOverlapX) {
            if (overlapTop < overlapBottom) {
                player.y = platform.y - player.height;
                player.vy = 0;
                player.onGround = true;
            } else {
                player.y = platform.y + platform.height;
                player.vy = 0;
            }
        } else {
            if (overlapLeft < overlapRight) {
                player.x = platform.x - player.width;
            } else {
                player.x = platform.x + platform.width;
            }
            player.vx = 0;
        }
    }
    
    updateMovingPlatforms() {
        this.movingPlatforms.forEach(platform => {
            platform.x += platform.speed * platform.direction;
            
            if (platform.x <= platform.startX || platform.x >= platform.endX) {
                platform.direction *= -1;
            }
        });
    }
    
    updateEnemies() {
        this.enemies.forEach(enemy => {
            enemy.x += enemy.speed * enemy.direction;
            
            if (enemy.x <= enemy.startX || enemy.x >= enemy.endX) {
                enemy.direction *= -1;
            }
        });
    }
    
    checkBoundaries() {
        if (!this.player) return;
        
        if (this.player.x < 0) {
            this.player.x = 0;
            this.player.vx = 0;
        }
        
        if (this.player.x + this.player.width > CONFIG.CANVAS_WIDTH) {
            this.player.x = CONFIG.CANVAS_WIDTH - this.player.width;
            this.player.vx = 0;
        }
    }
    
    checkDeath() {
        if (!this.player) return false;
        
        // 掉出边界
        if (this.player.y > CONFIG.CANVAS_HEIGHT) {
            return true;
        }
        
        // 尖刺碰撞
        for (const spike of this.spikes) {
            if (this.checkCollision(this.player, spike)) {
                return true;
            }
        }
        
        // 岩浆碰撞
        for (const lavaBlock of this.lava) {
            if (this.checkCollision(this.player, lavaBlock)) {
                return true;
            }
        }
        
        // 敌人碰撞
        for (const enemy of this.enemies) {
            if (this.checkCollision(this.player, enemy)) {
                return true;
            }
        }
        
        return false;
    }
    
    checkGoal() {
        if (!this.player) return false;
        
        for (const goal of this.goals) {
            if (this.checkCollision(this.player, goal)) {
                return true;
            }
        }
        
        return false;
    }
    
    resetPlayer() {
        if (!this.player) return;
        
        const levelData = window.LEVELS[this.currentLevel - 1];
        if (levelData && levelData.playerStart) {
            this.player.x = levelData.playerStart.x;
            this.player.y = levelData.playerStart.y;
            this.player.vx = 0;
            this.player.vy = 0;
            this.player.onGround = false;
            this.player.onIce = false;
        }
        
        this.deaths++;
        this.totalDeaths++;
        
        // 重置传送门
        this.teleporters.forEach(t => t.used = false);
    }
    
    levelComplete() {
        this.state = GameState.LEVEL_COMPLETE;
        this.totalTime += this.time;
        this.totalCoins += this.coins;
        
        // 解锁下一关
        if (this.currentLevel >= this.unlockedLevels && this.currentLevel < window.LEVELS.length) {
            this.unlockedLevels = this.currentLevel + 1;
        }
        
        // 标记当前关卡为已完成
        if (!this.completedLevels.includes(this.currentLevel)) {
            this.completedLevels.push(this.currentLevel);
        }
        
        this.saveProgress();
        
        // 显示关卡完成界面
        const timeSpan = document.getElementById('level-time').querySelector('span');
        const deathsSpan = document.getElementById('level-deaths').querySelector('span');
        const coinsSpan = document.getElementById('level-coins').querySelector('span');
        
        if (timeSpan) timeSpan.textContent = this.formatTime(this.time);
        if (deathsSpan) deathsSpan.textContent = this.deaths;
        if (coinsSpan) coinsSpan.textContent = this.coins;
        
        if (this.currentLevel >= window.LEVELS.length) {
            this.gameOver();
        } else {
            document.getElementById('level-complete-screen').style.display = 'block';
        }
    }
    
    nextLevel() {
        document.getElementById('level-complete-screen').style.display = 'none';
        if (this.currentLevel < window.LEVELS.length) {
            this.startLevel(this.currentLevel + 1);
        } else {
            this.showLevelSelect();
        }
    }
    
    gameOver() {
        this.state = GameState.GAME_OVER;
        
        const scoreSpan = document.getElementById('final-score').querySelector('span');
        const deathsSpan = document.getElementById('final-deaths').querySelector('span');
        const coinsSpan = document.getElementById('final-coins').querySelector('span');
        
        if (scoreSpan) scoreSpan.textContent = this.formatTime(this.totalTime);
        if (deathsSpan) deathsSpan.textContent = this.totalDeaths;
        if (coinsSpan) coinsSpan.textContent = this.totalCoins;
        
        document.getElementById('level-complete-screen').style.display = 'none';
        document.getElementById('game-over-screen').style.display = 'block';
    }
    
    restartGame() {
        document.getElementById('game-over-screen').style.display = 'none';
        this.showLevelSelect();
    }
    
    exitGame() {
        this.state = GameState.LEVEL_SELECT;
        document.getElementById('game-screen').style.display = 'none';
        this.showLevelSelect();
    }
    
    render() {
        // 更新摄像头位置
        if (this.player) {
            // 计算目标位置（玩家居中）
            this.camera.targetX = this.player.x - CONFIG.CANVAS_WIDTH / 2;
            this.camera.targetY = this.player.y - CONFIG.CANVAS_HEIGHT / 2;
            
            // 限制摄像头不要超出关卡边界
            const minX = 0;
            const maxX = 200; // 允许向右移动200像素
            const minY = -50; // 允许向上移动50像素
            const maxY = 50;  // 允许向下移动50像素
            
            this.camera.targetX = Math.max(minX, Math.min(this.camera.targetX, maxX));
            this.camera.targetY = Math.max(minY, Math.min(this.camera.targetY, maxY));
            
            // 平滑移动摄像头
            this.camera.x += (this.camera.targetX - this.camera.x) * this.camera.smoothing;
            this.camera.y += (this.camera.targetY - this.camera.y) * this.camera.smoothing;
        }
        
        // 清空画布
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        // 保存上下文并应用摄像头偏移
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // 绘制云朵背景
        this.drawClouds();
        
        // 绘制平台
        this.platforms.forEach(platform => {
            this.drawPlatform(platform, '#8B4513');
        });
        
        // 绘制冰块
        this.iceBlocks.forEach(ice => {
            this.drawPlatform(ice, '#87CEEB', true);
        });
        
        // 绘制移动平台
        this.movingPlatforms.forEach(platform => {
            this.drawPlatform(platform, '#DEB887');
        });
        
        // 绘制岩浆
        this.lava.forEach(lava => {
            this.drawLava(lava);
        });
        
        // 绘制尖刺
        this.spikes.forEach(spike => {
            this.drawSpike(spike);
        });
        
        // 绘制金币
        this.coinItems.forEach(coin => {
            if (!coin.collected) {
                this.drawCoin(coin);
            }
        });
        
        // 绘制传送门
        this.teleporters.forEach(teleporter => {
            this.drawTeleporter(teleporter);
        });
        
        // 绘制敌人
        this.enemies.forEach(enemy => {
            this.drawEnemy(enemy);
        });
        
        // 绘制终点
        this.goals.forEach(goal => {
            this.drawGoal(goal);
        });
        
        // 绘制玩家
        if (this.player) {
            this.drawPlayer();
        }
        
        // 恢复上下文，取消摄像头偏移
        this.ctx.restore();
    }
    
    drawClouds() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(150, 100, 40, 0, Math.PI * 2);
        this.ctx.arc(200, 80, 50, 0, Math.PI * 2);
        this.ctx.arc(250, 100, 40, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(600, 150, 35, 0, Math.PI * 2);
        this.ctx.arc(650, 130, 45, 0, Math.PI * 2);
        this.ctx.arc(700, 150, 35, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(950, 100, 40, 0, Math.PI * 2);
        this.ctx.arc(1000, 80, 50, 0, Math.PI * 2);
        this.ctx.arc(1050, 100, 40, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawPlatform(platform, color, isIce = false) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // 添加阴影效果
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(platform.x, platform.y + platform.height - 5, platform.width, 5);
        
        if (isIce) {
            // 冰块效果
            this.ctx.fillStyle = 'rgba(135, 206, 235, 0.5)';
            this.ctx.fillRect(platform.x, platform.y, platform.width, 3);
        }
    }
    
    drawSpike(spike) {
        this.ctx.fillStyle = '#FF4444';
        this.ctx.beginPath();
        this.ctx.moveTo(spike.x, spike.y + spike.height);
        this.ctx.lineTo(spike.x + spike.width / 2, spike.y);
        this.ctx.lineTo(spike.x + spike.width, spike.y + spike.height);
        this.ctx.closePath();
        this.ctx.fill();
        
        // 添加阴影
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.beginPath();
        this.ctx.moveTo(spike.x + spike.width / 2, spike.y);
        this.ctx.lineTo(spike.x + spike.width, spike.y + spike.height);
        this.ctx.lineTo(spike.x + spike.width / 2, spike.y + spike.height);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawCoin(coin) {
        const centerX = coin.x + coin.width / 2;
        const centerY = coin.y + coin.height / 2;
        const radius = coin.width / 2;
        
        // 外圈
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 内圈
        this.ctx.fillStyle = '#FFA500';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius * 0.7, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 金色闪光
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.beginPath();
        this.ctx.arc(centerX - 3, centerY - 3, radius * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawGoal(goal) {
        // 绘制旗帜杆
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(goal.x + goal.width / 2 - 5, goal.y, 10, goal.height);
        
        // 绘制旗帜
        this.ctx.fillStyle = '#00FF00';
        this.ctx.beginPath();
        this.ctx.moveTo(goal.x + goal.width / 2 + 5, goal.y);
        this.ctx.lineTo(goal.x + goal.width / 2 + 35, goal.y + 20);
        this.ctx.lineTo(goal.x + goal.width / 2 + 5, goal.y + 40);
        this.ctx.closePath();
        this.ctx.fill();
        
        // 添加光泽
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.moveTo(goal.x + goal.width / 2 + 5, goal.y);
        this.ctx.lineTo(goal.x + goal.width / 2 + 20, goal.y + 10);
        this.ctx.lineTo(goal.x + goal.width / 2 + 5, goal.y + 20);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawTeleporter(teleporter) {
        const gradient = this.ctx.createLinearGradient(
            teleporter.x, 
            teleporter.y,
            teleporter.x + teleporter.width,
            teleporter.y + teleporter.height
        );
        gradient.addColorStop(0, '#9400D3');
        gradient.addColorStop(1, '#4B0082');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(teleporter.x, teleporter.y, teleporter.width, teleporter.height);
        
        // 添加边框
        this.ctx.strokeStyle = '#DA70D6';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(teleporter.x, teleporter.y, teleporter.width, teleporter.height);
        
        // 添加闪烁效果
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.beginPath();
        this.ctx.arc(
            teleporter.x + teleporter.width / 2,
            teleporter.y + teleporter.height / 2,
            10,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }
    
    drawEnemy(enemy) {
        // 绘制敌人身体
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // 添加眼睛
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(enemy.x + enemy.width * 0.3, enemy.y + enemy.height * 0.4, 5, 0, Math.PI * 2);
        this.ctx.arc(enemy.x + enemy.width * 0.7, enemy.y + enemy.height * 0.4, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 添加瞳孔
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(enemy.x + enemy.width * 0.3, enemy.y + enemy.height * 0.4, 2, 0, Math.PI * 2);
        this.ctx.arc(enemy.x + enemy.width * 0.7, enemy.y + enemy.height * 0.4, 2, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawLava(lava) {
        const gradient = this.ctx.createLinearGradient(
            lava.x,
            lava.y,
            lava.x,
            lava.y + lava.height
        );
        gradient.addColorStop(0, '#FF4500');
        gradient.addColorStop(1, '#8B0000');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(lava.x, lava.y, lava.width, lava.height);
        
        // 添加气泡效果
        this.ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
        for (let i = 0; i < 3; i++) {
            const bubbleX = lava.x + Math.random() * lava.width;
            const bubbleY = lava.y + Math.random() * lava.height;
            this.ctx.beginPath();
            this.ctx.arc(bubbleX, bubbleY, 3 + Math.random() * 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawPlayer() {
        if (!this.player) return;
        
        // 绘制玩家身体
        const gradient = this.ctx.createLinearGradient(
            this.player.x,
            this.player.y,
            this.player.x + this.player.width,
            this.player.y + this.player.height
        );
        gradient.addColorStop(0, '#4CAF50');
        gradient.addColorStop(1, '#2E7D32');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // 添加阴影
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(this.player.x, this.player.y + this.player.height - 5, this.player.width, 5);
        
        // 添加眼睛
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(this.player.x + this.player.width * 0.35, this.player.y + this.player.height * 0.35, 5, 0, Math.PI * 2);
        this.ctx.arc(this.player.x + this.player.width * 0.65, this.player.y + this.player.height * 0.35, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 添加瞳孔
        this.ctx.fillStyle = 'black';
        const lookDirection = this.player.vx >= 0 ? 1 : -1;
        this.ctx.beginPath();
        this.ctx.arc(
            this.player.x + this.player.width * 0.35 + lookDirection * 2,
            this.player.y + this.player.height * 0.35,
            2,
            0,
            Math.PI * 2
        );
        this.ctx.arc(
            this.player.x + this.player.width * 0.65 + lookDirection * 2,
            this.player.y + this.player.height * 0.35,
            2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }
    
    updateUI() {
        document.getElementById('time-display').textContent = `时间: ${this.formatTime(this.time)}`;
        document.getElementById('deaths-display').textContent = `死亡: ${this.deaths}`;
        document.getElementById('coin-display').textContent = `金币: ${this.coins}`;
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    
    showSettings() {
        document.getElementById('settings-modal').style.display = 'block';
        this.updateDeveloperModeButton();
        
        // 调试信息
        console.log('=== 游戏状态调试 ===');
        console.log('开发者模式:', this.isDeveloperMode);
        console.log('解锁关卡数:', this.unlockedLevels);
        console.log('已完成关卡:', this.completedLevels);
        console.log('总金币:', this.totalCoins);
        console.log('总死亡:', this.totalDeaths);
        console.log('总用时:', this.totalTime);
    }
    
    hideSettings() {
        document.getElementById('settings-modal').style.display = 'none';
    }
    
    showInstructions() {
        console.log('显示操作说明');
        const modal = document.getElementById('instructions-modal');
        if (modal) {
            modal.style.display = 'block';
        } else {
            console.error('找不到instructions-modal元素');
        }
    }
    
    hideInstructions() {
        document.getElementById('instructions-modal').style.display = 'none';
    }
    
    updateDeveloperModeButton() {
        const btn = document.getElementById('developer-mode-btn');
        if (this.isDeveloperMode) {
            btn.textContent = '开启';
            btn.classList.add('active');
        } else {
            btn.textContent = '关闭';
            btn.classList.remove('active');
        }
    }
    
    toggleDeveloperMode() {
        if (this.isDeveloperMode) {
            this.isDeveloperMode = false;
        } else {
            const password = prompt('请输入开发者密码:');
            if (password === CONFIG.DEVELOPER_PASSWORD) {
                this.isDeveloperMode = true;
                alert('开发者模式已开启！所有关卡已解锁。');
            } else {
                alert('密码错误！');
            }
        }
        
        this.saveProgress();
        this.updateDeveloperModeButton();
        this.renderLevelGrid();
    }
    
    resetProgress() {
        if (confirm('确定要重置游戏进度吗？这将锁定所有关卡，仅保留第一关！')) {
            // 重置所有游戏数据
            this.unlockedLevels = 1;
            this.completedLevels = [];
            this.isDeveloperMode = false;
            this.totalTime = 0;
            this.totalDeaths = 0;
            this.totalCoins = 0;
            
            // 清除本地存储
            localStorage.removeItem('parkourGameProgress');
            
            // 保存新的进度
            this.saveProgress();
            
            // 更新UI
            this.updateDeveloperModeButton();
            this.renderLevelGrid();
            
            alert('游戏进度已重置！');
        }
    }
    
    saveProgress() {
        const progress = {
            unlockedLevels: this.unlockedLevels,
            completedLevels: this.completedLevels,
            isDeveloperMode: this.isDeveloperMode,
            totalTime: this.totalTime,
            totalDeaths: this.totalDeaths,
            totalCoins: this.totalCoins
        };
        
        localStorage.setItem('parkourGameProgress', JSON.stringify(progress));
    }
    
    loadProgress() {
        const saved = localStorage.getItem('parkourGameProgress');
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                this.unlockedLevels = progress.unlockedLevels || 1;
                this.completedLevels = progress.completedLevels || [];
                this.isDeveloperMode = progress.isDeveloperMode || false;
                this.totalTime = progress.totalTime || 0;
                this.totalDeaths = progress.totalDeaths || 0;
                this.totalCoins = progress.totalCoins || 0;
            } catch (e) {
                console.error('加载进度失败:', e);
            }
        }
    }
}

// 等待页面加载完成后启动游戏
window.addEventListener('load', () => {
    // 等待关卡数据加载
    setTimeout(() => {
        window.game = new Game();
    }, 500);
});