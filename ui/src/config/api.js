// API configuration and endpoints
import config from './environment';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/signup',
    REFRESH: '/api/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout',
  },
  
  // Problems
  PROBLEMS: {
    BASE: '/api/v1/problems',
    BY_USER: (userId) => `/api/v1/problems/user/${userId}`,
    BY_ID: (id) => `/api/v1/problems/${id}`,
    ASSIGN: '/api/v1/problems/assign',
    BULK_ASSIGN: '/api/v1/problems/bulk-assign',
    EXPORT: (format) => `/api/v1/problems/export/${format}`,
  },
  
  // Users
  USERS: {
    BASE: '/api/v1/users',
    BY_ID: (id) => `/api/v1/users/${id}`,
    STATS: '/api/v1/users/stats',
    ME: '/api/v1/users/me',
  },
  
  // Admin
  ADMIN: {
    USERS: '/api/v1/admin/dashboard/users',
    STATS: '/api/v1/admin/dashboard/stats',
    EXPORT: '/api/v1/admin/export',
    USER_BY_ID: (id) => `/api/v1/admin/users/${id}`,
    ASSIGN_PROBLEM: '/api/v1/admin/problems/assign',
    BULK_ASSIGN: '/api/v1/admin/problems/bulk-assign',
  },
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: config.API_BASE_URL,
  TIMEOUT: config.API_TIMEOUT,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = (token) => {
  return {
    ...API_CONFIG.HEADERS,
    'Authorization': `Bearer ${token}`,
  };
};
