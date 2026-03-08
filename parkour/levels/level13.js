window.loadLevelData({
    playerStart: { x: 50, y: 550 },
    platforms: [
        { x: 0, y: 600, width: 200, height: 100 },
        { x: 300, y: 500, width: 100, height: 20 },
        { x: 600, y: 460, width: 100, height: 20 },
        { x: 900, y: 460, width: 100, height: 20 },
        { x: 1100, y: 550, width: 100, height: 20 }
    ],
    spikes: [],
    coins: [
        { x: 350, y: 450 },
        { x: 650, y: 410 },
        { x: 950, y: 410 },
        { x: 1140, y: 500 }
    ],
    goal: { x: 1140, y: 490, width: 40, height: 60 },
    movingPlatforms: [
        { x: 400, y: 460, width: 100, height: 20, startX: 400, endX: 520, speed: 2.5 },
        { x: 700, y: 420, width: 100, height: 20, startX: 700, endX: 820, speed: 2.5 }
    ],
    enemies: [],
    teleporters: [],
    iceBlocks: [],
    lava: []
});