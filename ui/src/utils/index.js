// Utility functions
import { STORAGE_KEYS, VALIDATION } from '../constants';

// Local storage utilities
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },
};

// Authentication utilities
export const auth = {
  getToken: () => storage.get(STORAGE_KEYS.AUTH_TOKEN),
  setToken: (token) => storage.set(STORAGE_KEYS.AUTH_TOKEN, token),
  removeToken: () => storage.remove(STORAGE_KEYS.AUTH_TOKEN),
  getUser: () => storage.get(STORAGE_KEYS.USER_DATA),
  setUser: (user) => storage.set(STORAGE_KEYS.USER_DATA, user),
  removeUser: () => storage.remove(STORAGE_KEYS.USER_DATA),
  isAuthenticated: () => !!auth.getToken(),
  logout: () => {
    auth.removeToken();
    auth.removeUser();
  },
};

// Form validation utilities
export const validation = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  password: (password) => {
    return password.length >= VALIDATION.MIN_PASSWORD_LENGTH && 
           password.length <= VALIDATION.MAX_PASSWORD_LENGTH;
  },
  
  username: (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return username.length >= VALIDATION.MIN_USERNAME_LENGTH && 
           username.length <= VALIDATION.MAX_USERNAME_LENGTH &&
           usernameRegex.test(username);
  },
  
  required: (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },
  
  url: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};

// String utilities
export const strings = {
  capitalize: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  
  truncate: (str, length) => {
    return str.length > length ? str.substring(0, length) + '...' : str;
  },
  
  slugify: (str) => {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
  
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },
  
  formatDateTime: (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },
};

// Array utilities
export const arrays = {
  unique: (arr) => [...new Set(arr)],
  
  groupBy: (arr, key) => {
    return arr.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },
  
  sortBy: (arr, key, direction = 'asc') => {
    return [...arr].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  },
  
  filterBy: (arr, filters) => {
    return arr.filter(item => {
      return Object.keys(filters).every(key => {
        const filterValue = filters[key];
        const itemValue = item[key];
        
        if (filterValue === '' || filterValue === null || filterValue === undefined) {
          return true;
        }
        
        if (typeof filterValue === 'string') {
          return itemValue.toLowerCase().includes(filterValue.toLowerCase());
        }
        
        return itemValue === filterValue;
      });
    });
  },
};

// Number utilities
export const numbers = {
  format: (num, decimals = 0) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  },
  
  percentage: (value, total) => {
    return total === 0 ? 0 : Math.round((value / total) * 100);
  },
  
  clamp: (value, min, max) => {
    return Math.min(Math.max(value, min), max);
  },
};

// Error handling utilities
export const errors = {
  create: (message, code = 'UNKNOWN_ERROR') => ({
    message,
    code,
    timestamp: new Date().toISOString(),
  }),
  
  handle: (error, fallbackMessage = 'An unexpected error occurred') => {
    console.error('Error:', error);
    return error?.message || fallbackMessage;
  },
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
