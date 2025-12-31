/* data/servers.js */
const SERVER_DATA = {
    // Selectable Map Sizes
    mapSizes: [100, 200, 250, 400],

    // Tournament Square Factors (Index = Level)
    // Level 0 = 1.0 (100%), Level 1 = 2.1 (210%), Level 20 = 4.0 (400%)
    tsFactors: [
        1.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 
        3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0
    ],

    // Artifacts
    artifacts: [
        { name: "None", value: 1.0 },
        { name: "Titan Boots (3x)", value: 3.0 },
        { name: "Large Boots (2x)", value: 2.0 },
        { name: "Small Boots (1.5x)", value: 1.5 },
        { name: "Slow (0.67x)", value: 0.67 },
        { name: "Slower (0.5x)", value: 0.5 },
        { name: "Slowest (0.33x)", value: 0.33 }
    ],

    // Unit Data
    units: {
        "Roman": [
            { name: "Legionnaire", speed: 6 }, { name: "Praetorian", speed: 5 }, { name: "Imperian", speed: 7 },
            { name: "Equites Legati", speed: 16 }, { name: "Equites Imperatoris", speed: 14 }, { name: "Equites Caesaris", speed: 10 },
            { name: "Battering ram", speed: 4 }, { name: "Fire Catapult", speed: 3 }, { name: "Senator", speed: 4 }, { name: "Settler", speed: 5 }
        ],
        "Teutonic": [
            { name: "Maceman", speed: 7 }, { name: "Spearman", speed: 7 }, { name: "Axeman", speed: 6 }, { name: "Scout", speed: 9 },
            { name: "Paladin", speed: 10 }, { name: "Teutonic Knight", speed: 9 },
            { name: "Teutonic Ram", speed: 4 }, { name: "Teutonic Catapult", speed: 3 }, { name: "Chief", speed: 4 }, { name: "Settler", speed: 5 }
        ],
        "Gauls": [
            { name: "Phalanx", speed: 7 }, { name: "Swordsman", speed: 6 }, { name: "Pathfinder", speed: 17 },
            { name: "Theutates Thunder", speed: 19 }, { name: "Druidrider", speed: 16 }, { name: "Haeduan", speed: 13 },
            { name: "Gauls Ram", speed: 4 }, { name: "Trebuchet", speed: 3 }, { name: "Chieftain", speed: 5 }, { name: "Settler", speed: 5 }
        ]
    }
};