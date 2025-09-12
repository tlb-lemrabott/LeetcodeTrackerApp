// API configuration and endpoints
import config from './environment';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  
  // Problems
  PROBLEMS: {
    BASE: '/problems',
    BY_USER: (userId) => `/problems/user/${userId}`,
    BY_ID: (id) => `/problems/${id}`,
    ASSIGN: '/problems/assign',
    BULK_ASSIGN: '/problems/bulk-assign',
  },
  
  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
    STATS: '/users/stats',
  },
  
  // Admin
  ADMIN: {
    USERS: '/admin/users',
    STATS: '/admin/stats',
    EXPORT: '/admin/export',
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
