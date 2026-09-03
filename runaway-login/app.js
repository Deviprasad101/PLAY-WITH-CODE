document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('submit-btn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const dockArea = document.getElementById('dock-area');
    const togglePassword = document.getElementById('toggle-password');
    const form = document.getElementById('login-form');

    let isRunawayActive = true;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    
    // Physics variables
    let velocityX = 0;
    let velocityY = 0;
    const spring = 0.15; // spring strength
    const friction = 0.75; // friction

    function checkValidity() {
        // Simple validation logic
        const isEmailValid = emailInput.value.length > 0 && emailInput.value.includes('@');
        const isPasswordValid = passwordInput.value.length >= 8;
        
        if (isEmailValid && isPasswordValid) {
            isRunawayActive = false;
            button.classList.add('valid');
            button.removeAttribute('aria-disabled');
            targetX = 0; // Return to center
            targetY = 0;
        } else {
            isRunawayActive = true;
            button.classList.remove('valid');
            button.setAttribute('aria-disabled', 'true');
        }
    }

    emailInput.addEventListener('input', checkValidity);
    passwordInput.addEventListener('input', checkValidity);

    const bandLine = document.getElementById('band-line');

    // Animation loop for smooth movement
    function animate() {
        if (isRunawayActive) {
            // Apply spring physics towards targets
            velocityX += (targetX - currentX) * spring;
            velocityY += (targetY - currentY) * spring;
            velocityX *= friction;
            velocityY *= friction;
            currentX += velocityX;
            currentY += velocityY;
        } else {
            // If valid, smoothly return to center
            currentX += (0 - currentX) * 0.1;
            currentY += (0 - currentY) * 0.1;
        }

        button.style.setProperty('--x', `${currentX}px`);
        button.style.setProperty('--y', `${currentY}px`);
        
        // Draw the tether line
        if (bandLine) {
            const startX = dockArea.offsetWidth / 2;
            const startY = dockArea.offsetHeight / 2;
            const endX = startX + currentX;
            const endY = startY + currentY;
            
            // Only show the line if it has moved a bit
            const dist = Math.sqrt(currentX*currentX + currentY*currentY);
            if (dist > 10) {
                bandLine.setAttribute('d', `M ${startX} ${startY} L ${endX} ${endY}`);
                bandLine.style.opacity = Math.min(1, dist / 50); // Fade in as it stretches
            } else {
                bandLine.setAttribute('d', '');
                bandLine.style.opacity = 0;
            }
        }

        requestAnimationFrame(animate);
    }
    
    animate();

    document.addEventListener('mousemove', (e) => {
        if (!isRunawayActive) return;
        
        const btnRect = button.getBoundingClientRect();
        
        // Button center relative to viewport
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;
        
        // Mouse distance from button center
        const dx = e.clientX - btnCenterX;
        const dy = e.clientY - btnCenterY;
        
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If mouse is close (e.g. within 150px)
        const runawayThreshold = 150;
        
        if (distance < runawayThreshold) {
            // Move opposite to mouse direction
            const angle = Math.atan2(dy, dx);
            const force = (runawayThreshold - distance);
            
            targetX = currentX - Math.cos(angle) * force;
            targetY = currentY - Math.sin(angle) * force;
            
            // Constrain it to not fly completely off screen
            const maxTravel = 200; // allow it to go 200px away from dock center
            const distFromCenter = Math.sqrt(targetX*targetX + targetY*targetY);
            if (distFromCenter > maxTravel) {
                const clampAngle = Math.atan2(targetY, targetX);
                targetX = Math.cos(clampAngle) * maxTravel;
                targetY = Math.sin(clampAngle) * maxTravel;
            }
        } else {
            // If mouse is far, it slightly relaxes back towards center but doesn't immediately snap back
            targetX *= 0.95;
            targetY *= 0.95;
        }
    });

    // Password toggle
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        if (type === 'text') {
            togglePassword.classList.remove('ph-eye-slash');
            togglePassword.classList.add('ph-eye');
        } else {
            togglePassword.classList.remove('ph-eye');
            togglePassword.classList.add('ph-eye-slash');
        }
    });

    // Prevent submission if invalid
    form.addEventListener('submit', (e) => {
        if (isRunawayActive) {
            e.preventDefault();
        } else {
            e.preventDefault();
            alert("Logged in successfully!");
            // Here you would normally submit the form data
            
            // Reset for demo purposes
            emailInput.value = '';
            passwordInput.value = '';
            checkValidity();
        }
    });
});
