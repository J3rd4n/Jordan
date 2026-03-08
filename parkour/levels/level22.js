window.loadLevelData({
    playerStart: { x: 50, y: 550 },
    platforms: [
        { x: 0, y: 600, width: 200, height: 100 },
        { x: 230, y: 520, width: 120, height: 20 },
        { x: 400, y: 520, width: 120, height: 20 },
        { x: 570, y: 520, width: 120, height: 20 },
        { x: 740, y: 520, width: 120, height: 20 },
        { x: 910, y: 520, width: 120, height: 20 },
        { x: 1080, y: 560, width: 120, height: 20 }
    ],
    spikes: [],
    coins: [
        { x: 270, y: 470 },
        { x: 440, y: 470 },
        { x: 610, y: 470 },
        { x: 780, y: 470 },
        { x: 950, y: 470 },
        { x: 1120, y: 510 }
    ],
    goal: { x: 1120, y: 500, width: 40, height: 60 },
    movingPlatforms: [],
    enemies: [
        { x: 240, y: 540, width: 30, height: 30, startX: 240, endX: 340, speed: 2 },
        { x: 580, y: 540, width: 30, height: 30, startX: 580, endX: 680, speed: 2 },
        { x: 920, y: 540, width: 30, height: 30, startX: 920, endX: 1020, speed: 2 }
    ],
    teleporters: [],
    iceBlocks: [],
    lava: []
});