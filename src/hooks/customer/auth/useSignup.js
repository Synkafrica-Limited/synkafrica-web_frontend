// hooks/customer/useSignup.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export const useSignup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * signup
   * @param {string} email
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  const signup = async (email, password) => {
    setLoading(true);
    setError("");

    email = email.trim();

    try {
      const response = await fetch(
        "https://synkkafrica-backend-core.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      let data = {};
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse response JSON", parseError);
      }

      if (!response.ok) {
        setError(data?.message || "Signup failed");
        return false;
      }

      // Store tokens with consistent naming (matching login hook)
      if (data.accessToken)
        localStorage.setItem("customerToken", data.accessToken);

      if (data.refreshToken)
        localStorage.setItem("customerRefreshToken", data.refreshToken);

      if (data.id) localStorage.setItem("customerUserId", data.id);

      // Store user data if available
      if (data.user) {
        localStorage.setItem("customerUser", JSON.stringify(data.user));
      }

      // Trigger storage event for session sync
      window.dispatchEvent(new Event("storage"));

      // Redirect user to validate screen
      router.push(`/validate?email=${encodeURIComponent(email)}`);

      return true;
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to reach server. Please try again later."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    signup,
    loading,
    error,
    setError,
  };
};