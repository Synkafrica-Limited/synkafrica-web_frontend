"use client";

import { usePathname } from "next/navigation";

export default function OnboardServiceLayout({ children }) {
  const pathname = usePathname();
  // grabs “cars” or “beach” etc. from URL
  const service = pathname.split("/services/")[1] || null;

  return (
    <div className="max-w-3xl mx-auto w-full py-8">
      {service === null && (
        <h2 className="text-2xl font-semibold mb-6">Select a service</h2>
      )}
      {service && (
        <h2 className="text-2xl font-semibold mb-6 capitalize">
          {service.replace(/_/g, " ")}
        </h2>
      )}
      {children}
    </div>
  );
}
