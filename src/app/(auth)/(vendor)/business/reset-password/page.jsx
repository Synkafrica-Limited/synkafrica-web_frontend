"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";
import Buttons from "@/components/ui/Buttons";
import authService from '@/services/authService';

export default function VendorResetPasswordScreen() {
  const search = useSearchParams();
  const router = useRouter();
  const emailParam = search.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      router.push('/business/login');
    } catch (err) {
      console.error('Reset password failed:', err);
      setError(err?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter the code sent to your email and set a new password."
      cancelHref="/business/login"
      cancelLabel="Back to login"
    >
      <div className="space-y-5">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-5 py-4 border-2 rounded-xl"
          />
        </div>

        <div>
          <input
            type="text"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0,6))}
            placeholder="6-digit code"
            className="w-full px-5 py-4 border-2 rounded-xl text-center"
          />
        </div>

        <div>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full px-5 py-4 border-2 rounded-xl"
          />
        </div>

        <div>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
            className="w-full px-5 py-4 border-2 rounded-xl"
          />
        </div>

        <Buttons onClick={handleSubmit} disabled={loading} className="w-full py-4">
          {loading ? 'Updating...' : 'Set new password'}
        </Buttons>
      </div>
    </AuthLayout>
  );
}
