import React, { createContext, useState, useEffect } from 'react';
import { userService } from '../api/userService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch user profile when token exists
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoadingUser(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await userService.getCurrentUser();
      setUser(response.data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      // If token is invalid, clear it
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
    } finally {
      setLoadingUser(false);
    }
  };

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      login,
      logout,
      loadingUser,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
};