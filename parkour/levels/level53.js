window.loadLevelData({
    playerStart: { x: 50, y: 550 },
    platforms: [
        { x: 0, y: 600, width: 200, height: 100 },
        { x: 300, y: 500, width: 100, height: 20 },
        { x: 500, y: 460, width: 100, height: 20 },
        { x: 700, y: 420, width: 100, height: 20 },
        { x: 900, y: 460, width: 100, height: 20 },
        { x: 1100, y: 550, width: 100, height: 20 }
    ],
    spikes: [],
    coins: [
        { x: 350, y: 450 },
        { x: 550, y: 410 },
        { x: 750, y: 370 },
        { x: 950, y: 410 },
        { x: 1140, y: 500 }
    ],
    goal: { x: 1140, y: 490, width: 40, height: 60 },
    movingPlatforms: [
        { x: 400, y: 460, width: 100, height: 20, startX: 400, endX: 500, speed: 2.5 }
    ],
    enemies: [
        { x: 710, y: 450, width: 30, height: 30, startX: 710, endX: 790, speed: 2 }
    ],
    teleporters: [],
    iceBlocks: [
        { x: 600, y: 460, width: 100, height: 20 }
    ],
    lava: []
});