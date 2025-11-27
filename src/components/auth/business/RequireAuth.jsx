"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RequireAuth({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("vendorToken");

    if (!token) {
      router.replace("/business/login");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-600">
        Checking authentication...
      </div>
    );
  }

  return children;
}
