import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { useForm } from '../../hooks';
import { Button, LoadingSpinner } from '../common';
import { validation } from '../../utils';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
  } = useForm(
    {
      username: '',
      password: '',
    },
    {
      username: {
        required: 'Username is required',
        custom: (value) => {
          if (!validation.username(value)) {
            return 'Username must be 3-50 characters and contain only letters, numbers, and underscores';
          }
          return null;
        },
      },
      password: {
        required: 'Password is required',
        custom: (value) => {
          if (!validation.password(value)) {
            return 'Password must be at least 8 characters long';
          }
          return null;
        },
      },
    }
  );

  const onSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      clearError();
      await login(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your LeetCode Progress Tracker account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.username && touched.username ? 'error' : ''}
              placeholder="Enter your username"
              disabled={isSubmitting}
            />
            {errors.username && touched.username && (
              <span className="field-error">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.password && touched.password ? 'error' : ''}
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
            {errors.password && touched.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={!isValid || isSubmitting}
            className="auth-button"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
