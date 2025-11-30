"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLoadingScreen } from "@/components/ui/LoadingScreen";

export default function VerificationPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/business/settings?tab=verification");
  }, [router]);

  return <PageLoadingScreen message="Redirecting to verification settings..." />;
}
