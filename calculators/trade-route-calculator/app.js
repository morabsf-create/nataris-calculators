/* calculators/trade-route-calculator/app.js */

const PARTY_COSTS = {
    small: { wood: 6400, clay: 6650, iron: 5940, crop: 1340 },
    big: { wood: 29700, clay: 33250, iron: 32000, crop: 6700 }
};

window.onload = function() {
    calculate();
};

function calculate() {
    // 1. Get Production Inputs
    const prod = {
        wood: parseInt(document.getElementById('prodWood').value) || 0,
        clay: parseInt(document.getElementById('prodClay').value) || 0,
        iron: parseInt(document.getElementById('prodIron').value) || 0,
        crop: parseInt(document.getElementById('prodCrop').value) || 0
    };

    // 2. Get Settings
    const type = document.getElementById('partyType').value;
    const dailyCount = parseFloat(document.getElementById('partiesPerDay').value) || 0;
    const intervalMinutes = parseInt(document.getElementById('routeInterval').value);
    const doRounding = document.getElementById('roundRes').checked;

    if (dailyCount <= 0) {
        document.getElementById('results-area').style.display = 'none';
        return;
    }

    // 3. Calculate Consumption
    // Cost per day = Single Cost * Parties per Day
    // Cost per hour = Cost per day / 24
    const costs = PARTY_COSTS[type];
    const consumptionPerHour = {
        wood: (costs.wood * dailyCount) / 24,
        clay: (costs.clay * dailyCount) / 24,
        iron: (costs.iron * dailyCount) / 24,
        crop: (costs.crop * dailyCount) / 24
    };

    // 4. Calculate Shipment
    // Production per hour - Consumption per hour = Excess per hour
    // Shipment per interval = Excess per hour * (Interval Minutes / 60)
    
    const intervalFactor = intervalMinutes / 60;
    let warning = false;

    const calculateResource = (prodAmount, consAmount) => {
        const excessPerHour = prodAmount - consAmount;
        if (excessPerHour < 0) warning = true;
        
        let sendAmount = excessPerHour * intervalFactor;
        
        if (sendAmount < 0) sendAmount = 0;

        if (doRounding) {
            // Round down to nearest 100
            sendAmount = Math.floor(sendAmount / 100) * 100;
        } else {
            sendAmount = Math.floor(sendAmount);
        }
        return sendAmount;
    };

    const result = {
        wood: calculateResource(prod.wood, consumptionPerHour.wood),
        clay: calculateResource(prod.clay, consumptionPerHour.clay),
        iron: calculateResource(prod.iron, consumptionPerHour.iron),
        crop: calculateResource(prod.crop, consumptionPerHour.crop)
    };

    // 5. Render
    document.getElementById('results-area').style.display = 'block';
    
    document.getElementById('res-wood').innerText = result.wood.toLocaleString();
    document.getElementById('res-clay').innerText = result.clay.toLocaleString();
    document.getElementById('res-iron').innerText = result.iron.toLocaleString();
    document.getElementById('res-crop').innerText = result.crop.toLocaleString();
    
    const total = result.wood + result.clay + result.iron + result.crop;
    document.getElementById('res-total').innerText = total.toLocaleString();

    const warnBox = document.getElementById('warning-msg');
    if (warning) {
        warnBox.style.display = 'block';
        warnBox.innerHTML = "⚠️ Warning: Production is too low to sustain this party frequency! <br> You will run out of resources.";
    } else {
        warnBox.style.display = 'none';
    }
}