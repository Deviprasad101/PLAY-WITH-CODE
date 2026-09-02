document.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  
  const eyeL = document.getElementById('eye-l');
  const eyeR = document.getElementById('eye-r');
  const mouth = document.getElementById('mouth');
  const tongue = document.getElementById('tongue');
  
  // Default happy face (^ _ ^)
  const setHappyFace = () => {
      eyeL.setAttribute('d', 'M 115,130 Q 120,122 125,130');
      eyeR.setAttribute('d', 'M 175,130 Q 180,122 185,130');
      mouth.setAttribute('d', 'M 140,135 Q 150,150 160,135 Z');
      tongue.style.display = 'block';
  };
  
  // Curious face looking at the username input
  const setLookRightFace = () => {
      // Shift eyes slightly right and open them
      eyeL.setAttribute('d', 'M 120,130 Q 125,122 130,130');
      eyeR.setAttribute('d', 'M 180,130 Q 185,122 190,130');
      
      // Small "O" shape mouth for curiosity
      mouth.setAttribute('d', 'M 145,140 A 5,5 0 1,1 155,140 A 5,5 0 1,1 145,140 Z');
      tongue.style.display = 'none';
  };
  
  // Shy/Privacy face when typing password (> <)
  const setClosedEyesFace = () => {
      // Create ">" and "<" shapes for eyes
      eyeL.setAttribute('d', 'M 115,125 L 120,130 L 115,135');
      eyeR.setAttribute('d', 'M 185,125 L 180,130 L 185,135');
      
      // Straight line mouth (drawn as a thin rectangle to work with fill)
      mouth.setAttribute('d', 'M 140,138 L 160,138 L 160,142 L 140,142 Z');
      tongue.style.display = 'none';
  };
  
  // Add interactive event listeners
  usernameInput.addEventListener('focus', setLookRightFace);
  usernameInput.addEventListener('blur', setHappyFace);
  
  passwordInput.addEventListener('focus', setClosedEyesFace);
  passwordInput.addEventListener('blur', setHappyFace);
});
