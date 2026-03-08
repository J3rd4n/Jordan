window.loadLevelData({
    playerStart: { x: 50, y: 550 },
    platforms: [
        { x: 0, y: 600, width: 200, height: 100 },
        { x: 280, y: 500, width: 100, height: 20 },
        { x: 580, y: 500, width: 100, height: 20 },
        { x: 880, y: 500, width: 100, height: 20 },
        { x: 1100, y: 550, width: 100, height: 20 }
    ],
    spikes: [],
    coins: [
        { x: 330, y: 450 },
        { x: 630, y: 450 },
        { x: 930, y: 450 },
        { x: 1140, y: 500 }
    ],
    goal: { x: 1140, y: 490, width: 40, height: 60 },
    movingPlatforms: [
        { x: 400, y: 400, width: 100, height: 20, startX: 400, endY: 500, speed: 3 },
        { x: 700, y: 400, width: 100, height: 20, startX: 700, endY: 500, speed: 3 }
    ],
    enemies: [],
    teleporters: [],
    iceBlocks: [],
    lava: []
});