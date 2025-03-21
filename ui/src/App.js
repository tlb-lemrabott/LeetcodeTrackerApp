import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/redux-store";
import './App.css';
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProblemBoard from "./components/ProblemBoard";

function App() {
  const userLoggedIn = true;

  const Header = ({ userLoggedIn }) => {
    const location = useLocation();
    const username = "llemrabott@52";
    return (
      <header className="app-header">
        <h1>LeetCode Progress App</h1>
        {userLoggedIn && location.pathname === "/dashboard" && (
          <span className="welcome-message">Welcome user, <strong>{username}</strong></span>
        )}
      </header>
    );
  };

  return (
    <Provider store={store}>
      <Router>
        <div className="app-container">
          <Header userLoggedIn={userLoggedIn} />
        </div>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProblemBoard />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;