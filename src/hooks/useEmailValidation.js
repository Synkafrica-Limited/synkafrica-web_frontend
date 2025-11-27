// hooks/useEmailValidation.js
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      const token = localStorage.getItem("vendorToken");
      const res = await fetch(
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

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Invalid code, please try again");
        return false;
      }

      // Success → navigate to onboarding
      router.push("/business/onboarding");
      return true;
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async (email) => {
    setIsResending(true);
    try {
      const token = localStorage.getItem("vendorToken");
      const res = await fetch(
        "https://synkkafrica-backend-core.onrender.com/api/auth/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) {
        console.error("Failed to resend OTP");
      }
    } catch (err) {
      console.error(err);
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
