"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";

export default function VendorEmailValidationScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [touched, setTouched] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // In real flow, read from query or context
  const email = "your-business@email.com";

  const validateCode = (v) => /^\d{6}$/.test(v);

  const onChange = (e) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(v);
    if (touched) setCodeError(!v ? "Code is required" : !validateCode(v) ? "Enter a valid 6‑digit code" : "");
  };

  const onBlur = () => {
    setTouched(true);
    setCodeError(!code ? "Code is required" : !validateCode(code) ? "Enter a valid 6‑digit code" : "");
  };

  const isValid = code && validateCode(code) && !codeError;

  const handleContinue = () => {
    if (!isValid) return;
    // After successful verification, take vendors to onboarding
    router.push("/dashboard/business/onboarding");
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      // Call resend OTP API here
      await new Promise((r) => setTimeout(r, 800));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={
        <span>
          Enter the 6‑digit code we sent to{" "}
          <span className="font-medium text-gray-900">{email}</span>.
        </span>
      }
      cancelHref="/business/signup"
      cancelLabel="Back"
    >
      {/* Form */}
      <div className="space-y-6">
        {/* Code Input */}
        <div>
          <input
            type="text"
            inputMode="numeric"
            value={code}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="6-digit code"
            maxLength={6}
            className={`w-full px-5 py-4 border-2 rounded-xl text-center text-lg tracking-wider focus:outline-none focus:ring-0 transition-colors text-gray-900 placeholder-gray-400 ${
              codeError ? "border-red-500" : "border-gray-300 focus:border-gray-900"
            }`}
          />
          {codeError && <p className="mt-2 text-sm text-red-600">{codeError}</p>}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!isValid}
          className={`w-full py-4 px-4 rounded-xl font-medium text-white transition-all duration-200 ${
            isValid
              ? "bg-linear-to-r from-primary-400 to-primary-300 hover:from-primary-500 hover:to-primary-400 shadow-md"
              : "bg-primary-200 cursor-not-allowed"
          }`}
        >
          Continue
        </button>

        {/* Resend Code */}
        <div className="text-center">
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-gray-900 hover:text-gray-700 text-sm font-medium hover:underline disabled:opacity-50"
          >
            {isResending ? "Sending..." : "Resend Code"}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
