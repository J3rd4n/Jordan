window.loadLevelData({
    playerStart: { x: 50, y: 550 },
    platforms: [
        { x: 0, y: 600, width: 200, height: 100 },
        { x: 250, y: 550, width: 100, height: 20 },
        { x: 450, y: 500, width: 100, height: 20 },
        { x: 650, y: 450, width: 100, height: 20 },
        { x: 850, y: 500, width: 100, height: 20 },
        { x: 1050, y: 550, width: 150, height: 20 }
    ],
    spikes: [
        { x: 280, y: 520, width: 30, height: 30 },
        { x: 480, y: 470, width: 30, height: 30 },
        { x: 680, y: 420, width: 30, height: 30 }
    ],
    coins: [
        { x: 300, y: 500 },
        { x: 500, y: 450 },
        { x: 700, y: 400 },
        { x: 900, y: 450 },
        { x: 1100, y: 500 }
    ],
    goal: { x: 1150, y: 490, width: 40, height: 60 },
    movingPlatforms: [
        { x: 350, y: 500, width: 100, height: 20, startX: 350, endX: 450, speed: 2 }
    ],
    enemies: [
        { x: 460, y: 530, width: 30, height: 30, startX: 460, endX: 540, speed: 2 }
    ],
    teleporters: [
        { x: 550, y: 400, width: 40, height: 60, targetX: 750, targetY: 440 }
    ],
    iceBlocks: [],
    lava: []
});