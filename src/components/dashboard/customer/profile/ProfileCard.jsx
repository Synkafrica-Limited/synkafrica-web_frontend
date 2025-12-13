"use client";
import React from "react";

function ProfileCard({ user }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="bg-gray-900 p-6">
        <div className="text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-sm border-4 border-white/20 flex items-center justify-center shadow-sm">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {user.initials}
              </span>
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
            {user.name}
          </h3>
          <p className="text-white/80 text-sm">
            {user.email}
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600 font-medium">Status</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600 font-medium">Member Since</span>
            <span className="text-sm text-gray-900 font-semibold">
              {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600 font-medium">Email Verified</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user.isEmailVerified 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {user.isEmailVerified ? 'Verified' : 'Pending'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600 font-medium">User ID</span>
            <span className="text-xs text-gray-500 font-mono">
              {user.id ? user.id.slice(-8) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
