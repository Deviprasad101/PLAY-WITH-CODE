document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const eyeIcon = document.getElementById('eyeIcon');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const loadingSpinner = document.getElementById('loadingSpinner');

  // Mimics the React useState for showPassword
  togglePasswordBtn.addEventListener('click', () => {
      if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          eyeIcon.classList.remove('fa-eye');
          eyeIcon.classList.add('fa-eye-slash');
      } else {
          passwordInput.type = 'password';
          eyeIcon.classList.remove('fa-eye-slash');
          eyeIcon.classList.add('fa-eye');
      }
  });

  // Mimics the React handleSubmit logic (e.preventDefault, setLoading)
  loginForm.addEventListener('submit', (e) => {
      e.preventDefault(); 
      
      // setLoading(true)
      btnText.textContent = 'Logging in...';
      loadingSpinner.classList.remove('hidden');
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-80', 'cursor-not-allowed');
      
      // setTimeout(() => setLoading(false), 1500)
      setTimeout(() => {
          btnText.textContent = 'Login';
          loadingSpinner.classList.add('hidden');
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-80', 'cursor-not-allowed');
          
          // Clear inputs on success
          document.getElementById('username').value = '';
          passwordInput.value = '';
          
          alert("Login simulated successfully!");
      }, 1500);
  });
});
