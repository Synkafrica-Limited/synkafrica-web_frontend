"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import Buttons from "@/components/ui/Buttons";
import { useToast } from "@/components/ui/ToastProvider";
import { Toast } from "@/components/ui/Toast";
import listingsService from "@/services/listings.service";
import authService from "@/services/authService";
import { useBusiness } from "@/hooks/business/useBusiness";
import { buildListingPayload } from "@/utils/listingPayloadBuilder";
import { handleApiError } from "@/utils/errorParser";
import { enumToLabel, BACKEND_ENUMS } from "@/config/listingSchemas";
import { INITIAL_FORM_STATES } from "@/utils/formStates";

export default function EditFineDiningListing() {
  const router = useRouter();
  const params = useParams();
  const listingId = params?.id;
  const { toasts, addToast, removeToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedListing, setLoadedListing] = useState(null);

  const token = typeof window !== 'undefined' ? authService.getAccessToken() : null;
  const { business, loading: businessLoading } = useBusiness(token);

  // Initialize with strict form state
  const [form, setForm] = useState(INITIAL_FORM_STATES.FINE_DINING);

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (listingId) {
      loadListing();
    }
  }, [listingId]);

  const loadListing = async () => {
    try {
      setIsLoading(true);
      const listing = await listingsService.getListing(listingId);
      console.log('[EditFineDining] Loaded listing:', listing);

      // Store the full listing
      setLoadedListing(listing);

      // Extract location
      const locationObj = (listing.location && typeof listing.location === 'object') ? listing.location : {
        address: (typeof listing.location === 'string' ? listing.location : '') || (listing.address) || '',
        city: listing.city || 'Lagos',
        state: listing.state || 'Lagos',
        country: listing.country || 'Nigeria'
      };

      // Map API response to strict form state
      // Helper to consolidate arrays
      const consolidateArray = (...arrays) => {
        return arrays.flat().filter(Boolean);
      };

      const mapped = {
        ...INITIAL_FORM_STATES.FINE_DINING,
        title: listing.title || listing.restaurantName || "",
        description: listing.description || listing.summary || "",
        basePrice: listing.basePrice || listing.avgPrice || listing.priceRange || "", // Best effort map
        currency: listing.currency || "NGN",

        diningType: enumToLabel('FINE_DINING', 'diningType', listing.dining?.diningType || listing.diningType) || "RESTAURANT",

        cuisine: Array.isArray(listing.dining?.cuisine) ? listing.dining.cuisine :
          Array.isArray(listing.cuisineType) ? listing.cuisineType : [],

        menuUrl: listing.dining?.menuUrl || listing.menuUrl || "",

        reservationRequired: listing.dining?.reservationRequired !== false && listing.reservationRequired !== false,

        openingHours: listing.dining?.openingHours || listing.openingHours || listing.hours || "",
        daysOpen: listing.dining?.daysOpen || [],

        dietaryProvisions: listing.dining?.dietaryProvisions || [],
        dressCode: listing.dining?.dressCode || listing.dressCode || "",

        capacity: listing.dining?.capacity || listing.capacity || listing.maxGuests || "",

        features: consolidateArray(
          listing.dining?.features,
          listing.features,
          listing.dining?.specialties,
          listing.specialties,
          listing.dining?.amenities,
          listing.amenities
        ),

        location: locationObj,
        status: listing.status || listing.availability || "ACTIVE",
      };

      setForm(mapped);

      // Handle existing images
      const extractImageUrls = (images) => {
        if (!images) return [];
        if (typeof images === 'string') {
          try {
            images = JSON.parse(images);
          } catch {
            return [];
          }
        }
        if (!Array.isArray(images)) return [];

        return images.map(img => {
          if (typeof img === 'string' && img.trim()) return img;
          if (img && typeof img === 'object' && img.secure_url) {
            return img.secure_url;
          }
          return null;
        }).filter(Boolean);
      };

      const urls = extractImageUrls(listing.images);
      setExistingImages(urls);
    } catch (err) {
      console.error('[EditFineDining] Error loading listing:', err);
      addToast({ message: "Failed to load listing", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Get business ID
      const businessObj = Array.isArray(business) ? business[0] : business;
      const businessId = loadedListing?.businessId ||
        businessObj?.id ||
        businessObj?._id ||
        businessObj?.businessId || '';

      if (!businessId) {
        throw new Error('Business ID not found. Please ensure you have a valid business account.');
      }

      // Build payload
      const category = loadedListing?.category || 'FINE_DINING';

      // Combine existing and new images for payload
      const allImagePreviews = [
        ...existingImages,
        ...images.map(img => img.preview || img)
      ];

      const payload = buildListingPayload(category, form, businessId, allImagePreviews);

      console.log('[EditFineDining] Update payload:', payload);

      // Update listing
      const hasNewFiles = images.some((i) => i.file instanceof File);
      let res;

      if (hasNewFiles) {
        const newFiles = images
          .filter((i) => i.file instanceof File)
          .map((i) => i.file);

        console.log('[EditFineDining] Updating with new files:', newFiles.length);
        res = await listingsService.updateListingMultipart(listingId, payload, newFiles);
      } else {
        if (existingImages.length > 0) {
          payload.images = existingImages;
        }

        console.log('[EditFineDining] Updating without new files');
        res = await listingsService.updateListing(listingId, payload);
      }

      console.log('[EditFineDining] Update result:', res);
      addToast({ message: "Listing updated successfully", type: "success" });

      setTimeout(() => {
        router.push("/dashboard/business/listings");
      }, 1000);
    } catch (err) {
      console.error('[EditFineDining] Update error:', err);
      handleApiError(err, { addToast }, { setLoading: setIsSubmitting });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cuisineTypes = [
    "Nigerian",
    "Continental",
    "Asian",
    "Italian",
    "French",
    "Mediterranean",
    "Seafood",
    "Steakhouse",
    "Fusion",
    "Vegan",
    "Vegetarian",
  ];

  const diningTypes = Object.values(BACKEND_ENUMS.DINING_TYPE);

  const featureOptions = [
    "Chef's Tasting Menu",
    "Wine Pairing",
    "Private Dining Room",
    "Outdoor Seating",
    "Live Music",
    "Sunday Brunch",
    "Cocktail Bar",
    "Dessert Bar",
    "Air Conditioning",
    "Wi-Fi",
    "Parking",
    "Wheelchair Accessible",
    "Private Events",
    "Takeout Available",
    "Delivery Service",
    "Bar/Lounge",
  ];

  const daysOpenOptions = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const dietaryOptions = [
    "Vegan", "Vegetarian", "Gluten-Free", "Halal", "Kosher", "Nut-Free"
  ];

  if (isLoading || businessLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto text-primary-600" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="mt-4 text-gray-600">Loading listing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
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

      <div className="mb-6">
        <Link
          href="/dashboard/business/listings"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Edit Fine Dining Listing
        </h1>
        <p className="text-gray-600 mt-1">
          Update your restaurant or dining experience
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status Toggle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Listing Availability
              </h2>
              <p className="text-sm text-gray-600">
                Control whether this listing is visible to customers
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`text-sm font-medium ${form.status === "ACTIVE"
                  ? "text-green-600"
                  : "text-gray-600"
                  }`}
              >
                {form.status === "ACTIVE" ? "Active" : "Inactive"}
              </span>
              <button
                type="button"
                onClick={() => {
                  const isCurrentlyActive = form.status === "ACTIVE";
                  const newStatus = isCurrentlyActive ? "INACTIVE" : "ACTIVE";
                  setForm((prev) => ({ ...prev, status: newStatus }));
                  addToast({
                    message: `Listing ${isCurrentlyActive ? "deactivated" : "activated"}`,
                    type: "info",
                    duration: 2000
                  });
                }}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${form.status === "ACTIVE"
                  ? "bg-green-500"
                  : "bg-gray-300"
                  }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${form.status === "ACTIVE"
                    ? "translate-x-7"
                    : "translate-x-1"
                    }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Restaurant Images
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {/* Existing Images */}
            {existingImages.map((imageUrl, index) => (
              <div key={`existing-${index}`} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Existing ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* New Images */}
            {images.map((image, index) => (
              <div key={`new-${index}`} className="relative group">
                <img
                  src={image.preview}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Restaurant Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant Name *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., The Golden Fork"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dining Type *
              </label>
              <select
                name="diningType"
                value={form.diningType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select type</option>
                {diningTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                name="address"
                value={form.location?.address || (typeof form.location === 'string' ? form.location : '')}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm(prev => ({
                    ...prev,
                    location: {
                      ...(typeof prev.location === 'object' ? prev.location : {}),
                      address: val
                    }
                  }));
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Victoria Island, Lagos"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seating Capacity *
              </label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="50"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Average Price per Person (₦) *
              </label>
              <input
                type="number"
                name="basePrice"
                value={form.basePrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="15000"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine Types *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {cuisineTypes.map((cuisine) => (
                  <label key={cuisine} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Array.isArray(form.cuisine) && form.cuisine.includes(cuisine)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm((prev) => ({
                            ...prev,
                            cuisine: [...(Array.isArray(prev.cuisine) ? prev.cuisine : []), cuisine],
                          }));
                        } else {
                          setForm((prev) => ({
                            ...prev,
                            cuisine: (Array.isArray(prev.cuisine) ? prev.cuisine : []).filter(
                              (c) => c !== cuisine
                            ),
                          }));
                        }
                      }}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{cuisine}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days Open
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOpenOptions.map((day) => (
                  <label key={day} className={`px-3 py-1.5 rounded-full text-sm cursor-pointer border transition-colors ${(Array.isArray(form.daysOpen) && form.daysOpen.includes(day))
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={Array.isArray(form.daysOpen) && form.daysOpen.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm(prev => ({ ...prev, daysOpen: [...(Array.isArray(prev.daysOpen) ? prev.daysOpen : []), day] }));
                        } else {
                          setForm(prev => ({ ...prev, daysOpen: (Array.isArray(prev.daysOpen) ? prev.daysOpen : []).filter(d => d !== day) }));
                        }
                      }}
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Menu URL (Optional)
              </label>
              <input
                type="text"
                name="menuUrl"
                value={form.menuUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://example.com/menu.pdf"
              />
            </div>
          </div>
        </div>

        {/* Features & Dietary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Features & Dietary
          </h2>

          <h3 className="text-md font-semibold text-gray-900 mb-3 block">Features & Amenities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {featureOptions.map((feature) => (
              <label key={feature} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Array.isArray(form.features) && form.features.includes(feature)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm((prev) => ({
                        ...prev,
                        features: [...(Array.isArray(prev.features) ? prev.features : []), feature],
                      }));
                    } else {
                      setForm((prev) => ({
                        ...prev,
                        features: (Array.isArray(prev.features) ? prev.features : []).filter(
                          (f) => f !== feature
                        ),
                      }));
                    }
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{feature}</span>
              </label>
            ))}
          </div>

          <h3 className="text-md font-semibold text-gray-900 mb-3 block mt-6">Dietary Provisions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {dietaryOptions.map((provision) => (
              <label key={provision} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Array.isArray(form.dietaryProvisions) && form.dietaryProvisions.includes(provision)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm((prev) => ({
                        ...prev,
                        dietaryProvisions: [...(Array.isArray(prev.dietaryProvisions) ? prev.dietaryProvisions : []), provision],
                      }));
                    } else {
                      setForm((prev) => ({
                        ...prev,
                        dietaryProvisions: (Array.isArray(prev.dietaryProvisions) ? prev.dietaryProvisions : []).filter(
                          (p) => p !== provision
                        ),
                      }));
                    }
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{provision}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Additional Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe your restaurant's ambiance, experience..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opening Hours
                </label>
                <input
                  type="text"
                  name="openingHours"
                  value={form.openingHours}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Mon-Sun: 11AM - 11PM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dress Code
                </label>
                <input
                  type="text"
                  name="dressCode"
                  value={form.dressCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Smart Casual"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="reservationRequired"
                  checked={form.reservationRequired}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Reservation required
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href="/dashboard/business/listings"
            className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
          >
            Cancel
          </Link>
          <Buttons
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-none px-8 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Updating...
              </span>
            ) : (
              "Update Listing"
            )}
          </Buttons>
        </div>
      </form>
    </div>
  );
}
