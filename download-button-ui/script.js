document.addEventListener('DOMContentLoaded', () => {

  // --- Neumorphic Button Logic ---
  const neuBtn = document.getElementById('neu-btn');
  const neuRing = document.querySelector('.orange-ring');
  const neuText = document.getElementById('neu-text');

  let neuProgress = 58;
  let neuInterval = null;
  const neuCircumference = 289;

  // Initialize
  neuRing.style.strokeDashoffset = neuCircumference - (neuCircumference * neuProgress) / 100;

  neuBtn.addEventListener('click', () => {
    // Reset if it was already finished
    if (neuProgress >= 100) {
      neuProgress = 0;
    }
    
    clearInterval(neuInterval);
    neuInterval = setInterval(() => {
      neuProgress += 1;
      
      if (neuProgress >= 100) {
        neuProgress = 100;
        clearInterval(neuInterval);
        neuText.textContent = "Downloaded";
      } else {
        neuText.textContent = `${neuProgress}% Downloading...`;
      }
      
      neuRing.style.strokeDashoffset = neuCircumference - (neuCircumference * neuProgress) / 100;
    }, 40);
  });

  // --- Neon Button Logic ---
  const neonBtn = document.getElementById('neon-btn');
  const neonRing = document.querySelector('.neon-progress-ring');
  const neonText = document.getElementById('neon-text');

  let neonProgress = 52;
  let neonInterval = null;
  const neonCircumference = 440;

  // Initialize
  neonRing.style.strokeDashoffset = neonCircumference - (neonCircumference * neonProgress) / 100;

  neonBtn.addEventListener('click', () => {
    // Reset if it was already finished
    if (neonProgress >= 100) {
      neonProgress = 0;
    }
    
    clearInterval(neonInterval);
    neonInterval = setInterval(() => {
      neonProgress += 1;
      
      if (neonProgress >= 100) {
        neonProgress = 100;
        clearInterval(neonInterval);
      }
      
      neonText.textContent = `${neonProgress}%`;
      neonRing.style.strokeDashoffset = neonCircumference - (neonCircumference * neonProgress) / 100;
    }, 40);
  });

});
