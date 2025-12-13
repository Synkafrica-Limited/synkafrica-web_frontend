// hooks/customer/useValidate.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export const useValidate = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * validateEmail
   * @param {string} code - 6-digit verification code
   * @returns {Promise<boolean>}
   */
  const validateEmail = async (code) => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("customerToken");
      const response = await fetch(
        "https://synkkafrica-backend-core.onrender.com/api/auth/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({ code }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Invalid code, please try again");
        return false;
      }

      // Update email verification status in stored user data
      try {
        const userData = localStorage.getItem("customerUser");
        if (userData) {
          const user = JSON.parse(userData);
          user.emailVerified = true;
          localStorage.setItem("customerUser", JSON.stringify(user));
        }
      } catch (e) {
        console.error("Failed to update user verification status:", e);
      }

      // Trigger storage event for session sync
      window.dispatchEvent(new Event("storage"));

      // Success → navigate to customer dashboard
      router.push("/detail");
      return true;
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * resendVerificationCode
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  const resendVerificationCode = async (email) => {
    setResendLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("customerToken");
      const response = await fetch(
        "https://synkkafrica-backend-core.onrender.com/api/auth/resend-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Failed to resend verification code");
        return false;
      }

      return true;
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
      return false;
    } finally {
      setResendLoading(false);
    }
  };

  return {
    validateEmail,
    resendVerificationCode,
    loading,
    resendLoading,
    error,
    setError,
  };
};