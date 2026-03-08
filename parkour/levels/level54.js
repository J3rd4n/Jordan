window.loadLevelData({
    playerStart: { x: 50, y: 550 },
    platforms: [
        { x: 0, y: 600, width: 200, height: 100 },
        { x: 250, y: 530, width: 100, height: 20 },
        { x: 450, y: 490, width: 100, height: 20 },
        { x: 650, y: 450, width: 100, height: 20 },
        { x: 850, y: 490, width: 100, height: 20 },
        { x: 1100, y: 550, width: 100, height: 20 }
    ],
    spikes: [
        { x: 280, y: 500, width: 30, height: 30 },
        { x: 480, y: 460, width: 30, height: 30 }
    ],
    coins: [
        { x: 300, y: 480 },
        { x: 500, y: 440 },
        { x: 700, y: 400 },
        { x: 900, y: 440 },
        { x: 1140, y: 500 }
    ],
    goal: { x: 1140, y: 490, width: 40, height: 60 },
    movingPlatforms: [],
    enemies: [],
    teleporters: [
        { x: 550, y: 400, width: 40, height: 60, targetX: 750, targetY: 440 }
    ],
    iceBlocks: [
        { x: 350, y: 530, width: 100, height: 20 },
        { x: 750, y: 490, width: 100, height: 20 }
    ],
    lava: [
        { x: 550, y: 580, width: 100, height: 20 }
    ]
});