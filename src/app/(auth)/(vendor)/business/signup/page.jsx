"use client";

import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function VendorSignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const [touched, setTouched] = useState({ email: false, password: false, confirm: false });

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePassword = (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}\[\]:;"'`~<>,.?/\\]{8,}$/.test(value);

  const onEmailChange = (e) => {
    const v = e.target.value;
    setEmail(v);
    if (touched.email) setEmailError(!v.trim() ? "Email is required" : !validateEmail(v) ? "Enter a valid email" : "");
  };

  const onPasswordChange = (e) => {
    const v = e.target.value;
    setPassword(v);
    if (touched.password) setPasswordError(!v ? "Password is required" : !validatePassword(v) ? "Min 8 chars with a letter and number" : "");
    if (touched.confirm) setConfirmError(confirmPassword && v !== confirmPassword ? "Passwords do not match" : "");
  };

  const onConfirmChange = (e) => {
    const v = e.target.value;
    setConfirmPassword(v);
    if (touched.confirm) setConfirmError(!v ? "Confirm your password" : v !== password ? "Passwords do not match" : "");
  };

  const handleBlur = (field) => {
    setTouched((s) => ({ ...s, [field]: true }));
    if (field === "email") setEmailError(!email.trim() ? "Email is required" : !validateEmail(email) ? "Enter a valid email" : "");
    if (field === "password") setPasswordError(!password ? "Password is required" : !validatePassword(password) ? "Min 8 chars with a letter and number" : "");
    if (field === "confirm") setConfirmError(!confirmPassword ? "Confirm your password" : confirmPassword !== password ? "Passwords do not match" : "");
  };

  const isValid =
    email && validateEmail(email) &&
    password && validatePassword(password) &&
    confirmPassword && confirmPassword === password &&
    !emailError && !passwordError && !confirmError;

  const handleContinue = () => {
    if (!isValid) return;
    // In a real app, submit signup here then navigate to vendor OTP validation
    router.push("/business/validate");
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
        <Image src="/images/brand/synkafrica-logo-single.png" alt="Synk Africa Logo" width={80} height={30} />
        <div className="w-10" />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8 max-w-md mx-auto w-full">
        <div className="w-full space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create your business account</h1>
            <p className="text-gray-600 text-sm sm:text-base">Start listing services and managing bookings on SynkkAfrica.</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Email */}
            <div>
              <input
                type="email"
                value={email}
                onChange={onEmailChange}
                onBlur={() => handleBlur("email")}
                placeholder="Business email"
                className={`w-full px-4 py-3.5 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                  emailError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={onPasswordChange}
                  onBlur={() => handleBlur("password")}
                  placeholder="Password (min 8 chars, letter & number)"
                  className={`w-full px-4 py-3.5 pr-12 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                    passwordError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-3 my-auto h-8 w-8 grid place-items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
            </div>

            {/* Confirm */}
            <div>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={onConfirmChange}
                  onBlur={() => handleBlur("confirm")}
                  placeholder="Confirm password"
                  className={`w-full px-4 py-3.5 pr-12 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                    confirmError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute inset-y-0 right-3 my-auto h-8 w-8 grid place-items-center text-gray-500 hover:text-gray-700"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmError && <p className="mt-2 text-sm text-red-600">{confirmError}</p>}
            </div>

            {/* Continue */}
            <button
              onClick={handleContinue}
              disabled={!isValid}
              className={`w-full py-3.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                isValid ? "bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white shadow-sm" : "bg-gray-200 text-white cursor-not-allowed"
              }`}
            >
              Continue
            </button>

            {/* Help text */}
            <p className="text-xs text-gray-500 text-center">
              By creating an account, you agree to our <span className="text-blue-600 hover:underline">Terms</span> and <span className="text-blue-600 hover:underline">Privacy Policy</span>.
            </p>

            {/* Switch to sign in */}
            <p className="text-sm text-gray-600 text-center">
              Already have a vendor account? {" "}
              <Link href="/business/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
