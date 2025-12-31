/* calculators/time-calculator/app.js */

window.onload = function() {
    initCalculator();
};

function initCalculator() {
    if(typeof SERVER_DATA === 'undefined') {
        console.error("Data not loaded");
        return;
    }

    // 1. Populate Map Sizes (Cleaned Format)
    const mapSel = document.getElementById('mapSize');
    mapSel.innerHTML = '';
    SERVER_DATA.mapSizes.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.innerText = `${s}x${s}`; // Removed (R100) etc.
        if(s === 100) opt.selected = true; 
        mapSel.appendChild(opt);
    });

    // 2. Populate Tournament Square (Dropdown 0-20)
    const tsSel = document.getElementById('tsLevel');
    tsSel.innerHTML = '';
    for(let i=0; i<=20; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.innerText = i === 0 ? "Level 0 (None)" : `Level ${i}`;
        tsSel.appendChild(opt);
    }

    // Populate Artifacts
    const artSel = document.getElementById('artifactSelect');
    artSel.innerHTML = '';
    SERVER_DATA.artifacts.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a.value;
        opt.innerText = a.name;
        artSel.appendChild(opt);
    });

    // Populate Tribes
    const tribeSel = document.getElementById('tribeSelect');
    tribeSel.innerHTML = '';
    Object.keys(SERVER_DATA.units).forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.innerText = t;
        tribeSel.appendChild(opt);
    });

    // 3. Initialize Departure Time with Current Time
    setNowAsDeparture();

    updateUnits();
}

function setNowAsDeparture() {
    const now = new Date();
    // Adjust to local timezone for datetime-local input
    const localIso = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    document.getElementById('departureTime').value = localIso;
}

function updateUnits() {
    const tribe = document.getElementById('tribeSelect').value;
    const unitSel = document.getElementById('unitSelect');
    
    unitSel.innerHTML = '';
    
    if(SERVER_DATA.units[tribe]) {
        SERVER_DATA.units[tribe].forEach(u => {
            const opt = document.createElement('option');
            opt.value = u.speed;
            opt.innerText = `${u.name} (${u.speed})`;
            unitSel.appendChild(opt);
        });
    }
    calculate();
}

function calculate() {
    // Inputs
    const x1 = parseInt(document.getElementById('x1').value) || 0;
    const y1 = parseInt(document.getElementById('y1').value) || 0;
    const x2 = parseInt(document.getElementById('x2').value) || 0;
    const y2 = parseInt(document.getElementById('y2').value) || 0;

    const serverSpeed = parseFloat(document.getElementById('serverSpeed').value);
    const radius = parseInt(document.getElementById('mapSize').value); 
    const baseUnitSpeed = parseFloat(document.getElementById('unitSelect').value) || 0;
    const artifact = parseFloat(document.getElementById('artifactSelect').value) || 1.0;
    let tsLevel = parseInt(document.getElementById('tsLevel').value) || 0;
    
    // --- DISTANCE CALCULATION ---
    const mapWidth = (radius * 2) + 1;

    const getAxisDist = (a, b) => {
        const rawDiff = Math.abs(a - b);
        const wrapDiff = mapWidth - rawDiff;
        return Math.min(rawDiff, wrapDiff);
    };

    const dX = getAxisDist(x1, x2);
    const dY = getAxisDist(y1, y2);
    const dist = Math.sqrt((dX * dX) + (dY * dY));

    // 4. Distance 1 decimal
    document.getElementById('res-dist').innerText = dist.toFixed(1);

    // --- TIME CALCULATION ---
    if(baseUnitSpeed <= 0) return;

    const effectiveSpeed = baseUnitSpeed * serverSpeed * artifact;
    
    let timeHours = 0;
    const tsThreshold = 20;

    if (tsLevel > 0 && dist > tsThreshold) {
        const t1 = tsThreshold / effectiveSpeed;
        if(tsLevel > 20) tsLevel = 20;
        const tsFactor = SERVER_DATA.tsFactors[tsLevel] || 1.0; 
        const remainingDist = dist - tsThreshold;
        const t2 = remainingDist / (effectiveSpeed * tsFactor);
        timeHours = t1 + t2;
    } else {
        timeHours = dist / effectiveSpeed;
    }

    // Render Results
    const totalSecs = Math.round(timeHours * 3600);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    
    const pad = (n) => n < 10 ? '0'+n : n;
    document.getElementById('res-time').innerText = `${h}:${pad(m)}:${pad(s)}`;

    // 5. Calculate Arrival based on Departure Input
    const depVal = document.getElementById('departureTime').value;
    if(depVal) {
        const departureDate = new Date(depVal);
        const arrivalDate = new Date(departureDate.getTime() + totalSecs * 1000);
        
        // Format: European (en-GB is usually dd/mm/yyyy)
        document.getElementById('res-arrival').innerText = arrivalDate.toLocaleString('en-GB');
    } else {
        document.getElementById('res-arrival').innerText = "-";
    }
}