"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";

export default function SignUpScreen() {
  const router = useRouter();
  const [step, setStep] = useState("email"); // "email" or "password"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [isConfirmPasswordTouched, setIsConfirmPasswordTouched] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 characters, one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
    return passwordRegex.test(password);
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

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (isPasswordTouched) {
      if (!value) {
        setPasswordError("Password is required");
      } else if (!validatePassword(value)) {
        setPasswordError("Password must be at least 8 characters with a letter and number");
      } else {
        setPasswordError("");
      }
    }

    // Revalidate confirm password if it's been touched
    if (isConfirmPasswordTouched && confirmPassword) {
      if (value !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (isConfirmPasswordTouched) {
      if (!value) {
        setConfirmPasswordError("Please confirm your password");
      } else if (value !== password) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const handleEmailBlur = () => {
    setIsEmailTouched(true);

    if (!email.trim()) {
      setEmailError("Email is required");
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordBlur = () => {
    setIsPasswordTouched(true);

    if (!password) {
      setPasswordError("Password is required");
    } else if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters with a letter and number");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordBlur = () => {
    setIsConfirmPasswordTouched(true);

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const isEmailValid = email.trim() && validateEmail(email) && !emailError;
  const isPasswordValid = 
    password && 
    confirmPassword && 
    validatePassword(password) && 
    password === confirmPassword && 
    !passwordError && 
    !confirmPasswordError;

  const handleGoogleSignUp = () => {
    // Handle Google sign up
    console.log("Google sign up clicked");
  };

  const handleEmailContinue = () => {
    if (isEmailValid) {
      setStep("password");
    }
  };

  const handlePasswordContinue = () => {
    if (isPasswordValid) {
      // Handle account creation
      console.log("Account created:", { email, password });
      router.push("/validate");
    }
  };

  const handleAppleSignUp = () => {
    // Handle Apple sign up
    console.log("Apple sign up clicked");
  };

  const handleBackToEmail = () => {
    setStep("email");
  };

  return (
    <AuthLayout
      title={step === "email" ? "Create your account" : "Create a password"}
      subtitle={
        step === "email"
          ? "Experience Africa in a unique way using Synkkafrica, getting you closer to the culture, people, and places you love."
          : "Choose a strong password to secure your account."
      }
      bgGradient="bg-linear-to-br from-purple-400 via-pink-500 to-red-500"
      cancelHref={step === "password" ? undefined : "/"}
      showCancel={step === "email"}
    >
      {/* Form */}
      <div className="space-y-5">
        {step === "email" ? (
          <>
            {/* Google Sign Up Button */}
            <button
              onClick={handleGoogleSignUp}
              className="w-full bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-medium py-4 px-4 rounded-xl flex items-center justify-center space-x-3 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>

            {/* Apple Sign Up */}
            <button
              onClick={handleAppleSignUp}
              className="w-full bg-black hover:bg-gray-800 text-white font-medium py-4 px-4 rounded-xl flex items-center justify-center space-x-3 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              <span>Sign up with Apple</span>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="Email"
                className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors text-gray-900 placeholder-gray-400 ${
                  emailError ? "border-red-500" : "border-gray-300 focus:border-gray-900"
                }`}
              />
              {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
            </div>

            {/* Continue Button */}
            <button
              onClick={handleEmailContinue}
              disabled={!isEmailValid}
              className={`w-full py-4 px-4 rounded-xl font-medium text-white transition-all duration-200 ${
                isEmailValid
                  ? "bg-linear-to-r from-primary-400 to-primary-300 hover:from-primary-500 hover:to-primary-400 shadow-md"
                  : "bg-primary-200 cursor-not-allowed"
              }`}
            >
              Continue
            </button>

            {/* Footer */}
            <div className="text-center space-y-3 pt-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-gray-900 hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="text-gray-900 hover:underline">
                  Privacy Policy
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-gray-900 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Back to Email Button */}
            <button
              onClick={handleBackToEmail}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Change email
            </button>

            {/* Show Email */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600">Creating account for:</p>
              <p className="font-medium text-gray-900">{email}</p>
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  placeholder="Password"
                  className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors text-gray-900 placeholder-gray-400 ${
                    passwordError ? "border-red-500" : "border-gray-300 focus:border-gray-900"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
            </div>

            {/* Confirm Password Input */}
            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  onBlur={handleConfirmPasswordBlur}
                  placeholder="Confirm password"
                  className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors text-gray-900 placeholder-gray-400 ${
                    confirmPasswordError ? "border-red-500" : "border-gray-300 focus:border-gray-900"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPasswordError && <p className="mt-2 text-sm text-red-600">{confirmPasswordError}</p>}
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-xs text-gray-700 font-medium mb-2">Password must contain:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• At least 8 characters</li>
                <li>• At least one letter</li>
                <li>• At least one number</li>
              </ul>
            </div>

            {/* Create Account Button */}
            <button
              onClick={handlePasswordContinue}
              disabled={!isPasswordValid}
              className={`w-full py-4 px-4 rounded-xl font-medium text-white transition-all duration-200 ${
                isPasswordValid
                  ? "bg-linear-to-r from-primary-400 to-primary-300 hover:from-primary-500 hover:to-primary-400 shadow-md"
                  : "bg-primary-200 cursor-not-allowed"
              }`}
            >
              Create Account
            </button>
          </>
        )}
      </div>
    </AuthLayout>
  );
}