import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login, Signup } from "./components/auth";
import { ProblemBoard } from "./components/problems";
import { AdminDashboard } from "./components/admin";
import { Header } from "./components/layout";
import { useAuth } from "./contexts";
import './App.css';

function App() {
  return (
    <div className="app-container">
      <AppRoutes />
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isAuthenticated && <Header userLoggedIn={isAuthenticated} username={user?.username} />}
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <Login />
          } 
        />
        <Route 
          path="/signup" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <Signup />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
              <ProblemBoard /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/admin" 
          element={
            isAuthenticated && user?.role === 'ADMIN' ? 
              <AdminDashboard /> : 
              <Navigate to="/dashboard" replace />
          } 
        />
      </Routes>
    </>
  );
}

export default App;