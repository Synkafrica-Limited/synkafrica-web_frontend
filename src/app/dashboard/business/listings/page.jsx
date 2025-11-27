"use client";

import { useState } from "react";
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
import { useToast } from "@/hooks/useNotifications";
import { useVendorListings } from "@/hooks/business/useVendorListings";

// Service categories matching your requirements
const SERVICE_CATEGORIES = [
  {
    label: "Car Rental",
    icon: Car,
    value: "car-rental",
    description: "Chauffeur services and vehicle rentals",
    color: "bg-blue-500",
  },
  {
    label: "Resorts",
    icon: Waves,
    value: "resorts",
    description: "Beach party, jet ski, boat cruises",
    color: "bg-cyan-500",
  },
  {
    label: "Fine Dining",
    icon: UtensilsCrossed,
    value: "fine-dining",
    description: "Restaurant and dining experiences",
    color: "bg-orange-500",
  },
  {
    label: "Convenience Services",
    icon: Package,
    value: "convenience",
    description: "Delivery, Rent a chef, etc",
    color: "bg-purple-500",
  },
];

export default function ListingsPage() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("vendorToken") : null;
  const { listings, loading, error, refetch } = useVendorListings(token);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

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
    setIsDeleting(true);

    try {
      // TODO: Replace with real API delete call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remove listing from local state
      setListingToDelete(null);
      addToast(
        `"${listingToDelete.title}" has been deleted successfully`,
        "success"
      );
      refetch(); // Refresh listings
    } catch {
      addToast("Failed to delete listing", "error");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleToggleStatus = async (listing) => {
    const newStatus = listing.status === "active" ? "inactive" : "active";

    // Optimistically update UI
    const updatedListings = listings.map((l) =>
      l.id === listing.id ? { ...l, status: newStatus } : l
    );

    try {
      // TODO: Submit to API
      await new Promise((resolve) => setTimeout(resolve, 500));
      addToast(
        `Listing ${
          newStatus === "active" ? "activated" : "deactivated"
        } successfully`,
        "success"
      );
      refetch(); // Refresh listings
    } catch {
      addToast("Failed to update listing status", "error");
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600">
        Loading your listings...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-600">
        Error fetching listings: {error}
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
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

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Listings</h2>
          <p className="text-gray-600 text-sm mt-1">
            Create and manage your service listings
          </p>
        </div>
        <button
          onClick={() => setShowCategoryModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Add New Listing
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedCategory === "all"
                ? "bg-primary-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({listings.length})
          </button>
          {SERVICE_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const count = getCategoryCount(category.value);
            return (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedCategory === category.value
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
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

            return (
              <div
                key={listing.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Listing Image */}
                <div className="relative h-48 bg-gray-100">
                  {listing.image ? (
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleToggleStatus(listing)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        listing.status === "active"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      title={`Click to ${
                        listing.status === "active" ? "deactivate" : "activate"
                      }`}
                    >
                      {listing.status === "active" ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>

                {/* Listing Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
                    {listing.title}
                  </h3>
                  <p className="text-primary-600 font-bold text-lg mb-3">
                    {listing.price}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{listing.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      <span>{listing.bookings} bookings</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/business/listings/${listing.id}/edit`}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 sm:p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Select Service Category
                </h2>
                <p className="text-gray-600 text-sm mt-1">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICE_CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.value}
                    href={`/dashboard/business/listings/new/${category.value}`}
                    className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary-500 hover:shadow-lg transition-all cursor-pointer"
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

      <style jsx global>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
