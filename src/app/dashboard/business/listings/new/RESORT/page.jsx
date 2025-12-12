"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import Buttons from "@/components/ui/Buttons";
import { useToast } from "@/components/ui/ToastProvider";
import { useCreateResortListing } from '@/hooks/business/useCreateResortListing';
import { Toast } from "@/components/ui/Toast";

export default function NewResortListing() {
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createResortListing, isSubmitting: creating, businessLoading, businessError } = useCreateResortListing();
  const [form, setForm] = useState({
    resortName: "",
    packageType: "",
    location: "",
    duration: "",
    capacity: "",
    pricePerPerson: "",
    pricePerGroup: "",
    attractions: [],
    inclusions: [],
    description: "",
    availableDates: "",
    bookingAdvance: "24",
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    setIsSubmitting(true);
    try {
      await createResortListing(form, images);
    } catch (err) {
      // createResortListing already shows toasts
    } finally {
      setIsSubmitting(false);
    }
  };

  const packageTypes = [
    "Beach Party Package",
    "Water Sports Package",
    "Boat Cruise",
    "Resort Day Pass",
    "Weekend Getaway",
    "Custom Package",
  ];

  const attractionOptions = [
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
          Add Resort Package
        </h1>
        <p className="text-gray-600 mt-1">
          Create a new resort experience with beach attractions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            Package Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resort/Package Name *
              </label>
              <input
                type="text"
                name="resortName"
                value={form.resortName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Luxury Beach Party Experience"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Type *
              </label>
              <select
                name="packageType"
                value={form.packageType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select package type</option>
                {packageTypes.map((type) => (
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
                name="pricePerPerson"
                value={form.pricePerPerson}
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

        {/* Attractions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Attractions & Activities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {attractionOptions.map((attraction) => (
              <label key={attraction} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.attractions.includes(attraction)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm((prev) => ({
                        ...prev,
                        attractions: [...prev.attractions, attraction],
                      }));
                    } else {
                      setForm((prev) => ({
                        ...prev,
                        attractions: prev.attractions.filter(
                          (a) => a !== attraction
                        ),
                      }));
                    }
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{attraction}</span>
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
                  checked={form.inclusions.includes(inclusion)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm((prev) => ({
                        ...prev,
                        inclusions: [...prev.inclusions, inclusion],
                      }));
                    } else {
                      setForm((prev) => ({
                        ...prev,
                        inclusions: prev.inclusions.filter(
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Booking Advance Notice (hours)
              </label>
              <select
                name="bookingAdvance"
                value={form.bookingAdvance}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="24">24 hours</option>
                <option value="48">48 hours</option>
                <option value="72">72 hours</option>
                <option value="168">1 week</option>
              </select>
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
                Creating...
              </span>
            ) : (
              "Create Listing"
            )}
          </Buttons>
        </div>
      </form>
    </div>
  );
}
