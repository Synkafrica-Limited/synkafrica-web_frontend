"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import Buttons from "@/components/ui/Buttons";
import authService from '@/services/authService';

export default function CustomerForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [touched, setTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async () => {
    if (!isValid || isLoading) return;
    
    setIsLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      // Show success state briefly then redirect to reset password page
      setIsSubmitted(true);
      
      // Redirect to reset password page after 1.5 seconds with email pre-filled
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
      }, 1500);
    } catch (err) {
      console.error("Forgot password failed:", err);
      setEmailError(err?.message || "Failed to request password reset. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isValid && !isLoading) {
      handleSubmit();
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout
        title="Email Sent Successfully"
        subtitle="Redirecting you to reset your password..."
        cancelHref="/login"
        cancelLabel="Back to Login"
      >
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Success Icon with Animation */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl flex items-center justify-center shadow-lg shadow-green-100/50 animate-in zoom-in duration-500">
              <div className="relative">
                <Mail className="w-12 h-12 text-green-600" />
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 animate-in zoom-in duration-700 delay-300">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Email Info Card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 space-y-3 border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Mail className="w-4 h-4 text-gray-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Verification code sent to:
                </p>
                <p className="font-semibold text-gray-900 break-all">{email}</p>
              </div>
            </div>
          </div>

          {/* Redirecting Message */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-blue-900">
                Redirecting you to enter the code...
              </p>
            </div>

            {/* Manual Action Link */}
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                Not redirecting automatically?
              </p>
              <button
                onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`)}
                className="text-sm text-gray-900 hover:text-gray-700 font-semibold hover:underline"
              >
                Click here to continue
              </button>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-xs text-center text-gray-500 pt-2">
            Check your email for the 6-digit verification code
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your email address and we'll send you a link to reset your password"
      cancelHref="/login"
      cancelLabel="Back to Login"
    >
      {/* Form */}
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Info Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              Password reset instructions
            </p>
            <p className="text-xs text-gray-600">
              Enter the email address associated with your account. We'll send you a secure link to create a new password.
            </p>
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={onEmailChange}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
              placeholder="your.email@example.com"
              className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                emailError 
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                  : "border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              }`}
            />
          </div>
          {emailError && (
            <div className="flex items-center gap-2 text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
              <div className="w-1 h-1 bg-red-600 rounded-full"></div>
              {emailError}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Buttons
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className={`w-full py-4 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
            isValid && !isLoading
              ? "bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 transform hover:-translate-y-0.5" 
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Buttons>

        {/* Back to Login Link */}
        <div className="pt-4 text-center">
          <Link 
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
