"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaCar,
  FaUmbrellaBeach,
  FaUtensils,
  FaSwimmer,
} from "react-icons/fa";
import { GiIroning3, GiBarberBrush } from "react-icons/gi";

const SERVICES = [
  { label: "Cars",    icon: <FaCar size={48} />,           value: "cars" },
  { label: "Beach",   icon: <FaUmbrellaBeach size={48} />, value: "beach" },
  { label: "Dining",  icon: <FaUtensils size={48} />,      value: "dining" },
  { label: "Laundry", icon: <GiIroning3 size={48} />,      value: "laundry" },
  { label: "Barbing", icon: <GiBarberBrush size={48} />,   value: "barbing" },
  { label: "Pool",    icon: <FaSwimmer size={48} />,       value: "pool" },
];

export default function ServiceTypeSelection() {
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  function goNext() {
    if (!selected) return;
    // push into the next “questionnaire” route for that service
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
              px-6 py-8 shadow-sm transition-all
              ${selected === svc.value
                ? "border-[#E26A3D] shadow-lg"
                : "border-gray-200 hover:border-[#E26A3D]/60"
              }
            `}
          >
            <div className="mb-4 text-4xl text-gray-800">{svc.icon}</div>
            <div className="text-lg font-semibold text-gray-900">{svc.label}</div>
          </button>
        ))}
      </div>

      <div className="w-full flex justify-end">
        <button
          onClick={goNext}
          disabled={!selected}
          className={`
            px-6 py-3 rounded-lg font-medium text-white transition
            ${selected
              ? "bg-primary-500 hover:bg-primary-600"
              : "bg-gray-300 cursor-not-allowed"
            }
          `}
        >
          Next
        </button>
      </div>
    </div>
  );
}
