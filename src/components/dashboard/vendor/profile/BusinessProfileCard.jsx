"use client";
import React from "react";

function BusinessProfileCard({ business, user }) {
  const businessName = business?.businessName || business?.name || '';
  const businessInitials = business?.initials || (businessName ? businessName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : null);
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6">
        <div className="text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center shadow-lg">
            {user?.avatar || business?.profileImage ? (
              <img
                src={user?.avatar || business?.profileImage}
                alt="Profile Picture"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {user?.firstName && user?.lastName
                  ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                  : businessInitials || 'U'}
              </span>
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : businessName || 'User'}
          </h3>
          <p className="text-white/90 text-sm">
            {user?.email || business?.email}
          </p>
          {business?.verificationStatus && (
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                business.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                business.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                business.verificationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {business.verificationStatus === 'verified' ? '✓ Verified' :
                 business.verificationStatus === 'pending' ? '⏳ Pending' :
                 business.verificationStatus === 'rejected' ? '⚠ Action Required' :
                 '○ Not Verified'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600 font-medium">Status</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user?.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {user?.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600 font-medium">Member Since</span>
            <span className="text-sm text-gray-900 font-semibold">
              {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600 font-medium">Email Verified</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user?.isEmailVerified 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {user?.isEmailVerified ? 'Verified' : 'Pending'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600 font-medium">User ID</span>
            <span className="text-xs text-gray-500 font-mono">
              {user?.id ? user.id.slice(-8) : business?.id ? business.id.slice(-8) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessProfileCard;
