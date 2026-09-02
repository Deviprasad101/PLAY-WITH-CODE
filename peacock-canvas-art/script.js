const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

let cw, ch, cx, cy;

function resize() {
    cw = canvas.width = window.innerWidth;
    ch = canvas.height = window.innerHeight;
    cx = cw / 2;
    cy = ch / 2 + 150; // Offset downwards since the tail fans upwards
}
window.addEventListener('resize', resize);
resize();

// --- Animation State ---
let isPlaying = false;
let progress = 0;
const animationSpeed = 0.0025; // Controls draw speed
let reqId = null;

// --- Helper Functions ---
function getLocalProgress(globalP, start, end) {
    if (globalP <= start) return 0;
    if (globalP >= end) return 1;
    let t = (globalP - start) / (end - start);
    return t * t * (3 - 2 * t); // Smoothstep easing
}

function setGlow(color, blur) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
}

// --- Generative Art Elements Array ---
const elements = [];

// 1. Fine radiating background lines
for (let i = 0; i < 70; i++) {
    let angle = -Math.PI * 0.95 + (Math.PI * 0.9 * (i / 69));
    let length = 250 + Math.random() * 150;
    elements.push({
        start: 0.0,
        end: 0.5,
        draw: (ctx, p) => {
            if (p === 0) return;
            let currentLen = length * p;
            let x = cx + Math.cos(angle) * currentLen;
            let y = cy + Math.sin(angle) * currentLen;
            
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(x, y);
            ctx.strokeStyle = `rgba(0, 150, 255, ${0.1 + 0.3 * p})`;
            ctx.lineWidth = 1;
            setGlow('#00aaff', 5);
            ctx.stroke();
            
            // Little glowing dot at the end of the line
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            setGlow('#00ffff', 10);
            ctx.fill();
        }
    });
}

// 2. Large Outer Feathers (Ocelli)
const numMainEyes = 11;
for (let i = 0; i < numMainEyes; i++) {
    let angle = -Math.PI * 0.85 + (Math.PI * 0.7 * (i / (numMainEyes - 1)));
    let r = 320; 
    let x = cx + Math.cos(angle) * r;
    let y = cy + Math.sin(angle) * r;
    
    // Feather Stem
    elements.push({
        start: 0.1 + (i * 0.02),
        end: 0.6 + (i * 0.02),
        draw: (ctx, p) => {
            if(p===0) return;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + (x - cx)*p, cy + (y - cy)*p);
            ctx.strokeStyle = 'rgba(0, 200, 255, 0.6)';
            ctx.lineWidth = 2;
            setGlow('#00ffff', 10);
            ctx.stroke();
        }
    });

    // Eye shape (Ocellus)
    elements.push({
        start: 0.4 + (i * 0.02),
        end: 0.8 + (i * 0.02),
        draw: (ctx, p) => {
            if(p===0) return;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle + Math.PI/2);
            ctx.scale(p, p);
            
            // Outer teardrop
            ctx.beginPath();
            ctx.moveTo(0, -35);
            ctx.bezierCurveTo(25, -10, 25, 25, 0, 35);
            ctx.bezierCurveTo(-25, 25, -25, -10, 0, -35);
            ctx.strokeStyle = '#0055ff';
            ctx.lineWidth = 4;
            setGlow('#00aaff', 20);
            ctx.stroke();
            
            // Inner cyan oval
            ctx.beginPath();
            ctx.ellipse(0, 5, 12, 16, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#00ffff';
            setGlow('#00ffff', 25);
            ctx.fill();
            
            // Inner dark blue/black circle
            ctx.beginPath();
            ctx.arc(0, 8, 7, 0, Math.PI * 2);
            ctx.fillStyle = '#001144';
            setGlow('transparent', 0);
            ctx.fill();
            
            ctx.restore();
        }
    });
}

// 3. Smaller Inner Feathers (Layer 2)
const numInnerEyes = 9;
for (let i = 0; i < numInnerEyes; i++) {
    let angle = -Math.PI * 0.8 + (Math.PI * 0.6 * (i / (numInnerEyes - 1)));
    let r = 200; 
    let x = cx + Math.cos(angle) * r;
    let y = cy + Math.sin(angle) * r;
    
    // Stem
    elements.push({
        start: 0.2 + (i * 0.02),
        end: 0.7 + (i * 0.02),
        draw: (ctx, p) => {
            if(p===0) return;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + (x - cx)*p, cy + (y - cy)*p);
            ctx.strokeStyle = 'rgba(0, 150, 255, 0.5)';
            ctx.lineWidth = 1.5;
            setGlow('#00aaff', 5);
            ctx.stroke();
        }
    });

    // Eye shape
    elements.push({
        start: 0.5 + (i * 0.02),
        end: 0.9 + (i * 0.02),
        draw: (ctx, p) => {
            if(p===0) return;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle + Math.PI/2);
            ctx.scale(p * 0.65, p * 0.65); // scaled down for inner layer
            
            ctx.beginPath();
            ctx.moveTo(0, -35);
            ctx.bezierCurveTo(25, -10, 25, 25, 0, 35);
            ctx.bezierCurveTo(-25, 25, -25, -10, 0, -35);
            ctx.strokeStyle = '#0088ff';
            ctx.lineWidth = 4;
            setGlow('#00ccff', 20);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.ellipse(0, 5, 12, 16, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#00ffff';
            setGlow('#00ffff', 25);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(0, 8, 7, 0, Math.PI * 2);
            ctx.fillStyle = '#001144';
            setGlow('transparent', 0);
            ctx.fill();
            
            ctx.restore();
        }
    });
}

