"use client";

import { useState, useRef, useMemo } from "react";
import { FiCamera, FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiCreditCard, FiClock } from "react-icons/fi";
import Button from "@/components/ui/Buttons";
import { useToast } from "@/components/ui/ToastProvider";
import ngBanks from 'ng-banks';

export function BusinessEditProfileModal({ business, user, onClose, onSave, loading = false }) {
  const toast = useToast();

  const [form, setForm] = useState({
    // User profile fields
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
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
    console.debug('[BusinessEditProfileModal] business prop:', business);
    console.debug('[BusinessEditProfileModal] logo fields:', {
      logo: business?.logo,
      businessLogo: business?.businessLogo,
      profileImage: business?.profileImage
    });
  }

  const [businessLogo, setBusinessLogo] = useState(
    business?.logo ||
    business?.businessLogo ||
    business?.profileImage ||
    null
  );
  const [businessLogoFile, setBusinessLogoFile] = useState(null);
  const [errors, setErrors] = useState({});

  const businessLogoInputRef = useRef(null);

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

  // Handle business logo upload
  const handleBusinessLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBusinessLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setBusinessLogo(reader.result);
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
      // Business logo
      logo: businessLogoFile || null,
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

  const banks = useMemo(() => {
    try {
      const bankList = ngBanks.getBanks();
      if (!bankList || bankList.length === 0) {
        toast?.danger?.('Failed to load bank list');
        return [];
      }
      return bankList.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error loading banks:', error);
      toast?.danger?.('Failed to load bank list');
      return [];
    }
  }, [toast]);

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
          {/* Left: Business Logo Section */}
          <div className="flex flex-col items-center justify-center w-full md:w-[340px] py-8 px-4 md:py-12 md:px-0 bg-gray-50 md:bg-transparent">
            <div className="flex flex-col items-center">
              <p className="text-xs font-semibold text-gray-600 mb-3">Business Logo</p>
              <div className="relative">
                {businessLogo ? (
                  <img
                    src={businessLogo}
                    alt="Business Logo"
                    className="w-32 h-32 sm:w-36 sm:h-36 md:w-48 md:h-48 rounded-full object-cover border-4 border-[#181c26] bg-[#181c26] transition-all duration-200"
                  />
                ) : (
                  <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-48 md:h-48 rounded-full bg-[#181c26] flex items-center justify-center text-2xl sm:text-3xl md:text-4xl text-white font-medium select-none transition-all duration-200">
                    {initials}
                  </div>
                )}
                <button
                  type="button"
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg border border-gray-100 text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
                  onClick={() => businessLogoInputRef.current.click()}
                >
                  <FiCamera className="text-base" />
                  {businessLogo ? 'Change' : 'Add'} Logo
                  <input
                    ref={businessLogoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBusinessLogoChange}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Form Section */}
          <div className="flex-1 px-4 sm:px-6 md:px-12 py-6 md:py-10 max-h-[80vh] overflow-y-auto">
            <div className="mb-6">
              <h2 className="font-bold text-2xl text-gray-900 mb-2">Edit Profile</h2>
              <p className="text-gray-600 text-sm">
                Update your personal and business information. All fields marked with * are required.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* Personal Information Section */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiUser className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FiUser className="w-4 h-4 text-gray-400" />
                      First Name *
                    </label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="John"
                      required
                    />
                    {errors.firstName && (
                      <p className="text-red-600 text-xs mt-1.5 ml-1">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FiUser className="w-4 h-4 text-gray-400" />
                      Last Name *
                    </label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="Doe"
                      required
                    />
                    {errors.lastName && (
                      <p className="text-red-600 text-xs mt-1.5 ml-1">{errors.lastName}</p>
                    )}
                  </div>

                  {/* Personal Email */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FiMail className="w-4 h-4 text-gray-400" />
                      Email Address *
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="john.doe@example.com"
                      required
                    />
                    {errors.email && (
                      <p className="text-red-600 text-xs mt-1.5 ml-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Personal Phone */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FiPhone className="w-4 h-4 text-gray-400" />
                      Phone Number *
                    </label>
                    <input
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="+2348012345678"
                      required
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-600 text-xs mt-1.5 ml-1">{errors.phoneNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Information Section */}
              <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-6 border border-primary-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Business Information</h3>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Business Name */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Business Name *
                      </label>
                      <input
                        name="businessName"
                        value={form.businessName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                        placeholder="Synkafrica"
                        required
                      />
                      {errors.businessName && (
                        <p className="text-red-600 text-xs mt-1.5 ml-1">{errors.businessName}</p>
                      )}
                    </div>

                    {/* Business Location */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FiMapPin className="w-4 h-4 text-gray-400" />
                        Location *
                      </label>
                      <input
                        name="businessLocation"
                        value={form.businessLocation}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                        placeholder="Lagos, Lekki Phase 1"
                        required
                      />
                      {errors.businessLocation && (
                        <p className="text-red-600 text-xs mt-1.5 ml-1">{errors.businessLocation}</p>
                      )}
                    </div>
                  </div>

                  {/* Business Description */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-h-24"
                      placeholder="Tell us about your business..."
                      required
                    />
                    {errors.description && (
                      <p className="text-red-600 text-xs mt-1.5 ml-1">{errors.description}</p>
                    )}
                  </div>

                  {/* Contact Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FiGlobe className="w-4 h-4 text-gray-400" />
                        Website URL
                      </label>
                      <input
                        name="url"
                        type="url"
                        value={form.url}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                        placeholder="https://synkafrica.com"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FiMail className="w-4 h-4 text-gray-400" />
                        Business Email
                      </label>
                      <input
                        name="businessEmail"
                        type="email"
                        value={form.businessEmail}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                        placeholder="vendor@example.com"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FiPhone className="w-4 h-4 text-gray-400" />
                        Primary Phone
                      </label>
                      <input
                        name="businessPhone"
                        value={form.businessPhone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                        placeholder="+2348012345678"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FiPhone className="w-4 h-4 text-gray-400" />
                        Secondary Phone
                      </label>
                      <input
                        name="secondaryPhone"
                        value={form.secondaryPhone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                        placeholder="+2348012345679"
                      />
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <FiCreditCard className="w-4 h-4 text-gray-400" />
                      Payment Details *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1.5">Bank Name</label>
                        <select
                          name="bankName"
                          value={form.bankName}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                          required
                        >
                          <option value="">Select Bank</option>
                          {banks.map((bank) => (
                            <option key={bank.code} value={bank.name}>
                              {bank.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1.5">Account Holder</label>
                        <input
                          name="bankAccountName"
                          value={form.bankAccountName || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1.5">Account Number</label>
                        <input
                          name="bankAccountNumber"
                          value={form.bankAccountNumber || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                          placeholder="0246591373"
                          maxLength="10"
                          pattern="[0-9]{10}"
                          required
                        />
                      </div>
                    </div>
                    {errors.bankAccountNumber && (
                      <p className="text-red-600 text-xs mt-1.5 ml-1">{errors.bankAccountNumber}</p>
                    )}
                  </div>

                  {/* Business Availability */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FiClock className="w-4 h-4 text-gray-400" />
                      Availability *
                    </label>
                    <select
                      name="availability"
                      value={form.availability}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
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
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-primary-500 text-white rounded-lg font-semibold text-sm hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </>
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
