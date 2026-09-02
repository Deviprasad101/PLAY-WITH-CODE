document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('password');
  const leftArm = document.getElementById('left-arm');
  const eyes = document.getElementById('eyes');

  // Interactivity for the "Creative Login Page" character
  
  // When the user focuses on the password field, the boy covers his eyes!
  passwordInput.addEventListener('focus', () => {
      // Modify the SVG path to move the arm up to the face
      leftArm.setAttribute('d', 'M 30 45 Q 20 25 35 22');
      
      // Hide the open eyes so it looks like the arm is fully covering them
      eyes.style.opacity = '0';
  });

  // When the user clicks away (blurs), the boy puts his arm back down
  passwordInput.addEventListener('blur', () => {
      // Reset arm position
      leftArm.setAttribute('d', 'M 30 45 L 18 65');
      
      // Show eyes again
      eyes.style.opacity = '1';
  });
  
  // Simple form submit prevention
  document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Login successful!');
  });
});
