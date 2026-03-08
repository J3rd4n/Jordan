window.loadLevelData({
    playerStart: { x: 50, y: 550 },
    platforms: [
        { x: 0, y: 600, width: 200, height: 100 },
        { x: 320, y: 520, width: 100, height: 20 },
        { x: 620, y: 520, width: 100, height: 20 },
        { x: 920, y: 520, width: 100, height: 20 },
        { x: 1080, y: 550, width: 120, height: 20 }
    ],
    spikes: [],
    coins: [
        { x: 370, y: 470 },
        { x: 670, y: 470 },
        { x: 970, y: 470 },
        { x: 1130, y: 500 }
    ],
    goal: { x: 1130, y: 490, width: 40, height: 60 },
    movingPlatforms: [
        { x: 440, y: 420, width: 100, height: 20, startX: 440, endY: 520, speed: 2.5 },
        { x: 740, y: 420, width: 100, height: 20, startX: 740, endY: 520, speed: 2.5 }
    ],
    enemies: [],
    teleporters: [],
    iceBlocks: [],
    lava: []
});