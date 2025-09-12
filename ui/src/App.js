import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/redux-store";
import './App.css';
import { Login, Signup } from "./components/auth";
import { ProblemBoard } from "./components/problems";
import { AdminDashboard } from "./components/admin";
import { Header } from "./components/layout";
import { AuthProvider, ThemeProvider, useAuth } from "./contexts";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="app-container">
              <AppRoutes />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
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