# Frontend Structure Documentation

This document outlines the structure and organization of the React frontend application.

## 📁 Directory Structure

```
src/
├── components/           # React components organized by feature
│   ├── auth/            # Authentication components
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   └── index.js
│   ├── common/          # Reusable common components
│   │   ├── Button.js
│   │   ├── Button.css
│   │   ├── Modal.js
│   │   ├── Modal.css
│   │   ├── LoadingSpinner.js
│   │   ├── LoadingSpinner.css
│   │   └── index.js
│   ├── layout/          # Layout components
│   │   ├── Header.js
│   │   ├── Header.css
│   │   └── index.js
│   ├── problems/        # Problem-related components
│   │   ├── ProblemBoard.js
│   │   ├── ProblemForm.js
│   │   ├── ProblemItem.js
│   │   ├── ProblemList.js
│   │   ├── UpdateProblemForm.js
│   │   └── index.js
│   └── admin/           # Admin-specific components (future)
├── config/              # Configuration files
│   ├── api.js          # API endpoints and configuration
│   └── environment.js  # Environment variables and config
├── constants/           # Application constants
│   └── index.js        # All constants in one place
├── contexts/            # React contexts
│   ├── AuthContext.js  # Authentication context
│   ├── ThemeContext.js # Theme management context
│   └── index.js
├── hooks/               # Custom React hooks
│   └── index.js        # All custom hooks
├── services/            # API services and external integrations
│   ├── api.js          # Main API service
│   └── index.js
├── store/               # Redux store and slices
│   ├── problemSlice.js
│   └── redux-store.js
├── styles/              # Global styles and component styles
│   ├── globals.css     # Global CSS variables and base styles
│   ├── ProblemBoard.css
│   ├── ProblemForm.css
│   └── ProblemList.css
├── utils/               # Utility functions
│   └── index.js        # All utility functions
├── assets/              # Static assets (images, icons, etc.)
├── types/               # TypeScript type definitions (if using TS)
└── App.js              # Main App component
```

## 🎯 Design Principles

### 1. Feature-Based Organization
Components are organized by feature rather than by type. This makes it easier to:
- Find related components
- Understand feature boundaries
- Maintain and scale the application

### 2. Separation of Concerns
- **Components**: UI logic and presentation
- **Services**: API calls and external integrations
- **Utils**: Pure utility functions
- **Hooks**: Reusable stateful logic
- **Contexts**: Global state management
- **Constants**: Application-wide constants

### 3. Reusability
- Common components are placed in the `common/` directory
- Custom hooks provide reusable stateful logic
- Utility functions are pure and reusable
- Constants are centralized and easily accessible

### 4. Scalability
- Each feature has its own directory
- Index files provide clean imports
- Configuration is centralized
- Styles are organized and maintainable

## 🔧 Key Features

### Configuration Management
- Environment variables are managed through `config/environment.js`
- API endpoints are centralized in `config/api.js`
- Sensitive data is handled through environment variables

### State Management
- Redux for global state management
- React Context for theme and authentication
- Custom hooks for component-level state

### Styling
- CSS variables for consistent theming
- Component-scoped styles
- Global styles for base elements
- Responsive design utilities

### API Integration
- Centralized API service with axios
- Request/response interceptors
- Error handling
- Authentication token management

### Custom Hooks
- `useApi`: For API calls with loading states
- `useLocalStorage`: For persistent local storage
- `useDebounce`: For debounced values
- `useForm`: For form handling with validation

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env.local`
   - Update the values as needed

3. **Start development server**:
   ```bash
   npm start
   ```

## 📝 Best Practices

### Component Development
- Use functional components with hooks
- Keep components small and focused
- Use PropTypes or TypeScript for type checking
- Follow the single responsibility principle

### Styling
- Use CSS variables for consistent theming
- Follow BEM methodology for CSS classes
- Use responsive design principles
- Keep styles close to components when possible

### State Management
- Use Redux for global state
- Use local state for component-specific data
- Use Context for theme and authentication
- Keep state as minimal as possible

### API Integration
- Use the centralized API service
- Handle loading and error states
- Implement proper error handling
- Use TypeScript for API responses when possible

## 🔄 Future Enhancements

- Add TypeScript support
- Implement unit and integration tests
- Add Storybook for component documentation
- Implement PWA features
- Add internationalization (i18n)
- Implement advanced error boundaries
- Add performance monitoring
