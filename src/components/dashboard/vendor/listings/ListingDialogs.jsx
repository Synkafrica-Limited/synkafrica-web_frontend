/**
 * DeleteListingDialog - Confirmation dialog for listing deletions
 * Ensures users understand this is a soft delete (status change)
 */

import { useState } from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

export function DeleteListingDialog({ listing, onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <FiAlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Listing
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{' '}
              <span className="font-medium text-gray-900">"{listing?.title}"</span>?
            </p>
            <p className="text-sm text-gray-500">
              This action will mark the listing as inactive. You can reactivate it later from your listings dashboard.
            </p>
            
            {listing?.bookingsCount > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  ⚠️ This listing has {listing.bookingsCount} active booking(s). 
                  Deletion may be blocked if bookings are in progress.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isDeleting ? 'Deleting...' : 'Delete Listing'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * ConfirmStatusChangeDialog - Confirmation for status changes
 */
export function ConfirmStatusChangeDialog({ listing, newStatus, onConfirm, onCancel, isUpdating }) {
  const statusLabels = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    DRAFT: 'Draft',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Change Listing Status
          </h3>
          <p className="text-sm text-gray-600">
            Change "{listing?.title}" status to{' '}
            <span className="font-medium text-gray-900">{statusLabels[newStatus]}</span>?
          </p>
          
          {newStatus === 'ACTIVE' && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                ✓ This listing will be visible to customers
              </p>
            </div>
          )}
          
          {newStatus === 'INACTIVE' && (
            <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-sm text-gray-700">
                This listing will be hidden from customers but remain in your dashboard
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isUpdating}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isUpdating}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isUpdating ? 'Updating...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
