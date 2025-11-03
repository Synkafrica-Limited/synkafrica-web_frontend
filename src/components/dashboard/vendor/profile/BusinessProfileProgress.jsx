"use client";
import Buttons from "@/components/ui/Buttons";
import React from "react";

function BusinessProfileProgress({ progress, onEdit, onSaveInfo, onGetBookings }) {
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
        Get the best of Synkkafrica by updating your details
      </div>
      <div className="flex flex-wrap gap-2">
        <Buttons
          variant="outline"
          size="sm"
          className="border-[#E26A3D] text-[#E26A3D] bg-[#E26A3D]/10"
          onClick={onEdit}
        >
          <span className="mr-1">①</span> Update profile
        </Buttons>
        <Buttons
          variant="outline"
          size="sm"
          className="border-[#E26A3D] text-[#E26A3D] bg-[#E26A3D]/10"
          onClick={onSaveInfo}
        >
          <span className="mr-1">②</span> Save information
        </Buttons>
        <Buttons
          variant="outline"
          size="sm"
          className="border-[#E26A3D] text-[#E26A3D] bg-[#E26A3D]/10"
          onClick={onGetBookings}
        >
          <span className="mr-1">③</span> Get bookings
        </Buttons>
      </div>
    </div>
  );
}

export default BusinessProfileProgress;
