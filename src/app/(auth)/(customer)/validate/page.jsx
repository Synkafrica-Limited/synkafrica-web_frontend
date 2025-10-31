"use client";

import { useState } from "react";
import AuthLayout from "@/components/layout/AuthLayout";

export default function EmailValidationScreen() {
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isCodeTouched, setIsCodeTouched] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Replace with the actual email to be verified
  const email = "emmanuelmobolaji01@gmail.co";

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

  const handleContinue = () => {
    if (isCodeValid) {
      // Handle email verification
      console.log("Email verification:", { code, keepSignedIn });
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      // Handle resend code logic
      console.log("Resending code to:", email);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title="Let's confirm your email"
      subtitle={
        <>
          Enter the secure code we sent to{" "}
          <span className="font-medium text-gray-900">{email}</span>.
          <br />
          Check junk mail if it's not in your inbox.
        </>
      }
      bgGradient="bg-linear-to-br from-blue-400 via-blue-500 to-purple-800"
      cancelHref="/login"
    >
      <div className="space-y-6">
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
        <button
          onClick={handleContinue}
          disabled={!isCodeValid}
          className={`w-full py-4 px-4 rounded-xl font-medium text-white transition-all duration-200 ${
            isCodeValid
              ? "bg-linear-to-r from-primary-400 to-primary-300 hover:from-primary-500 hover:to-primary-400 shadow-md"
              : "bg-primary-200 cursor-not-allowed"
          }`}
        >
          Continue
        </button>

        {/* Resend Code */}
        <div className="text-center">
          <button
            onClick={handleResendCode}
            disabled={isResending}
            className="text-gray-900 hover:text-gray-700 text-sm font-medium hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? "Sending..." : "Resend Code"}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
