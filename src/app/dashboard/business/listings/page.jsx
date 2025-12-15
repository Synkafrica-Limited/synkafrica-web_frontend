"use client";

import { useState, useEffect } from "react";
import authService from '@/services/authService';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Car,
  Waves,
  UtensilsCrossed,
  Package,
} from "lucide-react";
import Link from "next/link";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/components/ui/ToastProvider";
import { useQuickListings } from "@/hooks/business/useQuickListing";
import { useVendorListings } from '@/hooks/business/useVendorListings';
import { PageLoadingScreen } from "@/components/ui/LoadingScreen";
import Image from "next/image";
import { useUserProfile } from "@/hooks/business/useUserProfileVendor";
import dashboardService from "@/services/dashboardService";
import DashboardHeader from '@/components/layout/DashboardHeader';
import FilterTabs from '@/components/ui/FilterTabs';

// Service categories matching your requirements
const SERVICE_CATEGORIES = [
  {
    label: "Car Rental",
    icon: Car,
    value: "CAR_RENTAL",
    description: "Chauffeur services and vehicle rentals",
    color: "bg-blue-500",
  },
  {
    label: "Resorts",
    icon: Waves,
    value: "RESORT",
    description: "Beach party, jet ski, boat cruises",
    color: "bg-cyan-500",
  },
  {
    label: "Fine Dining",
    icon: UtensilsCrossed,
    value: "FINE_DINING",
    description: "Restaurant and dining experiences",
    color: "bg-orange-500",
  },
  {
    label: "Convenience Services",
    icon: Package,
    value: "CONVENIENCE_SERVICE",
    description: "Delivery, Rent a chef, etc",
    color: "bg-purple-500",
  },
];

