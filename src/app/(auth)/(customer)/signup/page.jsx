"use client";

import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const API_BASE_URL = "https://synkkafrica-backend-core.onrender.com/api";

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setApiError(""); // Clear API errors when user types

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

  const handleEmailSignUp = async () => {
    if (!isEmailValid) return;

    setIsLoading(true);
    setApiError("");

    try {
      console.log("Attempting to sign up with email:", email);
      
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        // Handle HTTP errors
        let errorMessage = "Signup failed. Please try again.";
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Signup successful:", data);
      
      // Store token if provided
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        console.log("Token stored successfully");
      }

      // Store user data if provided
      if (data.user) {
        localStorage.setItem("userData", JSON.stringify(data.user));
        console.log("User data stored successfully");
      }

      // Redirect based on response
      if (data.requiresProfileCompletion) {
        router.push("/complete-profile");
      } else {
        router.push("/dashboard");
      }

    } catch (error) {
      console.error("Signup error details:", error);
      
      // More specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setApiError("Network error: Unable to connect to server. Please check your internet connection and try again.");
      } else if (error.message.includes('CORS')) {
        setApiError("CORS error: Please contact support.");
      } else {
        setApiError(error.message || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setIsLoading(true);
    try {
      console.log("Redirecting to Google OAuth...");
      // Redirect to Google OAuth endpoint
      window.location.href = `${API_BASE_URL}/auth/google/login`;
    } catch (error) {
      console.error("Google signup error:", error);
      setApiError("Failed to initiate Google signup. Please try again.");
      setIsLoading(false);
    }
  };

  const handleAppleSignUp = () => {
    setApiError("Apple signup is currently unavailable. Please use Google or email signup.");
  };

  const handleFacebookSignUp = () => {
    setApiError("Facebook signup is currently unavailable. Please use Google or email signup.");
  };

  // Test API endpoint connectivity
  const testApiConnection = async () => {
    try {
      console.log("Testing API connection...");
      const testResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'OPTIONS', // Use OPTIONS to test CORS without triggering actual signup
      });
      console.log("API connection test result:", testResponse.status, testResponse.statusText);
    } catch (testError) {
      console.error("API connection test failed:", testError);
    }
  };

  // Uncomment the line below to test API connection on component mount
  // useEffect(() => { testApiConnection(); }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6">
        <button 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
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
              across synkafrica, Hotels.com, and Vrbo.
            </p>
          </div>

          {/* API Error Message */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm text-center">{apiError}</p>
              <button
                onClick={() => setApiError("")}
                className="text-red-600 hover:text-red-800 text-xs mt-2"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Sign Up Form */}
          <div className="space-y-4">
            {/* Google Sign Up Button */}
            <button
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 font-medium py-3.5 px-4 rounded-lg flex items-center justify-center space-x-3 transition-colors shadow-sm disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
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
                </>
              )}
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
                  disabled={isLoading}
                  className={`w-full px-4 py-3.5 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
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
                onClick={handleEmailSignUp}
                disabled={!isEmailValid || isLoading}
                className={`w-full py-3.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                  isEmailValid && !isLoading
                    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
                    : "bg-orange-300 text-white cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  "Continue with Email"
                )}
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
                  disabled={isLoading}
                  className="w-12 h-12 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-colors disabled:cursor-not-allowed"
                  title="Apple Sign Up (Coming Soon)"
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
                  disabled={isLoading}
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-full flex items-center justify-center transition-colors disabled:cursor-not-allowed"
                  title="Facebook Sign Up (Coming Soon)"
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
            <Link
              href="/signin"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}