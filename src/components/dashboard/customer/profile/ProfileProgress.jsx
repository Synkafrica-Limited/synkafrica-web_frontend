"use client";
import Buttons from "@/components/ui/Buttons";
import React from "react";
import Link from "next/link";

function ProfileProgress({ progress, profileProgress, onEdit, onViewBookingInfo, onCompleteBooking }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col gap-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3 h-20 w-full sm:w-auto">
          <div className="mr-2">
            <div className="text-sm font-semibold">Profile Completion</div>
            <div className="text-xs text-gray-500">Complete your personal information</div>
          </div>

          <div className="hidden sm:block">
            <span className="text-sm font-medium text-gray-700">{progress}%</span>
          </div>
        </div>

        <div className="w-full flex items-center gap-2">
          <div className="relative flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-3 bg-gray-900 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
          <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded bg-primary-50 text-primary-600 border border-primary-100 shadow-sm">
            {progress}%
          </span>
        </div>
      </div>

      {/* Detailed Progress Breakdown */}
      {profileProgress && profileProgress.personal && (
        <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Personal Info</span>
              </div>
              <span className="text-sm text-gray-600 font-semibold">
                {profileProgress.personal.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${profileProgress.personal.percentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500">
              {profileProgress.personal.completed} of {profileProgress.personal.total} fields completed
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 mt-2">
        <div className="grid grid-cols-1 sm:flex gap-2 w-full sm:w-auto">
          <button
            onClick={onEdit}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium text-sm text-center flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <span className="mr-2">✏️</span>
            Update Profile
          </button>
          
          <Link href="/dashboard/bookings" className="w-full sm:w-auto">
            <button
              onClick={onViewBookingInfo}
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium text-sm text-center flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <span className="mr-2">📅</span>
              View Bookings
            </button>
          </Link>

          <button
            onClick={onCompleteBooking}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-primary-600 text-white font-medium text-sm text-center flex items-center justify-center hover:bg-primary-700 transition-colors shadow-sm"
          >
            <span className="mr-2">✨</span>
            Complete Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileProgress;
