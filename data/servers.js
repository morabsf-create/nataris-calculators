/* data/servers.js */
const SERVER_DATA = {
    [cite_start]// Selectable Map Sizes [cite: 3]
    mapSizes: [100, 200, 250, 400],

    // Tournament Square Factors (Index = Level 0 to 20)
    [cite_start]// Level 0 = 1.0, Level 1 = 2.1 (210%), Level 20 = 4.0 (400%) [cite: 4]
    tsFactors: [
        1.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 
        3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0
    ],

    [cite_start]// Artifacts from DB_Speed.csv [cite: 4]
    artifacts: [
        { name: "None", value: 1.0 },
        { name: "Titan Boots (3x)", value: 3.0 },
        { name: "Large Boots (2x)", value: 2.0 },
        { name: "Small Boots (1.5x)", value: 1.5 },
        { name: "Slow (0.67x)", value: 0.67 },
        { name: "Slower (0.5x)", value: 0.5 },
        { name: "Slowest (0.33x)", value: 0.33 }
    ],

    [cite_start]// Unit Data from DB_troops.csv [cite: 3]
    [cite_start]// Buildings mapped from DB_troops_allocation.csv [cite: 1]
    units: {
        "Roman": [
            { name: "Legionnaire", building: "Barracks", speed: 6, attack: 40, def_inf: 35, def_cav: 50, cap: 50, cost: {w: 120, c: 100, i: 150, cr: 30}, time: 1600 },
            { name: "Praetorian", building: "Barracks", speed: 5, attack: 30, def_inf: 65, def_cav: 35, cap: 20, cost: {w: 100, c: 130, i: 160, cr: 70}, time: 1760 },
            { name: "Imperian", building: "Barracks", speed: 7, attack: 70, def_inf: 40, def_cav: 25, cap: 50, cost: {w: 150, c: 160, i: 210, cr: 80}, time: 1920 },
            { name: "Equites Legati", building: "Stable", speed: 16, attack: 0, def_inf: 20, def_cav: 10, cap: 0, cost: {w: 140, c: 160, i: 20, cr: 40}, time: 1360 },
            { name: "Equites Imperatoris", building: "Stable", speed: 14, attack: 120, def_inf: 65, def_cav: 50, cap: 100, cost: {w: 550, c: 440, i: 320, cr: 100}, time: 2640 },
            { name: "Equites Caesaris", building: "Stable", speed: 10, attack: 180, def_inf: 80, def_cav: 105, cap: 70, cost: {w: 550, c: 640, i: 800, cr: 180}, time: 3520 },
            { name: "Battering ram", building: "Workshop", speed: 4, attack: 60, def_inf: 30, def_cav: 75, cap: 0, cost: {w: 900, c: 360, i: 500, cr: 70}, time: 4600 },
            { name: "Fire Catapult", building: "Workshop", speed: 3, attack: 75, def_inf: 60, def_cav: 10, cap: 0, cost: {w: 950, c: 1350, i: 600, cr: 90}, time: 9000 },
            { name: "Senator", building: "Residence", speed: 4, attack: 50, def_inf: 40, def_cav: 30, cap: 0, cost: {w: 30750, c: 27200, i: 45000, cr: 37500}, time: 4300 },
            { name: "Settler", building: "Residence", speed: 5, attack: 0, def_inf: 80, def_cav: 80, cap: 3000, cost: {w: 4600, c: 4200, i: 5800, cr: 4400}, time: 26900 }
        ],
        "Teutonic": [
            { name: "Maceman", building: "Barracks", speed: 7, attack: 40, def_inf: 20, def_cav: 5, cap: 60, cost: {w: 95, c: 75, i: 40, cr: 40}, time: 720 },
            { name: "Spearman", building: "Barracks", speed: 7, attack: 10, def_inf: 35, def_cav: 60, cap: 40, cost: {w: 145, c: 70, i: 85, cr: 40}, time: 1120 },
            { name: "Axeman", building: "Barracks", speed: 6, attack: 60, def_inf: 30, def_cav: 30, cap: 50, cost: {w: 130, c: 120, i: 170, cr: 70}, time: 1200 },
            { name: "Scout", building: "Barracks", speed: 9, attack: 0, def_inf: 10, def_cav: 5, cap: 0, cost: {w: 160, c: 100, i: 50, cr: 50}, time: 1120 },
            { name: "Paladin", building: "Stable", speed: 10, attack: 55, def_inf: 100, def_cav: 40, cap: 110, cost: {w: 370, c: 270, i: 290, cr: 75}, time: 2400 },
            { name: "Teutonic Knight", building: "Stable", speed: 9, attack: 150, def_inf: 50, def_cav: 75, cap: 80, cost: {w: 450, c: 515, i: 480, cr: 80}, time: 2960 },
            { name: "Teutonic Ram", building: "Workshop", speed: 4, attack: 65, def_inf: 30, def_cav: 80, cap: 0, cost: {w: 1000, c: 300, i: 350, cr: 70}, time: 4200 },
            { name: "Teutonic Catapult", building: "Workshop", speed: 3, attack: 50, def_inf: 60, def_cav: 10, cap: 0, cost: {w: 900, c: 1200, i: 600, cr: 60}, time: 9000 },
            { name: "Chief", building: "Residence", speed: 4, attack: 40, def_inf: 60, def_cav: 40, cap: 0, cost: {w: 35500, c: 26600, i: 25000, cr: 27200}, time: 70500 },
            { name: "Settler", building: "Residence", speed: 5, attack: 10, def_inf: 80, def_cav: 80, cap: 3000, cost: {w: 5800, c: 4400, i: 4600, cr: 5200}, time: 31000 }
        ],
        "Gauls": [
            { name: "Phalanx", building: "Barracks", speed: 7, attack: 15, def_inf: 40, def_cav: 50, cap: 35, cost: {w: 100, c: 130, i: 55, cr: 30}, time: 1040 },
            { name: "Swordsman", building: "Barracks", speed: 6, attack: 65, def_inf: 35, def_cav: 20, cap: 45, cost: {w: 140, c: 150, i: 185, cr: 60}, time: 1440 },
            { name: "Pathfinder", building: "Stable", speed: 17, attack: 0, def_inf: 20, def_cav: 10, cap: 0, cost: {w: 170, c: 150, i: 20, cr: 40}, time: 1360 },
            { name: "Theutates Thunder", building: "Stable", speed: 19, attack: 100, def_inf: 25, def_cav: 40, cap: 75, cost: {w: 350, c: 450, i: 230, cr: 60}, time: 2480 },
            { name: "Druidrider", building: "Stable", speed: 16, attack: 45, def_inf: 115, def_cav: 55, cap: 35, cost: {w: 360, c: 330, i: 280, cr: 120}, time: 2560 },
            { name: "Haeduan", building: "Stable", speed: 13, attack: 140, def_inf: 60, def_cav: 165, cap: 65, cost: {w: 500, c: 620, i: 675, cr: 170}, time: 3120 },
            { name: "Gauls Ram", building: "Workshop", speed: 4, attack: 50, def_inf: 30, def_cav: 105, cap: 0, cost: {w: 950, c: 555, i: 330, cr: 75}, time: 5000 },
            { name: "Trebuchet", building: "Workshop", speed: 3, attack: 70, def_inf: 45, def_cav: 10, cap: 0, cost: {w: 960, c: 1450, i: 630, cr: 90}, time: 9000 },
            { name: "Chieftain", building: "Residence", speed: 5, attack: 40, def_inf: 50, def_cav: 50, cap: 0, cost: {w: 30750, c: 45400, i: 31000, cr: 37500}, time: 4300 },
            { name: "Settler", building: "Residence", speed: 5, attack: 0, def_inf: 80, def_cav: 80, cap: 3000, cost: {w: 4400, c: 5600, i: 4200, cr: 3900}, time: 22700 }
        ]
    }
};