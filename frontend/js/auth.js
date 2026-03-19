// Auth Form Handlers

// Registration Form Handler
async function handleRegister(event) {
  event.preventDefault();

  const formData = {
    username: document.getElementById('register-username').value,
    email: document.getElementById('register-email').value,
    first_name: document.getElementById('register-firstname').value,
    last_name: document.getElementById('register-lastname').value,
    password: document.getElementById('register-password').value,
    role: 'user', // Default role
    phone_number: document.getElementById('register-phone').value
  };

  try {
    const response = await AuthAPI.register(formData);
    showNotification('Registration successful! Please log in.', 'success');
    // Switch to login form
    document.getElementById('auth-container').classList.add('show-login');
    document.getElementById('auth-container').classList.remove('show-register');
    document.getElementById('register-form').reset();
  } catch (error) {
    showNotification(`Registration failed: ${error.message}`, 'error');
  }
}

// Login Form Handler
async function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await AuthAPI.login(username, password);
    
    // Store token
    TokenManager.setToken(response.access_token, response.token_type);

    // Fetch and store user info
    const userInfo = await AuthAPI.getUser();
    TokenManager.setUserInfo(userInfo);

    showNotification('Login successful!', 'success');
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 500);
  } catch (error) {
    showNotification('Login failed. Invalid credentials.', 'error');
  }
}

// Toggle between login and register
function toggleAuthForm() {
  const container = document.getElementById('auth-container');
  container.classList.toggle('show-login');
  container.classList.toggle('show-register');
}

// Logout handler
function handleLogout() {
  TokenManager.clearAll();
  showNotification('Logged out successfully', 'success');
  setTimeout(() => {
    window.location.href = '/index.html';
  }, 500);
}

// Show notification
function showNotification(message, type = 'info') {
  const notificationContainer = document.getElementById('notification-container');
  if (!notificationContainer) {
    const container = document.createElement('div');
    container.id = 'notification-container';
    document.body.appendChild(container);
  }

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  document.getElementById('notification-container').appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Check if user is authenticated
function requireAuth() {
  if (!TokenManager.isAuthenticated()) {
    window.location.href = '/index.html';
  }
}

// Get current user
function getCurrentUser() {
  return TokenManager.getUserInfo();
}
