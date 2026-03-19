// API Base URL Configuration
const API_BASE_URL = 'http://localhost:8000';

// Token management
const TokenManager = {
  TOKEN_KEY: 'access_token',
  TOKEN_TYPE_KEY: 'token_type',
  USER_KEY: 'user_info',

  setToken(token, tokenType = 'bearer') {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.TOKEN_TYPE_KEY, tokenType);
  },

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  getTokenType() {
    return localStorage.getItem(this.TOKEN_TYPE_KEY);
  },

  setUserInfo(userInfo) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(userInfo));
  },

  getUserInfo() {
    const userInfo = localStorage.getItem(this.USER_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  },

  clearAll() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_TYPE_KEY);
    localStorage.removeItem(this.USER_KEY);
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};

// API Fetch Wrapper
const APIClient = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add authorization header if token exists
    const token = TokenManager.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        TokenManager.clearAll();
        window.location.href = '/index.html';
        return null;
      }

      // Handle other errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP Error: ${response.status}`);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return { success: true };
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};

// Auth API Endpoints
const AuthAPI = {
  register(userData) {
    return APIClient.post('/auth/', userData);
  },

  login(username, password) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Login Error:', error);
        throw error;
      });
  },

  getUser() {
    return APIClient.get('/user/');
  },

  changePassword(currentPassword, newPassword) {
    return APIClient.put('/user/password', {
      password: currentPassword,
      new_password: newPassword
    });
  },

  changePhoneNumber(phoneNumber) {
    return APIClient.put(`/user/phonenumber/${phoneNumber}`);
  }
};

// Todo API Endpoints
const TodoAPI = {
  getAllTodos() {
    return APIClient.get('/');
  },

  getTodo(todoId) {
    return APIClient.get(`/todo/${todoId}`);
  },

  createTodo(todoData) {
    return APIClient.post('/todo', todoData);
  },

  updateTodo(todoId, todoData) {
    return APIClient.put(`/todo/${todoId}`, todoData);
  },

  deleteTodo(todoId) {
    return APIClient.delete(`/todo/${todoId}`);
  }
};

// Admin API Endpoints
const AdminAPI = {
  getAllTodos() {
    return APIClient.get('/admin/todo');
  },

  deleteTodo(todoId) {
    return APIClient.delete(`/admin/todo/${todoId}`);
  }
};
