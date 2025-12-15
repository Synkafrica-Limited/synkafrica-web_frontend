"use client";
import Buttons from "@/components/ui/Buttons";
import React from "react";
import { useToast } from "@/components/ui/ToastProvider";
import Link from "next/link";

function BusinessProfileProgress({
  progress = 0,
  profileProgress = null,
  business = null,
  onEdit,
  onSaveInfo,
  onGetBookings,
  onVerify,
}) {
  const toast = useToast();
  const verificationState = business?.verificationStatus || "not_started";
  const verificationPercent = business?.verificationProgress || 0;

  return (
    <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col gap-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3 h-20 w-full sm:w-auto">
          <div className="mr-2">
            <div className="text-sm font-semibold">Profile Completion</div>
            <div className="text-xs text-gray-500">Complete your personal and business information</div>
          </div>

          <div className="hidden sm:block">
            <span className="text-sm font-medium text-gray-700">{progress}%</span>
          </div>
        </div>

        <div className="w-full flex items-center gap-2">
          <div className="relative flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-3 bg-linear-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
          <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded bg-primary-50 text-primary-600 border border-primary-100 shadow-sm">
            {progress}%
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="text-sm text-gray-600">
            Verification: <span className={`font-medium ${
              verificationState === 'verified' ? 'text-green-600' : 
              verificationState === 'pending' ? 'text-yellow-600' : 
              verificationState === 'rejected' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {verificationState === 'verified' ? 'Verified' : 
               verificationState === 'pending' ? 'Pending Review' :
               verificationState === 'rejected' ? 'Action Required' : 'Not Started'}
            </span>
            {verificationPercent > 0 && verificationState !== 'verified' && (
              <span className="ml-1">({verificationPercent}%)</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">

          <Link href="/dashboard/business/settings" className="w-full sm:w-auto px-3 py-2 rounded bg-primary-500 text-white font-medium text-sm text-center flex items-center justify-center hover:bg-primary-600 transition-colors">
            <span className="mr-1">{verificationState === "verified" ? "View" : "Manage"}</span>
            <span className="hidden xs:inline">verification</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BusinessProfileProgress;
