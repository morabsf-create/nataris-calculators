/* calculators/attack-identifier/app.js */

window.onload = function() {
    initTool();
};

function initTool() {
    if(typeof SERVER_DATA === 'undefined') {
        console.error("Data not loaded");
        return;
    }

    // Populate Map Sizes
    const mapSel = document.getElementById('mapSize');
    mapSel.innerHTML = '';
    SERVER_DATA.mapSizes.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.innerText = `${s}x${s}`;
        if(s === 100) opt.selected = true; 
        mapSel.appendChild(opt);
    });

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
}

function parseTimeStr(str) {
    // Expected formats: HH:MM:SS or HH:MM or just SS (unlikely but safe)
    if(!str) return 0;
    const parts = str.split(':').map(Number);
    let seconds = 0;
    
    if (parts.length === 3) { // H:M:S
        seconds = (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    } else if (parts.length === 2) { // H:M (usually) or M:S? 
        // Logic: If user enters 1:00 in buffer, usually means 1 hour.
        // Standard convention for inputs > 2 digits usually implies H:M
        seconds = (parts[0] * 3600) + (parts[1] * 60);
    } else if (parts.length === 1) {
        seconds = parts[0];
    }
    return seconds;
}

function analyze() {
    const x1 = parseInt(document.getElementById('x1').value);
    const y1 = parseInt(document.getElementById('y1').value);
    const x2 = parseInt(document.getElementById('x2').value);
    const y2 = parseInt(document.getElementById('y2').value);
    
    // Validate required inputs
    if(isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
        return; 
    }

    const timeStr = document.getElementById('timeToLand').value;
    if(!timeStr) return;
    
    const bufferStr = document.getElementById('buffer').value || "0:00";

    const durationSec = parseTimeStr(timeStr);
    const bufferSec = parseTimeStr(bufferStr);

    // Range: 
    // The attack could have been launched "Now" (travelTime = durationSec)
    // OR "Buffer ago" (travelTime = durationSec + bufferSec)
    const minTime = durationSec;
    const maxTime = durationSec + bufferSec;

    // --- Distance Calc ---
    const radius = parseInt(document.getElementById('mapSize').value);
    const mapWidth = (radius * 2) + 1;
    const getAxisDist = (a, b) => {
        const rawDiff = Math.abs(a - b);
        const wrapDiff = mapWidth - rawDiff;
        return Math.min(rawDiff, wrapDiff);
    };
    const dX = getAxisDist(x1, x2);
    const dY = getAxisDist(y1, y2);
    const dist = Math.sqrt((dX * dX) + (dY * dY));

    // --- Check Units ---
    const serverSpeed = parseFloat(document.getElementById('serverSpeed').value);
    const artifact = parseFloat(document.getElementById('artifactSelect').value) || 1.0;
    const tribe = document.getElementById('tribeSelect').value;
    const units = SERVER_DATA.units[tribe] || [];

    const matchesByTS = {}; // Key: TS Level, Value: Array of unit names

    // Loop TS Levels 0 to 20
    for(let ts = 0; ts <= 20; ts++) {
        const tsFactor = ts === 0 ? 1.0 : (SERVER_DATA.tsFactors[ts] || 1.0);
        const tsThreshold = 20;

        units.forEach(u => {
            const baseSpeed = u.speed;
            const effectiveSpeed = baseSpeed * serverSpeed * artifact;
            let timeHours = 0;

            if (ts > 0 && dist > tsThreshold) {
                const t1 = tsThreshold / effectiveSpeed;
                const remainingDist = dist - tsThreshold;
                const t2 = remainingDist / (effectiveSpeed * tsFactor);
                timeHours = t1 + t2;
            } else {
                timeHours = dist / effectiveSpeed;
            }

            const totalSecs = Math.round(timeHours * 3600);

            // Check if this calculated time fits in our window
            // Allow small margin of error (e.g. +/- 1 second) due to rounding
            if (totalSecs >= (minTime - 1) && totalSecs <= (maxTime + 1)) {
                if(!matchesByTS[ts]) matchesByTS[ts] = [];
                matchesByTS[ts].push(u.name);
            }
        });
    }

    renderResults(matchesByTS, dist);
}

function renderResults(matches, dist) {
    const box = document.getElementById('results-area');
    const list = document.getElementById('matches-list');
    const msg = document.getElementById('status-msg');
    
    list.innerHTML = '';
    
    const levels = Object.keys(matches).sort((a,b) => a - b);
    
    if(levels.length === 0) {
        box.style.display = 'none';
        msg.style.display = 'block';
        msg.innerText = `Distance: ${dist.toFixed(1)}. No matching units found in that time window.`;
        return;
    }

    box.style.display = 'block';
    msg.style.display = 'none';

    levels.forEach(lvl => {
        const row = document.createElement('div');
        row.className = 'match-row';
        
        const tsLabel = document.createElement('div');
        tsLabel.className = 'ts-badge';
        tsLabel.innerText = lvl == 0 ? 'No TS' : `TS Lvl ${lvl}`;
        
        const unitDiv = document.createElement('div');
        unitDiv.className = 'unit-list';
        
        matches[lvl].forEach(uName => {
            const span = document.createElement('span');
            span.className = 'unit-tag';
            span.innerText = uName;
            
            const lower = uName.toLowerCase();
            if(lower.includes('catapult') || lower.includes('trebuchet')) {
                span.classList.add('danger-cata');
            } else if(lower.includes('ram')) {
                span.classList.add('danger-ram');
            }
            
            unitDiv.appendChild(span);
        });

        row.appendChild(tsLabel);
        row.appendChild(unitDiv);
        list.appendChild(row);
    });
}