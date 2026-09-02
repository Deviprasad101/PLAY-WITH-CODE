document.addEventListener('DOMContentLoaded', () => {
  const tree = document.querySelector('.tree');
  
  // Festive vibrant colors for the glowing ornaments
  const colors = [
      '#ff4757', // Red
      '#1e90ff', // Blue
      '#2ed573', // Green
      '#ffa502', // Orange
      '#ff69b4', // Pink
      '#ffffff', // White
      '#f1c40f'  // Yellow
  ];
  
  // Tree Dimensions
  const max_h = 450; // Maximum height of the tree cone
  const max_r = 200; // Maximum radius of the base of the cone
  const num_branches = 200; // Number of glowing lines
  
  for (let i = 0; i < num_branches; i++) {
      const li = document.createElement('li');
      
      // Calculate 3D points on a cone structure
      // Math.sqrt randomizes heights but clusters them towards the bottom for a fuller tree base
      const h = 40 + Math.sqrt(Math.random()) * (max_h - 40); 
      const theta = Math.random() * Math.PI * 2; // Full 360 degree rotation around the Y axis
      
      // Calculate X and Z in 3D space
      const r = max_r * (h / max_h); // Radius at this specific height
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      
      // Project the 3D coordinates onto a 2D screen
      // Calculate the 2D rotation angle for the CSS transform
      const angle = Math.atan2(x, h) * (180 / Math.PI); 
      // Calculate the 2D length of the line
      const length = Math.sqrt(x*x + h*h);
      
      // Calculate visual properties
      const zIndex = Math.floor(z); // Elements with higher Z come to the front
      const dotSize = 2.5 + Math.random() * 4; // Random ornament sizes
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Inject properties directly into the element's CSS variables
      // These are seamlessly picked up by the `var(...)` references in the stylesheet!
      li.style.setProperty('--angle', `${angle}deg`);
      li.style.setProperty('--length', `${length}px`);
      li.style.setProperty('--z', zIndex);
      li.style.setProperty('--color', color);
      li.style.setProperty('--dot-size', `${dotSize}px`);
      
      tree.appendChild(li);
  }
});
