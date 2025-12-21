"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import Buttons from "@/components/ui/Buttons";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/components/ui/ToastProvider";
import listingsService from '@/services/listings.service';
import authService from '@/services/authService';
import { useBusiness } from '@/hooks/business/useBusiness';
import { handleApiError } from '@/utils/errorParser';
import { buildListingPayload, buildUpdateListingPayload } from '@/utils/listingPayloadBuilder';
import { enumToLabel, BACKEND_ENUMS } from '@/config/listingSchemas';
import { INITIAL_FORM_STATES } from "@/utils/formStates";

export default function EditResortListing() {
  const router = useRouter();
  const { id } = useParams();
  const { toasts, addToast, removeToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedListing, setLoadedListing] = useState(null);

  const token = typeof window !== "undefined" ? authService.getAccessToken() : null;
  const { business, loading: businessLoading, error: businessError } = useBusiness(token);

  // Initialize with strict form state
  const [form, setForm] = useState(INITIAL_FORM_STATES.RESORT);
  const [initialForm, setInitialForm] = useState(null); // Keep track of initial state for diffing

  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadListing = async () => {
      setIsLoading(true);
      try {
        const res = await listingsService.getListing(id);
        if (res) {
          setLoadedListing(res);

          // Helper to extract image URLs
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

          // Map API response to strict form state
          const mapped = {
            ...INITIAL_FORM_STATES.RESORT,
            title: res.title || res.resortName || '',
            description: res.description || '',
            basePrice: res.basePrice || res.pricePerPerson || '',
            currency: res.currency || 'NGN',

            // Category fields (flatten from res or res.resort)
            resortType: res.resort?.resortType || res.resortType || 'HOTEL',
            roomType: res.resort?.roomType || res.roomType || 'STANDARD',
            packageType: res.resort?.packageType || res.packageType || '',

            capacity: res.resort?.capacity || res.capacity || res.maxOccupancy || '',
            duration: res.resort?.duration || res.duration || '',

            availableDates: res.resort?.availableDates || res.availableDates || '',
            checkInTime: res.resort?.checkInTime || res.checkInTime || '14:00',
            checkOutTime: res.resort?.checkOutTime || res.checkOutTime || '11:00',
            advanceBookingRequired: Boolean(res.resort?.advanceBookingRequired || res.advanceBookingRequired),
            minimumAdvanceHours: res.resort?.minimumAdvanceHours || res.minimumAdvanceHours || 0,

            pricePerGroup: res.resort?.pricePerGroup || res.pricePerGroup || '',
            minimumGroupSize: res.resort?.minimumGroupSize || '',

            activities: Array.isArray(res.resort?.activities) ? res.resort.activities :
              Array.isArray(res.resort?.attractions) ? res.resort.attractions :
                Array.isArray(res.attractions) ? res.attractions : [],

            inclusions: Array.isArray(res.resort?.inclusions) ? res.resort.inclusions :
              Array.isArray(res.inclusions) ? res.inclusions :
                Array.isArray(res.amenities) ? res.amenities : [],

            amenities: res.amenities || [], // If backend stores amenities separately

            location: (res.location && typeof res.location === 'object') ? res.location : {
              address: (typeof res.location === 'string' ? res.location : '') || (res.address) || '',
              city: res.city || 'Lagos',
              state: res.state || 'Lagos',
              country: res.country || 'Nigeria'
            },

            status: res.status || res.availability || 'ACTIVE',
          };

          setForm(mapped);
          setInitialForm(mapped); // Save initial state

          // Extract and set images
          const urls = extractImageUrls(res.images);
          const existing = urls.map((url) => ({
            preview: url,
            existing: true
          }));
          setImages(existing);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to load listing:', err);
        }
        addToast({ message: 'Failed to load listing. Please try again.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadListing();
    }
  }, [id]);

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

      // Generate Original Payload from Initial Form State (for accurate diffing)
      const category = loadedListing?.category || 'RESORT';

      // We reconstruct what the payload WOULD be for the initial state
      // This normalizes structure and types (e.g. strings to numbers)
      const originalPayload = buildListingPayload(category, initialForm, businessId, []);

      // Build minimal update payload (diff only)
      // Pass originalPayload as the "originalListing" source of truth
      const payload = buildUpdateListingPayload(form, originalPayload);

      if (!payload || (Object.keys(payload).length === 0 && !images.some(i => i.file instanceof File))) {
        addToast({ message: 'No changes detected', type: 'info' });
        setIsSubmitting(false);
        return;
      }

      // Update listing
      const hasNewFiles = images.some((i) => i.file instanceof File);
      let res;

      if (hasNewFiles) {
        const newFiles = images
          .filter((i) => i.file instanceof File)
          .map((i) => i.file);

        res = await listingsService.updateListingMultipart(id, payload, newFiles);
      } else {
        // For standard updates, payload includes 'images' array of URLs if changed
        res = await listingsService.updateListing(id, payload);
      }

      addToast({ message: 'Resort listing updated successfully', type: 'success' });

      setTimeout(() => {
        router.push('/dashboard/business/listings');
      }, 1000);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[EditResort] Update failed:', err);
      }
      handleApiError(err, { addToast }, { setLoading: setIsSubmitting });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resortTypes = Object.values(BACKEND_ENUMS.RESORT_TYPE);
  const packageTypes = Object.values(BACKEND_ENUMS.PACKAGE_TYPE);
  const roomTypes = Object.values(BACKEND_ENUMS.ROOM_TYPE);

  const activityOptions = [
    "Beach Access",
    "Jet Ski",
    "Boat Cruise",
    "Parasailing",
    "Banana Boat",
    "Kayaking",
    "Snorkeling",
    "Beach Volleyball",
    "Swimming Pool",
    "Private Cabana",
  ];

  const inclusionOptions = [
    "Welcome Drinks",
    "Lunch Buffet",
    "Dinner",
    "BBQ",
    "DJ/Music",
    "Photography",
    "Life Jackets",
    "Equipment Rental",
    "Transportation",
    "Tour Guide",
  ];

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
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

      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/business/listings"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Edit Resort Listing
        </h1>
        <p className="text-gray-600 mt-1">Update your resort experience details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Availability Status Toggle */}
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
            Resort Images
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.preview}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                {image.existing && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded">
                    Existing
                  </span>
                )}
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
            Package Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resort/Package Name *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Luxury Beach Party Experience"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resort Type *
              </label>
              <select
                name="resortType"
                value={form.resortType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select resort type</option>
                {resortTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type *
              </label>
              <select
                name="roomType"
                value={form.roomType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select room type</option>
                {roomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Type
              </label>
              <select
                name="packageType"
                value={form.packageType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select package type (Optional)</option>
                {packageTypes.map((type) => (
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
                placeholder="e.g., Lekki Beach, Lagos"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Full Day (8 hours)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Capacity *
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
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Person (₦) *
              </label>
              <input
                type="number"
                name="basePrice"
                value={form.basePrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="50000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Group (₦)
              </label>
              <input
                type="number"
                name="pricePerGroup"
                value={form.pricePerGroup}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="1500000"
              />
              <p className="text-xs text-gray-500 mt-1">
                For exclusive group bookings
              </p>
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Attractions & Activities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {activityOptions.map((activity) => (
              <label key={activity} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Array.isArray(form.activities) && form.activities.includes(activity)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm((prev) => ({
                        ...prev,
                        activities: [...(Array.isArray(prev.activities) ? prev.activities : []), activity],
                      }));
                    } else {
                      setForm((prev) => ({
                        ...prev,
                        activities: (Array.isArray(prev.activities) ? prev.activities : []).filter(
                          (a) => a !== activity
                        ),
                      }));
                    }
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{activity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Inclusions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Package Inclusions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {inclusionOptions.map((inclusion) => (
              <label key={inclusion} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Array.isArray(form.inclusions) && form.inclusions.includes(inclusion)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm((prev) => ({
                        ...prev,
                        inclusions: [...(Array.isArray(prev.inclusions) ? prev.inclusions : []), inclusion],
                      }));
                    } else {
                      setForm((prev) => ({
                        ...prev,
                        inclusions: (Array.isArray(prev.inclusions) ? prev.inclusions : []).filter(
                          (i) => i !== inclusion
                        ),
                      }));
                    }
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{inclusion}</span>
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
                placeholder="Describe the resort experience, what makes it special..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Dates
              </label>
              <input
                type="text"
                name="availableDates"
                value={form.availableDates}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Weekends, Holidays, All year round"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Time
                </label>
                <input
                  type="time"
                  name="checkInTime"
                  value={form.checkInTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Time
                </label>
                <input
                  type="time"
                  name="checkOutTime"
                  value={form.checkOutTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                name="advanceBookingRequired"
                id="advanceBookingRequired"
                checked={form.advanceBookingRequired}
                onChange={handleChange}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <div>
                <label htmlFor="advanceBookingRequired" className="block text-sm font-medium text-gray-900">
                  Advance Booking Required
                </label>
                <p className="text-xs text-gray-500">
                  Customers must book at least 24 hours in advance
                </p>
              </div>
            </div>

            {form.advanceBookingRequired && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Advance Notice (Hours)
                </label>
                <select
                  name="minimumAdvanceHours"
                  value={form.minimumAdvanceHours}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="0">Select hours...</option>
                  <option value="24">24 Hours</option>
                  <option value="48">48 Hours</option>
                  <option value="72">72 Hours</option>
                  <option value="168">1 Week</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  How many hours in advance must a customer book?
                </p>
              </div>
            )}
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
