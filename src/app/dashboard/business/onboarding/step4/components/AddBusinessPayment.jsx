// src/app/dashboard/business/onboarding/components/step4/BusinessDetailsStep.jsx
"use client";
import { useState } from "react";
import Button from "@/components/ui/Buttons";

const BANKS = [
  "Bank name",
  "Access Bank",
  "GTBank",
  "First Bank",
  "UBA",
  "Zenith Bank",
  // ...add more as needed
];

function AddBusinessPayment({ value, onSave, onCancel }) {
  const [form, setForm] = useState({
    bank: value?.bank || "",
    accountNumber: value?.accountNumber || "",
    accountName: value?.accountName || "",
  });

  const isValid =
    form.bank &&
    form.bank !== "Bank name" &&
    form.accountNumber.trim() &&
    form.accountName.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-10 text-center">Add your business payment details</h3>
        <form className="w-full flex flex-col items-center gap-4 mb-12">
          <select
            className="w-full border rounded-md px-4 py-3 text-base"
            value={form.bank || "Bank name"}
            onChange={e => setForm(f => ({ ...f, bank: e.target.value }))}
          >
            {BANKS.map((b) => (
              <option key={b} value={b === "Bank name" ? "" : b} disabled={b === "Bank name"}>
                {b}
              </option>
            ))}
          </select>
          <input
            className="w-full border rounded-md px-4 py-3 text-base"
            value={form.accountNumber}
            onChange={e => setForm(f => ({ ...f, accountNumber: e.target.value }))}
            placeholder="Account number"
            type="text"
          />
          <input
            className="w-full border rounded-md px-4 py-3 text-base"
            value={form.accountName}
            onChange={e => setForm(f => ({ ...f, accountName: e.target.value }))}
            placeholder="Account name"
            type="text"
          />
        </form>
        <div className="flex w-full justify-between mt-8 border-t pt-8">
          <Button
            variant="outline"
            className="text-[#E26A3D] rounded-md px-8 py-2 font-medium hover:bg-[#E26A3D]/10 transition"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            className={`bg-[#E26A3D] text-white rounded-md px-8 py-2 font-medium transition ${!isValid ? "opacity-50 cursor-not-allowed" : "hover:bg-[#c2552e]"}`}
            onClick={() => isValid && onSave(form)}
            disabled={!isValid}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddBusinessPayment;
