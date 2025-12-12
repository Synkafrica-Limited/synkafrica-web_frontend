"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";
import Buttons from "@/components/ui/Buttons";
import { useValidate } from "@/hooks/customer/auth/useValidate";


export default function EmailValidationScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isCodeTouched, setIsCodeTouched] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [email, setEmail] = useState("");

  // Use the validate hook
  const { validateEmail, resendVerificationCode, loading, resendLoading, error: serverError } = useValidate();

  const validateCode = (code) => {
    const codeRegex = /^\d{6}$/;
    return codeRegex.test(code);
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);

    if (isCodeTouched) {
      if (!value.trim()) {
        setCodeError("Code is required");
      } else if (!validateCode(value)) {
        setCodeError("Please enter a valid 6-digit code");
      } else {
        setCodeError("");
      }
    }
  };

  const handleCodeBlur = () => {
    setIsCodeTouched(true);

    if (!code.trim()) {
      setCodeError("Code is required");
    } else if (!validateCode(code)) {
      setCodeError("Please enter a valid 6-digit code");
    } else {
      setCodeError("");
    }
  };

  const isCodeValid = code.trim() && validateCode(code) && !codeError;

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!isCodeValid) return;

    // Store keepSignedIn preference if needed
    if (keepSignedIn) {
      try {
        localStorage.setItem("customerKeepSignedIn", "true");
      } catch (e) {
        console.error("Failed to store keep signed in preference:", e);
      }
    }

    await validateEmail(code);
    // Note: The validateEmail hook handles redirect on success
  };

  const handleResendCode = async () => {
    if (!email) {
      setCodeError("Email not found. Please try signing up again.");
      return;
    }

    await resendVerificationCode(email);
  };



  return (
    <AuthLayout
      title="Let's confirm your email"
      subtitle={
        <>
          Enter the secure code we sent to{" "}
          <span className="font-medium text-gray-900">{email || 'your email'}</span>.
          <br />
          Check junk mail if it's not in your inbox.
        </>
      }
      bgGradient="bg-linear-to-br from-blue-400 via-blue-500 to-purple-800"
      cancelHref="/customer/signin"
    >
      <form onSubmit={handleContinue} className="space-y-6">
        {/* Server Error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{serverError}</p>
          </div>
        )}

        {/* Code Input */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              onBlur={handleCodeBlur}
              placeholder="6-digit code"
              maxLength={6}
              className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors text-gray-900 placeholder-gray-400 text-center text-lg tracking-wider ${
                codeError
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-900"
              }`}
            />
            {codeError && (
              <p className="mt-2 text-sm text-red-600">{codeError}</p>
            )}
          </div>
        </div>

        {/* Keep me signed in */}
        <div className="flex items-start space-x-3">
          <div className="flex items-center h-5">
            <input
              id="keep-signed-in"
              type="checkbox"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
              className="w-4 h-4 text-primary-500 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            />
          </div>
          <div className="text-sm">
            <label
              htmlFor="keep-signed-in"
              className="font-medium text-gray-900 cursor-pointer"
            >
              Keep me signed in
            </label>
            <p className="text-gray-600 text-xs mt-1">
              This is for personal devices only. Don't check this on shared
              devices to keep your account secure.
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <Buttons
          type="submit"
          disabled={!isCodeValid || loading}
          className={`w-full py-4 px-4 rounded-xl font-medium text-white transition-all duration-200 ${
            isCodeValid && !loading
              ? "bg-linear-to-r from-primary-400 to-primary-300 hover:from-primary-500 hover:to-primary-400 shadow-md"
              : "bg-primary-200 cursor-not-allowed"
          }`}
        >
          {loading ? "Verifying..." : "Continue"}
        </Buttons>

        {/* Resend Code */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendLoading || !email}
            className="text-gray-900 hover:text-gray-700 text-sm font-medium hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendLoading ? "Sending..." : "Resend Code"}
          </button>
        </div>

        {/* Support */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Having trouble?{" "}
            <button
              type="button"
              onClick={() => router.push("/customer/support")}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Contact support
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}