"use client";
import { useState, useEffect } from "react";
import ProfileCard from "@/components/dashboard/customer/profile/ProfileCard";
import ProfileProgress from "@/components/dashboard/customer/profile/ProfileProgress";
import ProfileDetails from "@/components/dashboard/customer/profile/ProfileDetails";
import { EditProfileModal } from "@/components/dashboard/customer/profile/EditProfileModal";
import { useToast } from "@/components/ui/ToastProvider";
import { PageLoadingScreen } from "@/components/ui/LoadingScreen";
import { useUserProfile } from "@/hooks/customer/details/useUserProfileDetails";
import { useRouter } from "next/navigation";

function CustomerProfileContent() {
  const router = useRouter();
  const toast = useToast();
  const [showEdit, setShowEdit] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Use the user profile hook
  const {
    userProfile,
    loading,
    error,
    fetchUserProfile,
    updateUserProfile,
  } = useUserProfile();

  // Fetch profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast?.danger?.(error);
    }
  }, [error, toast]);

  // Calculate profile completion based on userProfile data
  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "address",
    "city",
    "state",
    "country",
  ];
  
  const completed = userProfile 
    ? requiredFields.filter((f) => userProfile[f] && userProfile[f].toString().trim() !== "").length
    : 0;
  const progress = Math.round((completed / requiredFields.length) * 100);

  // Progress breakdown for detailed display
  const profileProgress = {
    overall: progress,
    personal: {
      completed: completed,
      total: requiredFields.length,
      percentage: progress,
    },
  };

  // Map userProfile to the format expected by ProfileCard
  const cardUser = userProfile ? {
    initials: (userProfile.firstName?.[0] || "") + (userProfile.lastName?.[0] || "") || "U",
    name: `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() || "User",
    email: userProfile.email || "",
    profileImage: userProfile.profilePicture,
    isActive: true,
    createdAt: userProfile.createdAt,
    isEmailVerified: userProfile.isEmailVerified || userProfile.emailVerified,
    id: userProfile.id,
  } : null;

  // Map userProfile to the format expected by ProfileDetails
  const detailsUser = userProfile ? {
    firstName: userProfile.firstName || "",
    lastName: userProfile.lastName || "",
    middleName: userProfile.middleName || "",
    email: userProfile.email || "",
    phone: userProfile.phoneNumber || "",
    dob: userProfile.dateOfBirth || "",
    gender: userProfile.gender || "",
    nationality: userProfile.nationality || "",
    national_identity: userProfile.nationalIdentity || "",
    expiry: userProfile.identityExpiry || "",
  } : null;

  // Update profile handler
  const handleUpdateProfile = async (updatedData) => {
    setUpdating(true);
    try {
      // Map the form data to the backend API format
      const rawProfileUpdate = {
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        middleName: updatedData.middleName,
        phoneNumber: updatedData.phone,
        // email: updatedData.email, // Exclude email as it's likely immutable
        address: updatedData.address,
        city: updatedData.city,
        state: updatedData.state,
        country: updatedData.country,
        avatar: updatedData.profileImage,
        gender: updatedData.gender,
        dob: updatedData.dob,
        nationality: updatedData.nationality,
        nin: updatedData.national_identity,
        identityExpiry: updatedData.expiry,
        title: updatedData.title,
        travelerType: updatedData.travelerType,
      };

      // Remove empty strings and null/undefined values
      const profileUpdate = Object.fromEntries(
        Object.entries(rawProfileUpdate).filter(([_, v]) => v != null && v !== "")
      );

      // Ensure dates are in correct format (if backend requires ISO)
      if (profileUpdate.dob && !profileUpdate.dob.includes("T")) {
        profileUpdate.dob = new Date(profileUpdate.dob).toISOString();
      }
      if (profileUpdate.identityExpiry && !profileUpdate.identityExpiry.includes("T")) {
        profileUpdate.identityExpiry = new Date(profileUpdate.identityExpiry).toISOString();
      }

      const success = await updateUserProfile(profileUpdate);
      
      if (success) {
        toast?.success?.("Profile updated successfully");
        setShowEdit(false);
        // Refresh the profile data
        await fetchUserProfile();
      } else {
        toast?.danger?.("Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast?.danger?.(error?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  // Action handlers
  const handleSaveBookingInfo = () => {
    router.push("/dashboard/saved-bookings");
  };

  const handleCompleteBooking = () => {
    router.push("/dashboard/bookings");
  };

  const handleViewTravelHistory = () => {
    router.push("/dashboard/travel-history");
  };

  // Show loading state
  if (loading) {
    return <PageLoadingScreen message="Loading your profile..." />;
  }

  // Show error state if profile failed to load
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-[#FAF8F6] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load profile</h2>
          <p className="text-gray-600 mb-4">Please try refreshing the page</p>
          <button
            onClick={() => fetchUserProfile()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Customer Profile
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage your personal information and travel preferences
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowEdit(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ProfileCard user={cardUser} />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Progress */}
            <ProfileProgress
              progress={progress}
              profileProgress={profileProgress}
              onEdit={() => setShowEdit(true)}
              onSaveBookingInfo={handleSaveBookingInfo}
              onCompleteBooking={handleCompleteBooking}
              onViewTravelHistory={handleViewTravelHistory}
            />

            {/* Profile Details */}
            <ProfileDetails user={detailsUser} onEdit={() => setShowEdit(true)} />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <EditProfileModal
          user={detailsUser}
          onClose={() => setShowEdit(false)}
          onSave={handleUpdateProfile}
          loading={updating}
        />
      )}
    </div>
  );
}

export default function ProfilePage() {
  return <CustomerProfileContent />;
}
