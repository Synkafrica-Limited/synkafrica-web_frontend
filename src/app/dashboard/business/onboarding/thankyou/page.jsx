"use client";
import Button from "@/components/ui/Buttons";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <Image
        src="/images/brand/synkafrica-logo-w-text.png"
        alt="SynkAfrica Logo"
        width={120}
        height={120}
        className="mb-6"
      />
      <h1 className="text-4xl font-bold mb-4 text-center text-[#222]">
        Thank You for Completing Your Onboarding!
      </h1>
      <p className="text-lg text-gray-600 mb-6 text-center max-w-xl">
        Your business profile is now set up and ready to go. You can now access your full dashboard experience, manage your business, add more services, and connect with customers.
      </p>
      <ul className="mb-8 text-gray-700 text-base max-w-lg mx-auto list-disc pl-6">
        <li>Manage your business profile and services</li>
        <li>Upload and update your business pictures</li>
        <li>Track bookings and customer interactions</li>
        <li>Access analytics and insights</li>
        <li>Update your payment and contact details anytime</li>
      </ul>
      <Button
        variant="filled"
        size="lg"
        className="px-10 py-3 text-lg"
        onClick={() => router.push("/dashboard")}
      >
        Launch Dashboard
      </Button>
      <div className="mt-10 text-sm text-gray-400 text-center">
        Need help? <a href="mailto:support@synkafrica.com" className="underline text-[#E26A3D]">Contact Support</a>
      </div>
    </div>
  );
}