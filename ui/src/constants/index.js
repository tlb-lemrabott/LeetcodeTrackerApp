// Application constants
export const APP_CONSTANTS = {
  NAME: 'LeetCode Progress Tracker',
  VERSION: '1.0.0',
  DESCRIPTION: 'A full-stack web application for tracking LeetCode problem-solving progress',
};

// Problem status constants
export const PROBLEM_STATUS = {
  TODO: 'TODO',
  DOING: 'DOING',
  DONE: 'DONE',
};

// Problem level constants
export const PROBLEM_LEVEL = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
};

// User roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

// API response status
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading',
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

// Form validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  MAX_PROBLEM_NAME_LENGTH: 200,
  MAX_COMMENT_LENGTH: 500,
};

// UI constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 3000,
  PAGINATION_SIZE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};

// Export status options for dropdowns
export const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: PROBLEM_STATUS.TODO, label: 'To Do' },
  { value: PROBLEM_STATUS.DOING, label: 'In Progress' },
  { value: PROBLEM_STATUS.DONE, label: 'Completed' },
];

// Level options for dropdowns
export const LEVEL_OPTIONS = [
  { value: '', label: 'All Levels' },
  { value: PROBLEM_LEVEL.EASY, label: 'Easy' },
  { value: PROBLEM_LEVEL.MEDIUM, label: 'Medium' },
  { value: PROBLEM_LEVEL.HARD, label: 'Hard' },
];

// Problem status colors for UI
export const STATUS_COLORS = {
  [PROBLEM_STATUS.TODO]: '#6c757d',
  [PROBLEM_STATUS.DOING]: '#ffc107',
  [PROBLEM_STATUS.DONE]: '#28a745',
};

// Problem level colors for UI
export const LEVEL_COLORS = {
  [PROBLEM_LEVEL.EASY]: '#28a745',
  [PROBLEM_LEVEL.MEDIUM]: '#ffc107',
  [PROBLEM_LEVEL.HARD]: '#dc3545',
};
