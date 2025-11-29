"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import authService from '@/services/authService';

export function useSignOut(redirectPath = "/business/login") {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signOut = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.signOut();
      router.push(redirectPath);
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message || "Failed to sign out");
    } finally {
      setLoading(false);
    }
  };

  return { signOut, loading, error };
}
