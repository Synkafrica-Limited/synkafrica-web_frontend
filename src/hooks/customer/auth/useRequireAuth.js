// components/auth/RequireAuth.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RequireAuth({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  const token = localStorage.getItem("customerToken");
  
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return children;
}