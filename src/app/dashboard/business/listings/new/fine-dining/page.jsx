"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import Buttons from "@/components/ui/Buttons";
import { useToast } from "@/hooks/useNotifications";
import { Toast } from "@/components/ui/Toast";

export default function NewFineDiningListing() {
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    restaurantName: "",
    cuisineType: [],
    diningType: "",
    location: "",
    capacity: "",
    priceRange: "",
    reservationRequired: true,
    menuHighlights: "",
    specialties: [],
    amenities: [],
    description: "",
    openingHours: "",
    dressCode: "",
  });

  const [images, setImages] = useState([]);
  const [menuPDF, setMenuPDF] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleMenuUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMenuPDF(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Fine dining listing:", form, images, menuPDF);
      addToast("Fine dining listing created successfully!", "success");
      setTimeout(() => router.push("/dashboard/business/listings"), 1000);
    } catch {
      addToast("Failed to create listing. Please try again.", "error");
      setIsSubmitting(false);
    }
  };

  const cuisineTypes = [
    "Nigerian", "Continental", "Asian", "Italian", "French", 
    "Mediterranean", "Seafood", "Steakhouse", "Fusion", "Vegan/Vegetarian"
  ];

  const diningTypes = ["Fine Dining", "Casual Dining", "Bistro", "Cafe", "Lounge"];
  const priceRanges = ["₦₦₦₦ (Luxury)", "₦₦₦ (Upscale)", "₦₦ (Moderate)", "₦ (Budget-Friendly)"];

  const specialtyOptions = [
    "Chef's Tasting Menu",
    "Wine Pairing",
    "Private Dining Room",
    "Outdoor Seating",
    "Live Music",
    "Sunday Brunch",
    "Cocktail Bar",
    "Dessert Bar"
  ];

  const amenityOptions = [
    "Air Conditioning",
    "Wi-Fi",
    "Parking",
    "Wheelchair Accessible",
    "Private Events",
    "Takeout Available",
    "Delivery Service",
    "Bar/Lounge"
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add Fine Dining Listing</h1>
        <p className="text-gray-600 mt-1">Create a new restaurant or dining experience</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Images</h2>
          
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Information</h2>
          
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
                {diningTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
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
                {priceRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine Types *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {cuisineTypes.map(cuisine => (
                  <label key={cuisine} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.cuisineType.includes(cuisine)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm(prev => ({
                            ...prev,
                            cuisineType: [...prev.cuisineType, cuisine]
                          }));
                        } else {
                          setForm(prev => ({
                            ...prev,
                            cuisineType: prev.cuisineType.filter(c => c !== cuisine)
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Menu & Specialties</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Menu (PDF)
              </label>
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-primary-500 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {menuPDF ? menuPDF.name : "Click to upload menu PDF"}
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleMenuUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Menu Highlights
              </label>
              <textarea
                name="menuHighlights"
                value={form.menuHighlights}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe your signature dishes..."
              />
            </div>
          </div>
        </div>

        {/* Specialties & Amenities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Specialties</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {specialtyOptions.map(specialty => (
              <label key={specialty} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.specialties.includes(specialty)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm(prev => ({
                        ...prev,
                        specialties: [...prev.specialties, specialty]
                      }));
                    } else {
                      setForm(prev => ({
                        ...prev,
                        specialties: prev.specialties.filter(s => s !== specialty)
                      }));
                    }
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{specialty}</span>
              </label>
            ))}
          </div>

          <h3 className="text-md font-semibold text-gray-900 mb-3 mt-6">Amenities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {amenityOptions.map(amenity => (
              <label key={amenity} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.amenities.includes(amenity)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm(prev => ({
                        ...prev,
                        amenities: [...prev.amenities, amenity]
                      }));
                    } else {
                      setForm(prev => ({
                        ...prev,
                        amenities: prev.amenities.filter(a => a !== amenity)
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h2>
          
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
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
