"use client";

import { useState, useRef } from "react";
import { FiCamera } from "react-icons/fi";
import Button from "@/components/ui/Buttons";
import { useToast } from "@/components/ui/ToastProvider";

export function BusinessEditProfileModal({ business, user, onClose, onSave, loading = false }) {
  const toast = useToast();

  const [form, setForm] = useState({
    // User profile fields
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",

    nationality: user?.nationality || "",
    gender: user?.gender || "",
    dateOfBirth: user?.dateOfBirth || user?.dob || "",
    // Business (only backend-recognized fields)
    id: business?.id || business?._id || business?.businessId || "",
    businessName: business?.businessName || business?.name || "",
    businessLocation: business?.businessLocation || business?.location || "",
    // map to backend fields
    description: business?.description || business?.businessDescription || "",
    url: business?.url || business?.businessURL || "",
    bankName: business?.bankName || "",
    bankAccountName: business?.bankAccountName || business?.accountName || "",
    bankAccountNumber: business?.bankAccountNumber || business?.accountNumber || "",
    availability: business?.availability || "",
    businessEmail: business?.businessEmail || business?.email || "",
    businessPhone: business?.phoneNumber || business?.businessPhone || "",
    secondaryPhone: business?.secondaryPhone || business?.phoneNumber2 || "",
  });

  // Debug: log incoming business prop to help diagnose population issues
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.debug('BusinessEditProfileModal: business prop =', business);
  }

  const [profileImage, setProfileImage] = useState(business?.profileImage || null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Validate single field on change
    validateField(name, value);
  };

  function validateField(name, value) {
    let message = "";
    if (["firstName", "lastName", "email", "phoneNumber"].includes(name)) {
      if (!value || value.toString().trim() === "") {
        message = "This field is required";
      }
    }
    if (name === "email" && value) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(value)) message = "Invalid email address";
    }
    if ((name === "accountNumber" || name === 'bankAccountNumber') && value) {
      if (!/^[0-9]{6,20}$/.test(value)) message = "Invalid account number";
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  }

  function validateAll() {
    const required = ["firstName", "lastName", "email", "phoneNumber", "businessName", "businessLocation", "description"];
    const newErrors = {};
    required.forEach((field) => {
      const val = form[field];
      if (!val || val.toString().trim() === "") newErrors[field] = "This field is required";
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email address";
    if (form.bankAccountNumber && !/^[0-9]{6,20}$/.test(form.bankAccountNumber)) newErrors.bankAccountNumber = "Invalid account number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Handle profile image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // No FAQ or license file handlers — these fields were removed

  // Save and close
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateAll()) {
      toast?.danger?.('Please fix errors before saving');
      return;
    }

    // Separate user and business data
    const userData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phoneNumber: form.phoneNumber,
    };

    const businessData = {
      id: form.id,
      businessName: form.businessName,
      businessLocation: form.businessLocation,
      // backend-expected keys
      description: form.description,
      url: form.url,
      bankName: form.bankName,
      bankAccountName: form.bankAccountName || form.accountName,
      bankAccountNumber: form.bankAccountNumber || form.accountNumber,
      availability: form.availability,
      // include file only if user selected one
      profileImage: profileImageFile || null,
      businessEmail: form.businessEmail,
      phoneNumber: form.businessPhone,
      secondaryPhone: form.secondaryPhone,
    };

    try {
      // Await parent save to ensure update completes before closing
      await onSave({ userData, businessData });
    } catch (err) {
      // Parent will handle toasts/errors; keep modal open so user can retry
      // eslint-disable-next-line no-console
      console.error('BusinessEditProfileModal: save failed', err);
      toast?.danger?.(err?.message || 'Save failed');
      return;
    }

    onClose();
  };

  // Get initials for avatar
  const initials =
    (form.businessName?.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase() ||
      business?.businessName?.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase() ||
      "SA");

  const banks = [
    "Access Bank",
    "Citibank",
    "Ecobank Nigeria",
    "Fidelity Bank Nigeria",
    "First Bank of Nigeria",
    "First City Monument Bank",
    "Guaranty Trust Bank",
    "Heritage Bank",
    "Keystone Bank",
    "Polaris Bank",
    "Providus Bank",
    "Stanbic IBTC Bank",
    "Standard Chartered Bank",
    "Sterling Bank",
    "Union Bank of Nigeria",
    "United Bank for Africa",
    "Unity Bank",
    "Wema Bank",
    "Zenith Bank",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-2 overflow-y-auto">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-5xl relative animate-fadeIn my-0 sm:my-4 max-h-[90vh] sm:max-h-full flex flex-col sm:block">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 md:top-6 md:right-8 text-2xl text-gray-500 hover:text-primary-500 transition z-10"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-0">
          {/* Left: Profile Image Section */}
          <div className="flex flex-col items-center justify-center w-full md:w-[340px] py-8 px-4 md:py-12 md:px-0 bg-gray-50 md:bg-transparent">
            <div className="flex flex-col items-center">
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Business Logo"
                    className="w-32 h-32 sm:w-36 sm:h-36 md:w-56 md:h-56 rounded-full object-cover border-4 border-[#181c26] bg-[#181c26] transition-all duration-200"
                  />
                ) : (
                  <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-56 md:h-56 rounded-full bg-[#181c26] flex items-center justify-center text-2xl sm:text-3xl md:text-5xl text-white font-medium select-none transition-all duration-200">
                    {initials}
                  </div>
                )}
                {/* Add Button */}
                <button
                  type="button"
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 sm:px-6 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-700 hover:bg-gray-50 transition text-xs sm:text-sm md:text-base font-medium"
                  onClick={() => fileInputRef.current.click()}
                >
                  <FiCamera className="text-base sm:text-lg md:text-xl" />
                  Add
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Form Section */}
          <div className="flex-1 px-4 sm:px-6 md:px-12 py-6 md:py-10 max-h-[80vh] overflow-y-auto">
            <div className="font-bold text-lg sm:text-xl md:text-2xl mb-2">
              Edit Profile Information
            </div>
            <div className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6 md:mb-8">
              Update your personal and business information. All fields marked with * are required.
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Personal Information Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-3 md:gap-y-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">First Name *</label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="John"
                      required
                    />
                    {errors.firstName && (
                      <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">Last Name *</label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="Doe"
                      required
                    />
                    {errors.lastName && (
                      <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>

                  {/* Personal Email */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">Email Address *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="john.doe@example.com"
                      required
                    />
                    {errors.email && (
                      <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Personal Phone */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">Phone Number *</label>
                    <input
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="+2348012345678"
                      required
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-600 text-xs mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>

                  {/* Nationality */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">Nationality</label>
                    <input
                      name="nationality"
                      value={form.nationality}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="Nigeria"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">Gender</label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">Date of Birth</label>
                    <input
                      name="dateOfBirth"
                      type="date"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                    />
                  </div>
                </div>
              </div>

              {/* Business Information Section */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-3 md:gap-y-4">
                  {/* Business Name */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">Business Name</label>
                    <input
                      name="businessName"
                      value={form.businessName}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="Synkkafrica"
                      required
                    />
                    {errors.businessName && (
                      <p className="text-red-600 text-xs mt-1">{errors.businessName}</p>
                    )}
                  </div>

                  {/* Business Location */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">Business Location</label>
                    <input
                      name="businessLocation"
                      value={form.businessLocation}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="Lagos, lekki phase 1"
                      required
                    />
                    {errors.businessLocation && (
                      <p className="text-red-600 text-xs mt-1">{errors.businessLocation}</p>
                    )}
                  </div>

                  {/* Business Description */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-1">Business Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 min-h-20"
                      placeholder="This company is built on trust..."
                      required
                    />
                    {errors.description && (
                      <p className="text-red-600 text-xs mt-1">{errors.description}</p>
                    )}
                  </div>

                  {/* Business's URL */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">Business's URL</label>
                    <input
                      name="url"
                      type="url"
                      value={form.url}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="Synkkafrica.com"
                    />
                  </div>

                  {/* Business Contact: Email */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">Business Email</label>
                    <input
                      name="businessEmail"
                      type="email"
                      value={form.businessEmail}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="vendor@example.com"
                    />
                  </div>

                  {/* Business Contact: Phone */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">Business Phone</label>
                    <input
                      name="businessPhone"
                      value={form.businessPhone}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="+2348012345678"
                    />
                  </div>

                  {/* Secondary Business Phone */}
                  <div>
                    <label className="block text-xs font-semibold mb-1">Secondary Phone</label>
                    <input
                      name="secondaryPhone"
                      value={form.secondaryPhone}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      placeholder="+2348012345679"
                    />
                  </div>

                  {/* Business Payment Details */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-2">Business Payment Details</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <select
                        name="bankName"
                        value={form.bankName}
                        onChange={handleChange}
                        className="border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                        required
                      >
                        <option value="">Select Bank</option>
                        {banks.map((bank) => (
                          <option key={bank} value={bank}>
                            {bank}
                          </option>
                        ))}
                      </select>
                      <input
                        name="bankAccountName"
                        value={form.bankAccountName || form.accountName}
                        onChange={handleChange}
                        className="border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                        placeholder="Odeyale Emmanuel"
                        required
                      />
                      <input
                        name="bankAccountNumber"
                        value={form.bankAccountNumber || form.accountNumber}
                        onChange={handleChange}
                        className="border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                        placeholder="0246591373"
                        maxLength="10"
                        pattern="[0-9]{10}"
                        required
                      />
                      {errors.accountNumber && (
                        <p className="text-red-600 text-xs mt-1">{errors.bankAccountNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Business FAQ's */}
                  {/* Removed Business FAQ and License upload fields per request */}

                  {/* Business Availability */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-1">Business Availability</label>
                    <select
                      name="availability"
                      value={form.availability}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                      required
                    >
                      <option value="">Select availability</option>
                      <option value="24/7">24/7 - Always Available</option>
                      <option value="weekdays">Weekdays (Mon-Fri)</option>
                      <option value="weekends">Weekends Only</option>
                      <option value="custom">Custom Hours</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto bg-primary-500 text-white rounded-md px-6 py-2 font-semibold text-sm hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    'Save All Information'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
