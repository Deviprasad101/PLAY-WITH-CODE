// Setup Three.js Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 600;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Helper function to create a soft circular texture for the particles
function getParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Create a radial gradient for a soft, glowing particle
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

// Generate the vertices for the heart shape
const vertices = [];
const baseVertices = [];
const numParticles = 12000; // Large number of particles for a rich glow

for (let i = 0; i < numParticles; i++) {
  // Random parameter 't' from 0 to 2*PI
  const t = Math.random() * Math.PI * 2;
  
  // Heart math formula
  const st = Math.sin(t);
  let x = 16 * st * st * st;
  let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  
  // Scale the heart up
  x *= 14;
  y *= 14;

  // Add random spread around the edge to create volume
  const spread = 25;
  const offsetX = (Math.random() - 0.5) * spread;
  const offsetY = (Math.random() - 0.5) * spread;
  const offsetZ = (Math.random() - 0.5) * (spread * 2);

  const vec = new THREE.Vector3(x + offsetX, y + offsetY, offsetZ);
  
  // Keep a copy of the base position for calculating animations
  baseVertices.push(vec.clone());
  vertices.push(vec);
}

// EXACTLY matching the core logic from the screenshot image
const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
const material = new THREE.PointsMaterial({ 
  color: 0xee5282, 
  blending: THREE.AdditiveBlending, 
  size: 4,
  transparent: true,
  opacity: 0.6,
  depthWrite: false, // Ensures glowing particles blend correctly
  map: getParticleTexture() // Uses the soft circle instead of squares
});
const particles = new THREE.Points(geometry, material);

// Visually center the heart slightly
particles.position.y += 30;
scene.add(particles);


const clock = new THREE.Clock();

function render() {
  requestAnimationFrame(render);
  
  const time = clock.getElapsedTime();
  
  // Update the geometry from the animated vertices
  for (let i = 0; i < numParticles; i++) {
    const v = vertices[i];
    const base = baseVertices[i];
    
    // Create a subtle drifting/floating effect for each particle
    v.x = base.x + Math.sin(time * 1.5 + i * 0.1) * 3;
    v.y = base.y + Math.cos(time * 1.5 + i * 0.1) * 3;
    v.z = base.z + Math.sin(time * 1.0 + i * 0.1) * 3;
  }
  
  // Apply updated vertices back to geometry (as seen in the screenshot code)
  geometry.setFromPoints(vertices);
  
  // Add 3D rotation to the entire heart
  particles.rotation.y = Math.sin(time * 0.5) * 0.3;
  particles.rotation.z = Math.sin(time * 0.3) * 0.05;
  
  // Add a heartbeat pulse effect!
  // Uses an exponential sine wave to simulate a quick "thump-thump"
  const pulse = Math.pow(Math.sin(time * 4), 16) * 0.12;
  const scale = 1 + pulse;
  particles.scale.set(scale, scale, scale);

  renderer.render(scene, camera);
}


/* EVENTS (from the screenshot) */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);

// Start the render loop
requestAnimationFrame(render);
