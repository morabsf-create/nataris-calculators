/* calculators/time-calculator/app.js */

// Initialize dropdowns on load
window.onload = function() {
    // Populate Map Sizes
    const mapSel = document.getElementById('mapSize');
    SERVER_DATA.mapSizes.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.innerText = `${s}x${s}`;
        if(s === 400) opt.selected = true; // Default
        mapSel.appendChild(opt);
    });

    // Populate Artifacts
    const artSel = document.getElementById('artifactSelect');
    SERVER_DATA.artifacts.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a.value;
        opt.innerText = a.name;
        artSel.appendChild(opt);
    });

    // Populate Tribes
    const tribeSel = document.getElementById('tribeSelect');
    Object.keys(SERVER_DATA.units).forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.innerText = t;
        tribeSel.appendChild(opt);
    });

    updateUnits(); // Trigger unit population
};

function updateUnits() {
    const tribe = document.getElementById('tribeSelect').value;
    const unitSel = document.getElementById('unitSelect');
    unitSel.innerHTML = '';

    SERVER_DATA.units[tribe].forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.speed; // Store speed in value for easy access
        opt.innerText = `${u.name} (${u.speed})`;
        unitSel.appendChild(opt);
    });
    calculate();
}

function calculate() {
    // Inputs
    const x1 = parseInt(document.getElementById('x1').value) || 0;
    const y1 = parseInt(document.getElementById('y1').value) || 0;
    const x2 = parseInt(document.getElementById('x2').value) || 0;
    const y2 = parseInt(document.getElementById('y2').value) || 0;
    
    const serverSpeed = parseFloat(document.getElementById('serverSpeed').value);
    const mapSize = parseInt(document.getElementById('mapSize').value);
    const baseUnitSpeed = parseFloat(document.getElementById('unitSelect').value) || 0;
    const artifact = parseFloat(document.getElementById('artifactSelect').value) || 1.0;
    let tsLevel = parseInt(document.getElementById('tsLevel').value) || 0;
    if(tsLevel > 20) tsLevel = 20;

    // 1. Calculate Distance (Map Wrap)
    const getDist = (a, b) => {
        let d = Math.abs(a - b);
        if (d > mapSize / 2) d = mapSize - d;
        return d;
    };
    const dist = Math.sqrt(Math.pow(getDist(x1, x2), 2) + Math.pow(getDist(y1, y2), 2));

    // 2. Effective Speed
    const effectiveSpeed = baseUnitSpeed * serverSpeed * artifact;

    // 3. Time Calculation (Tournament Square Logic)
    let timeHours = 0;
    const tsThreshold = 20; // TS active after 20 fields

    if (tsLevel > 0 && dist > tsThreshold) {
        // First 20 fields: Normal Speed
        const t1 = tsThreshold / effectiveSpeed;
        
        // Remaining fields: Boosted Speed
        const tsFactor = SERVER_DATA.tsFactors[tsLevel] || 1.0; // e.g., 2.1 for lvl 1
        const remainingDist = dist - tsThreshold;
        const t2 = remainingDist / (effectiveSpeed * tsFactor);
        
        timeHours = t1 + t2;
    } else {
        timeHours = dist / effectiveSpeed;
    }

    // 4. Display
    document.getElementById('res-dist').innerText = dist.toFixed(2);
    document.getElementById('res-speed').innerText = effectiveSpeed.toFixed(1);

    if(baseUnitSpeed > 0) {
        const totalSecs = Math.round(timeHours * 3600);
        const h = Math.floor(totalSecs / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        const s = totalSecs % 60;
        const pad = (n) => n < 10 ? '0'+n : n;
        
        document.getElementById('res-time').innerText = `${h}:${pad(m)}:${pad(s)}`;
        
        const arr = new Date(new Date().getTime() + totalSecs * 1000);
        document.getElementById('res-arrival').innerText = arr.toLocaleTimeString();
        document.getElementById('result').style.display = 'block';
    }
}