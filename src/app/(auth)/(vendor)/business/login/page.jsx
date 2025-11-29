"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";
import Buttons from "@/components/ui/Buttons";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import authService from '@/services/authService';

export default function VendorSignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const { redirectLoading } = useAuthRedirect();

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // Redirect logged-in users or handle Google redirect token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");

    if (accessToken) {
      // OAuth redirect: persist tokens according to the remember-me flag set before redirect
      const rememberFromLocal = localStorage.getItem("oauthRemember");
      const rememberFromSession = sessionStorage.getItem("oauthRemember");

      // If the user clicked with remember checked we stored a marker in localStorage.
      // If they clicked without remember we stored a marker in sessionStorage.
      const finalRemember = !!rememberFromLocal;

      authService.setTokens({ accessToken, refreshToken }, finalRemember);

      // cleanup temporary markers
      try {
        localStorage.removeItem("oauthRemember");
      } catch {}
      try {
        sessionStorage.removeItem("oauthRemember");
      } catch {}
      router.replace("/dashboard/business/home");
    } else {
      const token = authService.getAccessToken();
      if (token) router.replace("/dashboard/business/home");
    }
  }, [router]);

  const onEmailChange = (e) => {
    const v = e.target.value;
    setEmail(v);
    if (touched.email)
      setEmailError(
        !v.trim()
          ? "Email is required"
          : !validateEmail(v)
          ? "Enter a valid email"
          : ""
      );
  };

  const onPasswordChange = (e) => {
    const v = e.target.value;
    setPassword(v);
    if (touched.password) setPasswordError(!v ? "Password is required" : "");
  };

  const handleBlur = (field) => {
    setTouched((s) => ({ ...s, [field]: true }));
    if (field === "email")
      setEmailError(
        !email.trim()
          ? "Email is required"
          : !validateEmail(email)
          ? "Enter a valid email"
          : ""
      );
    if (field === "password")
      setPasswordError(!password ? "Password is required" : "");
  };

  const isValid =
    email && validateEmail(email) && password && !emailError && !passwordError;

  const handleSignIn = async () => {
    if (!isValid) return;
    setLoading(true);
    setServerError("");

    try {
      const data = await authService.signIn(email.trim(), password, rememberMe);
      if (data?.accessToken) {
        // signIn already persisted tokens according to rememberMe
        router.push("/dashboard/business/home");
      } else {
        setServerError("Unexpected server response. No token received.");
      }
    } catch (err) {
      console.error("Sign in failed:", err);
      setServerError(err?.message || "Unable to reach server.");
    } finally {
      setLoading(false);
    }
  };

  // Redirect to backend Google login
  const handleGoogleSignIn = () => {
    // Persist the user's remember choice across the external OAuth redirect.
    try {
      if (rememberMe) {
        localStorage.setItem("oauthRemember", "true");
      } else {
        sessionStorage.setItem("oauthRemember", "true");
      }
    } catch (e) {
      // ignore storage errors
    }

    window.location.href =
      "https://synkkafrica-backend-core.onrender.com/api/auth/google/login";
  };

  const handleAppleSignIn = () => console.log("Apple sign in clicked");

  if (redirectLoading) return <p>Loading...</p>;

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back! Please enter your details."
    >
      <div className="space-y-5">
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        {/* Email */}
        <div>
          <input
            type="email"
            value={email}
            onChange={onEmailChange}
            onBlur={() => handleBlur("email")}
            placeholder="Email"
            className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors text-gray-900 placeholder-gray-400 ${
              emailError
                ? "border-red-500"
                : "border-gray-300 focus:border-gray-900"
            }`}
          />
          {emailError && (
            <p className="mt-2 text-sm text-red-600">{emailError}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={onPasswordChange}
              onBlur={() => handleBlur("password")}
              placeholder="Password"
              className={`w-full px-5 py-4 pr-12 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors text-gray-900 placeholder-gray-400 ${
                passwordError
                  ? "border-red-500"
                  : "border-gray-300 focus:border-gray-900"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-4 my-auto h-8 w-8 grid place-items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {passwordError && (
            <p className="mt-2 text-sm text-red-600">{passwordError}</p>
          )}
        </div>

        <Buttons
          onClick={handleSignIn}
          disabled={!isValid || loading}
          className={`w-full py-4 px-4 rounded-xl font-medium text-white transition-all duration-200 ${
            isValid
              ? "bg-linear-to-r from-primary-400 to-primary-300 hover:from-primary-500 hover:to-primary-400 shadow-md"
              : "bg-primary-200 cursor-not-allowed"
          }`}
        >
          {loading ? "Signing in..." : "Log in"}
        </Buttons>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-5 h-5 border-2 border-primary-400 rounded cursor-pointer accent-primary-400"
            />
            <span className="text-gray-700 group-hover:text-gray-900">
              Remember me
            </span>
          </label>
          <Link
            href="/business/forgot-password"
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <span className="text-lg">🔒</span> Forgot password?
          </Link>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Social Sign In */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
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
            <span>Sign in with Google</span>
          </button>
          <button
            onClick={handleAppleSignIn}
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-4 px-4 rounded-xl flex items-center justify-center space-x-3 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
            </svg>
            <span>Sign in with Apple</span>
          </button>
        </div>

        <p className="text-sm text-gray-600 text-center pt-4">
          Don't have a business account?{" "}
          <Link
            href="/business/signup"
            className="text-gray-900 hover:underline font-medium"
          >
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
