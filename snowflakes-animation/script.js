document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('snow-container');
  const moreBtn = document.getElementById('moreSnow');
  const lessBtn = document.getElementById('lessSnow');
  
  let maxSnowflakes = 100;
  let currentSnowflakes = 0;
  let spawnInterval;
  
  const createSnowflake = () => {
      if (currentSnowflakes >= maxSnowflakes) return;
      
      const snowflake = document.createElement('div');
      snowflake.classList.add('snow-particle');
      
      // Use different characters to match the varying shapes in the image
      // Mixing actual snowflakes with dots for a depth-of-field glowing effect
      const flakes = ['❄', '❅', '❆', '•', '·', '⋆'];
      snowflake.textContent = flakes[Math.floor(Math.random() * flakes.length)];
      
      // Random horizontal position (0 to 100vw)
      snowflake.style.left = Math.random() * 100 + 'vw';
      
      // Random size
      const size = Math.random() * 25 + 10; // 10px to 35px
      snowflake.style.fontSize = `${size}px`;
      
      // Random animation duration (falling speed)
      const duration = Math.random() * 5 + 4; // 4s to 9s
      
      // Random sway duration for organic movement
      const swayDuration = Math.random() * 3 + 2; // 2s to 5s
      
      // Apply animations
      snowflake.style.animation = `fall ${duration}s linear forwards, sway ${swayDuration}s ease-in-out infinite alternate`;
      
      container.appendChild(snowflake);
      currentSnowflakes++;
      
      // Cleanup DOM after animation completes
      setTimeout(() => {
          if (container.contains(snowflake)) {
              snowflake.remove();
              currentSnowflakes--;
          }
      }, duration * 1000);
  };

  const startSnowing = (rate) => {
      if (spawnInterval) clearInterval(spawnInterval);
      spawnInterval = setInterval(createSnowflake, rate); 
  };
  
  // Initial gentle snowfall
  startSnowing(150);
  
  // Interactive UI Controls
  moreBtn.addEventListener('click', () => {
      maxSnowflakes += 40;
      if (maxSnowflakes > 250) maxSnowflakes = 250;
      startSnowing(80); // Spawn flakes much faster
  });
  
  lessBtn.addEventListener('click', () => {
      maxSnowflakes -= 40;
      if (maxSnowflakes < 0) maxSnowflakes = 0;
      
      if (maxSnowflakes > 0) {
          startSnowing(300); // Spawn flakes slower
      } else {
          clearInterval(spawnInterval); // Stop completely
      }
  });
});
