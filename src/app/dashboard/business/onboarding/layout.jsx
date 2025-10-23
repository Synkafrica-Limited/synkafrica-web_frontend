"use client";

import { useState } from "react";
import Button from "@/components/ui/buttons";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// ConfirmationModal component
function ConfirmationModal({ open, onClose, message }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        <div className="text-2xl font-bold mb-4 text-center">Success!</div>
        <div className="text-gray-700 text-center mb-8">{message}</div>
        <Button variant="filled" onClick={onClose}>OK</Button>
      </div>
    </div>
  );
}

export default function VendorOnboardingLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const steps = [
    "/dashboard/business/onboarding",
    "/dashboard/business/onboarding/step2",
    "/dashboard/business/onboarding/step3",
    "/dashboard/business/onboarding/step4",
    "/dashboard/business/onboarding/step5",
  ];

  const currentStep = steps.findIndex(
    (step) =>
      pathname === step ||
      pathname === step + "/" // handle trailing slash
  );

  // Confirmation modal state
  const [showConfirm, setShowConfirm] = useState(false);

  function goNext() {
    if (currentStep === steps.length - 1) {
      setShowConfirm(true); // Show confirmation on last step
    } else if (currentStep < steps.length - 1) {
      router.push(steps[currentStep + 1]);
    }
  }
  function goBack() {
    if (currentStep > 0) {
      router.push(steps[currentStep - 1]);
    }
  }

  function handleConfirmClose() {
    setShowConfirm(false);
    router.push("/dashboard/business/onboarding/thankyou");
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* header */}
      <header className="flex items-center justify-between px-6 py-4">
        <Image
          src="/images/brand/synkafrica-logo-w-text.png"
          alt="Logo"
          width={150}
          height={40}
        />
        <Link href="/">
          <Button variant="outline" className="flex items-center space-x-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Exit</span>
          </Button>
        </Link>
      </header>

      {/* content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-8">
        {children}
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirm}
        onClose={handleConfirmClose}
        message="Your business pictures and prices have been saved!"
      />

      {/* footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between p-6 space-x-4">
          <div>
            {currentStep > 0 && (
              <Button variant="outline" onClick={goBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
          </div>
          <div>
            {currentStep < steps.length
              ? (
                <Button variant="filled" onClick={goNext}>
                  {currentStep === steps.length - 1 ? "Save" : "Next"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )
              : null}
          </div>
        </div>
      </footer>
    </div>
  );
}
