import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { Button } from '../common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faCog, faUser } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = ({ userLoggedIn, username }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">LeetCode Progress App</h1>
        </div>
        
        {userLoggedIn && (
          <div className="header-right">
            <nav className="header-nav">
              <button
                className={`nav-button ${location.pathname === '/dashboard' ? 'active' : ''}`}
                onClick={() => navigate('/dashboard')}
              >
                <FontAwesomeIcon icon={faUser} />
                Dashboard
              </button>
              {isAdmin && (
                <button
                  className={`nav-button ${location.pathname === '/admin' ? 'active' : ''}`}
                  onClick={() => navigate('/admin')}
                >
                  <FontAwesomeIcon icon={faCog} />
                  Admin
                </button>
              )}
            </nav>
            
            <div className="user-info">
              <span className="welcome-message">
                Welcome, <strong>{username}</strong>
              </span>
              <Button
                variant="outline"
                size="small"
                onClick={handleLogout}
                className="logout-button"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
