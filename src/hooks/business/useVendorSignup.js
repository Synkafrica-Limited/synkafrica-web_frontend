"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export const useVendorSignup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * signupVendor
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} email
   * @param {string} password
   * @param {string} [phoneNumber] optional
   * @returns {Promise<boolean>}
   */
  const signupVendor = async (firstName, lastName, email, password, phoneNumber = "") => {
    setLoading(true);
    setError("");

    // Trim all string inputs
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    phoneNumber = phoneNumber.trim();

    try {
      const response = await fetch("https://synkkafrica-backend-core.onrender.com/api/auth/vendor/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, phoneNumber }),
      });

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

      // Store tokens
      if (data.accessToken) localStorage.setItem("vendorToken", data.accessToken);
      if (data.refreshToken) localStorage.setItem("vendorRefreshToken", data.refreshToken);

      // Store user data if available
      if (data.user) {
        localStorage.setItem("vendorData", JSON.stringify(data.user));
      }

      // Redirect to OTP page
      router.push(`/business/validate?email=${encodeURIComponent(email)}`);
      return true;
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to reach server. Please try again later.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    signupVendor,
    loading,
    error,
    setError,
  };
};
