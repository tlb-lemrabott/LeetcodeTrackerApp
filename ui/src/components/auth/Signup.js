import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { useForm } from '../../hooks';
import { Button, LoadingSpinner } from '../common';
import { validation } from '../../utils';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
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
      email: '',
      password: '',
      confirmPassword: '',
      role: 'USER',
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
      email: {
        required: 'Email is required',
        custom: (value) => {
          if (!validation.email(value)) {
            return 'Please enter a valid email address';
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
      confirmPassword: {
        required: 'Please confirm your password',
        custom: (value, allValues) => {
          if (value !== allValues.password) {
            return 'Passwords do not match';
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
      
      // Remove confirmPassword from the data sent to API
      const { confirmPassword, ...userData } = formData;
      
      await register(userData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
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
          <h1>Create Account</h1>
          <p>Sign up for LeetCode Progress Tracker</p>
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
              placeholder="Choose a username"
              disabled={isSubmitting}
            />
            {errors.username && touched.username && (
              <span className="field-error">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.email && touched.email ? 'error' : ''}
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
            {errors.email && touched.email && (
              <span className="field-error">{errors.email}</span>
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
              placeholder="Create a password"
              disabled={isSubmitting}
            />
            {errors.password && touched.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.confirmPassword && touched.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={values.role}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={!isValid || isSubmitting}
            className="auth-button"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;