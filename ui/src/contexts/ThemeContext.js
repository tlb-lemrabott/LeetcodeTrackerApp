// Theme context for managing app theme
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks';

// Theme options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Initial state
const initialState = {
  theme: THEMES.LIGHT,
  isDark: false,
  systemTheme: 'light',
};

// Action types
const THEME_ACTIONS = {
  SET_THEME: 'SET_THEME',
  SET_SYSTEM_THEME: 'SET_SYSTEM_THEME',
  TOGGLE_THEME: 'TOGGLE_THEME',
};

// Reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.SET_THEME:
      const isDark = action.payload === THEMES.DARK || 
        (action.payload === THEMES.SYSTEM && state.systemTheme === 'dark');
      
      return {
        ...state,
        theme: action.payload,
        isDark,
      };
    
    case THEME_ACTIONS.SET_SYSTEM_THEME:
      const isDarkSystem = action.payload === 'dark';
      const isDarkTheme = state.theme === THEMES.DARK || 
        (state.theme === THEMES.SYSTEM && isDarkSystem);
      
      return {
        ...state,
        systemTheme: action.payload,
        isDark: isDarkTheme,
      };
    
    case THEME_ACTIONS.TOGGLE_THEME:
      const newTheme = state.isDark ? THEMES.LIGHT : THEMES.DARK;
      return {
        ...state,
        theme: newTheme,
        isDark: !state.isDark,
      };
    
    default:
      return state;
  }
};

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [storedTheme, setStoredTheme] = useLocalStorage('theme', THEMES.LIGHT);
  const [state, dispatch] = useReducer(themeReducer, {
    ...initialState,
    theme: storedTheme,
  });

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      dispatch({
        type: THEME_ACTIONS.SET_SYSTEM_THEME,
        payload: e.matches ? 'dark' : 'light',
      });
    };

    // Set initial system theme
    dispatch({
      type: THEME_ACTIONS.SET_SYSTEM_THEME,
      payload: mediaQuery.matches ? 'dark' : 'light',
    });

    // Listen for changes
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (state.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.isDark]);

  // Set theme function
  const setTheme = (theme) => {
    dispatch({ type: THEME_ACTIONS.SET_THEME, payload: theme });
    setStoredTheme(theme);
  };

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = state.isDark ? THEMES.LIGHT : THEMES.DARK;
    setTheme(newTheme);
  };

  // Get theme icon
  const getThemeIcon = () => {
    if (state.theme === THEMES.SYSTEM) {
      return state.isDark ? '🌙' : '☀️';
    }
    return state.isDark ? '🌙' : '☀️';
  };

  // Get theme label
  const getThemeLabel = () => {
    switch (state.theme) {
      case THEMES.LIGHT:
        return 'Light';
      case THEMES.DARK:
        return 'Dark';
      case THEMES.SYSTEM:
        return `System (${state.systemTheme})`;
      default:
        return 'Light';
    }
  };

  const value = {
    ...state,
    setTheme,
    toggleTheme,
    getThemeIcon,
    getThemeLabel,
    themes: THEMES,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeContext;
