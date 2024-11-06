import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const [userResponse, profileStatusResponse] = await Promise.all([
        apiClient.get('/user'),
        apiClient.get('/user/profile-status')
      ]);

      const userData = userResponse.data;
      const profileStatus = profileStatusResponse.data;

      const updatedUser = {
        ...userData,
        profileComplete: profileStatus.is_complete
      };

      setUser(updatedUser);

      // Handle automatic navigation based on profile completion
      if (!profileStatus.is_complete && window.location.pathname !== '/profile') {
        navigate('/profile');
      } else if (profileStatus.is_complete && window.location.pathname === '/profile') {
        navigate('/chat');
      }
    } catch (error) {
      console.error('Fetching user failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/token`,
        new URLSearchParams({
          'username': username,
          'password': password,
        }), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      await fetchUser(); // This will handle navigation based on profile completion
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async ({ username, email, password, phone_number, firstname, lastname }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        username,
        email,
        password,
        phone_number,
        firstname,
        lastname
      });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      await fetchUser();
      navigate('/profile'); // Always navigate to profile after registration
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const updateProfile = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      await fetchUser(); // This will handle navigation to chat if profile is complete
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    register,
    login,
    updateProfile,
    logout,
    fetchUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
