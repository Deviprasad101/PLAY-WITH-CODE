document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 120; // Lots of magical dust

    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 4 + 1; // 1 to 5px
        const posX = Math.random() * 100; // 0 to 100vw
        const duration = Math.random() * 15 + 5; // 5s to 20s
        const delay = Math.random() * 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}vw`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        // Colors: Gold and Purple mixes
        const colors = [
            '#ffd700', // Gold
            '#ff8c00', // Dark Orange
            '#8a2be2', // Blue Violet
            '#da70d6', // Orchid
            '#fff8dc'  // Cornsilk (whiteish gold)
        ];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}`;

        particlesContainer.appendChild(particle);
    }
});
