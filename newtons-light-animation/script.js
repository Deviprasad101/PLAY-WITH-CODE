const numBulbs = 5;
const container = document.getElementById('bulbs-container');
const powerSwitch = document.getElementById('power');

const bulbSVG = `
  <div class="string"></div>
  <svg viewBox="0 0 100 130" class="bulb-svg">
    <rect class="light-bulb__fitting" x="35" y="0" width="30" height="25" rx="3" />
    <rect class="light-bulb__fitting-shine" x="40" y="0" width="5" height="25" fill="rgba(255,255,255,0.3)"/>
    <path class="light-bulb__filament" d="M 42 25 L 42 60 L 50 65 L 58 60 L 58 25" />
    <path class="light-bulb__glass" d="M 35 25 L 65 25 C 65 45, 80 55, 80 80 A 30 30 0 1 1 20 80 C 20 55, 35 45, 35 25 Z" />
    <circle class="light-bulb__bloom" cx="50" cy="80" r="40" />
  </svg>
`;

// Generate bulbs
for (let i = 0; i < numBulbs; i++) {
  const wrapper = document.createElement('div');
  wrapper.className = 'bulb-wrapper';
  wrapper.innerHTML = bulbSVG;
  container.appendChild(wrapper);
}

const bulbs = document.querySelectorAll('.bulb-wrapper');
let isRunning = powerSwitch.checked;
let cycleActive = false;

const swingTime = 400; // Time for one swing (ms)
const flashTime = 40;  // Time for energy transfer flash (ms)

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startCycle() {
  if (cycleActive) return;
  cycleActive = true;

  while (isRunning) {
    // Bulb 1 swings out
    bulbs[0].style.transition = `transform ${swingTime}ms cubic-bezier(0.2, 0.8, 0.4, 1)`;
    bulbs[0].style.transform = 'rotate(-35deg)';
    bulbs[0].classList.add('on');
    await sleep(swingTime);

    if (!isRunning) break;

    // Bulb 1 swings in
    bulbs[0].style.transition = `transform ${swingTime}ms cubic-bezier(0.6, 0.04, 0.9, 0.4)`;
    bulbs[0].style.transform = 'rotate(0deg)';
    await sleep(swingTime);
    bulbs[0].classList.remove('on');

    if (!isRunning) break;

    // Energy transfer 1 -> 5
    for (let i = 1; i < numBulbs - 1; i++) {
      bulbs[i].classList.add('on');
      await sleep(flashTime);
      bulbs[i].classList.remove('on');
    }

    if (!isRunning) break;

    // Bulb 5 swings out
    bulbs[numBulbs - 1].style.transition = `transform ${swingTime}ms cubic-bezier(0.2, 0.8, 0.4, 1)`;
    bulbs[numBulbs - 1].style.transform = 'rotate(35deg)';
    bulbs[numBulbs - 1].classList.add('on');
    await sleep(swingTime);

    if (!isRunning) break;

    // Bulb 5 swings in
    bulbs[numBulbs - 1].style.transition = `transform ${swingTime}ms cubic-bezier(0.6, 0.04, 0.9, 0.4)`;
    bulbs[numBulbs - 1].style.transform = 'rotate(0deg)';
    await sleep(swingTime);
    bulbs[numBulbs - 1].classList.remove('on');
    
    if (!isRunning) break;

    // Energy transfer 5 -> 1
    for (let i = numBulbs - 2; i > 0; i--) {
      bulbs[i].classList.add('on');
      await sleep(flashTime);
      bulbs[i].classList.remove('on');
    }
  }

  // Reset transforms when turned off
  bulbs.forEach(b => {
    b.style.transition = `transform ${swingTime}ms ease`;
    b.style.transform = 'rotate(0deg)';
    b.classList.remove('on');
  });
  
  cycleActive = false;
}

powerSwitch.addEventListener('change', (e) => {
  isRunning = e.target.checked;
  if (isRunning) {
    startCycle();
  }
});

// Start if initially checked
if (isRunning) {
  startCycle();
}
