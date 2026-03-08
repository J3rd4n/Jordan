window.loadLevelData({
    playerStart: { x: 50, y: 550 },
    platforms: [
        { x: 0, y: 600, width: 200, height: 100 },
        { x: 250, y: 550, width: 150, height: 20 },
        { x: 450, y: 550, width: 150, height: 20 },
        { x: 650, y: 550, width: 150, height: 20 },
        { x: 850, y: 550, width: 150, height: 20 },
        { x: 1050, y: 550, width: 150, height: 20 }
    ],
    spikes: [],
    coins: [
        { x: 300, y: 500 },
        { x: 500, y: 500 },
        { x: 700, y: 500 },
        { x: 900, y: 500 },
        { x: 1100, y: 500 }
    ],
    goal: { x: 1150, y: 490, width: 40, height: 60 },
    movingPlatforms: [],
    enemies: [
        { x: 260, y: 570, width: 30, height: 30, startX: 260, endX: 390, speed: 2 },
        { x: 660, y: 570, width: 30, height: 30, startX: 660, endX: 790, speed: 2 }
    ],
    teleporters: [],
    iceBlocks: [],
    lava: []
});