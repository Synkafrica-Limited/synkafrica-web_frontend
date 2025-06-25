"use client";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/buttons";
import { ArrowRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function VendorOnboardingLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // Detect if we're on the intro page or a question page
  const isIntro =
    pathname === "/dashboard/vendor" ||
    pathname === "/dashboard/vendor/convienience_services";

  const isServiceQuestion =
    pathname === "/dashboard/vendor/onboarding/convienience_services/ServiceQuestion1";

  return (
    <div className="bg-white flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 md:px-5 py-4 pt-4 sm:pt-6 md:pt-8">
        <div>
          <Image
            src="/images/brand/synkafrica-logo-w-text.png"
            alt="Synkafrica Logo"
            width={150}
            height={80}
            priority
          />
        </div>
        <Link
          href="/dashboard"
          className="border border-[#E26A3D] text-[#E26A3D] rounded-md px-4 py-2 sm:px-6 sm:py-2 font-medium hover:bg-[#E26A3D]/10 transition text-sm sm:text-base"
        >
          Exit
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-2 sm:px-4 md:px-8 py-2 sm:py-4 gap-4 sm:gap-8 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-400 bg-white">
        <div className="max-w-8xl mx-auto flex justify-end px-4 sm:px-8 py-4 sm:py-6">
          {isIntro ? (
            <Link href="/dashboard/vendor/onboarding/convienience_services/ServiceQuestion1">
              <Button
                variant="filled"
                icon={<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
              >
                Get Started
              </Button>
            </Link>
          ) : isServiceQuestion ? (
            <div className="w-full flex justify-between">
              <Link
                href="/dashboard/vendor"
                className="border border-[#E26A3D] text-[#E26A3D] rounded-md px-8 py-3 font-medium hover:bg-[#E26A3D]/10 transition text-base"
              >
                Back
              </Link>
              <button
                className="rounded-md px-8 py-3 font-medium text-base transition bg-[#E26A3D] text-white hover:bg-[#c2552e]"
                // Add your next step logic here, e.g., router.push(...)
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </footer>
    </div>
  );
}