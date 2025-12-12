// src/hooks/customer/useSignOut.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useSignOut() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const signOut = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get tokens from localStorage first
      const accessToken = localStorage.getItem('customerToken');
      const refreshToken = localStorage.getItem('customerRefreshToken');

      // Only attempt API call if we have a valid access token
      if (accessToken) {
        try {
          const response = await fetch('https://synkkafrica-backend-core.onrender.com/api/auth/signout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              refreshToken: refreshToken || ''
            }),
          });

          // We don't throw error for 401/403 - token might be expired, which is fine for logout
          if (!response.ok && response.status !== 401 && response.status !== 403) {
            console.warn(`Signout API call failed with status: ${response.status}`);
            // Don't throw error - we'll still clear local storage
          } else if (response.ok) {
            console.log('Signout successful on server');
          }
        } catch (apiError) {
          console.warn('Signout API call failed, but continuing with client-side cleanup:', apiError);
          // Don't throw error - network issues shouldn't prevent logout
        }
      }

    } catch (err) {
      console.error('Unexpected error during signout:', err);
      setError(err.message);
    } finally {
      // Always clear local storage and redirect, regardless of API response
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerRefreshToken');
      localStorage.removeItem('customerUserId');
      localStorage.removeItem('customerUser');
      localStorage.removeItem('customerProfile');
      localStorage.removeItem('customerKeepSignedIn');
      
      // Also clear session storage
      sessionStorage.removeItem('customerToken');
      sessionStorage.removeItem('customerRefreshToken');
      
      // Trigger storage event to notify other tabs/components
      window.dispatchEvent(new Event('storage'));

      // Redirect to login page
      router.push('/login');
      setLoading(false);
    }
  };

  return { signOut, loading, error };
}