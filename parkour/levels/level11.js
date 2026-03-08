window.loadLevelData({
    playerStart: { x: 50, y: 550 },
    platforms: [
        { x: 0, y: 600, width: 200, height: 100 },
        { x: 250, y: 550, width: 100, height: 20 },
        { x: 500, y: 500, width: 100, height: 20 },
        { x: 800, y: 500, width: 100, height: 20 },
        { x: 1050, y: 550, width: 150, height: 20 }
    ],
    spikes: [],
    coins: [
        { x: 300, y: 500 },
        { x: 550, y: 450 },
        { x: 850, y: 450 },
        { x: 1100, y: 500 }
    ],
    goal: { x: 1150, y: 490, width: 40, height: 60 },
    movingPlatforms: [
        { x: 350, y: 500, width: 100, height: 20, startX: 350, endX: 450, speed: 2 }
    ],
    enemies: [],
    teleporters: [],
    iceBlocks: [],
    lava: []
});