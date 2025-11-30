// hooks/useAuthRedirect.js - Simplified for use with PageWrapper
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import authService from '@/services/authService';

/**
 * useAuthRedirect - Simple authentication redirect hook
 * @param {Object} options
 *  - redirectIfAuthenticated: boolean (true: go to dashboard if logged in)
 *  - redirectPath: string (where to redirect if authenticated, default: "/dashboard/business")
 */
export function useAuthRedirect({ redirectIfAuthenticated = true, redirectPath = "/dashboard/business" } = {}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authService.getAccessToken();

    if (redirectIfAuthenticated && token) {
      router.replace(redirectPath);
    }

    setLoading(false);
  }, [router, redirectIfAuthenticated, redirectPath]);

  return { loading, isAuthenticated: !!authService.getAccessToken() };
}
