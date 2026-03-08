window.loadLevelData({
    playerStart: { x: 50, y: 550 },
    platforms: [
        { x: 0, y: 600, width: 200, height: 100 },
        { x: 280, y: 510, width: 100, height: 20 },
        { x: 580, y: 480, width: 100, height: 20 },
        { x: 880, y: 480, width: 100, height: 20 },
        { x: 1080, y: 550, width: 120, height: 20 }
    ],
    spikes: [
        { x: 310, y: 480, width: 30, height: 30 },
        { x: 610, y: 450, width: 30, height: 30 }
    ],
    coins: [
        { x: 330, y: 460 },
        { x: 630, y: 430 },
        { x: 930, y: 430 },
        { x: 1130, y: 500 }
    ],
    goal: { x: 1130, y: 490, width: 40, height: 60 },
    movingPlatforms: [
        { x: 380, y: 480, width: 100, height: 20, startX: 380, endX: 500, speed: 2.5 }
    ],
    enemies: [
        { x: 590, y: 510, width: 30, height: 30, startX: 590, endX: 670, speed: 2 }
    ],
    teleporters: [],
    iceBlocks: [],
    lava: []
});