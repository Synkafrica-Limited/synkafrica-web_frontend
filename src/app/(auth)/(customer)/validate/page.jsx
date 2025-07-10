"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EmailValidationScreen() {
  const [code, setCode] = useState("");
  const [isCodeFocused, setIsCodeFocused] = useState(false);
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
    setIsCodeFocused(false);
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 bg-white">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Link href="/login">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
        </button>
        {/* Logo */}
        <Image
          src="/images/brand/synkafrica-logo-single.png"
          alt="Synk Africa Logo"
          width={80}
          height={30}
        />
        <div className="w-10"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8 max-w-md mx-auto w-full">
        <div className="w-full space-y-8">
          {/* Title and Description */}
          <div className="text-center space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Let's confirm your email
            </h1>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm sm:text-base">
                Enter the secure code we sent to{" "}
                <span className="font-medium text-gray-900">{email}</span>.
              </p>
              <p className="text-gray-600 text-sm">
                Check junk mail if it's not in your inbox.
              </p>
            </div>
          </div>

          {/* Verification Form */}
          <div className="space-y-6">
            {/* Code Input */}
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={handleCodeChange}
                  onFocus={() => setIsCodeFocused(true)}
                  onBlur={handleCodeBlur}
                  placeholder="6-digit code"
                  maxLength={6}
                  className={`w-full px-4 py-3.5 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-center text-lg tracking-wider ${
                    codeError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
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
                  className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
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
              className={`w-full py-3.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                isCodeValid
                  ? "bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white shadow-sm"
                  : "bg-gray-200 text-white cursor-not-allowed"
              }`}
            >
              Continue
            </button>

            {/* Resend Code */}
            <div className="text-center">
              <button
                onClick={handleResendCode}
                disabled={isResending}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? "Sending..." : "Resend Code"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
