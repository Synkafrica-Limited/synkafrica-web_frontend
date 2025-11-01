"use client";
import { useState } from "react";

export default function ConfirmBusinessAddress({ value, onSave, onCancel }) {
  const [form, setForm] = useState({
    country: value?.country || "Nigeria",
    street: value?.street || "",
    city: value?.city || "",
    state: value?.state || "",
    postal: value?.postal || "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-2 text-center">Confirm your address</h3>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Your address is shared with guest when making reservations
        </p>
        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          className="w-full border rounded-md px-4 py-3 mb-3 text-base"
        >
          <option value="Nigeria">Nigeria</option>
          {/* Add more countries as needed */}
        </select>
        <input
          name="street"
          value={form.street}
          onChange={handleChange}
          className="w-full border rounded-md px-4 py-3 mb-3 text-base"
          placeholder="Street address"
        />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          className="w-full border rounded-md px-4 py-3 mb-3 text-base"
          placeholder="City/town/village"
        />
        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          className="w-full border rounded-md px-4 py-3 mb-3 text-base"
          placeholder="Province/state"
        />
        <input
          name="postal"
          value={form.postal}
          onChange={handleChange}
          className="w-full border rounded-md px-4 py-3 mb-6 text-base"
          placeholder="Postal code (if applicable)"
        />
        <div className="flex w-full justify-between">
          <button
            className="border border-[#E26A3D] text-[#E26A3D] rounded-md px-8 py-2 font-medium hover:bg-[#E26A3D]/10 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-[#E26A3D] text-white rounded-md px-8 py-2 font-medium hover:bg-[#c2552e] transition"
            onClick={() => onSave(form)}
            disabled={!form.street || !form.city || !form.state}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}