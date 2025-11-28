"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";
import Buttons from "@/components/ui/Buttons";
import { useVendorSignup } from "@/hooks/business/useVendorSignup";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function VendorSignUpScreen() {
  const router = useRouter();
  const {
    signupVendor,
    loading,
    error: serverError,
    setError,
  } = useVendorSignup();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const { redirectLoading } = useAuthRedirect();

  const [touched, setTouched] = useState({
    firstname: false,
    lastname: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("vendorToken");
    if (token) router.replace("/dashboard/business/home");
  }, [router]);

  // Handlers
  const handleBlur = (field) => {
    setTouched((t) => ({ ...t, [field]: true }));
    validateField(field);
  };

  const validateField = (field) => {
    if (field === "firstname") {
      setFirstnameError(!firstname.trim() ? "First name is required" : "");
    }
    if (field === "lastname") {
      setLastnameError(!lastname.trim() ? "Last name is required" : "");
    }
    if (field === "email") {
      setEmailError(
        !email.trim()
          ? "Email is required"
          : !validateEmail(email)
          ? "Enter a valid email"
          : ""
      );
    }
    if (field === "password") {
      setPasswordError(!password.trim() ? "Password is required" : "");
    }
    if (field === "confirmPassword") {
      setConfirmPasswordError(
        !confirmPassword.trim()
          ? "Confirm your password"
          : password !== confirmPassword
          ? "Passwords do not match"
          : ""
      );
    }
  };

  const isValid =
    firstname &&
    lastname &&
    email &&
    validateEmail(email) &&
    password &&
    confirmPassword &&
    !firstnameError &&
    !lastnameError &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError;

  // Signup function using hook
  const handleSignUp = async () => {
    if (!isValid) return;

    // clear previous error if any
    setError("");

    await signupVendor(firstname, lastname, email, password);
  };

  // Social login
  const handleGoogleSignIn = () => {
    window.location.href =
      "https://synkkafrica-backend-core.onrender.com/api/auth/google/login";
  };

  const handleAppleSignIn = () => console.log("Apple sign in");

  if (redirectLoading) return <p>Loading...</p>;

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Begin your business journey with us"
    >
      <div className="space-y-5">
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        {/* First Name */}
        <div>
          <input
            type="text"
            value={firstname}
            onChange={(e) => {
              setFirstname(e.target.value);
              if (touched.firstname) validateField("firstname");
            }}
            onBlur={() => handleBlur("firstname")}
            placeholder="First Name"
            className={`w-full px-5 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 ${
              firstnameError
                ? "border-red-500"
                : "border-gray-300 focus:border-gray-900"
            }`}
          />
          {firstnameError && (
            <p className="mt-2 text-sm text-red-600">{firstnameError}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <input
            type="text"
            value={lastname}
            onChange={(e) => {
              setLastname(e.target.value);
              if (touched.lastname) validateField("lastname");
            }}
            onBlur={() => handleBlur("lastname")}
            placeholder="Last Name"
            className={`w-full px-5 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 ${
              lastnameError
                ? "border-red-500"
                : "border-gray-300 focus:border-gray-900"
            }`}
          />
          {lastnameError && (
            <p className="mt-2 text-sm text-red-600">{lastnameError}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (touched.email) validateField("email");
            }}
            onBlur={() => handleBlur("email")}
            placeholder="Email"
            className={`w-full px-5 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 ${
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
              onChange={(e) => {
                setPassword(e.target.value);
                if (touched.password) validateField("password");
              }}
              onBlur={() => handleBlur("password")}
              placeholder="Password"
              className={`w-full px-5 py-4 pr-12 border-2 rounded-xl text-gray-900 placeholder-gray-400 ${
                passwordError
                  ? "border-red-500"
                  : "border-gray-300 focus:border-gray-900"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-4 grid place-items-center text-gray-400 hover:text-gray-600"
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

        {/* Confirm Password */}
        <div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (touched.confirmPassword) validateField("confirmPassword");
              }}
              onBlur={() => handleBlur("confirmPassword")}
              placeholder="Confirm Password"
              className={`w-full px-5 py-4 pr-12 border-2 rounded-xl text-gray-900 placeholder-gray-400 ${
                confirmPasswordError
                  ? "border-red-500"
                  : "border-gray-300 focus:border-gray-900"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              className="absolute inset-y-0 right-4 grid place-items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {confirmPasswordError && (
            <p className="mt-2 text-sm text-red-600">{confirmPasswordError}</p>
          )}
        </div>

        {/* Submit */}
        <Buttons
          onClick={handleSignUp}
          disabled={!isValid || loading}
          className={`w-full py-4 rounded-xl font-medium text-white transition-all ${
            isValid
              ? "bg-linear-to-r from-primary-400 to-primary-300 hover:from-primary-500 hover:to-primary-400 shadow-md"
              : "bg-primary-200 cursor-not-allowed"
          }`}
        >
          {loading ? "Creating account..." : "Create account"}
        </Buttons>

        {/* Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Social Auth */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-medium py-4 px-4 rounded-xl flex items-center justify-center space-x-3 transition-colors"
          >
            <span>Sign up with Google</span>
          </button>

          <button
            onClick={handleAppleSignIn}
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-4 px-4 rounded-xl flex items-center justify-center space-x-3 transition-colors"
          >
            <span>Sign up with Apple</span>
          </button>
        </div>

        <p className="text-sm text-gray-600 text-center pt-4">
          Already have an account?{" "}
          <Link
            href="/business/login"
            className="text-gray-900 hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
