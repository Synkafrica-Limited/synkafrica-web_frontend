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
import { PageLoadingScreen } from "@/components/ui/LoadingScreen";

export default function EditConvenienceListing() {
  const router = useRouter();
  const params = useParams();
  const listingId = params?.id;
  const { toasts, addToast, removeToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedListing, setLoadedListing] = useState(null);

  const token = typeof window !== "undefined" ? authService.getAccessToken() : null;
  const { business, loading: businessLoading } = useBusiness(token);

  // Initialize with strict form state
  const [form, setForm] = useState(INITIAL_FORM_STATES.CONVENIENCE_SERVICE);

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
      console.log('[EditConvenience] Loaded listing:', listing);

      // Store the full listing
      setLoadedListing(listing);

      // Extract location
      const locationObj = (listing.location && typeof listing.location === 'object') ? listing.location : {
        address: (typeof listing.location === 'string' ? listing.location : '') || (listing.address) || '',
        city: listing.city || 'Lagos',
        state: listing.state || 'Lagos',
        country: listing.country || 'Nigeria'
      };

      // Extract pricing
      const pricingType = listing.convenience?.pricingType || listing.priceType || (listing.hourlyRate ? "HOURLY" : "FIXED");
      let basePriceVal = listing.basePrice;
      if (!basePriceVal) {
        if (pricingType === 'HOURLY') basePriceVal = listing.hourlyRate;
        else basePriceVal = listing.fixedPrice || listing.price;
      }

      const mapped = {
        ...INITIAL_FORM_STATES.CONVENIENCE_SERVICE,
        title: listing.title || listing.serviceName || "",
        description: listing.description || listing.summary || "",
        serviceDescription: listing.convenience?.serviceDescription || listing.description || "",
        basePrice: basePriceVal || "",
        currency: listing.currency || "NGN",

        serviceType: enumToLabel('CONVENIENCE_SERVICE', 'serviceType', listing.convenience?.serviceType || listing.serviceType) || "",
        pricingType: enumToLabel('CONVENIENCE_SERVICE', 'pricingType', pricingType).toUpperCase().replace(' ', '_'), // Ensure enum value

        // If pricingType logic was loose in backend, align it here
        // Actually, let's keep it rigorous. If it's "Fixed Price" label, convert to "FIXED".
        // But here I'm mapping to state. Let's rely on string values mostly.
        // However, the form checks against "FIXED" / "HOURLY".

        serviceArea: listing.convenience?.serviceArea || listing.coverageArea || locationObj.address || "",

        minimumOrder: listing.convenience?.minimumOrder || listing.minimumDuration || "",
        deliveryFee: listing.convenience?.deliveryServiceFee || listing.deliveryFee || "",

        features: listing.convenience?.serviceFeatures || listing.features || [],
        availability: listing.convenience?.availableDays || listing.availability || [], // Note: availability vs status

        responseTime: listing.convenience?.responseTime || "30",
        advanceBooking: listing.convenience?.advanceBookingRequired || false,

        location: locationObj,
        status: listing.status || "ACTIVE",
      };

      // Fix pricingType if it came back as label or undefined
      if (!['FIXED', 'HOURLY'].includes(mapped.pricingType)) {
        mapped.pricingType = mapped.pricingType === 'Hourly Rate' ? 'HOURLY' : 'FIXED';
      }

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
    } catch (error) {
      console.error("Error fetching listing:", error);
      addToast({ message: "Failed to load listing data", type: "error" });
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
      const category = loadedListing?.category || 'CONVENIENCE_SERVICE';

      // Combine existing and new images for payload
      const allImagePreviews = [
        ...existingImages,
        ...images.map(img => img.preview || img)
      ];

      const payloadForm = {
        ...form,
        // Ensure map legacy pricing fields if strictly needed, though backend builder should handle basePrice + mapping
        // But strict state uses basePrice.
        serviceDescription: form.serviceDescription || form.description,
      };

      const payload = buildListingPayload(category, payloadForm, businessId, allImagePreviews);

      // Update listing
      const hasNewFiles = images.some((i) => i.file instanceof File);
      let res;

      // Ensure pricing type is set if missing
      if (!payload.convenience) payload.convenience = {};

      // Force correct payload structure for pricing
      // Note: listingPayloadBuilder should handle this, but let's be safe

      if (hasNewFiles) {
        const newFiles = images
          .filter((i) => i.file instanceof File)
          .map((i) => i.file);

        console.log('[EditConvenience] Updating with new files:', newFiles.length);
        res = await listingsService.updateListingMultipart(listingId, payload, newFiles);
      } else {
        if (existingImages.length > 0) {
          payload.images = existingImages;
        }

        console.log('[EditConvenience] Updating without new files');
        res = await listingsService.updateListing(listingId, payload);
      }

      console.log('[EditConvenience] Update result:', res);
      addToast({ message: "Listing updated successfully", type: "success" });

      setTimeout(() => {
        router.push("/dashboard/business/listings");
      }, 1000);
    } catch (error) {
      console.error("Error updating listing:", error);
      handleApiError(error, { addToast }, { setLoading: setIsSubmitting });
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceTypes = Object.values(BACKEND_ENUMS.SERVICE_TYPE);

  const featureOptions = [
    "Same Day Service",
    "24/7 Availability",
    "Emergency Service",
    "Verified Professionals",
    "Insurance Coverage",
    "Flexible Scheduling",
    "Contactless Service",
    "Eco-Friendly Options",
  ];

  const availabilityOptions = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  if (isLoading || businessLoading) {
    return <PageLoadingScreen message="Loading listing..." />;
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
          Edit Convenience Service
        </h1>
        <p className="text-gray-600 mt-1">
          Update your convenience service listing
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Availability Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Listing Status
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
            Service Images
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {existingImages.map((image, index) => (
              <div key={`existing-${index}`} className="relative group">
                <img
                  src={image}
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

            {images.map((image, index) => (
              <div key={`new-${index}`} className="relative group">
                <img
                  src={image.preview}
                  alt={`New ${index + 1}`}
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
            Service Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Name *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Premium Home Chef Service"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Type *
              </label>
              <select
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select service type</option>
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ').replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase())}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coverage Area / Location *
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
                placeholder="e.g., Lagos Island, Lekki"
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pricing Type *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="pricingType"
                    value="FIXED"
                    checked={form.pricingType === "FIXED"}
                    onChange={(e) => setForm(prev => ({ ...prev, pricingType: "FIXED" }))}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Fixed Price</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="pricingType"
                    value="HOURLY"
                    checked={form.pricingType === "HOURLY"}
                    onChange={(e) => setForm(prev => ({ ...prev, pricingType: "HOURLY" }))}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Hourly Rate</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {form.pricingType === "FIXED" ? "Fixed Price (₦) *" : "Hourly Rate (₦) *"}
                </label>
                <input
                  type="number"
                  name="basePrice"
                  value={form.basePrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="5000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Order/Duration
                </label>
                <input
                  type="text"
                  name="minimumOrder"
                  value={form.minimumOrder}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 2 hours, ₦20,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery/Service Fee (₦)
                </label>
                <input
                  type="number"
                  name="deliveryFee"
                  value={form.deliveryFee}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="2000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Service Features
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                        features: (Array.isArray(prev.features) ? prev.features : []).filter((f) => f !== feature),
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

        {/* Availability */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Availability
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Days
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {availabilityOptions.map((day) => (
                  <label key={day} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Array.isArray(form.availability) && form.availability.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm((prev) => ({
                            ...prev,
                            availability: [...(Array.isArray(prev.availability) ? prev.availability : []), day],
                          }));
                        } else {
                          setForm((prev) => ({
                            ...prev,
                            availability: (Array.isArray(prev.availability) ? prev.availability : []).filter(
                              (d) => d !== day
                            ),
                          }));
                        }
                      }}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">
                      {day.slice(0, 3)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Response Time (minutes)
                </label>
                <select
                  name="responseTime"
                  value={form.responseTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    name="advanceBooking"
                    checked={form.advanceBooking}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Requires advance booking
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Service Description
          </h2>

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
              placeholder="Describe your service, what's included, special requirements..."
              required
            />
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
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
