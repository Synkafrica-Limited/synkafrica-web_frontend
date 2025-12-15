"use client";
import React, { useRef, useState } from "react";
import { FiCamera } from "react-icons/fi";

function BusinessProfileCard({ business, user, onImageUpload }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const businessName = business?.businessName || business?.name || '';
  const businessInitials = business?.initials || (businessName ? businessName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && onImageUpload) {
      setUploading(true);
      try {
        await onImageUpload(file);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6">
        <div className="text-center">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 group">
            <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center shadow-lg overflow-hidden">
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
            {/* Camera Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Upload Profile Picture"
            >
              {uploading ? (
                <svg className="animate-spin h-4 w-4 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FiCamera className="w-4 h-4 text-primary-500" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : businessName || 'User'}
          </h3>
          <p className="text-white/90 text-sm">
            {user?.email || business?.email}
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600 font-medium">Verification Status</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              business?.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
              business?.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              business?.verificationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {business?.verificationStatus === 'verified' ? '✓ Verified' :
               business?.verificationStatus === 'pending' ? '⏳ Pending' :
               business?.verificationStatus === 'rejected' ? '⚠ Rejected' :
               '○ Not Verified'}
            </span>
          </div>

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
