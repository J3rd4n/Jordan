window.loadLevelData({
    playerStart: { x: 50, y: 550 },
    platforms: [
        { x: 0, y: 600, width: 200, height: 100 },
        { x: 220, y: 500, width: 100, height: 20 },
        { x: 370, y: 450, width: 100, height: 20 },
        { x: 520, y: 400, width: 100, height: 20 },
        { x: 670, y: 350, width: 100, height: 20 },
        { x: 820, y: 400, width: 100, height: 20 },
        { x: 970, y: 450, width: 100, height: 20 },
        { x: 1120, y: 500, width: 80, height: 20 }
    ],
    spikes: [],
    coins: [
        { x: 250, y: 450 },
        { x: 400, y: 400 },
        { x: 550, y: 350 },
        { x: 700, y: 300 },
        { x: 850, y: 350 },
        { x: 1000, y: 400 }
    ],
    goal: { x: 1140, y: 440, width: 40, height: 60 },
    movingPlatforms: [],
    enemies: [
        { x: 230, y: 520, width: 30, height: 30, startX: 230, endX: 310, speed: 2 },
        { x: 530, y: 420, width: 30, height: 30, startX: 530, endX: 610, speed: 2 },
        { x: 830, y: 420, width: 30, height: 30, startX: 830, endX: 910, speed: 2 }
    ],
    teleporters: [],
    iceBlocks: [],
    lava: []
});