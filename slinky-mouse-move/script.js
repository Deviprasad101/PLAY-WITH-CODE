const c = document.getElementById('c');
const ctx = c.getContext('2d');

let innerWidth, innerHeight;

// Ensure canvas is always full screen
function resize() {
  innerWidth = window.innerWidth;
  innerHeight = window.innerHeight;
  c.width = innerWidth;
  c.height = innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Mouse tracking
let mouse = { x: innerWidth / 2, y: innerHeight / 2 };
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Touch support for mobile devices
window.addEventListener('touchmove', (e) => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
});

// Create an array of points (rings) for the slinky
const numPoints = 60; // The length of the slinky
let m = Array.from({ length: numPoints }, () => ({ x: mouse.x, y: mouse.y }));

// The update loop to handle slinky physics
function update() {
  // Lerp physics: First point smoothly follows the mouse
  m[0].x += (mouse.x - m[0].x) * 0.15;
  m[0].y += (mouse.y - m[0].y) * 0.15;

  // Each subsequent point smoothly follows the point before it
  for (let i = 1; i < numPoints; i++) {
      m[i].x += (m[i-1].x - m[i].x) * 0.3;
      m[i].y += (m[i-1].y - m[i].y) * 0.3;
  }

  // Call the function from the provided snippet
  slinky_move();
}

/* 
* EXACT CODE SNIPPET PROVIDED IN THE IMAGE
* This handles drawing the slinky with a 3D perspective effect
*/
function slinky_move(){
  ctx.clearRect(0, 0, c.width, c.height)

  m.forEach((pt,i)=>{
      if (i==m.length-1) return;
      ctx.lineWidth = 25+i*.05; // As written in snippet
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1.5; // Overwrites the above, as written in snippet
      ctx.beginPath()
      // The math here creates a brilliant pseudo-3D perspective by pulling
      // rings further down the slinky towards the center vanishing point!
      ctx.arc(m[i].x-i*2*(0.5-m[i].x/innerWidth),
              m[i].y-i*4*(0.5-m[i].y/innerHeight),
              50+i*.1, 0, 2*Math.PI)
      ctx.stroke()
  })
}

// Exactly as requested by the snippet, using GSAP ticker to run the animation loop
gsap.ticker.add(update);
