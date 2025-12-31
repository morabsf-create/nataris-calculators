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
    if(!str) return null; 
    const parts = str.split(':').map(Number);
    let seconds = 0;
    
    if (parts.length === 3) { 
        seconds = (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    } else if (parts.length === 2) { 
        seconds = (parts[0] * 3600) + (parts[1] * 60);
    } else if (parts.length === 1) {
        seconds = parts[0]; 
    } else {
        return null;
    }
    return isNaN(seconds) ? null : seconds;
}

function formatSecs(totalSecs) {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    const pad = (n) => n < 10 ? '0'+n : n;
    return `${h}:${pad(m)}:${pad(s)}`;
}

function analyze() {
    const x1 = parseInt(document.getElementById('x1').value);
    const y1 = parseInt(document.getElementById('y1').value);
    const x2 = parseInt(document.getElementById('x2').value);
    const y2 = parseInt(document.getElementById('y2').value);
    
    if(isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) return; 

    const timeStr = document.getElementById('timeToLand').value;
    const bufferStr = document.getElementById('buffer').value;

    if(!timeStr || !bufferStr) {
        document.getElementById('status-msg').innerText = "Please enter both Time to Land and Buffer.";
        document.getElementById('status-msg').style.color = "red";
        document.getElementById('results-area').style.display = 'none';
        return;
    }

    const durationSec = parseTimeStr(timeStr);
    const bufferSec = parseTimeStr(bufferStr);

    if(durationSec === null || bufferSec === null) {
        document.getElementById('status-msg').innerText = "Invalid time format. Use HH:MM:SS";
        return;
    }

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

    // --- Speed Calc ---
    // Speed = Distance / Time (in hours)
    // Min Speed required comes from MAX time.
    // Max Speed required comes from MIN time.
    const minSpeedReq = dist / (maxTime / 3600);
    const maxSpeedReq = dist / (minTime / 3600);

    // Update Detail Box
    document.getElementById('disp-dist').innerText = dist.toFixed(1);
    document.getElementById('disp-speed').innerText = `${minSpeedReq.toFixed(1)} - ${maxSpeedReq.toFixed(1)} f/h`;
    document.getElementById('disp-time').innerText = `${formatSecs(minTime)} - ${formatSecs(maxTime)}`;

    // --- Check Units ---
    const serverSpeed = parseFloat(document.getElementById('serverSpeed').value);
    const artifact = parseFloat(document.getElementById('artifactSelect').value) || 1.0;
    const tribe = document.getElementById('tribeSelect').value;
    const units = SERVER_DATA.units[tribe] || [];
    const matchesByTS = {}; 
    const ignoredUnits = ["Settler", "Scout", "Pathfinder", "Equites Legati"];

    let matchCount = 0;

    for(let ts = 0; ts <= 20; ts++) {
        const tsFactor = ts === 0 ? 1.0 : (SERVER_DATA.tsFactors[ts] || 1.0);
        const tsThreshold = 20;

        units.forEach(u => {
            if(ignoredUnits.includes(u.name)) return;

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

            // Time Window Check
            if (totalSecs >= (minTime - 1) && totalSecs <= (maxTime + 1)) {
                if(!matchesByTS[ts]) matchesByTS[ts] = [];
                matchesByTS[ts].push(u.name);
                matchCount++;
            }
        });
    }

    renderResults(matchesByTS, matchCount);
}

function renderResults(matches, count) {
    const area = document.getElementById('results-area');
    const list = document.getElementById('matches-list');
    const msg = document.getElementById('status-msg');
    
    list.innerHTML = '';
    msg.style.color = "#7f8c8d";
    area.style.display = 'block';
    msg.style.display = 'none';

    if(count === 0) {
        // Show box but indicate no matches
        list.innerHTML = '<div style="padding:15px; text-align:center; color:#e74c3c;">No units match this speed profile.</div>';
        return;
    }

    const levels = Object.keys(matches).sort((a,b) => a - b);

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
            } 
            else if(
                lower.includes('ram') || 
                lower.includes('senator') || 
                lower.includes('chief') || 
                lower.includes('chieftain')
            ) {
                span.classList.add('danger-ram');
            }
            
            unitDiv.appendChild(span);
        });

        row.appendChild(tsLabel);
        row.appendChild(unitDiv);
        list.appendChild(row);
    });
}