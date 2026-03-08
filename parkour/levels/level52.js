window.loadLevelData({
    playerStart: { x: 50, y: 550 },
    platforms: [
        { x: 0, y: 600, width: 200, height: 100 },
        { x: 280, y: 520, width: 100, height: 20 },
        { x: 480, y: 480, width: 100, height: 20 },
        { x: 680, y: 440, width: 100, height: 20 },
        { x: 880, y: 480, width: 100, height: 20 },
        { x: 1080, y: 560, width: 120, height: 20 }
    ],
    spikes: [
        { x: 310, y: 490, width: 30, height: 30 },
        { x: 510, y: 450, width: 30, height: 30 },
        { x: 710, y: 410, width: 30, height: 30 }
    ],
    coins: [
        { x: 330, y: 470 },
        { x: 530, y: 430 },
        { x: 730, y: 390 },
        { x: 930, y: 430 },
        { x: 1130, y: 510 }
    ],
    goal: { x: 1130, y: 500, width: 40, height: 60 },
    movingPlatforms: [],
    enemies: [
        { x: 290, y: 550, width: 30, height: 30, startX: 290, endX: 370, speed: 2 }
    ],
    teleporters: [
        { x: 580, y: 380, width: 40, height: 60, targetX: 780, targetY: 420 }
    ],
    iceBlocks: [],
    lava: []
});