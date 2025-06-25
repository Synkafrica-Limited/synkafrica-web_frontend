"use client";
import { useState } from "react";
import { FaCar, FaUmbrellaBeach, FaUtensils, FaSwimmer } from "react-icons/fa";
import { GiIroning3, GiBarberBrush } from "react-icons/gi";
import Link from "next/link";

const SERVICES = [
  { label: "Cars", icon: <FaCar size={48} />, value: "cars" },
  { label: "Beach", icon: <FaUmbrellaBeach size={48} />, value: "beach" },
  { label: "Dining", icon: <FaUtensils size={48} />, value: "dining" },
  { label: "Laundry", icon: <GiIroning3 size={48} />, value: "laundry" },
  { label: "Barbing", icon: <GiBarberBrush size={48} />, value: "barbing" },
  { label: "Pool", icon: <FaSwimmer size={48} />, value: "pool" },
];

export default function ServiceQuestion1() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-3xl mx-auto">
        <div className="text-gray-400 text-base mb-2 mt-4">Step 1</div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">
          Which service will you provide?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {SERVICES.map((service) => (
            <button
              key={service.value}
              type="button"
              className={`flex flex-col items-center justify-center border rounded-2xl bg-white px-6 py-8 min-h-[160px] shadow-sm transition-all
                ${
                  selected === service.value
                    ? "border-[#E26A3D] shadow-lg"
                    : "border-gray-200 hover:border-[#E26A3D]/60"
                }`}
              onClick={() => setSelected(service.value)}
            >
              <span className="mb-4 text-4xl text-gray-800">{service.icon}</span>
              <span className="text-lg font-semibold text-gray-900">{service.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Footer Navigation */}
      <div className="w-full max-w-5xl border-t pt-8 flex items-center justify-between px-4 mt-8">
        <Link
          href="/dashboard/vendor"
          className="border border-[#E26A3D] text-[#E26A3D] rounded-md px-8 py-3 font-medium hover:bg-[#E26A3D]/10 transition text-base"
        >
          Back
        </Link>
        <button
          className={`rounded-md px-8 py-3 font-medium text-base transition ${
            selected
              ? "bg-[#E26A3D] text-white hover:bg-[#c2552e]"
              : "bg-[#E26A3D]/20 text-[#E26A3D] cursor-not-allowed"
          }`}
          disabled={!selected}
          // TODO: Replace with router.push or form submit for next step
        >
          Next
        </button>
      </div>
    </div>
  );
}