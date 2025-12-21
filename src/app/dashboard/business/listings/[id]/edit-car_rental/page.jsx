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
import { buildListingPayload } from '@/utils/listingPayloadBuilder';
import { enumToLabel, BACKEND_ENUMS } from '@/config/listingSchemas';
import { INITIAL_FORM_STATES } from "@/utils/formStates";

export default function EditCarRentalListing() {
  const router = useRouter();
  const { id } = useParams();
  const { toasts, addToast, removeToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedListing, setLoadedListing] = useState(null);

  const token = typeof window !== "undefined" ? authService.getAccessToken() : null;
  const { business, loading: businessLoading, error: businessError } = useBusiness(token);

  // Initialize with strict form state
  const [form, setForm] = useState(INITIAL_FORM_STATES.CAR_RENTAL);

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
            ...INITIAL_FORM_STATES.CAR_RENTAL, // ensure defaults
            title: res.title || res.vehicleName || '',
            description: res.description || '',
            basePrice: res.basePrice || res.pricePerDay || '',
            currency: res.currency || 'NGN',

            // Category fields (flatten from res or res.carRental)
            carMake: res.carMake || res.brand || res.carRental?.carMake || '',
            carModel: res.carModel || res.model || res.carRental?.carModel || '',
            carYear: res.carYear || res.year || res.carRental?.carYear || '',
            carSeats: res.carSeats || res.seats || res.carRental?.carSeats || '',
            carTransmission: res.carTransmission || res.transmission || res.carRental?.carTransmission || '', // Enum value
            carFuelType: res.carFuelType || res.fuelType || res.carRental?.carFuelType || '', // Enum value
            carPlateNumber: res.carPlateNumber || res.carRental?.carPlateNumber || '',

            carFeatures: Array.isArray(res.carFeatures) ? res.carFeatures :
              Array.isArray(res.features) ? res.features :
                Array.isArray(res.carRental?.carFeatures) ? res.carRental?.carFeatures : [],

            chauffeurIncluded: Boolean(res.chauffeurIncluded || res.carRental?.chauffeurIncluded),
            chauffeurPricePerDay: res.chauffeurPricePerDay || res.carRental?.chauffeurPricePerDay || '',
            chauffeurPricePerHour: res.chauffeurPricePerHour || res.carRental?.chauffeurPricePerHour || '',

            location: (res.location && typeof res.location === 'object') ? res.location : {
              address: (typeof res.location === 'string' ? res.location : '') || (res.address) || '',
              city: res.city || 'Lagos',
              state: res.state || 'Lagos',
              country: res.country || 'Nigeria'
            },

            status: res.status || res.availability || 'ACTIVE',
          };

          setForm(mapped);

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

      // Build payload
      const category = loadedListing?.category || 'CAR_RENTAL';
      const payload = buildListingPayload(category, form, businessId, images);

      // Update listing
      const hasNewFiles = images.some((i) => i.file instanceof File);
      let res;

      if (hasNewFiles) {
        const newFiles = images
          .filter((i) => i.file instanceof File)
          .map((i) => i.file);

        res = await listingsService.updateListingMultipart(id, payload, newFiles);
      } else {
        const existingImageUrls = images
          .filter((i) => i.existing && i.preview)
          .map((i) => i.preview);

        if (existingImageUrls.length > 0) {
          payload.images = existingImageUrls;
        }

        res = await listingsService.updateListing(id, payload);
      }

      addToast({ message: 'Car rental listing updated successfully', type: 'success' });

      setTimeout(() => {
        router.push('/dashboard/business/listings');
      }, 1000);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[EditCarRental] Update failed:', err);
      }
      handleApiError(err, { addToast }, { setLoading: setIsSubmitting });
    } finally {
      setIsSubmitting(false);
    }
  };

  const transmissionTypes = Object.values(BACKEND_ENUMS.CAR_TRANSMISSION);
  const fuelTypes = Object.values(BACKEND_ENUMS.CAR_FUEL_TYPE);

  const featureOptions = [
    "Air Conditioning",
    "GPS",
    "Bluetooth",
    "Backup Camera",
    "Sunroof",
    "Leather Seats",
    "USB Charging",
    "Child Seat Available",
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
          Edit Car Rental
        </h1>
        <p className="text-gray-600 mt-1">Update your car rental listing details</p>
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
            Vehicle Images
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

        {/* Vehicle Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Vehicle Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Name *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Mercedes Benz S-Class"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand *
              </label>
              <input
                type="text"
                name="carMake"
                value={form.carMake}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Mercedes Benz"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model *
              </label>
              <input
                type="text"
                name="carModel"
                value={form.carModel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., S-Class"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year *
              </label>
              <input
                type="number"
                name="carYear"
                value={form.carYear}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="2024"
                min="1990"
                max="2025"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plate Number *
              </label>
              <input
                type="text"
                name="carPlateNumber"
                value={form.carPlateNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., ABC-123-XY"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Seats *
              </label>
              <input
                type="number"
                name="carSeats"
                value={form.carSeats}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="4"
                min="1"
                max="50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transmission *
              </label>
              <select
                name="carTransmission"
                value={form.carTransmission}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select transmission</option>
                {transmissionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fuel Type *
              </label>
              <select
                name="carFuelType"
                value={form.carFuelType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select fuel type</option>
                {fuelTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Day (₦) *
              </label>
              <input
                type="number"
                name="basePrice"
                value={form.basePrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="25000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chauffeur Price per Hour (₦)
              </label>
              <input
                type="number"
                name="chauffeurPricePerHour"
                value={form.chauffeurPricePerHour}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="5000"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="chauffeurIncluded"
                  checked={form.chauffeurIncluded}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Chauffeur service included
                </span>
              </label>
            </div>

            {form.chauffeurIncluded && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Chauffeur Price per Day (₦)
                </label>
                <input
                  type="number"
                  name="chauffeurPricePerDay"
                  value={form.chauffeurPricePerDay}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="10000"
                />
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Features & Amenities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {featureOptions.map((feature) => (
              <label key={feature} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Array.isArray(form.carFeatures) && form.carFeatures.includes(feature)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm((prev) => ({
                        ...prev,
                        carFeatures: [...(Array.isArray(prev.carFeatures) ? prev.carFeatures : []), feature],
                      }));
                    } else {
                      setForm((prev) => ({
                        ...prev,
                        carFeatures: (Array.isArray(prev.carFeatures) ? prev.carFeatures : []).filter((f) => f !== feature),
                      }));
                    }
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{feature}</span>
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
                placeholder="Describe your vehicle and services..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Location *
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
                placeholder="e.g., Lekki Phase 1, Lagos"
                required
              />
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
