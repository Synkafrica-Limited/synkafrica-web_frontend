"use client";

import { REGIONS } from "../content";

export default function RegionTabs({ region, setRegion }) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {REGIONS.map((r) => (
        <button
          key={r.key}
          type="button"
          onClick={() => setRegion(r.key)}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition ${
            region === r.key
              ? "border-orange-500 bg-orange-50 text-orange-700"
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span className="text-base">{r.emoji}</span>
          {r.label}
        </button>
      ))}
    </div>
  );
}
