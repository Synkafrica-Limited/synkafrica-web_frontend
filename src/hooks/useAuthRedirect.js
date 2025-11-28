// hooks/useAuthRedirect.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * useAuthRedirect
 * @param {Object} options
 *  - redirectIfAuthenticated: boolean (true: go to dashboard if logged in)
 *  - redirectPath: string (where to redirect if authenticated, default: "/dashboard/business/home")
 */
export function useAuthRedirect({ redirectIfAuthenticated = true, redirectPath = "/dashboard/business/home" } = {}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("vendorToken");

    if (redirectIfAuthenticated && token) {
      router.replace(redirectPath);
    }

    setLoading(false);
  }, [router, redirectIfAuthenticated, redirectPath]);

  return { loading, isAuthenticated: !!localStorage.getItem("vendorToken") };
}
