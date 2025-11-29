"use client";

import Link from "next/link";
import React from "react";

// Simple verification progress/status small card
export default function VerificationProgress({ status = "not_started", percent = 0 }) {
  const statusColor = status === "verified" ? "bg-green-100 text-green-800" : status === "pending" ? "bg-yellow-50 text-yellow-800" : "bg-gray-50 text-gray-700";

  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-md flex items-center justify-center bg-[#E05D3D]/10 border border-[#E05D3D]/20">
          <svg className="w-6 h-6 text-[#E05D3D]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="9" strokeWidth="1.2" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-semibold">Business verification</div>
          <div className="text-xs text-gray-500">{status === 'verified' ? 'Verified' : status === 'pending' ? 'Under review' : 'Not started'}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-sm text-gray-600">{percent}% complete</div>
        <Link href="/dashboard/business/verification" className={`px-3 py-1 rounded-md font-medium text-sm ${status === 'verified' ? 'bg-green-600 text-white' : 'bg-[#E05D3D] text-white'}`}>
          {status === 'verified' ? 'View' : 'Complete'}
        </Link>
      </div>
    </div>
  );
}
