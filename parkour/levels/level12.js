window.loadLevelData({
    playerStart: { x: 50, y: 550 },
    platforms: [
        { x: 0, y: 600, width: 200, height: 100 },
        { x: 280, y: 520, width: 100, height: 20 },
        { x: 550, y: 480, width: 100, height: 20 },
        { x: 820, y: 480, width: 100, height: 20 },
        { x: 1080, y: 560, width: 120, height: 20 }
    ],
    spikes: [],
    coins: [
        { x: 330, y: 470 },
        { x: 600, y: 430 },
        { x: 870, y: 430 },
        { x: 1130, y: 510 }
    ],
    goal: { x: 1130, y: 500, width: 40, height: 60 },
    movingPlatforms: [
        { x: 380, y: 480, width: 100, height: 20, startX: 380, endX: 480, speed: 2 },
        { x: 650, y: 440, width: 100, height: 20, startX: 650, endX: 750, speed: 2 }
    ],
    enemies: [],
    teleporters: [],
    iceBlocks: [],
    lava: []
});