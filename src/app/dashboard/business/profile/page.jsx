"use client";

import { useState, useEffect } from "react";
import BusinessProfileCard from "@/components/dashboard/vendor/profile/BusinessProfileCard";
import BusinessProfileProgress from "@/components/dashboard/vendor/profile/BusinessProfileProgress";
import BusinessProfileDetails from "@/components/dashboard/vendor/profile/BusinessProfileDetails";
import { BusinessEditProfileModal } from "@/components/dashboard/vendor/profile/BusinessEditProfileModal";
import { useUserProfile } from "@/hooks/business/useUserProfileVendor";

export default function BusinessProfilePage() {
  // Get token from localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("vendorToken") : null;

  // Fetch user profile
  const {
    user,
    loading: profileLoading,
    error: profileError,
    refetch,
  } = useUserProfile(token);

  // Local state for business data and edit modal
  const [business, setBusiness] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  // Update business state when user data is loaded
  useEffect(() => {
    if (user) {
      setBusiness({
        initials:
          user.firstName && user.lastName
            ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
            : "SA",
        name: user.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : "Business Name",
        email: user.email || "",
        businessName: user.firstName
          ? `${user.firstName} ${user.lastName || ""}`.trim()
          : "",
        businessLocation: "", // Could extend API later
        businessDescription: "",
        phoneNumber: user.phoneNumber || "",
        phoneNumber2: "",
        businessURL: "",
        bankName: "",
        accountName: "",
        accountNumber: "",
        faqs: null,
        serviceLicense: null,
        availability: "",
        profileImage: user.avatar || null,
      });
    }
  }, [user]);

  if (profileLoading || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{profileError}</p>
      </div>
    );
  }

  // Calculate profile completion
  const requiredFields = [
    "businessName",
    "businessLocation",
    "businessDescription",
    "phoneNumber",
    "businessURL",
    "email",
    "bankName",
    "accountName",
    "accountNumber",
    "faqs",
    "serviceLicense",
    "availability",
  ];

  const completed = requiredFields.filter((f) => {
    const value = business[f];
    return value && value.toString().trim() !== "";
  }).length;

  const progress = Math.round((completed / requiredFields.length) * 100);

  // For ProfileCard initials and name
  const cardBusiness = {
    initials:
      business.businessName
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "SA",
    name: business.businessName || "Business Name",
    email: business.email,
    profileImage: business.profileImage,
  };

  // Payment details formatted
  const paymentDetails =
    business.bankName && business.accountNumber
      ? `${business.accountNumber} - ${business.bankName}`
      : null;

  const businessWithFormattedDetails = {
    ...business,
    paymentDetails,
  };

  // Example handlers for the action buttons
  const handleSaveInfo = () => {
    alert("Save information action triggered");
  };

  const handleGetBookings = () => {
    alert("Get bookings action triggered");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F6]">
      {/* Dashboard Main Content */}
      <div className="flex-1 flex flex-col w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Content */}
        <section className="flex-1 flex flex-col gap-6 py-6 px-2 sm:px-4 md:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            {/* Profile Card */}
            <div className="flex flex-col gap-4 w-full md:w-auto md:max-w-xs">
              <BusinessProfileCard business={cardBusiness} />
            </div>

            {/* Profile Progress */}
            <div className="flex-1">
              <BusinessProfileProgress
                progress={progress}
                onEdit={() => setShowEdit(true)}
                onSaveInfo={handleSaveInfo}
                onGetBookings={handleGetBookings}
              />
            </div>
          </div>

          {/* Profile Details */}
          <div className="w-full ">
            <BusinessProfileDetails
              business={businessWithFormattedDetails}
              onEdit={() => setShowEdit(true)}
            />
          </div>
        </section>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <BusinessEditProfileModal
          business={business}
          onClose={() => setShowEdit(false)}
          onSave={(updated) => {
            setBusiness((prev) => ({ ...prev, ...updated }));
            refetch(); // Re-fetch profile from backend after save
          }}
        />
      )}

      <style jsx global>{`
        @media (max-width: 768px) {
          section {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