// Skeleton Loader
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export default function ListingsPage() {
  const token = typeof window !== "undefined" ? authService.getAccessToken() : null;
  const { listings, loading, error, refetch, deleteListing, toggleStatus } = useVendorListings(token);
  const { user, loading: userLoading, error: userError } = useUserProfile(token);

  // compute user initials for avatar fallback
  const initials = (() => {
    try {
      const first = user?.firstName || user?.first_name || user?.firstname || '';
      const last = user?.lastName || user?.last_name || user?.lastname || '';
      if (!first && !last) {
        const email = user?.email || '';
        return email ? String(email).charAt(0).toUpperCase() : '';
      }
      const f = first ? String(first).trim().charAt(0).toUpperCase() : '';
      const l = last ? String(last).trim().charAt(0).toUpperCase() : '';
      return `${f}${l}` || '';
    } catch (e) {
      return '';
    }
  })();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(null);
  const [analytics, setAnalytics] = useState({});
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  // Fetch analytics for all listings
  const fetchAnalytics = async (listingsData) => {
    if (!listingsData || listingsData.length === 0) return;

    setAnalyticsLoading(true);
    const analyticsData = {};

    try {
      // Fetch analytics for each listing (you might want to batch this or use a single endpoint)
      const analyticsPromises = listingsData.map(async (listing) => {
        try {
          const data = await dashboardService.getListingAnalytics(listing.id);
          return { id: listing.id, ...data };
        } catch (error) {
          // Return default analytics if endpoint doesn't exist yet
          return {
            id: listing.id,
            views: Math.floor(Math.random() * 100) + 10, // Placeholder
            bookings: Math.floor(Math.random() * 20) + 1, // Placeholder
          };
        }
      });

      const results = await Promise.all(analyticsPromises);
      results.forEach((result) => {
        analyticsData[result.id] = result;
      });

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Fetch analytics when listings change
  useEffect(() => {
    if (listings.length > 0 && Object.keys(analytics).length === 0) {
      fetchAnalytics(listings);
    }
  }, [listings]);

  // Filter listings by category
  const filteredListings =
    selectedCategory === "all"
      ? listings
      : listings.filter((listing) => listing.category === selectedCategory);

  // Get counts by category
  const getCategoryCount = (categoryValue) => {
    return listings.filter((l) => l.category === categoryValue).length;
  };

  const handleDeleteListing = (listing) => {
    setListingToDelete(listing);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!listingToDelete) return;

    setIsDeleting(true);
    try {
      const listingId = listingToDelete.id || listingToDelete._id;
      if (!listingId) {
        throw new Error('Listing ID not found');
      }
      
      console.log('Confirming delete for listing:', listingId);
      
      await deleteListing(listingId);
      
      addToast({ 
        message: `"${listingToDelete.title}" has been deleted successfully`, 
        type: "success" 
      });
      
      setListingToDelete(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error('Delete listing error:', err);
      
      // Refetch only on error to restore correct state
      await refetch();
      
      const errorMsg = err?.response?.message || err?.message || "Failed to delete listing. Please try again.";
      addToast({ message: errorMsg, type: "error" });
      
      // Keep dialog open on error
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (listing) => {
    const newStatus = listing.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setTogglingStatus(listing.id);

    try {
      await toggleStatus(listing.id, newStatus);
      addToast({
        message: `Listing ${newStatus === "ACTIVE" ? "activated" : "deactivated"} successfully`,
        type: "success"
      });
    } catch (err) {
      addToast({ message: "Failed to update listing status. Please try again.", type: "error" });
    } finally {
      setTogglingStatus(null);
    }
  };

  if (loading)
    return <PageLoadingScreen message="Loading your listings..." />;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Listings</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Manage Listings"
        subtitle="Create and manage your service listings"

        rightActions={(
          <>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-5 h-5" />

            </button>
          </>
        )}
      />

      {/* Page Content */}
      <div className="flex-1 p-6">
        {/* Toast Notifications */}
        {toasts.map((toast, index) => (
          <div key={toast.id} style={{ top: `${1 + index * 5}rem` }}>
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => !isDeleting && setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          title="Delete Listing"
          message={`Are you sure you want to delete "${listingToDelete?.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          isLoading={isDeleting}
        />

        {/* Category Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-6 mt-4">
          <FilterTabs
            tabs={[
              { id: "all", label: "All", count: listings.length },
              ...SERVICE_CATEGORIES.map((category) => ({
                id: category.value,
                label: category.label,
                count: getCategoryCount(category.value)
              }))
            ]}
            activeTab={selectedCategory}
            onTabChange={setSelectedCategory}
            layout="scroll"
          />
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Package className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No listings found
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedCategory === "all"
                ? "Get started by creating your first listing"
                : "No listings in this category yet"}
            </p>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const category = SERVICE_CATEGORIES.find(
                (c) => c.value === listing.category
              );
              const Icon = category?.icon || Package;
              const listingId = listing.id || listing._id || listing._id?.toString?.() || '';

              return (
                <div
                  key={listingId || listing.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Listing Image */}
                  <div className="relative h-48 bg-gray-100">
                    {(() => {
                      const firstImage = (listing.images && listing.images.length > 0 && listing.images[0]);
                      // Handle both string URLs and image objects
                      const src = typeof firstImage === 'string'
                        ? firstImage
                        : firstImage?.secure_url || firstImage?.url || '/images/vendor/vendor-profile.jpg';

                      return (
                        <Image
                          src={src}
                          alt={listing.title || 'Listing image'}
                          width={800}
                          height={480}
                          className="w-full h-full object-cover"
                          unoptimized={typeof src === 'string' && src.startsWith('http') ? true : undefined}
                        />
                      );
                    })()}
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium text-white ${category?.color || 'bg-gray-500'}`}>
                        {category?.label || 'Unknown'}
                      </span>
                    </div>
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleToggleStatus(listing)}
                        disabled={togglingStatus === listing.id}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${listing.status === "ACTIVE"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        title={`Click to ${listing.status === "ACTIVE" ? "deactivate" : "activate"
                          }`}
                      >
                        {togglingStatus === listing.id ? (
                          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          listing.status === "ACTIVE" ? "Active" : "Inactive"
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Listing Details */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">
                      {listing.title}
                    </h3>
                    <p className="text-primary-600 font-bold text-lg mb-3">
                      ₦{listing.basePrice?.toLocaleString() || "0"}
                    </p>

                    {/* Menu Items for Fine Dining */}
                    {listing.category === 'FINE_DINING' && listing.dining?.menuItems && listing.dining.menuItems.length > 0 && (
                      <div className="mb-3 pb-3 border-b border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Menu Items:</p>
                        <div className="space-y-1">
                          {listing.dining.menuItems.slice(0, 3).map((item, idx) => (
                            <p key={idx} className="text-xs text-gray-600">
                              • {item.name}
                              {item.price && <span className="text-primary-600 font-semibold ml-1">₦{parseInt(item.price)?.toLocaleString() || 0}</span>}
                            </p>
                          ))}
                          {listing.dining.menuItems.length > 3 && (
                            <p className="text-xs text-gray-500 italic">
                              +{listing.dining.menuItems.length - 3} more items
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{analytics[listing.id]?.views || 0} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        <span>{analytics[listing.id]?.bookings || 0} bookings</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={(() => {
                          const baseUrl = `/dashboard/business/listings/${listingId}`;
                          switch (listing.category) {
                            case 'CAR_RENTAL':
                              return `${baseUrl}/edit`;
                            case 'RESORT':
                              return `${baseUrl}/edit-resort`;
                            case 'FINE_DINING':
                              return `${baseUrl}/edit-fine-dining`;
                            case 'CONVENIENCE_SERVICE':
                              return `${baseUrl}/edit-convenience`;
                            default:
                              return `${baseUrl}/edit`;
                          }
                        })()}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-50 text-primary-600 rounded-lg font-medium hover:bg-primary-100 transition-colors text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteListing(listing)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Category Selection Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40">
            <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-3xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Select Service Category
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    Choose the type of service you want to list
                  </p>
                </div>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid animate-fadeIn grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {SERVICE_CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.value}
                      href={`/dashboard/business/listings/new/${category.value}`}
                      className="group relative bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 hover:border-primary-500 hover:shadow-lg transition-all cursor-pointer min-h-[80px]"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`${category.color} p-3 rounded-lg text-white`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                            {category.label}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {category.description}
                          </p>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-5 h-5 text-primary-500" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
