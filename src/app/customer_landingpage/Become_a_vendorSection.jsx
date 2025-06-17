import Button from "@/components/ui/Buttons";
import React from "react";

export default function BecomeVendorSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative rounded-2xl overflow-hidden md:h-56 flex items-center bg-gradient-to-tr from-blue-200 via-white to-orange-100">
        {/* Background image or illustration */}
        <img
          src="/images/banner_1.png" // Replace with your actual image path
          alt="Abstract"
          className="absolute right-0 top-0 h-55 w-full object-cover"
        />
        {/* Card */}
        <div className="relative z-10 bg-primary-500 text-white rounded-lg p-6 w-[250px]] ml-6 shadow-lg">
          <div className="font-semibold text-lg mb-1">Become a vendor</div>
          <div className="text-white text-sm mb-4 opacity-90">
            Create & list your product, and earn with Synkafrica.
          </div>
          <Button
            variant="outline"
            size="md"
            className="w-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary-500 hover:border-primary-500 transition"
          >
            List your products <span className="ml-2 text-lg">→</span>
          </Button>
        </div>
      </div>
    </section>
  );
}