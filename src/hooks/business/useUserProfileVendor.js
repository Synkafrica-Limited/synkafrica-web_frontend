// hooks/useUserProfile.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/fetchClient';

export const useUserProfile = (token) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      // Backend exposes user profile at /api/users/profile
      const data = await api.get('/api/users/profile', { auth: true });
      // Response may be { user } or { user, business }
      if (data && data.user) setUser(data.user);
      else setUser(data);
    } catch (err) {
      const message = err.message || 'Something went wrong';
      console.error("Failed to fetch user profile:", message); // Log the error
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return { user, loading, error, refetch: fetchUserProfile };
};
