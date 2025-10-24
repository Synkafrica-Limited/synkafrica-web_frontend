"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import ShareQualificationsStep from "@/app/dashboard/business/onboarding/step3/components/ShareQualificationsStep";

export default function Step3Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // safe to access window/localStorage here
    // const v = window.localStorage.getItem("x");
  }, []);

  if (!mounted) return null; // avoids SSR mismatch if render needs window

  return (
    <div className="p-6">
      <ShareQualificationsStep />
    </div>
  );
}