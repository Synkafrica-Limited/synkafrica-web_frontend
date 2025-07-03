"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SERVICES = [
  { label: "Cars",    icon: "🚗", value: "cars" },
  { label: "Beach",   icon: "🏖️", value: "beach" },
  { label: "Dining",  icon: "🍽️", value: "dining" },
  { label: "Laundry", icon: "🧺", value: "laundry" },
  { label: "Barbing", icon: "💈", value: "barbing" },
  { label: "Pool",    icon: "🏊", value: "pool" },
];

export default function ServiceTypeSelection() {
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  function goNext() {
    if (!selected) return;
    router.push(`/dashboard/vendor/onboarding/services/${selected}`);
  }

  return (
    <div className="w-full flex flex-col items-center min-h-[70vh]">
      <div className="text-gray-500 mb-2">Step 1</div>
      <h3 className="text-3xl font-bold mb-8">Which service will you provide?</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {SERVICES.map((svc) => (
          <button
            key={svc.value}
            onClick={() => setSelected(svc.value)}
            className={`
              flex flex-col items-center justify-center border rounded-2xl bg-white
              px-8 py-14 shadow-sm transition-all text-5xl
              ${selected === svc.value
                ? "border-[#E26A3D] shadow-lg"
                : "border-gray-200 hover:border-[#E26A3D]/60"
              }
              min-h-[200px] sm:min-h-[220px] w-full
            `}
          >
            <div className="mb-6">{svc.icon}</div>
            <div className="text-2xl font-semibold text-gray-900">{svc.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
