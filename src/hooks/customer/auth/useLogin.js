// hooks/customer/useLogin.js
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if already logged in on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("customerToken");
      if (token) {
        router.replace("/dashboard");
      }
    };

    checkAuthStatus();
  }, [router]);

  // login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://synkkafrica-backend-core.onrender.com/api/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Unable to log in");
      }

      const data = await response.json();

      // Save tokens with consistent naming (matching signout hook)
      localStorage.setItem("customerToken", data.accessToken);
      localStorage.setItem("customerRefreshToken", data.refreshToken);
      localStorage.setItem("customerUserId", data.id);
      
      // Also store user data if available in response
      if (data.user) {
        localStorage.setItem("customerUser", JSON.stringify(data.user));
      }

      // Trigger a storage event to notify other tabs/components
      window.dispatchEvent(new Event("storage"));

      // Redirect to customer dashboard
      router.replace("/dashboard"); 
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
    setError,
  };
}