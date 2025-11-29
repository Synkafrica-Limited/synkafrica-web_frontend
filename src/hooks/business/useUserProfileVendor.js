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
      const data = await api.get('/api/auth/profile', { auth: true });
      setUser(data);
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
