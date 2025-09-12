// Environment configuration
// This file manages environment variables and configuration settings

const config = {
  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  API_TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  
  // Application Configuration
  APP_NAME: process.env.REACT_APP_APP_NAME || 'LeetCode Progress Tracker',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  
  // Feature Flags
  ENABLE_DEBUG_MODE: process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true',
  ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  
  // External Services
  GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GOOGLE_ANALYTICS_ID || null,
  SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN || null,
  
  // Development helpers
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

// Validation
if (!config.API_BASE_URL) {
  console.warn('API_BASE_URL is not defined. Using default localhost URL.');
}

if (config.ENABLE_DEBUG_MODE && config.isProduction) {
  console.warn('Debug mode is enabled in production. Consider disabling for security.');
}

export default config;
