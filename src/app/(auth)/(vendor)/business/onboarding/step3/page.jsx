"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import NextDynamic from "next/dynamic";

const ShareQualificationsStep = NextDynamic(
  () =>
    import(
      "@/app/business/onboarding/step3/components/ShareQualificationsStep"
    ),
  { ssr: false }
);

export default function Step3Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="p-6">
      <ShareQualificationsStep />
    </div>
  );
}
