// hooks/business/useBusiness.js
import { useState, useEffect, useCallback } from 'react';

const API_URL = 'https://synkkafrica-backend-core.onrender.com/api/business';

export const useBusiness = (token) => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBusiness = useCallback(async () => {
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
      // The API returns an array, so we take the first business
      setBusiness(data[0] || null);
    } catch (err) {
      const message = err.message || 'Failed to fetch business data';
      console.error("Failed to fetch business:", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  return { business, loading, error, refetch: fetchBusiness };
};