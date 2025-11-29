import { useState, useEffect } from 'react';
import { authServiceWrapper, AuthResponse } from '../services/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authServiceWrapper.getStoredToken();
    if (token) {
      // TODO: Validate token with backend
      setIsAuthenticated(true);
      // TODO: Decode token to get user info or get from authService
    }
    setLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await authServiceWrapper.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  const logout = () => {
    authServiceWrapper.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };
};