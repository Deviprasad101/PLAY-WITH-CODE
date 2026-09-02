document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('heart-container');
  let svg = `<svg viewBox="0 0 400 450" xmlns="http://www.w3.org/2000/svg">`;

  // 3D Grid approximating a classic, perfectly symmetrical romantic heart shape (x, y, z)
  const grid3D = [
      // Row 0 (Top edges)
      [[100, 100, 0], [130, 50, 20], [170, 40, 30], [200, 80, 10], [230, 40, 30], [270, 50, 20], [300, 100, 0]],
      // Row 1 (Upper bulk)
      [[60, 140, 0],  [110, 90, 50], [160, 80, 70], [200, 120, 50], [240, 80, 70], [290, 90, 50], [340, 140, 0]],
      // Row 2 (Widest part)
      [[40, 190, 0],  [90, 150, 60], [150, 140, 90], [200, 170, 70], [250, 140, 90], [310, 150, 60], [360, 190, 0]],
      // Row 3 (Mid tapering)
      [[60, 250, 0],  [110, 230, 60], [160, 220, 90], [200, 240, 80], [240, 220, 90], [290, 230, 60], [340, 250, 0]],
      // Row 4 (Lower tapering)
      [[100, 310, 0], [140, 300, 50], [170, 290, 70], [200, 310, 60], [230, 290, 70], [260, 300, 50], [300, 310, 0]],
      // Row 5 (Bottom before apex)
      [[150, 370, 0], [170, 360, 30], [185, 360, 50], [200, 370, 40], [215, 360, 50], [230, 360, 30], [250, 370, 0]],
      // Row 6 (Apex)
      [[190, 420, 0], [195, 415, 10], [198, 415, 20], [200, 430, 10], [202, 415, 20], [205, 415, 10], [210, 420, 0]]
  ];

  // Light Source (Coming from Top-Left to match the screenshot shading)
  const L = {x: -1.0, y: -0.2, z: 0.8};
  const len = Math.sqrt(L.x*L.x + L.y*L.y + L.z*L.z);
  L.x /= len; L.y /= len; L.z /= len;

  // Calculates color based on 3D face normal
  function getColor(brightness) {
      // Clamp brightness between -0.5 and 1.0
      let b = Math.max(0, Math.min(1, (brightness + 0.3) / 1.3)); 
      
      let c = {r:0, g:0, b:0};
      
      if (b < 0.5) {
          // Lerp between Dark Shadow and Mid Red
          let t = b / 0.5;
          c.r = 45 + (201 - 45) * t;
          c.g = 0 + (24 - 0) * t;
          c.b = 0 + (24 - 0) * t;
      } else {
          // Lerp between Mid Red and Highlight Pink
          let t = (b - 0.5) / 0.5;
          c.r = 201 + (255 - 201) * t;
          c.g = 24 + (142 - 24) * t;
          c.b = 24 + (139 - 24) * t;
      }
      
      // Add slight randomness to color to enhance low-poly facet look
      let noise = (Math.random() - 0.5) * 15;
      return `rgb(${Math.floor(c.r + noise)}, ${Math.floor(c.g + noise)}, ${Math.floor(c.b + noise)})`;
  }

  // Generates an SVG polygon from 3 points
  function addTriangle(p1, p2, p3, row, col) {
      // Calculate normal vectors for 3D lighting
      let ux = p2[0] - p1[0], uy = p2[1] - p1[1], uz = p2[2] - p1[2];
      let vx = p3[0] - p1[0], vy = p3[1] - p1[1], vz = p3[2] - p1[2];
      
      let nx = uy*vz - uz*vy;
      let ny = uz*vx - ux*vz;
      let nz = ux*vy - uy*vx;
      let nlen = Math.sqrt(nx*nx + ny*ny + nz*nz);
      
      if (nlen > 0) {
          nx /= nlen; ny /= nlen; nz /= nlen;
      }
      
      // Calculate brightness via dot product with Light vector
      let bright = nx*L.x + ny*L.y + nz*L.z;
      let color = getColor(bright);
      
      // Center of triangle (for CSS transform-origin)
      let cx = (p1[0]+p2[0]+p3[0])/3;
      let cy = (p1[1]+p2[1]+p3[1])/3;
      
      // Create a staggered delay for the beating animation (ripple effect)
      let delay = (row * 0.03 + col * 0.03) + Math.random() * 0.05;
      
      svg += `<polygon points="${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}" 
               fill="${color}" 
               style="transform-origin: ${cx}px ${cy}px; animation-delay: ${delay}s" />`;
  }

  // Loop through grid and generate 2 triangles per cell
  for(let r = 0; r < 6; r++) {
      for(let c = 0; c < 6; c++) {
          let p1 = grid3D[r][c];
          let p2 = grid3D[r][c+1];
          let p3 = grid3D[r+1][c];
          let p4 = grid3D[r+1][c+1];
          
          addTriangle(p1, p2, p3, r, c); // Top-left triangle
          addTriangle(p2, p4, p3, r, c); // Bottom-right triangle
      }
  }

  svg += `</svg>`;
  container.innerHTML = svg;
});
