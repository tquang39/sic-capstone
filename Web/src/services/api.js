import axios from 'axios';

// API Base URL - có thể config qua environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Games API
export const gamesAPI = {
  getRecommended: () => api.get('/games/recommended'),
  getPopular: () => api.get('/games/popular'),
  getNew: () => api.get('/games/new'),
  search: (query) => api.get(`/games/search?q=${encodeURIComponent(query)}`),
  getById: (id) => api.get(`/games/${id}`),
  like: (id) => api.post(`/games/${id}/like`),
  unlike: (id) => api.delete(`/games/${id}/like`),
};

// User API
export const userAPI = {
  getFavorites: () => api.get('/user/favorites'),
  updateProfile: (profileData) => api.put('/user/profile', profileData),
  getRatings: () => api.get('/user/ratings'),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api; 