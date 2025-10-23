"use client";

import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isEmailTouched, setIsEmailTouched] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (isEmailTouched) {
      if (!value.trim()) {
        setEmailError("Email is required");
      } else if (!validateEmail(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }
  };

  const handleEmailBlur = () => {
    setIsEmailFocused(false);
    setIsEmailTouched(true);

    if (!email.trim()) {
      setEmailError("Email is required");
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const isEmailValid = email.trim() && validateEmail(email) && !emailError;

  const handleGoogleSignUp = () => {
    // Handle Google sign up
    console.log("Google sign up clicked");
  };

  const handleEmailContinue = () => {
    if (isEmailValid) {
      // Handle email continue for sign up
      console.log("Email sign up continue clicked:", email);
    }
  };

  const handleAppleSignUp = () => {
    // Handle Apple sign up
    console.log("Apple sign up clicked");
  };

  const handleFacebookSignUp = () => {
    // Handle Facebook sign up
    console.log("Facebook sign up clicked");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Link href="/">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
        </button>
        {/* logo */}
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
          <div className="text-center space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Create your account
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Join thousands of travelers and unlock exclusive rewards
              <br className="hidden sm:block" />
              across synkkafrica, Hotels.com, and Vrbo.
            </p>
          </div>

          {/* Sign Up Form */}
          <div className="space-y-4">
            {/* Google Sign Up Button */}
            <button
              onClick={handleGoogleSignUp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-4 rounded-lg flex items-center justify-center space-x-3 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 text-gray-500">or</span>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={handleEmailBlur}
                  placeholder="Email"
                  className={`w-full px-4 py-3.5 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                    emailError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {emailError && (
                  <p className="mt-2 text-sm text-red-600">{emailError}</p>
                )}
              </div>

              {/* Continue Button */}
              <button
                onClick={handleEmailContinue}
                disabled={!isEmailValid}
                className={`w-full py-3.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isEmailValid
                    ? "bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white shadow-sm"
                    : "bg-gray-200 text-white cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>

            {/* Other Sign Up Options */}
            <div className="space-y-4">
              <p className="text-center text-gray-600 text-sm">
                Other ways to sign up
              </p>

              <div className="flex justify-center space-x-4">
                {/* Apple Sign Up */}
                <button
                  onClick={handleAppleSignUp}
                  className="w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                  </svg>
                </button>

                {/* Facebook Sign Up */}
                <button
                  onClick={handleFacebookSignUp}
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 pt-4">
        <div className="text-center space-y-3">
          <p className="text-xs text-gray-500 leading-relaxed">
            By creating an account, you agree to our{" "}
            <button className="text-blue-600 hover:underline">
              Terms & Conditions
            </button>{" "}
            and{" "}
            <button className="text-blue-600 hover:underline">
              Privacy Policy
            </button>
          </p>
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}