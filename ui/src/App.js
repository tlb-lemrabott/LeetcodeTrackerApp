import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/redux-store";
import './App.css';
import { Login, Signup } from "./components/auth";
import { ProblemBoard } from "./components/problems";
import { Header } from "./components/layout";

function App() {
  const userLoggedIn = true;
  const username = "llemrabott@52";

  return (
    <Provider store={store}>
      <Router>
        <div className="app-container">
          <Header userLoggedIn={userLoggedIn} username={username} />
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