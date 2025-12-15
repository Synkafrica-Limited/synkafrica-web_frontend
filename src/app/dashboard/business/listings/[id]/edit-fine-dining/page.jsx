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
import { enumToLabel } from "@/config/listingSchemas";

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

  const [form, setForm] = useState({
    restaurantName: "",
    cuisineType: [],
    diningType: "",
    location: "",
    capacity: "",
    priceRange: "",
    reservationRequired: true,
    menuItems: [{ name: "", description: "", price: "" }],
    specialties: [],
    amenities: [],
    description: "",
    openingHours: "",
    dressCode: "",
    availability: "ACTIVE",
  });

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
      const locationStr = (listing.location && (listing.location.address || listing.location.name)) ||
        (typeof listing.location === 'string' ? listing.location : '') ||
        listing.address || '';

      // Map API response to form state with comprehensive field extraction
      const cuisineTypeArray = Array.isArray(listing.dining?.cuisineType)
        ? listing.dining.cuisineType
        : Array.isArray(listing.cuisineType)
          ? listing.cuisineType
          : (listing.dining?.cuisineType || listing.cuisineType)
            ? [listing.dining?.cuisineType || listing.cuisineType]
            : [];

      const menuItemsArray = Array.isArray(listing.dining?.menuItems)
        ? listing.dining.menuItems
        : Array.isArray(listing.menuItems)
          ? listing.menuItems
          : [];

      const specialtiesArray = Array.isArray(listing.dining?.specialties)
        ? listing.dining.specialties
        : Array.isArray(listing.specialties)
          ? listing.specialties
          : [];

      const amenitiesArray = Array.isArray(listing.dining?.amenities)
        ? listing.dining.amenities
        : Array.isArray(listing.amenities)
          ? listing.amenities
          : Array.isArray(listing.facilities)
            ? listing.facilities
            : [];

      setForm({
        restaurantName: listing.title || listing.restaurantName || "",
        cuisineType: cuisineTypeArray.map(c => enumToLabel('FINE_DINING', 'cuisineType', c)),
        diningType: enumToLabel('FINE_DINING', 'diningType', listing.dining?.diningType || listing.diningType),
        location: locationStr,
        capacity: listing.dining?.seatingCapacity || listing.dining?.capacity || listing.capacity || listing.maxGuests || "",
        priceRange: listing.basePrice || listing.pricing?.range || listing.priceRange || "",
        reservationRequired: listing.dining?.reservationRequired !== false && listing.reservationRequired !== false,
        menuItems: menuItemsArray.length > 0
          ? menuItemsArray.map(item => ({
            name: item.name || "",
            description: item.description || "",
            price: item.price || "",
          }))
          : [{ name: "", description: "", price: "" }],
        specialties: specialtiesArray,
        amenities: amenitiesArray,
        description: listing.description || listing.summary || "",
        openingHours: listing.dining?.openingHours || listing.openingHours || listing.hours || "",
        dressCode: enumToLabel('FINE_DINING', 'dressCode', listing.dining?.dressCode || listing.dressCode),
        availability: listing.status || listing.availability || "ACTIVE",
      });

      // Handle existing images with proper extraction
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

  const handleMenuItemChange = (index, field, value) => {
    const updatedItems = [...form.menuItems];
    updatedItems[index][field] = value;
    setForm((prev) => ({ ...prev, menuItems: updatedItems }));
  };

  const addMenuItem = () => {
    setForm((prev) => ({
      ...prev,
      menuItems: [...prev.menuItems, { name: "", description: "", price: "" }],
    }));
  };

  const removeMenuItem = (index) => {
    if (form.menuItems.length > 1) {
      setForm((prev) => ({
        ...prev,
        menuItems: prev.menuItems.filter((_, i) => i !== index),
      }));
    }
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
    "Vegan/Vegetarian",
  ];

  const diningTypes = [
    "Fine Dining",
    "Casual Dining",
    "Bistro",
    "Cafe",
    "Lounge",
  ];

  const priceRanges = [
    "₦₦₦₦ (Luxury)",
    "₦₦₦ (Upscale)",
    "₦₦ (Moderate)",
    "₦ (Budget-Friendly)",
  ];

  const specialtyOptions = [
    "Chef's Tasting Menu",
    "Wine Pairing",
    "Private Dining Room",
    "Outdoor Seating",
    "Live Music",
    "Sunday Brunch",
    "Cocktail Bar",
    "Dessert Bar",
  ];

  const amenityOptions = [
    "Air Conditioning",
    "Wi-Fi",
    "Parking",
    "Wheelchair Accessible",
    "Private Events",
    "Takeout Available",
    "Delivery Service",
    "Bar/Lounge",
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
                className={`text-sm font-medium ${form.availability === "ACTIVE"
                    ? "text-green-600"
                    : "text-gray-600"
                  }`}
              >
                {form.availability === "ACTIVE" ? "Active" : "Inactive"}
              </span>
              <button
                type="button"
                onClick={() => {
                  const isCurrentlyActive = form.availability === "ACTIVE";
                  const newStatus = isCurrentlyActive ? "INACTIVE" : "ACTIVE";
                  setForm((prev) => ({ ...prev, availability: newStatus }));
                  addToast({
                    message: `Listing ${isCurrentlyActive ? "deactivated" : "activated"}`,
                    type: "info",
                    duration: 2000
                  });
                }}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${form.availability === "ACTIVE"
                    ? "bg-green-500"
                    : "bg-gray-300"
                  }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${form.availability === "ACTIVE"
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
                name="restaurantName"
                value={form.restaurantName}
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
                    {type}
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
                name="location"
                value={form.location}
                onChange={handleChange}
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
                Price Range *
              </label>
              <select
                name="priceRange"
                value={form.priceRange}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select price range</option>
                {priceRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
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
                      checked={Array.isArray(form.cuisineType) && form.cuisineType.includes(cuisine)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm((prev) => ({
                            ...prev,
                            cuisineType: [...(Array.isArray(prev.cuisineType) ? prev.cuisineType : []), cuisine],
                          }));
                        } else {
                          setForm((prev) => ({
                            ...prev,
                            cuisineType: (Array.isArray(prev.cuisineType) ? prev.cuisineType : []).filter(
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
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Menu Items *
            </h2>
            <button
              type="button"
              onClick={addMenuItem}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              + Add Item
            </button>
          </div>

          <div className="space-y-4">
            {form.menuItems.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 relative"
              >
                {form.menuItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMenuItem(index)}
                    className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dish Name *
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleMenuItemChange(index, "name", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Grilled Salmon"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        handleMenuItemChange(index, "description", e.target.value)
                      }
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Brief description of the dish..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₦) *
                    </label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleMenuItemChange(index, "price", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="5000"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specialties & Amenities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Specialties
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {specialtyOptions.map((specialty) => (
              <label key={specialty} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Array.isArray(form.specialties) && form.specialties.includes(specialty)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm((prev) => ({
                        ...prev,
                        specialties: [...(Array.isArray(prev.specialties) ? prev.specialties : []), specialty],
                      }));
                    } else {
                      setForm((prev) => ({
                        ...prev,
                        specialties: (Array.isArray(prev.specialties) ? prev.specialties : []).filter(
                          (s) => s !== specialty
                        ),
                      }));
                    }
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{specialty}</span>
              </label>
            ))}
          </div>

          <h3 className="text-md font-semibold text-gray-900 mb-3 mt-6">
            Amenities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {amenityOptions.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Array.isArray(form.amenities) && form.amenities.includes(amenity)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm((prev) => ({
                        ...prev,
                        amenities: [...(Array.isArray(prev.amenities) ? prev.amenities : []), amenity],
                      }));
                    } else {
                      setForm((prev) => ({
                        ...prev,
                        amenities: (Array.isArray(prev.amenities) ? prev.amenities : []).filter((a) => a !== amenity),
                      }));
                    }
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{amenity}</span>
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
