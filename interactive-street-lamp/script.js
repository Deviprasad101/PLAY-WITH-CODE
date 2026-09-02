document.addEventListener('DOMContentLoaded', () => {
  const bulb = document.getElementById('bulb');
  
  // Toggle the lamp on and off when the bulb is clicked
  bulb.addEventListener('click', () => {
      document.body.classList.toggle('lamp-off');
  });
});
