// src/app/dashboard/business/onboarding/components/step4/BusinessDetailsStep.jsx
"use client";
import Buttons from "@/components/ui/Buttons";
import { useState } from "react";

export function AddBusinessEmail({ value, onSave, onCancel }) {
  const [email, setEmail] = useState(value || "");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-6 text-center">Add your business email</h3>
        <input
          className="w-full border rounded-md px-4 py-3 text-center text-lg mb-8"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Business email"
          type="email" />
        <div className="flex w-full justify-between mt-4">
          <Buttons
            variant="outline"
            className="border border-[#E26A3D] text-[#E26A3D] rounded-md px-8 py-2 font-medium hover:bg-[#E26A3D]/10 transition"
            onClick={onCancel}
          >
            Cancel
          </Buttons>
          <Buttons
            variant="filled"
            className="bg-[#E26A3D] text-white rounded-md px-8 py-2 font-medium hover:bg-[#c2552e] transition"
            onClick={() => onSave(email)}
            disabled={!email.trim()}
          >
            Save
          </Buttons>
        </div>
      </div>
    </div>
  );
}
