"use client";
import VendorOnboardingIntro from "@/components/dashboard/vendor/VendorOnboardingIntro";

export default function VendorPage() {
  return (
    <>
      <VendorOnboardingIntro
        ctaHref="/dashboard/vendor/onboarding/convienience_services/ServiceQuestion1"
      />
      {/* <CarRentalOnboarding /> */}
      {/* <ReservationOnboarding /> */}
    </>
  );
}