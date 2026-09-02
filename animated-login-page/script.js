document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const btn = document.querySelector('.btn');

  loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const originalText = btn.textContent;
      
      // Loading State
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.9';
      
      // Simulate API response
      setTimeout(() => {
          // Success State
          btn.innerHTML = '<i class="fas fa-check"></i> Success!';
          btn.style.background = '#4ade80'; // Success green
          btn.style.color = '#fff';
          
          // Reset State
          setTimeout(() => {
              btn.textContent = originalText;
              btn.style.background = '#fff';
              btn.style.color = 'var(--bg)';
              btn.style.pointerEvents = 'auto';
              btn.style.opacity = '1';
              loginForm.reset();
          }, 2000);
      }, 1500);
  });
});
