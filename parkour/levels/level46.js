window.loadLevelData({
    playerStart: { x: 50, y: 550 },
    platforms: [
        { x: 0, y: 600, width: 200, height: 100 },
        { x: 250, y: 550, width: 100, height: 20 },
        { x: 500, y: 500, width: 100, height: 20 },
        { x: 800, y: 500, width: 100, height: 20 },
        { x: 1050, y: 550, width: 150, height: 20 }
    ],
    spikes: [
        { x: 280, y: 520, width: 30, height: 30 }
    ],
    coins: [
        { x: 300, y: 500 },
        { x: 550, y: 450 },
        { x: 850, y: 450 },
        { x: 1100, y: 500 }
    ],
    goal: { x: 1150, y: 490, width: 40, height: 60 },
    movingPlatforms: [],
    enemies: [
        { x: 510, y: 530, width: 30, height: 30, startX: 510, endX: 590, speed: 2 }
    ],
    teleporters: [
        { x: 600, y: 400, width: 40, height: 60, targetX: 700, targetY: 440 }
    ],
    iceBlocks: [],
    lava: []
});