"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";
import Buttons from "@/components/ui/Buttons";

export default function VendorForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [touched, setTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const onEmailChange = (e) => {
    const v = e.target.value;
    setEmail(v);
    if (touched) setEmailError(!v.trim() ? "Email is required" : !validateEmail(v) ? "Enter a valid email" : "");
  };

  const handleBlur = () => {
    setTouched(true);
    setEmailError(!email.trim() ? "Email is required" : !validateEmail(email) ? "Enter a valid email" : "");
  };

  const isValid = email && validateEmail(email) && !emailError;

  const handleSubmit = () => {
    if (!isValid) return;
    // Handle password reset request
    console.log("Password reset requested for:", email);
    setIsSubmitted(true);
    
    // In a real app, you would send the reset email here
    // then redirect or show success message after a delay
    setTimeout(() => {
      router.push("/business/login");
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent you a password reset link."
        cancelHref="/business/login"
        cancelLabel="Back to Login"
      >
        <div className="space-y-5 text-center">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-700">
              We've sent a password reset link to:
            </p>
            <p className="font-semibold text-gray-900">{email}</p>
          </div>

          <p className="text-sm text-gray-500">
            Please check your inbox and click the link to reset your password.
            The link will expire in 24 hours.
          </p>

          <div className="pt-4">
            <Link 
              href="/business/login" 
              className="text-gray-900 hover:underline font-medium"
            >
              Return to Login
            </Link>
          </div>

          <p className="text-xs text-gray-500 pt-4">
            Didn't receive the email?{" "}
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-gray-900 hover:underline font-medium"
            >
              Try again
            </button>
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Enter your email to receive a password reset link."
      cancelHref="/business/login"
      cancelLabel="Back to Login"
    >
      {/* Form */}
      <div className="space-y-5">
        {/* Email */}
        <div>
          <input
            type="email"
            value={email}
            onChange={onEmailChange}
            onBlur={handleBlur}
            placeholder="Business email"
            className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors text-gray-900 placeholder-gray-400 ${
              emailError ? "border-red-500" : "border-gray-300 focus:border-gray-900"
            }`}
          />
          {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
        </div>

        {/* Submit Button */}
        <Buttons
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full py-4 px-4 rounded-xl font-medium text-white transition-all duration-200 ${
            isValid 
              ? "bg-linear-to-r from-primary-400 to-primary-300 hover:from-primary-500 hover:to-primary-400 shadow-md" 
              : "bg-primary-200 cursor-not-allowed"
          }`}
        >
          Send Reset Link
        </Buttons>

        {/* Help text */}
        <p className="text-xs text-gray-500 text-center">
          Remember your password?{" "}
          <Link href="/business/login" className="text-gray-900 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
