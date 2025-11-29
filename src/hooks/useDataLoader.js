"use client";

import { useState, useEffect, useCallback } from 'react';

/**
 * useDataLoader - Simple hook for consistent data loading with error handling
 * @param {Function} fetchFunction - Async function that fetches the data
 * @param {Array} dependencies - Dependencies array for useEffect
 * @param {Object} options - Additional options
 * @returns {Object} { data, loading, error, refetch }
 */
export function useDataLoader(fetchFunction, dependencies = [], options = {}) {
  const {
    initialData = null,
    onError = null,
    onSuccess = null,
    enabled = true
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const errorMessage = err?.message || 'Something went wrong';
      setError(errorMessage);
      console.error('Data loading failed:', errorMessage);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, enabled, onError, onSuccess]);

  useEffect(() => {
    loadData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: loadData
  };
}

/**
 * useAuthCheck - Simple hook for authentication checking
 * @param {boolean} requireAuth - Whether authentication is required
 * @param {string} redirectTo - Where to redirect on auth failure
 * @returns {Object} { isAuthenticated, loading, user }
 */
export function useAuthCheck(requireAuth = true, redirectTo = '/auth/login') {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Import authService dynamically to avoid circular dependencies
        const authService = (await import('@/services/authService')).default;
        const token = authService.getAccessToken();

        if (requireAuth && !token) {
          if (typeof window !== 'undefined') {
            window.location.href = redirectTo;
          }
          return;
        }

        if (!requireAuth && token) {
          // User is authenticated but shouldn't be
          if (typeof window !== 'undefined') {
            window.location.href = '/dashboard/business';
          }
          return;
        }

        setIsAuthenticated(!!token);

        // Try to get user data if authenticated
        if (token) {
          try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
          } catch (userError) {
            console.warn('Could not fetch user data:', userError);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (requireAuth && typeof window !== 'undefined') {
          window.location.href = redirectTo;
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [requireAuth, redirectTo]);

  return { isAuthenticated, loading, user };
}