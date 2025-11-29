"use client";
import React from "react";

function BusinessProfileDetails({ business, user, onEdit }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Business Information</h2>
            <p className="text-sm text-gray-600 mt-1">
              Complete your profile for a faster and better experience
            </p>
          </div>
          <button
            className="inline-flex items-center px-4 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors font-medium"
            onClick={onEdit}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Personal Information Section */}
        {user && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2">
                  Personal Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1">Full Name</label>
                    <div className="text-sm font-medium text-gray-900">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user.firstName || user.lastName || <span className="text-gray-400 italic">Not set</span>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1">Email Address</label>
                    <div className="text-sm font-medium text-gray-900 break-all">
                      {user.email || <span className="text-gray-400 italic">Not set</span>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1">Phone Number</label>
                    <div className="text-sm font-medium text-gray-900">
                      {user.phoneNumber || <span className="text-gray-400 italic">Not set</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2">
                  Account Details
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1">Role</label>
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {user.role || <span className="text-gray-400 italic">Not set</span>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1">Email Verified</label>
                    <div className="flex items-center gap-2">
                      {user.isEmailVerified ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-700 font-medium">Verified</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm text-yellow-700 font-medium">Not Verified</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1">Account Status</label>
                    <div className="flex items-center gap-2">
                      {user.isActive ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-700 font-medium">Active</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-red-700 font-medium">Inactive</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2">
                  Additional Info
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1">Nationality</label>
                    <div className="text-sm font-medium text-gray-900">
                      {user.nationality || <span className="text-gray-400 italic">Not set</span>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1">Gender</label>
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {user.gender || <span className="text-gray-400 italic">Not set</span>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1">Date of Birth</label>
                    <div className="text-sm font-medium text-gray-900">
                      {user.dob ? new Date(user.dob).toLocaleDateString() : <span className="text-gray-400 italic">Not set</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Business Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2">
              Basic Information
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">Business Name</label>
                <div className="text-sm font-medium text-gray-900 break-words">
                  {business.businessName || <span className="text-gray-400 italic">Not set</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">Business Location</label>
                <div className="text-sm font-medium text-gray-900 break-words">
                  {business.businessLocation || <span className="text-gray-400 italic">Not set</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">Business Description</label>
                <div className="text-sm text-gray-700 line-clamp-3">
                  {business.businessDescription || <span className="text-gray-400 italic">Not set</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2">
              Contact Information
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">Phone Number</label>
                <div className="text-sm font-medium text-gray-900">
                  {business.phoneNumber || <span className="text-gray-400 italic">Not set</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">Business URL</label>
                <div className="text-sm text-blue-600 break-all">
                  {business.businessURL ? (
                    <a href={business.businessURL} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {business.businessURL}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">Not set</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">Email Address</label>
                <div className="text-sm font-medium text-gray-900 break-all">
                  {business.email}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2">
              Business Details
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">Payment Details</label>
                <div className="text-sm font-medium text-gray-900">
                  {business.paymentDetails || <span className="text-gray-400 italic">Not set</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">Business FAQs</label>
                <div className="flex items-center gap-2">
                  {business.faqs ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-700 font-medium">Uploaded</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span className="text-sm text-gray-400 italic">Not uploaded</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">Availability</label>
                <div className="text-sm font-medium text-gray-900 capitalize">
                  {business.availability || <span className="text-gray-400 italic">Not set</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessProfileDetails;
