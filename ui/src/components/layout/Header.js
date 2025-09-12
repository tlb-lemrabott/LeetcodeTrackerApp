import React from 'react';
import { useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ userLoggedIn, username }) => {
  const location = useLocation();

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">LeetCode Progress App</h1>
        {userLoggedIn && location.pathname === "/dashboard" && (
          <div className="user-info">
            <span className="welcome-message">
              Welcome, <strong>{username}</strong>
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
