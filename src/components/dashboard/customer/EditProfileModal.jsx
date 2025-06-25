"use client";
import { useState, useRef } from "react";
import Button from "../../ui/buttons";
import { FiCamera } from "react-icons/fi";
import ReactCountryFlag from "react-country-flag";
import countryList from "react-select-country-list";
import Select from "react-select";
import CalendarCard from "@/components/booking_flow/CalendarCard"; // Add this import

// --- EditProfileModal Component ---
export function EditProfileModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    title: user.title || "",
    travelerType: user.travelerType || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    middleName: user.middleName || "",
    gender: user.gender || "",
    dob: user.dob || "",
    email: user.email || "",
    phone: user.phone || "",
    nationality: user.nationality || "",
    national_identity: user.national_identity || "",
    expiry: user.expiry || "",
  });
  const [profileImage, setProfileImage] = useState(user.profileImage || null);
  const fileInputRef = useRef(null);
  const [showDobCalendar, setShowDobCalendar] = useState(false);
  const [showExpiryCalendar, setShowExpiryCalendar] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle gender select
  const handleGender = (gender) => setForm((prev) => ({ ...prev, gender }));

  // Handle profile image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfileImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Save and close
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, profileImage });
    onClose();
  };

  // Get initials for avatar
  const initials =
    (form.firstName?.[0] || user.firstName?.[0] || "") +
    (form.lastName?.[0] || user.lastName?.[0] || "");

  // Prepare country options with flags
  const countryOptions = countryList().getData().map((country) => ({
    value: country.label,
    label: (
      <span className="flex items-center gap-2">
        <ReactCountryFlag
          countryCode={country.value}
          svg
          style={{ width: "1.2em", height: "1.2em" }}
        />
        {country.label}
      </span>
    ),
    code: country.value,
    rawLabel: country.label,
  }));

  // Find selected country option
  const selectedCountry = countryOptions.find(
    (c) => c.rawLabel === form.nationality
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-0 w-full max-w-5xl relative animate-fadeIn mx-2">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 md:top-6 md:right-8 text-2xl text-gray-500 hover:text-primary-500 transition"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex flex-col md:flex-row gap-0">
          {/* Left: Profile Image Section */}
          <div className="flex flex-col items-center justify-center w-full md:w-[340px] py-8 px-4 md:py-12 md:px-0">
            <div className="flex flex-col items-center">
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-32 h-32 sm:w-36 sm:h-36 md:w-56 md:h-56 rounded-full object-cover border-4 border-[#181c26] bg-[#181c26] transition-all duration-200"
                  />
                ) : (
                  <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-56 md:h-56 rounded-full bg-[#181c26] flex items-center justify-center text-2xl sm:text-3xl md:text-5xl text-white font-medium select-none transition-all duration-200">
                    {initials || "TM"}
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
          <div className="flex-1 px-2 sm:px-4 md:px-12 py-4 sm:py-6 md:py-10">
            <div className="font-bold text-lg sm:text-xl md:text-2xl mb-2">
              Complete Profile Information
            </div>
            <div className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6 md:mb-8">
             This information helps us provide a better experience for you.
             Profile details are used to personalize your bookings and ensure smooth communication.

            </div>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-2 sm:gap-x-4 md:gap-x-6 gap-y-2 sm:gap-y-3 md:gap-y-4"
            >
              {/* Title & Traveler Type */}
              <div>
                <label className="block text-xs font-semibold mb-1">Title</label>
                <select
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm"
                >
                  <option value="">Select</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                  <option value="Dr">Dr</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Work Type
                </label>
                <select
                  name="travelerType"
                  value={form.travelerType}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm"
                >
                  <option value="">Select</option>
                  <option value="Business">Business</option>
                  <option value="Finance">Finance</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Health care">Health care</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {/* First/Last Name */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  First Name
                </label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm"
                  required
                />
              </div>
              {/* Middle Name & Gender */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Middle Name{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  name="middleName"
                  value={form.middleName}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Gender</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`flex-1 border rounded-md px-3 py-2 text-xs sm:text-sm ${
                      form.gender === "Male"
                        ? "bg-primary-50 border-primary-500 text-primary-600"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleGender("Male")}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    className={`flex-1 border rounded-md px-3 py-2 text-xs sm:text-sm ${
                      form.gender === "Female"
                        ? "bg-primary-50 border-primary-500 text-primary-600"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleGender("Female")}
                  >
                    Female
                  </button>
                </div>
              </div>
              {/* Date of Birth & Email */}
              <div className="relative">
                <label className="block text-xs font-semibold mb-1">Date of birth</label>
                <input
                  name="dob"
                  type="text"
                  readOnly
                  value={form.dob ? new Date(form.dob).toLocaleDateString() : ""}
                  onClick={() => setShowDobCalendar(true)}
                  className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm cursor-pointer bg-white"
                  placeholder="Select date of birth"
                />
                {showDobCalendar && (
                  <div className="absolute z-50 left-0 top-16 w-full">
                    <CalendarCard
                      mode="single"
                      start={form.dob ? new Date(form.dob) : null}
                      onChange={({ date }) => {
                        setForm((prev) => ({
                          ...prev,
                          dob: date ? date.toISOString().slice(0, 10) : "",
                        }));
                        setShowDobCalendar(false);
                      }}
                      onClose={() => setShowDobCalendar(false)}
                      labelSingle="Date of birth"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm"
                  required
                />
              </div>
              {/* Phone & Nationality */}
              <div>
                <label className="block text-xs font-semibold mb-1">Mobile No</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm"
                  placeholder="+234 Mobile No"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Nationality</label>
                <Select
                  options={countryOptions}
                  value={selectedCountry}
                  onChange={(option) =>
                    setForm((prev) => ({
                      ...prev,
                      nationality: option ? option.rawLabel : "",
                    }))
                  }
                  classNamePrefix="react-select"
                  placeholder="Select nationality"
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "38px",
                      fontSize: "0.95rem",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </div>
              {/* NIN & Expiry */}
              <div>
                <label className="block text-xs font-semibold mb-1">NIN Number</label>
                <input
                  name="national_identity"
                  value={form.national_identity}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm"
                  placeholder="national_identity Number"
                />
              </div>
              <div className="relative">
                <label className="block text-xs font-semibold mb-1">Expiry Date</label>
                <input
                  name="expiry"
                  type="text"
                  readOnly
                  value={form.expiry ? new Date(form.expiry).toLocaleDateString() : ""}
                  onClick={() => setShowExpiryCalendar(true)}
                  className="w-full border rounded-md px-3 py-2 text-xs sm:text-sm cursor-pointer bg-white"
                  placeholder="Expiry Date"
                />
                {showExpiryCalendar && (
                  <div className="absolute z-50 left-0 top-16 w-full">
                    <CalendarCard
                      mode="single"
                      start={form.expiry ? new Date(form.expiry) : null}
                      onChange={({ date }) => {
                        setForm((prev) => ({
                          ...prev,
                          expiry: date ? date.toISOString().slice(0, 10) : "",
                        }));
                        setShowExpiryCalendar(false);
                      }}
                      onClose={() => setShowExpiryCalendar(false)}
                      labelSingle="Expiry date"
                    />
                  </div>
                )}
              </div>
              {/* Save Button */}
              <div className="md:col-span-2 mt-4 md:mt-6 flex justify-end">
                <Button
                  type="submit"
                  className="w-full md:w-full bg-primary-500 text-white rounded-md py-3 font-semibold text-base hover:bg-primary-600 transition disabled:opacity-50"
                >
                  Save Information
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
        @media (max-width: 768px) {
          .animate-fadeIn {
            max-height: 98vh;
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
}
