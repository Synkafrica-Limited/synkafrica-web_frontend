// hooks/useUserProfile.js
import { useState, useEffect, useCallback } from 'react';

const API_URL = 'https://synkkafrica-backend-core.onrender.com/api/auth/profile';

export const useUserProfile = (token) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
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
