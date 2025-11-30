"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import authService from '@/services/authService';

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
      const data = await authService.signupVendor(firstName, lastName, email, password, phoneNumber);
      // authService.signupVendor persists tokens and user data by default on success
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
