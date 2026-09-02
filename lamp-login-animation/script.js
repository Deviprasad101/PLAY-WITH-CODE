document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const spinner = document.getElementById('spinner');
  
  // Lamp elements
  const bulb = document.getElementById('bulb');
  const beam = document.getElementById('beam');
  const knob = document.getElementById('knob');
  const pullString = document.getElementById('pullString');
  const particles = document.getElementById('particles');

  let isLampOn = false;

  // Function to toggle the lamp on and off
  function toggleLamp() {
    isLampOn = !isLampOn;
    if (isLampOn) {
      bulb.classList.add('on');
      beam.classList.add('on');
      knob.classList.add('on');
      document.body.classList.add('fireflies-on');
    } else {
      bulb.classList.remove('on');
      beam.classList.remove('on');
      knob.classList.remove('on');
      document.body.classList.remove('fireflies-on');
    }
  }

  // Interactive pull string to manually toggle the lamp!
  pullString.addEventListener('click', () => {
    toggleLamp();
  });

  // Toggle Password Visibility (Eye icon logic from the screenshot)
  togglePassword.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      togglePassword.classList.replace('fa-eye', 'fa-eye-slash');
      togglePassword.classList.add('text-yellow-400');
    } else {
      passwordInput.type = 'password';
      togglePassword.classList.replace('fa-eye-slash', 'fa-eye');
      togglePassword.classList.remove('text-yellow-400');
    }
  });

  // Handle Form Submit (React logic adaptation from the screenshot)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // UI Loading state
    btnText.textContent = 'Signing in...';
    spinner.classList.remove('hidden');
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-80', 'cursor-not-allowed');
    
    // The code in the image specifically triggers `setLampOn(true)` on submit
    if (!isLampOn) {
      toggleLamp();
    }

    // Simulate network delay
    setTimeout(() => {
      btnText.textContent = 'Sign In';
      spinner.classList.add('hidden');
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-80', 'cursor-not-allowed');
    }, 2000);
  });

  // Generate glowing firefly particles floating in the background
  for (let i = 0; i < 40; i++) {
    const firefly = document.createElement('div');
    firefly.classList.add('firefly');
    
    // Random positions across the screen
    firefly.style.left = Math.random() * 100 + 'vw';
    firefly.style.top = Math.random() * 100 + 'vh';
    
    // Random animation delays and durations for a natural, chaotic look
    firefly.style.animationDuration = (Math.random() * 4 + 3) + 's'; // 3s to 7s
    firefly.style.animationDelay = (Math.random() * 5) + 's';
    
    particles.appendChild(firefly);
  }
});
