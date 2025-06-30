// app/dashboard/vendor/page.jsx
"use client";


import { useState } from "react";
import ServiceTypeSelection from "@/app/dashboard/business/onboarding/components/step1/ServiceTypeSelection"
import VendorOnboardingIntro from "@/app/dashboard/business/onboarding/components/step2/VendorOnboardingIntro"


export default function VendorIntroPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const onboardingStepsComponents = [
    <ServiceTypeSelection goToNextStep={goToNextStep} />,
    <VendorOnboardingIntro goToNextStep={goToNextStep} />,
  ];

  return (
    <div className="p-6">
      {onboardingStepsComponents[currentStep]}
    </div>
  );
}
