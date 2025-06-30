"use client";

import Image from "next/image";
import Link  from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/ui/buttons";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function VendorOnboardingLayout({ children }) {
  const pathname = usePathname();
  const router   = useRouter();

  const isIntro   = pathname === "/dashboard/vendor";
  const isServices = pathname === "/dashboard/vendor/onboarding/services";

  function goNext() {
    if (isIntro) {
      router.push("/dashboard/vendor/onboarding/services");
    } else if (isServices) {
      // default first service—user will click one before “Next”
      router.push("/dashboard/vendor/onboarding/services/[service]/");
    }
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

      {/* footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-end p-6 space-x-4">
          {!isIntro && (
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          )}
          { (isIntro || isServices) && (
            <Button variant="filled" onClick={goNext}>
              {isIntro ? "Get Started" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
