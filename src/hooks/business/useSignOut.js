"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function useSignOut(redirectPath = "/business/login") {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signOut = async () => {
    setLoading(true);
    setError(null);

    try {
      // Read token safely
      const token = typeof window !== "undefined"
        ? localStorage.getItem("vendorToken")
        : null;

      const res = await fetch(
        "https://synkkafrica-backend-core.onrender.com/api/auth/signout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({}), // <-- IMPORTANT FIX
        }
      );

      // Remove tokens ALWAYS (even if backend fails)
      if (typeof window !== "undefined") {
        localStorage.removeItem("vendorToken");
        localStorage.removeItem("vendorRefreshToken");
      }

      // Redirect to login
      router.push(redirectPath);

    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { signOut, loading, error };
}
