// hooks/customer/useSession.js
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const REFRESH_URL = "https://synkkafrica-backend-core.onrender.com/api/auth/refresh";

export function useSession() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Refresh token function
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("customerRefreshToken");
    if (!refreshToken) return null;

    try {
      const response = await fetch(REFRESH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        console.error("Token refresh failed with status:", response.status);
        return null;
      }

      const data = await response.json();

      if (!data.accessToken || !data.refreshToken) {
        console.error("Invalid token response from server");
        return null;
      }

      localStorage.setItem("customerToken", data.accessToken);
      localStorage.setItem("customerRefreshToken", data.refreshToken);

      return data.accessToken;
    } catch (err) {
      console.error("Token refresh failed:", err);
      return null;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customerRefreshToken");
    localStorage.removeItem("customerUserId");
    localStorage.removeItem("customerUser");
    setIsLoggedIn(false);
    setUser(null);
    
    // Only redirect if not already on login page
    if (!pathname.includes("/login")) {
      router.replace("/login");
    }
  }, [router, pathname]);

  // Get current user data from token
  const getCurrentUser = useCallback(() => {
    const token = localStorage.getItem("customerToken");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      
      // Try to get user data from localStorage first
      try {
        const storedUser = localStorage.getItem("customerUser");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          return {
            id: localStorage.getItem("customerUserId"),
            email: decoded.email,
            exp: decoded.exp,
            ...userData,
            ...decoded
          };
        }
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
      }

      // Fallback to token data only
      return {
        id: localStorage.getItem("customerUserId"),
        email: decoded.email,
        exp: decoded.exp,
        ...decoded
      };
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  }, []);

  // Check if token is valid
  const isTokenValid = useCallback((token) => {
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      
      // Add a 5-minute buffer to refresh token before it actually expires
      const bufferTime = 5 * 60; // 5 minutes in seconds
      return decoded.exp && (decoded.exp - bufferTime) > now;
    } catch (err) {
      return false;
    }
  }, []);

  // Check if token exists and is valid (without auto-refresh)
  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem("customerToken");
    return isTokenValid(token);
  }, [isTokenValid]);

  // MAIN SESSION CHECK
  useEffect(() => {
    const checkSession = async () => {
      // Ensure we are on client
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      let token = localStorage.getItem("customerToken");

      // No token found
      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      try {
        // Check if token is expired or about to expire
        if (!isTokenValid(token)) {
          // Try to refresh token
          const newToken = await refreshAccessToken();

          if (!newToken) {
            // Refresh failed, logout user
            logout();
            return;
          }

          token = newToken;
        }

        // Token is valid, set user as logged in
        const userData = getCurrentUser();
        setUser(userData);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Session check failed:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router, refreshAccessToken, logout, getCurrentUser, isTokenValid]);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!isLoggedIn || !user?.exp) return;

    const tokenExpiryTime = user.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const timeUntilExpiry = tokenExpiryTime - currentTime;
    
    // Refresh token when it's 10 minutes from expiring
    const refreshTime = Math.max(timeUntilExpiry - (10 * 60 * 1000), 5000); // Minimum 5 seconds

    if (refreshTime > 0) {
      const refreshTimer = setTimeout(async () => {
        await refreshAccessToken();
        // Update user data after refresh
        const userData = getCurrentUser();
        setUser(userData);
      }, refreshTime);

      return () => clearTimeout(refreshTimer);
    }
  }, [isLoggedIn, user, refreshAccessToken, getCurrentUser]);

  // Listen for storage events (for multi-tab sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "customerToken" || e.key === "customerRefreshToken") {
        window.location.reload(); // Simple way to sync across tabs
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return { 
    isLoggedIn, 
    loading, 
    user, 
    logout, 
    refreshAccessToken,
    getCurrentUser,
    checkAuthStatus
  };
}