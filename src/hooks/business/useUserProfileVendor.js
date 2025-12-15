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
      console.debug('[useUserProfile] Raw API response:', data);
      
      // Handle wrapped response format: { success, message, data: { user } }
      // or direct format: { user } or just the user object
      const responseData = data?.data || data;
      console.debug('[useUserProfile] Extracted data:', responseData);
      
      // Try to extract user from various possible structures
      if (responseData && responseData.user) {
        setUser(responseData.user);
      } else if (responseData) {
        // If responseData doesn't have a 'user' field, it might be the user object itself
        setUser(responseData);
      } else {
        console.warn('[useUserProfile] No user data found in response');
        setUser(null);
      }
    } catch (err) {
      const message = err.message || 'Something went wrong';
      console.error("[useUserProfile] Failed to fetch user profile:", message, err); // Log the error
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
