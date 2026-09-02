document.addEventListener('DOMContentLoaded', () => {
  // Form elements
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  
  // Lamp elements
  const knob = document.querySelector('.knob');
  const cordGroup = document.getElementById('cordGroup');
  const lampSection = document.getElementById('lampSection');
  
  // Character facial features
  const eyesClosed = document.getElementById('eyes-closed');
  const eyesOpen = document.getElementById('eyes-open');
  const eyesSquint = document.getElementById('eyes-squint');
  const tongue = document.getElementById('tongue');

  let isLightOn = false;

  // Helper to change the character's eye expression
  function setEyes(state) {
      // Hide all first
      eyesClosed.style.opacity = '0';
      eyesOpen.style.opacity = '0';
      eyesSquint.style.opacity = '0';
      
      // Show requested state
      if (state === 'open') {
          eyesOpen.style.opacity = '1';
      } else if (state === 'squint') {
          eyesSquint.style.opacity = '1';
      } else {
          eyesClosed.style.opacity = '1';
      }
  }

  // 1. When typing username, lamp opens eyes to watch you
  usernameInput.addEventListener('focus', () => {
      setEyes('open');
      tongue.style.opacity = '0'; // hide tongue if showing
  });
  
  usernameInput.addEventListener('blur', () => {
      // If we aren't moving directly to the password field, close eyes
      if (!passwordInput.matches(':focus') && !isLightOn) {
          setEyes('closed');
      }
  });

  // 2. When typing password, lamp squints/covers eyes for privacy!
  passwordInput.addEventListener('focus', () => {
      setEyes('squint');
      tongue.style.opacity = '0';
  });
  
  passwordInput.addEventListener('blur', () => {
      // If we aren't moving directly to the username field, close eyes
      if (!usernameInput.matches(':focus') && !isLightOn) {
          setEyes('closed');
      }
  });

  // 3. Interactive Pull Cord Logic
  knob.addEventListener('mousedown', () => {
      // Add a CSS class that translates the cord down
      lampSection.classList.add('pulling');
  });

  // Listen on the whole document in case they drag outside the knob
  document.addEventListener('mouseup', () => {
      if (lampSection.classList.contains('pulling')) {
          // Release cord
          lampSection.classList.remove('pulling');
          
          // Toggle light state
          isLightOn = !isLightOn;
          document.body.classList.toggle('light-on', isLightOn);
          
          if (isLightOn) {
              // Light turns ON! Lamp opens eyes wide and sticks tongue out playfully
              setEyes('open');
              tongue.style.opacity = '1';
              
              // After a short delay, return to normal expression if not typing
              setTimeout(() => {
                  if (!usernameInput.matches(':focus') && !passwordInput.matches(':focus')) {
                      setEyes('closed');
                      tongue.style.opacity = '0';
                  } else {
                      // If they are still focused on a field, keep tongue hidden and revert to field expression
                      tongue.style.opacity = '0';
                      if (passwordInput.matches(':focus')) setEyes('squint');
                  }
              }, 1500);
          } else {
              // Light turns OFF
              tongue.style.opacity = '0';
              if (!usernameInput.matches(':focus') && !passwordInput.matches(':focus')) {
                  setEyes('closed');
              } else if (passwordInput.matches(':focus')) {
                  setEyes('squint');
              } else {
                  setEyes('open');
              }
          }
      }
  });

  // Basic Form Submit Prevention for Demo
  document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      alert("Cute login successful!");
      e.target.reset();
      setEyes('closed');
      tongue.style.opacity = '0';
  });
});
