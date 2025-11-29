// hooks/useEmailValidation.js
import { useState } from "react";
import { useRouter } from "next/navigation";
import authService from '@/services/authService';

export function useEmailValidation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");

  // Verify email code
  const verifyEmail = async (code) => {
    setLoading(true);
    setError("");

    try {
      await authService.verifyEmail(code);
      router.push("/business/onboarding");
      return true;
    } catch (err) {
      console.error(err);
      setError(err?.message || "Invalid code, please try again");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async (email) => {
    setIsResending(true);
    try {
      await authService.resendOtp(email);
    } catch (err) {
      console.error("Failed to resend OTP", err);
      setError(err?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return {
    verifyEmail,
    resendOtp,
    loading,
    isResending,
    error,
    setError,
  };
}
