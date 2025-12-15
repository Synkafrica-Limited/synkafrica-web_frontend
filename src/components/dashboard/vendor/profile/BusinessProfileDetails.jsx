"use client";
import React from "react";
import { FiMail, FiPhone, FiGlobe, FiMapPin, FiUser, FiCreditCard, FiClock, FiShield, FiCheck, FiX } from "react-icons/fi";

function BusinessProfileDetails({ business, user, onEdit }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 border-b border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Business Profile</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your business and personal information
            </p>
          </div>
          <button
            className="inline-flex items-center px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            onClick={onEdit}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Personal Information Section */}
        {user && (
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUser className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <FiUser className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 font-medium mb-1">Full Name</label>
                    <div className="text-sm font-semibold text-gray-900">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user.firstName || user.lastName || <span className="text-gray-400 italic font-normal">Not set</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <FiMail className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 font-medium mb-1">Email Address</label>
                    <div className="text-sm font-semibold text-gray-900 break-all">
                      {user.email || <span className="text-gray-400 italic font-normal">Not set</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <FiPhone className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 font-medium mb-1">Phone Number</label>
                    <div className="text-sm font-semibold text-gray-900">
                      {user.phoneNumber || <span className="text-gray-400 italic font-normal">Not set</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <FiShield className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 font-medium mb-1">Account Role</label>
                    <div className="text-sm font-semibold text-gray-900 capitalize">
                      {user.role || <span className="text-gray-400 italic font-normal">Not set</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <div className="w-4 h-4 mt-0.5">
                    {user.isEmailVerified ? (
                      <FiCheck className="w-4 h-4 text-green-500" />
                    ) : (
                      <FiX className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 font-medium mb-1">Email Verification</label>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.isEmailVerified 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {user.isEmailVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <div className="w-4 h-4 mt-0.5">
                    {user.isActive ? (
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-0.5"></div>
                    ) : (
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-0.5"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 font-medium mb-1">Account Status</label>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Business Information Section */}
        <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-6 border border-primary-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary-100 rounded-lg">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Business Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 font-medium mb-1">Business Name</label>
                  <div className="text-sm font-semibold text-gray-900 break-words">
                    {business.businessName || <span className="text-gray-400 italic font-normal">Not set</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 font-medium mb-1">Location</label>
                  <div className="text-sm font-semibold text-gray-900 break-words">
                    {business.businessLocation || <span className="text-gray-400 italic font-normal">Not set</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 font-medium mb-1">Description</label>
                  <div className="text-sm text-gray-700 line-clamp-3">
                    {business.description || business.businessDescription || <span className="text-gray-400 italic font-normal">Not set</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <FiPhone className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 font-medium mb-1">Primary Phone</label>
                  <div className="text-sm font-semibold text-gray-900">
                    {business.phoneNumber || <span className="text-gray-400 italic font-normal">Not set</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <FiPhone className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 font-medium mb-1">Secondary Phone</label>
                  <div className="text-sm font-semibold text-gray-900">
                    {business.secondaryPhone || business.phoneNumber2 || <span className="text-gray-400 italic font-normal">Not set</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <FiMail className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 font-medium mb-1">Email Address</label>
                  <div className="text-sm font-semibold text-gray-900 break-all">
                    {business.businessEmail || business.email || <span className="text-gray-400 italic font-normal">Not set</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <FiGlobe className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 font-medium mb-1">Website URL</label>
                  <div className="text-sm text-blue-600 break-all">
                    {business.url || business.businessURL ? (
                      <a href={business.url || business.businessURL} target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold">
                        {business.url || business.businessURL}
                      </a>
                    ) : (
                      <span className="text-gray-400 italic font-normal">Not set</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment & Operational Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <FiCreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 font-medium mb-1">Bank Name</label>
                  <div className="text-sm font-semibold text-gray-900">
                    {business.bankName || <span className="text-gray-400 italic font-normal">Not set</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <FiUser className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 font-medium mb-1">Account Holder</label>
                  <div className="text-sm font-semibold text-gray-900">
                    {business.bankAccountName || business.accountName || <span className="text-gray-400 italic font-normal">Not set</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <FiCreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 font-medium mb-1">Account Number</label>
                  <div className="text-sm font-semibold text-gray-900">
                    {business.bankAccountNumber || business.accountNumber || <span className="text-gray-400 italic font-normal">Not set</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <FiClock className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 font-medium mb-1">Availability</label>
                  <div className="text-sm font-semibold text-gray-900 capitalize">
                    {business.availability || <span className="text-gray-400 italic font-normal">Not set</span>}
                  </div>
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
