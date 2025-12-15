"use client";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, Lock, Key, Eye, EyeOff, CheckCircle2, XCircle, Shield, ArrowRight } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import Buttons from "@/components/ui/Buttons";
import authService from '@/services/authService';

function ResetPasswordForm() {
  const search = useSearchParams();
  const router = useRouter();
  const emailParam = search.get("email") || "";
  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getPasswordStrength = (pass) => {
    if (!pass) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.length >= 12) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { strength, label: 'Fair', color: 'bg-yellow-500' };
    if (strength <= 4) return { strength, label: 'Good', color: 'bg-blue-500' };
    return { strength, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const getValidationStatus = (field) => {
    if (!field) return null;
    
    switch (field) {
      case 'email':
        if (!email) return null;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      case 'code':
        if (!code) return null;
        return /^[0-9]{6}$/.test(code);
      case 'password':
        if (!newPassword) return null;
        return newPassword.length >= 8;
      case 'confirm':
        if (!confirm) return null;
        return newPassword && confirm === newPassword;
      default:
        return null;
    }
  };

  const validate = () => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
    if (!/^[0-9]{6}$/.test(code)) return "Enter the 6-digit code";
    if (newPassword.length < 8) return "Password must be at least 8 characters";
    if (newPassword !== confirm) return "Passwords do not match";
    return "";
  };

  const handleSubmit = async () => {
    const v = validate();
    if (v) return setError(v);
    setLoading(true);
    setError("");
    try {
      await authService.resetPassword(email.trim(), code, newPassword);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/business/login');
      }, 2000);
    } catch (err) {
      console.error('Reset password failed:', err);
      setError(err?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading && !validate()) {
      handleSubmit();
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Password Reset Successful"
        subtitle="Your password has been updated successfully"
        cancelHref="/business/login"
        cancelLabel="Back to Login"
      >
        <div className="space-y-6 animate-in fade-in duration-500 text-center">
          {/* Success Icon with Animation */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl flex items-center justify-center shadow-lg shadow-green-100/50 animate-in zoom-in duration-500">
              <div className="relative">
                <Shield className="w-12 h-12 text-green-600" />
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 animate-in zoom-in duration-700 delay-300">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">
              All Set!
            </h3>
            <p className="text-gray-600">
              You can now sign in with your new password
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => router.push('/business/login')}
              className="w-full py-4 px-4 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 transform hover:-translate-y-0.5"
            >
              Continue to Login
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter the verification code and create a new secure password"
      cancelHref="/business/login"
      cancelLabel="Back to Login"
    >
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top-1 duration-200">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 flex-1">{error}</p>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Key className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              Check your email
            </p>
            <p className="text-xs text-gray-600">
              We've sent a 6-digit verification code to your email. Enter it below along with your new password.
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
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              placeholder="your.email@business.com"
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-300 focus:border-gray-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-900 focus:ring-opacity-20 transition-all duration-200 text-gray-900 placeholder-gray-400"
            />
            {getValidationStatus('email') !== null && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                {getValidationStatus('email') ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Verification Code */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Verification Code
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Key className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                setError("");
              }}
              onKeyPress={handleKeyPress}
              placeholder="000000"
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-300 focus:border-gray-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-900 focus:ring-opacity-20 transition-all duration-200 text-gray-900 placeholder-gray-400 text-center text-2xl tracking-widest font-semibold"
              maxLength={6}
            />
            {getValidationStatus('code') !== null && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                {getValidationStatus('code') ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              placeholder="Create a strong password"
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-300 focus:border-gray-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-900 focus:ring-opacity-20 transition-all duration-200 text-gray-900 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="space-y-2 animate-in slide-in-from-top-1 duration-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Password strength:</span>
                <span className={`font-semibold ${
                  passwordStrength.label === 'Weak' ? 'text-red-600' :
                  passwordStrength.label === 'Fair' ? 'text-yellow-600' :
                  passwordStrength.label === 'Good' ? 'text-blue-600' :
                  'text-green-600'
                }`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      level <= passwordStrength.strength
                        ? passwordStrength.color
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
          
          <p className="text-xs text-gray-500">
            Must be at least 8 characters with a mix of letters, numbers & symbols
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              placeholder="Re-enter your password"
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-300 focus:border-gray-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-900 focus:ring-opacity-20 transition-all duration-200 text-gray-900 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {confirm && (
            <div className={`flex items-center gap-2 text-xs animate-in slide-in-from-top-1 duration-200 ${
              newPassword === confirm ? 'text-green-600' : 'text-red-600'
            }`}>
              {newPassword === confirm ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Passwords match
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Passwords do not match
                </>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Buttons
          onClick={handleSubmit}
          disabled={loading || !!validate()}
          className={`w-full py-4 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
            !loading && !validate()
              ? "bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 transform hover:-translate-y-0.5" 
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Updating Password...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              Reset Password
            </>
          )}
        </Buttons>

        {/* Help Text */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            Remember your password?{" "}
            <button 
              onClick={() => router.push('/business/login')}
              className="text-gray-700 hover:text-gray-900 font-medium hover:underline"
            >
              Sign in instead
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function VendorResetPasswordScreen() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
