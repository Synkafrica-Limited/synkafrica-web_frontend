// hooks/business/useBusiness.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/fetchClient';

export const useBusiness = (token) => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBusiness = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the correct endpoint: /api/business/
      const data = await api.get('/api/business/', { auth: true });

      // Backend returns single object or array
      let businessData = data;
      if (Array.isArray(data)) {
        businessData = data.length > 0 ? data[0] : null;
      }
      
      setBusiness(businessData || null);
    } catch (err) {
      let errorMessage = 'Failed to fetch business data';

      // Provide more specific error messages based on status
      if (err.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (err.status === 403) {
        errorMessage = 'You do not have permission to access business data.';
      } else if (err.status === 404) {
        // 404 is expected for users who haven't set up their business yet
        errorMessage = 'Business profile not found. Please complete your business setup.';
        if (process.env.NODE_ENV !== 'development') {
          // In production, don't log 404s as they're expected
          console.log('Business profile not found - user needs to set up business first');
        }
      } else if (err.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      console.error("Business fetch error:", {
        message: errorMessage,
        status: err.status,
        originalError: err.message
      });

      setError({
        message: errorMessage,
        status: err.status,
        retryable: err.status >= 500 || err.status === 401
      });

      // Don't set business to null on error - keep previous data if available
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  return { business, loading, error, refetch: fetchBusiness };
};