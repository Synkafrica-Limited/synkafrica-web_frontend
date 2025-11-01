// src/app/dashboard/business/onboarding/components/step4/BusinessDetailsStep.jsx
"use client";
import { useState } from "react";

export function AddBusinessNumber({ value, onSave, onCancel }) {
  const [number, setNumber] = useState(value || "");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-6 text-center">Add your business number</h3>
        <input
          className="w-full border rounded-md px-4 py-3 text-center text-lg mb-8"
          value={number}
          onChange={e => setNumber(e.target.value)}
          placeholder="Business number"
          type="tel" />
        <div className="flex w-full justify-between mt-4">
          <button
            className="border border-[#E26A3D] text-[#E26A3D] rounded-md px-8 py-2 font-medium hover:bg-[#E26A3D]/10 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-[#E26A3D] text-white rounded-md px-8 py-2 font-medium hover:bg-[#c2552e] transition"
            onClick={() => onSave(number)}
            disabled={!number.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
