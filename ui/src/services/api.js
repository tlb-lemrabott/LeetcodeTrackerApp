// API service for making HTTP requests
import axios from 'axios';
import { API_CONFIG, buildApiUrl, getAuthHeaders } from '../config/api';
import { auth } from '../utils';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = auth.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      auth.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
  patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
};

// API service class for better organization
class ApiService {
  constructor() {
    this.client = apiClient;
  }

  // Authentication endpoints
  async login(credentials) {
    const response = await this.client.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData) {
    const response = await this.client.post('/auth/register', userData);
    return response.data;
  }

  async logout() {
    const response = await this.client.post('/auth/logout');
    return response.data;
  }

  async refreshToken() {
    const response = await this.client.post('/auth/refresh');
    return response.data;
  }

  // Problem endpoints
  async getProblems() {
    const response = await this.client.get('/problems');
    return response.data;
  }

  async getProblemById(id) {
    const response = await this.client.get(`/problems/${id}`);
    return response.data;
  }

  async createProblem(problemData) {
    const response = await this.client.post('/problems', problemData);
    return response.data;
  }

  async updateProblem(id, problemData) {
    const response = await this.client.put(`/problems/${id}`, problemData);
    return response.data;
  }

  async deleteProblem(id) {
    const response = await this.client.delete(`/problems/${id}`);
    return response.data;
  }

  async updateProblemStatus(id, status) {
    const response = await this.client.patch(`/problems/${id}/status`, { status });
    return response.data;
  }

  async exportProblems(format) {
    const response = await this.client.get(`/problems/export/${format}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // User endpoints
  async getCurrentUser() {
    const response = await this.client.get('/users/me');
    return response.data;
  }

  async updateUser(userData) {
    const response = await this.client.put('/users/me', userData);
    return response.data;
  }

  async getUserStats() {
    const response = await this.client.get('/users/stats');
    return response.data;
  }

  // Admin endpoints
  async getAllUsers() {
    const response = await this.client.get('/admin/users');
    return response.data;
  }

  async getUserById(id) {
    const response = await this.client.get(`/admin/users/${id}`);
    return response.data;
  }

  async updateUserStatus(id, status) {
    const response = await this.client.patch(`/admin/users/${id}/status`, { status });
    return response.data;
  }

  async assignProblem(userId, problemId) {
    const response = await this.client.post('/admin/problems/assign', {
      userId,
      problemId,
    });
    return response.data;
  }

  async bulkAssignProblems(assignments) {
    const response = await this.client.post('/admin/problems/bulk-assign', assignments);
    return response.data;
  }

  async getSystemStats() {
    const response = await this.client.get('/admin/stats');
    return response.data;
  }

  async exportUserData(userId, format) {
    const response = await this.client.get(`/admin/export/user/${userId}/${format}`, {
      responseType: 'blob',
    });
    return response.data;
  }
}

// Create and export singleton instance
export const apiService = new ApiService();

// Export individual methods for convenience
export const {
  login,
  register,
  logout,
  refreshToken,
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
  updateProblemStatus,
  exportProblems,
  getCurrentUser,
  updateUser,
  getUserStats,
  getAllUsers,
  getUserById,
  updateUserStatus,
  assignProblem,
  bulkAssignProblems,
  getSystemStats,
  exportUserData,
} = apiService;
