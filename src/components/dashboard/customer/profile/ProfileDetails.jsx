"use client";
import React from "react";

function ProfileDetails({ user, onEdit }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your personal details and identity information
            </p>
          </div>
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 transition-colors font-medium text-sm shadow-sm"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2">
              Basic Details
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">First Name</label>
                <div className="text-sm font-medium text-gray-900 break-words">
                  {user.firstName || <span className="text-gray-400 italic">Not set</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">Last Name</label>
                <div className="text-sm font-medium text-gray-900 break-words">
                  {user.lastName || <span className="text-gray-400 italic">Not set</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">Middle Name</label>
                <div className="text-sm font-medium text-gray-900 break-words">
                  {user.middleName || <span className="text-gray-400 italic">Not set</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">Date of Birth</label>
                <div className="text-sm font-medium text-gray-900">
                  {user.dob || <span className="text-gray-400 italic">Not set</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">Gender</label>
                <div className="text-sm font-medium text-gray-900 capitalize">
                  {user.gender || <span className="text-gray-400 italic">Not set</span>}
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
                <label className="block text-xs text-gray-500 font-medium mb-1">Email Address</label>
                <div className="text-sm font-medium text-gray-900 break-all">
                  {user.email || <span className="text-gray-400 italic">Not set</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">Phone Number</label>
                <div className="text-sm font-medium text-gray-900">
                  {user.phone || <span className="text-gray-400 italic">Not set</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2">
              Identity Information
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">Nationality</label>
                <div className="text-sm font-medium text-gray-900">
                  {user.nationality || <span className="text-gray-400 italic">Not set</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">National Identity</label>
                <div className="text-sm font-medium text-gray-900 break-words">
                  {user.national_identity || <span className="text-gray-400 italic">Not set</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1">Expiry Date</label>
                <div className="text-sm font-medium text-gray-900">
                  {user.expiry || <span className="text-gray-400 italic">Not set</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails;
