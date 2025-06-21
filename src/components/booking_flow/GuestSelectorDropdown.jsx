'use client';
import { useState, useRef, useEffect } from 'react';

export function GuestSelectorDropdown({ adults, children, setAdults, setChildren }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <label className="sr-only">Guests</label>
        <button
          type="button"
          className="w-full flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 bg-white text-left h-[55px] cursor-pointer"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-sm text-gray-700">
            {adults + children} Guest{adults + children !== 1 ? 's' : ''}{" "}
            <span className="text-xs text-gray-400">(Tap to edit)</span>
          </span>

          <svg
          className={`w-4 h-4 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Adults</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-lg text-gray-700 disabled:opacity-40"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  disabled={adults <= 1}
                >-</button>
                <span className="w-6 text-center">{adults}</span>
                <button
                  type="button"
                  className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-lg text-gray-700"
                  onClick={() => setAdults(Math.min(10, adults + 1))}
                >+</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Children</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-lg text-gray-700 disabled:opacity-40"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  disabled={children <= 0}
                >-</button>
                <span className="w-6 text-center">{children}</span>
                <button
                  type="button"
                  className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-lg text-gray-700"
                  onClick={() => setChildren(Math.min(10, children + 1))}
                >+</button>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Guests = Adults + Children
            </div>
            <button
              type="button"
              className="mt-2 w-full bg-primary-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-primary-600 transition"
              onClick={() => setOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
