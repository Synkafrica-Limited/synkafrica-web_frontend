import Image from "next/image";
import Link from "next/link";
import Buttons from "@/components/ui/Buttons";

// Minimal navbar for vendor landing: logo icon on the left, Get started on the right
export default function VendorSimpleNavbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/70 border-b border-gray-100">
      <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" aria-label="Synkafrica home" className="flex items-center">
          <Image
            src="/images/brand/synkafrica-logo-single.png"
            alt="Synkafrica"
            width={40}
            height={40}
            priority
          />
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/login">
            <Buttons variant="outline" size="sm" className="text-md rounded-full px-6">Log in</Buttons>
          </Link>
          <Link href="/dashboard/business/onboarding">
            <Buttons variant="filled" size="sm" className="text-md rounded-full px-8">Get started</Buttons>
          </Link>
        </div>
      </div>
    </header>
  );
}
