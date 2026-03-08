window.loadLevelData({
    playerStart: { x: 50, y: 550 },
    platforms: [
        { x: 0, y: 600, width: 200, height: 100 },
        { x: 300, y: 550, width: 100, height: 20 },
        { x: 600, y: 550, width: 100, height: 20 },
        { x: 900, y: 550, width: 100, height: 20 },
        { x: 1100, y: 550, width: 100, height: 20 }
    ],
    spikes: [],
    coins: [
        { x: 350, y: 500 },
        { x: 650, y: 500 },
        { x: 950, y: 500 },
        { x: 1140, y: 500 }
    ],
    goal: { x: 1140, y: 490, width: 40, height: 60 },
    movingPlatforms: [
        { x: 420, y: 450, width: 100, height: 20, startX: 420, endY: 550, speed: 2 },
        { x: 720, y: 450, width: 100, height: 20, startX: 720, endY: 550, speed: 2 }
    ],
    enemies: [],
    teleporters: [],
    iceBlocks: [],
    lava: []
});