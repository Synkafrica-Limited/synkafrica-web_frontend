"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/buttons";
import { ArrowRight } from 'lucide-react';

const options = [
  {
    label: "Transportation",
    value: "cars",
    img: "/images/vendor/cars.png",
  },
  {
    label: "Reservations",
    value: "dining",
    img: "/images/vendor/dining.png",
  },
  {
    label: "Services",
    value: "services",
    img: "/images/vendor/services.png",
  },
];

export default function ListingSelection({ onClose }) {
  const [selected, setSelected] = useState("cars");
  const router = useRouter();

  const handleNext = () => {
    if (selected === "cars") router.push("/dashboard/vendor/cars");
    else if (selected === "dining") router.push("/dashboard/vendor/dining");
    else if (selected === "services") router.push("/dashboard/vendor");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-2 sm:mx-4 p-2 sm:p-6 md:p-8 flex flex-col">
        {/* Close Button */}
        <button
          aria-label="Close"
          className="absolute left-3 top-3 sm:left-6 sm:top-6 text-2xl sm:text-3xl text-gray-400 hover:text-gray-700"
          onClick={onClose || (() => router.back())}
        >
          &times;
        </button>
        {/* Title */}
        <h2 className="text-base xs:text-lg sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-8 mt-2">
          What&nbsp; <span className="whitespace-nowrap">would you like to host?</span>
        </h2>
        {/* Options */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 justify-center items-center mb-6 sm:mb-10 w-full">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`flex flex-col items-center justify-center border-2 rounded-2xl px-4 py-4 sm:px-8 sm:py-8 w-full max-w-xs h-40 sm:h-56 bg-white shadow-sm transition-all
                ${selected === opt.value
                  ? "border-[#E26A3D] shadow-lg"
                  : "border-gray-200 hover:border-[#E26A3D]/60"
                }`}
              onClick={() => setSelected(opt.value)}
            >
              <Image
                src={opt.img}
                alt={opt.label}
                width={70}
                height={50}
                className="mb-2 sm:mb-4 object-contain"
                draggable={false}
              />
              <span className="text-sm sm:text-base md:text-xl font-semibold text-gray-900">{opt.label}</span>
            </button>
          ))}
        </div>
        {/* Next Button */}
        <div className="flex justify-end">
          <Button
            variant="filled"
            icon={<ArrowRight className="w-5 h-5" />}
            className="bg-[#E26A3D] text-white px-4 py-2 sm:px-8 sm:py-3 rounded-md font-semibold hover:bg-[#c2552e] transition text-sm sm:text-base"
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}