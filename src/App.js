import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import ChatLayout from './components/ChatLayout';

function AppRoutes() {
  const { user, loading } = useAuth();



  return (
    <Routes>
      <Route path="/login" element={
        user ? <Navigate to="/chat" replace /> : <Login />
      } />
      <Route path="/register" element={
        user ? <Navigate to="/chat" replace /> : <Register />
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
      <Route path="/chat" element={
        <PrivateRoute>
          <ChatLayout />
        </PrivateRoute>
      } />
      <Route path="/" element={
        <Navigate to={user ? "/chat" : "/login"} replace />
      } />
    </Routes>
  );
}

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
