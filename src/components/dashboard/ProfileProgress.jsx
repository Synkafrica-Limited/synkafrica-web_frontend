"use client";
import Button from "@/components/ui/buttons";
import React from "react";

function ProfileProgress({ progress, onEdit, onViewBookingInfo, onCompleteBooking }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-base">Your Profile</span>
        <span className="text-xs font-medium text-gray-500">{progress}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
        <div
          className="h-2 bg-[#E26A3D] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-gray-600 text-sm mb-2">
        Get the best of SynKafrica by updating your details
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-[#E26A3D] text-[#E26A3D] bg-[#E26A3D]/10"
          onClick={onEdit}
        >
          <span className="mr-1">①</span> Update profile
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-[#E26A3D] text-[#E26A3D] bg-[#E26A3D]/10"
          onClick={onViewBookingInfo}
        >
          <span className="mr-1">②</span> View booking information
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-[#E26A3D] text-[#E26A3D] bg-[#E26A3D]/10"
          onClick={onCompleteBooking}
        >
          <span className="mr-1">③</span> Complete a booking
        </Button>
      </div>
    </div>
  );
}

export default ProfileProgress;
