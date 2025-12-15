/**
 * VendorListingCard - Listing card for vendor dashboard
 * Displays listing with actions (edit, delete, status toggle)
 */

import { useState } from 'react';
import Link from 'next/link';
import { FiEdit2, FiTrash2, FiEye, FiMoreVertical } from 'react-icons/fi';
import { ListingStatusBadge, CategoryBadge } from './ListingBadges';
import { DeleteListingDialog, ConfirmStatusChangeDialog } from './ListingDialogs';

export function VendorListingCard({ listing, onDelete, onStatusChange, onUpdate }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await onDelete(listing.id || listing._id);

      if (result?.success) {
        setShowDeleteDialog(false);
      } else {
        // Show error message if deletion failed
        alert(result?.message || 'Failed to delete listing');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete listing');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setPendingStatus(newStatus);
    setShowStatusDialog(true);
  };

  const confirmStatusChange = async () => {
    setIsUpdating(true);
    try {
      const result = await onStatusChange(listing.id || listing._id, pendingStatus);

      if (result?.success) {
        setShowStatusDialog(false);
        setPendingStatus(null);
      } else {
        alert(result?.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Status change error:', err);
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const listingId = listing.id || listing._id;
  const imageUrl = listing.images?.[0] || '/images/placeholder-listing.jpg';
  const currency = listing.currency || 'NGN';

  // Calculate price based on category
  const getPriceDisplay = () => {
    const category = listing.category;

    if (category === 'FINE_DINING') {
      // For fine dining, calculate from menu items or use basePrice
      // Backend returns menuItems as a flat field on listing, not nested under dining
      const menuItems = listing.menuItems || listing.dining?.menuItems || [];

      if (menuItems.length > 0) {
        const prices = menuItems.map(item => item.price || 0);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        if (minPrice === maxPrice) {
          return {
            price: minPrice,
            label: 'per dish',
            showRange: false
          };
        }

        return {
          price: minPrice,
          maxPrice: maxPrice,
          label: 'price range',
          showRange: true
        };
      }

      // Fallback to basePrice
      return {
        price: listing.basePrice || 0,
        label: 'starting from',
        showRange: false
      };
    }

    // For other categories
    const price = listing.basePrice || listing.pricing?.perDay || 0;
    let label = '/day';

    if (category === 'CAR_RENTAL') {
      label = '/day';
    } else if (category === 'RESORT') {
      label = '/person';
    } else if (category === 'CONVENIENCE_SERVICE') {
      const priceType = listing.convenience?.pricingType || listing.pricingType;
      label = priceType === 'HOURLY' ? '/hour' : '';
    }

    return { price, label, showRange: false };
  };

  const priceInfo = getPriceDisplay();

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          <img
            src={imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/images/placeholder-listing.jpg';
            }}
          />

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <ListingStatusBadge status={listing.status} />
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <CategoryBadge category={listing.category} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
            {listing.title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {listing.description || 'No description provided'}
          </p>

          {/* Price */}
          <div className="mb-3">
            {priceInfo.showRange ? (
              <div>
                <span className="text-lg font-bold text-primary-600">
                  {currency} {priceInfo.price.toLocaleString()} - {currency} {priceInfo.maxPrice.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 ml-1">{priceInfo.label}</span>
              </div>
            ) : (
              <div>
                <span className="text-lg font-bold text-primary-600">
                  {currency} {priceInfo.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 ml-1">{priceInfo.label}</span>
              </div>
            )}

            {/* Show menu item count for fine dining */}
            {listing.category === 'FINE_DINING' && (listing.menuItems?.length || listing.dining?.menuItems?.length) > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                🍽️ {(listing.menuItems?.length || listing.dining?.menuItems?.length)} menu item{(listing.menuItems?.length || listing.dining?.menuItems?.length) !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Location */}
          {listing.location && (
            <p className="text-sm text-gray-500 mb-3">
              📍 {listing.location.city || listing.location.address}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <Link
              href={`/dashboard/business/listings/${listingId}/edit`}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <FiEdit2 className="w-4 h-4" />
              Edit
            </Link>

            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
            >
              <FiTrash2 className="w-4 h-4" />
              Delete
            </button>

            {/* Status Toggle Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <FiMoreVertical className="w-5 h-5" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="py-1">
                      {listing.status !== 'ACTIVE' && (
                        <button
                          onClick={() => {
                            handleStatusChange('ACTIVE');
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Set as Active
                        </button>
                      )}
                      {listing.status !== 'INACTIVE' && (
                        <button
                          onClick={() => {
                            handleStatusChange('INACTIVE');
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Set as Inactive
                        </button>
                      )}
                      {listing.status !== 'DRAFT' && (
                        <button
                          onClick={() => {
                            handleStatusChange('DRAFT');
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Set as Draft
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {showDeleteDialog && (
        <DeleteListingDialog
          listing={listing}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
          isDeleting={isDeleting}
        />
      )}

      {showStatusDialog && (
        <ConfirmStatusChangeDialog
          listing={listing}
          newStatus={pendingStatus}
          onConfirm={confirmStatusChange}
          onCancel={() => {
            setShowStatusDialog(false);
            setPendingStatus(null);
          }}
          isUpdating={isUpdating}
        />
      )}
    </>
  );
}
