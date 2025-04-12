import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadToken = useCallback(async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (e) {
      console.error('Failed to load token', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('refreshToken');
      setToken(null);
    } catch (e) {
      console.error('Error during logout', e);
    }
  }, []);

  const login = useCallback(async (newToken) => {
    try {
      await AsyncStorage.setItem('userToken', newToken);
      setToken(newToken);
    } catch (e) {
      console.error('Error saving token', e);
    }
  }, []);

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  return (
    <AuthContext.Provider value={{ token, setToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
