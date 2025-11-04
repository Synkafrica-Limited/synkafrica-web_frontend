"use client";

import { useState, useRef } from "react";
import { FiCamera } from "react-icons/fi";
import Buttons from "@/components/ui/Buttons";

export function BusinessEditProfileModal({ business, onClose, onSave }) {
  const [form, setForm] = useState({
    businessName: business.businessName || "",
    businessLocation: business.businessLocation || "",
    businessDescription: business.businessDescription || "",
    phoneNumber: business.phoneNumber || "",
    phoneNumber2: business.phoneNumber2 || "",
    businessURL: business.businessURL || "",
    email: business.email || "",
    bankName: business.bankName || "",
    accountName: business.accountName || "",
    accountNumber: business.accountNumber || "",
    availability: business.availability || "",
  });

  const [profileImage, setProfileImage] = useState(business.profileImage || null);
  const [faqsFile, setFaqsFile] = useState(business.faqs || null);
  const [licenseFile, setLicenseFile] = useState(business.serviceLicense || null);
  
  const fileInputRef = useRef(null);
  const faqsInputRef = useRef(null);
  const licenseInputRef = useRef(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle FAQ file upload
  const handleFaqsChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaqsFile(file);
    }
  };

  // Handle License file upload
  const handleLicenseChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLicenseFile(file);
    }
  };

  // Save and close
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ 
      ...form, 
      profileImage, 
      faqs: faqsFile,
      serviceLicense: licenseFile 
    });
    onClose();
  };

  // Get initials for avatar
  const initials =
    (form.businessName?.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase() || 
    business.businessName?.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase() || 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl relative animate-fadeIn my-4">
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
              Complete Profile Information
            </div>
            <div className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6 md:mb-8">
              This informations will be used for all bookings within synkkafrica. Please ensure your informations and your license are government approved.
            </div>
            
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-3 md:gap-y-4"
            >
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
              </div>

              {/* Business Description */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold mb-1">Business Description</label>
                <textarea
                  name="businessDescription"
                  value={form.businessDescription}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 min-h-20"
                  placeholder="This company is built on trust..."
                  required
                />
              </div>

              {/* Business Phone numbers */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold mb-1">Business Phone numbers</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                    placeholder="08065017856"
                    required
                  />
                  <input
                    name="phoneNumber2"
                    value={form.phoneNumber2}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                    placeholder="08065017856"
                  />
                </div>
              </div>

              {/* Business's URL */}
              <div>
                <label className="block text-xs font-semibold mb-1">Business's URL</label>
                <input
                  name="businessURL"
                  type="url"
                  value={form.businessURL}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="Synkkafrica.com"
                />
              </div>

              {/* Business email */}
              <div>
                <label className="block text-xs font-semibold mb-1">Business email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="eodeyale@synkkafrica.com"
                  required
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
                    name="accountName"
                    value={form.accountName}
                    onChange={handleChange}
                    className="border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                    placeholder="Odeyale Emmanuel"
                    required
                  />
                  <input
                    name="accountNumber"
                    value={form.accountNumber}
                    onChange={handleChange}
                    className="border rounded-md px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                    placeholder="0246591373"
                    maxLength="10"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </div>

              {/* Business FAQ's */}
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold mb-1">Business FAQ's</label>
                <button
                  type="button"
                  onClick={() => faqsInputRef.current.click()}
                  className="w-full border border-dashed border-gray-400 rounded-md px-3 py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <span className="text-lg">+</span>
                  {faqsFile ? faqsFile.name || "File uploaded" : "Add FAQ file"}
                </button>
                <input
                  ref={faqsInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFaqsChange}
                />
              </div>

              {/* Business License */}
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold mb-1">Business License</label>
                <button
                  type="button"
                  onClick={() => licenseInputRef.current.click()}
                  className="w-full border border-dashed border-gray-400 rounded-md px-3 py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <span className="text-lg">+</span>
                  {licenseFile ? licenseFile.name || "File uploaded" : "Add license file"}
                </button>
                <input
                  ref={licenseInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleLicenseChange}
                />
              </div>

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

              {/* Submit Button */}
              <div className="md:col-span-2 mt-4 md:mt-6 flex justify-end">
                <Buttons
                  type="submit"
                  className="w-full md:w-auto bg-primary-500 text-white rounded-md px-8 py-3 font-semibold text-base hover:bg-primary-600 transition disabled:opacity-50"
                >
                  Save Information
                </Buttons>
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