// 4. Overlapping Elegant Arcs (Adding geometric complexity)
for (let i = 1; i <= 6; i++) {
    elements.push({
        start: 0.3,
        end: 0.9,
        draw: (ctx, p) => {
            if(p===0) return;
            ctx.beginPath();
            // Draw counterclockwise from PI to 0
            ctx.arc(cx, cy, 60 * i, Math.PI, Math.PI - (Math.PI * p), true);
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
            ctx.lineWidth = 1;
            setGlow('#00ffff', 5);
            ctx.stroke();
        }
    });
}

// 5. Delicate intersecting circles
for (let i = 0; i < 8; i++) {
    elements.push({
        start: 0.4 + i * 0.05,
        end: 0.95,
        draw: (ctx, p) => {
            if(p===0) return;
            let cx_c = cx + Math.cos(Math.PI + i * 0.45) * 180;
            let cy_c = cy + Math.sin(Math.PI + i * 0.45) * 180 - 20;
            
            ctx.beginPath();
            ctx.arc(cx_c, cy_c, 80, 0, Math.PI * 2 * p);
            ctx.strokeStyle = 'rgba(0, 200, 255, 0.1)';
            ctx.lineWidth = 1;
            setGlow('transparent', 0);
            ctx.stroke();
        }
    });
}

// 6. Peacock Body
elements.push({
    start: 0.6,
    end: 1.0,
    draw: (ctx, p) => {
        if(p===0) return;
        ctx.save();
        ctx.translate(cx, cy - 20);
        ctx.scale(p, p);
        
        // Body Glow
        ctx.beginPath();
        ctx.ellipse(0, 0, 30, 50, 0, 0, Math.PI * 2);
        let grad = ctx.createRadialGradient(0, 0, 5, 0, 0, 50);
        grad.addColorStop(0, '#00ffff');
        grad.addColorStop(1, '#0022cc');
        ctx.fillStyle = grad;
        setGlow('#0055ff', 40);
        ctx.fill();
        
        // Neck
        ctx.beginPath();
        ctx.moveTo(-10, -35);
        ctx.quadraticCurveTo(-10, -85, 0, -100);
        ctx.quadraticCurveTo(15, -85, 12, -35);
        ctx.fillStyle = '#0033dd';
        setGlow('#0055ff', 20);
        ctx.fill();
        
        // Head
        ctx.beginPath();
        ctx.arc(0, -105, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#00aaff';
        ctx.fill();
        
        // Eye
        ctx.beginPath();
        ctx.arc(4, -108, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        setGlow('transparent', 0);
        ctx.fill();
        
        // Beak (Facing right)
        ctx.beginPath();
        ctx.moveTo(12, -105);
        ctx.lineTo(24, -100);
        ctx.lineTo(10, -95);
        ctx.fillStyle = '#00ffff';
        ctx.fill();
        
        // Crest feathers (Crown)
        for(let c = 0; c < 5; c++) {
            ctx.beginPath();
            ctx.moveTo(-2, -118);
            let cx_c = -18 + c * 8;
            let cy_c = -140 + Math.abs(c - 2) * 5;
            ctx.lineTo(cx_c, cy_c);
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(cx_c, cy_c, 2.5, 0, Math.PI*2);
            ctx.fillStyle = '#00ffff';
            setGlow('#00ffff', 10);
            ctx.fill();
        }
        
        // Legs
        setGlow('transparent', 0);
        ctx.beginPath();
        ctx.moveTo(-10, 48);
        ctx.lineTo(-15, 75);
        ctx.moveTo(-15, 75);
        ctx.lineTo(-22, 80);
        ctx.moveTo(-15, 75);
        ctx.lineTo(-8, 80);
        
        ctx.moveTo(10, 48);
        ctx.lineTo(15, 75);
        ctx.moveTo(15, 75);
        ctx.lineTo(22, 80);
        ctx.moveTo(15, 75);
        ctx.lineTo(8, 80);
        
        ctx.strokeStyle = '#0055ff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
    }
});


// --- Main Draw Loop ---
function draw() {
    // Clear background
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, cw, ch);
    
    // Use screen mode for glowing neon effect
    ctx.globalCompositeOperation = 'screen';
    
    // Draw all elements based on current progress
    elements.forEach(el => {
        let localP = getLocalProgress(progress, el.start, el.end);
        if (localP > 0) {
            el.draw(ctx, localP);
        }
    });
}

function loop() {
    if (!isPlaying) return;
    
    progress += animationSpeed;
    if (progress > 1) {
        progress = 1;
        isPlaying = false;
    }
    
    draw();
    
    if (isPlaying) {
        reqId = requestAnimationFrame(loop);
    }
}

// Initial draw (blank canvas)
draw();

// --- UI Controls ---
const btnStart = document.getElementById('btnStart');
const btnPause = document.getElementById('btnPause');
const btnReplay = document.getElementById('btnReplay');
const btnHide = document.getElementById('btnHide');
const panelBody = document.querySelector('.panel-body');

btnStart.addEventListener('click', () => {
    if (progress >= 1) progress = 0;
    if (!isPlaying) {
        isPlaying = true;
        loop();
    }
});

btnPause.addEventListener('click', () => {
    isPlaying = false;
    if (reqId) cancelAnimationFrame(reqId);
});

btnReplay.addEventListener('click', () => {
    progress = 0;
    isPlaying = true;
    loop();
});

let panelVisible = true;
btnHide.addEventListener('click', () => {
    panelVisible = !panelVisible;
    if (panelVisible) {
        panelBody.classList.remove('collapsed');
        btnHide.textContent = 'X';
    } else {
        panelBody.classList.add('collapsed');
        btnHide.textContent = '+';
    }
});
