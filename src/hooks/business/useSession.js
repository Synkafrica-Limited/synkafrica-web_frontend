// hooks/useSession.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const REFRESH_URL = "https://synkkafrica-backend-core.onrender.com/api/auth/refresh";

export function useSession() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Refresh token function
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("vendorRefreshToken");
    if (!refreshToken) return null;

    try {
      const response = await fetch(REFRESH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return null;

      const data = await response.json();

      localStorage.setItem("vendorToken", data.accessToken);
      localStorage.setItem("vendorRefreshToken", data.refreshToken);

      return data.accessToken;
    } catch (err) {
      return null;
    }
  };

  // MAIN SESSION CHECK
  useEffect(() => {
    const checkSession = async () => {
      // Ensure we are on client
      if (typeof window === "undefined") return;

      let token = localStorage.getItem("vendorToken");

      if (!token) {
        router.replace("/business/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        // If token expired → try refresh
        if (decoded.exp && decoded.exp < now) {
          const newToken = await refreshAccessToken();

          if (!newToken) {
            localStorage.removeItem("vendorToken");
            localStorage.removeItem("vendorRefreshToken");
            router.replace("/business/login");
            return;
          }

          token = newToken;
        }

        setIsLoggedIn(true);
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("vendorToken");
        localStorage.removeItem("vendorRefreshToken");
        router.replace("/business/login");
      } finally {
        setLoading(false);
      }
    };

    // Run after hydration
    setTimeout(checkSession, 50);
  }, [router]);

  return { isLoggedIn, loading };
}
