"use client";
import React from "react";

function BusinessProfileDetails({ business, onEdit }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 sm:p-6 w-full max-w-6xl min-w-0">
      <div className="font-semibold text-base sm:text-lg mb-1">
        Complete your profile basic information, for a faster and better experience
      </div>
      <div className="border border-[#E26A3D] rounded-xl p-3 sm:p-4 flex flex-col gap-2 relative mt-4">
        <button
          className="absolute top-3 right-3 sm:top-4 sm:right-4 px-3 sm:px-4 py-1 rounded-md border border-[#E26A3D] text-[#E26A3D] text-xs sm:text-sm font-medium hover:bg-[#E26A3D]/10 transition"
          onClick={onEdit}
        >
          Edit
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-3">
          <div>
            <div className="text-xs text-gray-500 font-semibold">Business Name</div>
            <div className="font-medium wrap-break-word">{business.businessName || <span className="text-gray-400">-</span>}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-semibold">Business Location</div>
            <div className="font-medium wrap-break-word">{business.businessLocation || <span className="text-gray-400">-</span>}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-semibold">Business Description</div>
            <div className="font-medium wrap-break-word">{business.businessDescription || <span className="text-gray-400">-</span>}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-semibold">Phone Number</div>
            <div className="font-medium wrap-break-word">{business.phoneNumber || <span className="text-gray-400">-</span>}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-semibold">Business URL</div>
            <div className="font-medium break-all">{business.businessURL || <span className="text-gray-400">-</span>}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-semibold">Email Address</div>
            <div className="font-medium break-all">{business.email}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-semibold">Business Payment Details</div>
            <div className="font-medium wrap-break-word">{business.paymentDetails || <span className="text-gray-400">-</span>}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-semibold">Business FAQs & Policies</div>
            <div className="font-medium wrap-break-word">
              {business.faqs ? (
                <span className="text-[#E26A3D] flex items-center gap-1">
                  <span className="w-1 h-1 bg-[#E26A3D] rounded-full"></span> Uploaded
                </span>
              ) : (
                <span className="text-gray-400">Not uploaded</span>
              )}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-semibold">Business Service License</div>
            <div className="font-medium wrap-break-word">
              {business.serviceLicense ? (
                <span className="text-[#E26A3D] flex items-center gap-1">
                  <span className="w-1 h-1 bg-[#E26A3D] rounded-full"></span> Uploaded
                </span>
              ) : (
                <span className="text-gray-400">Not uploaded</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessProfileDetails;
