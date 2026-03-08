window.loadLevelData({
    playerStart: { x: 50, y: 550 },
    platforms: [
        { x: 0, y: 600, width: 200, height: 100 },
        { x: 280, y: 460, width: 100, height: 20 },
        { x: 580, y: 460, width: 100, height: 20 },
        { x: 880, y: 460, width: 100, height: 20 },
        { x: 1080, y: 550, width: 120, height: 20 }
    ],
    spikes: [],
    coins: [
        { x: 330, y: 410 },
        { x: 630, y: 410 },
        { x: 930, y: 410 },
        { x: 1130, y: 500 }
    ],
    goal: { x: 1130, y: 490, width: 40, height: 60 },
    movingPlatforms: [
        { x: 400, y: 360, width: 100, height: 20, startX: 400, endY: 460, speed: 2.5 },
        { x: 700, y: 360, width: 100, height: 20, startX: 700, endY: 460, speed: 2.5 }
    ],
    enemies: [],
    teleporters: [],
    iceBlocks: [],
    lava: []
});