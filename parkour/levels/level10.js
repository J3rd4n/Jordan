window.loadLevelData({
    playerStart: { x: 50, y: 550 },
    platforms: [
        { x: 0, y: 600, width: 200, height: 100 },
        { x: 230, y: 530, width: 130, height: 20 },
        { x: 420, y: 460, width: 130, height: 20 },
        { x: 610, y: 390, width: 130, height: 20 },
        { x: 800, y: 460, width: 130, height: 20 },
        { x: 990, y: 530, width: 130, height: 20 },
        { x: 1150, y: 580, width: 50, height: 20 }
    ],
    spikes: [
        { x: 280, y: 500, width: 30, height: 30 },
        { x: 470, y: 430, width: 30, height: 30 },
        { x: 660, y: 360, width: 30, height: 30 },
        { x: 850, y: 430, width: 30, height: 30 },
        { x: 1040, y: 500, width: 30, height: 30 }
    ],
    coins: [
        { x: 280, y: 480 },
        { x: 470, y: 410 },
        { x: 660, y: 340 },
        { x: 850, y: 410 },
        { x: 1040, y: 480 }
    ],
    goal: { x: 1160, y: 520, width: 40, height: 60 },
    movingPlatforms: [
        { x: 350, y: 520, width: 80, height: 20, startX: 350, endX: 420, speed: 1.5 },
        { x: 550, y: 450, width: 80, height: 20, startX: 550, endX: 620, speed: 1.5 }
    ],
    enemies: [
        { x: 260, y: 490, width: 30, height: 30, startX: 260, endX: 340, speed: 1.5 }
    ],
    teleporters: [],
    iceBlocks: [],
    lava: []
});