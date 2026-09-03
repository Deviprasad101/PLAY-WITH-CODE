document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const bead = document.querySelector('.dock__bead');
    const beadIcon = document.getElementById('bead-icon');
    const pathFill = document.getElementById('skinFill');
    const dock = document.querySelector('.dock');
    const title = document.getElementById('page-title');
    const sub = document.getElementById('page-sub');
    
    let activeIndex = 0;
    
    // Physics / state for bead
    let currentX = 0;
    let targetX = 0;
    let velocity = 0;
    const spring = 0.15;
    const friction = 0.75;
    
    let isDragging = false;
    let dragStartX = 0;
    
    // Dock dimensions
    const dockWidth = 500;
    const dockHeight = 80;
    const cornerRadius = 24;

    function getTabX(index) {
        if (!tabs[index]) return 0;
        const tab = tabs[index];
        const rect = tab.getBoundingClientRect();
        const dockRect = dock.getBoundingClientRect();
        return rect.left - dockRect.left + rect.width / 2;
    }
    
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            setActive(index);
        });
    });
    
    function setActive(index) {
        tabs[activeIndex].classList.remove('active');
        activeIndex = index;
        const activeTab = tabs[activeIndex];
        activeTab.classList.add('active');
        
        targetX = getTabX(activeIndex);
        
        // Update content and colors
        const color = activeTab.style.getPropertyValue('--acc').trim();
        const iconClass = activeTab.querySelector('i').className;
        
        setTimeout(() => {
            beadIcon.className = iconClass.replace('ph ', 'ph-fill ');
            bead.style.backgroundColor = color;
            bead.style.boxShadow = `0 10px 20px ${color}80`;
            title.textContent = activeTab.dataset.title;
            sub.textContent = activeTab.dataset.sub;
            title.style.color = color;
        }, 150);
    }
    
    // Drag logic
    bead.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX - targetX;
        bead.style.cursor = 'grabbing';
    });
    
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        targetX = e.clientX - dragStartX;
        // Clamp
        targetX = Math.max(40, Math.min(dockWidth - 40, targetX));
    });
    
    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        bead.style.cursor = 'grab';
        
        // Snap to nearest tab
        let closestIndex = 0;
        let minDistance = Infinity;
        tabs.forEach((_, index) => {
            const dist = Math.abs(targetX - getTabX(index));
            if (dist < minDistance) {
                minDistance = dist;
                closestIndex = index;
            }
        });
        
        setActive(closestIndex);
    });
    
    // Animation Loop
    function render() {
        if (!isDragging) {
            const ax = (targetX - currentX) * spring;
            velocity += ax;
            velocity *= friction;
            currentX += velocity;
        } else {
            const prevX = currentX;
            currentX += (targetX - currentX) * 0.4;
            velocity = currentX - prevX; 
        }
        
        bead.style.transform = `translateX(calc(${currentX}px - 50%))`;
        
        // Meniscus Curve Calculation
        // Leaning effect based on velocity
        const lean = Math.min(Math.max(velocity * 0.8, -25), 25);
        
        const bumpW = 50; // Half width of the bump base
        const bumpTopW = 28; // Half width of the bump top (cradling the bead)
        const bumpH = -28; // Depth of the bump (negative means it goes UP outside the rect)
        
        // We use an SVG path. Start at top-left corner (after radius).
        // Line to just before the bead, cubic bezier up to the bead, cubic bezier back down, 
        // line to top-right, then round the corners.
        
        const path = `
            M ${cornerRadius} 0
            L ${currentX - bumpW} 0
            C ${currentX - bumpW + 20 + lean} 0, ${currentX - bumpTopW + lean} ${bumpH}, ${currentX} ${bumpH}
            C ${currentX + bumpTopW + lean} ${bumpH}, ${currentX + bumpW - 20 + lean} 0, ${currentX + bumpW} 0
            L ${dockWidth - cornerRadius} 0
            Q ${dockWidth} 0, ${dockWidth} ${cornerRadius}
            L ${dockWidth} ${dockHeight - cornerRadius}
            Q ${dockWidth} ${dockHeight}, ${dockWidth - cornerRadius} ${dockHeight}
            L ${cornerRadius} ${dockHeight}
            Q 0 ${dockHeight}, 0 ${dockHeight - cornerRadius}
            L 0 ${cornerRadius}
            Q 0 0, ${cornerRadius} 0
            Z
        `;
        
        pathFill.setAttribute('d', path);
        
        requestAnimationFrame(render);
    }
    
    // Initial setup
    setTimeout(() => {
        targetX = getTabX(0);
        currentX = targetX;
        render();
    }, 100);
});
