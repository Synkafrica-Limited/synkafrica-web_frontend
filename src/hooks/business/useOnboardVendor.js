// hooks/useOnboardVendor.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function useOnboardVendor() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitOnboarding = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("vendorToken");

      if (!token) {
        throw new Error("Authentication failed. Please log in again.");
      }

      const res = await fetch(
        "https://synkkafrica-backend-core.onrender.com/api/business/onboard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to complete onboarding");
      }

      // On success → redirect to vendor dashboard
      router.replace("/dashboard/vendor");
      return data;

    } catch (err) {
      console.error("Onboarding Error:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submitOnboarding, loading, error };
}
