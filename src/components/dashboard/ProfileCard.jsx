"use client";
import React from "react";

function ProfileCard({ user }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col items-center w-full max-w-xs mx-auto min-w-0">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-900 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">
        {user.initials}
      </div>
      <div className="text-base sm:text-lg font-semibold text-center break-words">
        {user.name}
      </div>
      <div className="text-xs sm:text-sm text-[#E26A3D] mt-1 text-center break-all">
        {user.email}
      </div>
    </div>
  );
}

export default ProfileCard;
