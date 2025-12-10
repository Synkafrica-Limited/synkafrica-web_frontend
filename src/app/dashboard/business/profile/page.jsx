"use client";

import { useState, useEffect } from "react";
import BusinessProfileCard from "@/components/dashboard/vendor/profile/BusinessProfileCard";
import BusinessProfileProgress from "@/components/dashboard/vendor/profile/BusinessProfileProgress";
import BusinessProfileDetails from "@/components/dashboard/vendor/profile/BusinessProfileDetails";
import { BusinessEditProfileModal } from "@/components/dashboard/vendor/profile/BusinessEditProfileModal";
import { useUserProfile } from "@/hooks/business/useUserProfileVendor";
import { useBusiness } from '@/context/BusinessContext';
import authService from '@/services/authService';
import businessService from '@/services/business.service';
// verification moved to Account Settings (VerificationSettings)
import { useRouter } from 'next/navigation';
import { PageLoadingScreen } from "@/components/ui/LoadingScreen";
import { useToast } from "@/components/ui/ToastProvider";
import DashboardHeader from '@/components/layout/DashboardHeader';
import { ProtectedPage } from "@/components/ui/PageWrapper";
import { useDataLoader } from "@/hooks/useDataLoader";


function BusinessProfileContent() {
  const router = useRouter();
  const toast = useToast();

  // Get token and user profile
  const token = typeof window !== "undefined" ? authService.getAccessToken() : null;
  const { user, loading: profileLoading, error: profileError, refetch: refetchProfile } = useUserProfile(token);

  // State management
  const [showEdit, setShowEdit] = useState(false);
  const [updating, setUpdating] = useState(false);
  // Verification status is managed in Account Settings

  // Load business data using the simplified hook
  const {
    data: businessData,
    loading: businessLoading,
    error: businessError,
    refetch: refetchBusiness
  } = useDataLoader(
    async () => {
      if (!user) return null;

      let business = await businessService.getMyBusinesses();

      // Normalize backend shapes: array, wrapped object { user, business }, or direct object
      if (Array.isArray(business)) {
        business = business.length > 0 ? business[0] : null;
      }
      if (business && business.business) {
        business = business.business;
      }

      if (!business) {
        throw new Error('No business found. Please complete your business onboarding first.');
      }

      return {
        id: business.id || business._id || business.businessId,
        initials: business.businessName
          ?.split(" ")
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "SA",
        name: business.businessName || "Business Name",
        email: user?.email || business.email || "",
        businessName: business.businessName || business.name || "",
        businessLocation: business.businessLocation || business.location || "",
        // use backend-aligned keys
        description: business.description || business.businessDescription || "",
        phoneNumber: business.phoneNumber || business.businessPhone || user?.phoneNumber || "",
        secondaryPhone: business.secondaryPhone || business.phoneNumber2 || "",
        url: business.url || business.businessURL || "",
        bankName: business.bankName || "",
        bankAccountName: business.bankAccountName || business.accountName || "",
        bankAccountNumber: business.bankAccountNumber || business.accountNumber || "",
        faqs: business.faqs || null,
        serviceLicense: business.serviceLicense || null,
        availability: business.availability || "",
        profileImage: business.profileImage || business.logo || user?.avatar || null,
      };
    },
    [user],
    {
      enabled: !!user,
      onError: (error) => {
        if (error.message.includes('No business found')) {
          toast?.info?.('No business found. Please complete your business onboarding first.');
          setTimeout(() => {
            router.push('/dashboard/business');
          }, 2000);
        } else {
          toast?.danger?.('Failed to load business data. Please try again or contact support.');
        }
      }
    }
  );

  // Sync business data into shared BusinessContext so other pages can reuse it
  const { business: contextBusiness, setBusiness: setContextBusiness } = useBusiness();
  useEffect(() => {
    if (businessData && setContextBusiness) {
      setContextBusiness(businessData);
    }
  }, [businessData, setContextBusiness]);

  // Verification moved to settings; no local verification fetch here

  // Show loading only when actively fetching data
  if (profileLoading || businessLoading) {
    return <PageLoadingScreen message="Loading your profile..." />;
  }

  // Show error states
  if (profileError || businessError) {
    const isNoBusinessError = businessError?.includes('No business found');

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isNoBusinessError ? 'bg-blue-100' : 'bg-red-100'
          }`}>
            <svg className={`w-8 h-8 ${isNoBusinessError ? 'text-blue-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                isNoBusinessError
                  ? "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              } />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isNoBusinessError ? 'No Business Found' : 'Failed to Load Profile'}
          </h2>
          <p className="text-gray-600 mb-4">
            {isNoBusinessError
              ? 'Redirecting you to create your business profile...'
              : (profileError || businessError)
            }
          </p>
          {!isNoBusinessError && (
            <button
              onClick={() => {
                refetchProfile();
                refetchBusiness();
              }}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          )}
          {isNoBusinessError && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          )}
        </div>
      </div>
    );
  }

  // Should not reach here if there's no business data, but just in case
  if (!businessData) {
    return <PageLoadingScreen message="Loading your profile..." />;
  }

  // Calculate profile completion - include both user and business data
  const userRequiredFields = [
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
  ];

  const businessRequiredFields = [
    "businessName",
    "businessLocation",
    "description",
    "url", // Business-specific URL
    "bankName",
    "bankAccountName",
    "bankAccountNumber",
    "faqs",
    "serviceLicense",
    "availability",
  ];

  // Check user profile completion
  const userCompleted = userRequiredFields.filter((field) => {
    const value = user?.[field];
    return value && value.toString().trim() !== "";
  }).length;

  // Check business profile completion
  const businessCompleted = businessRequiredFields.filter((field) => {
    const value = businessData[field];
    return value && value.toString().trim() !== "";
  }).length;

  // Calculate overall progress
  const totalRequired = userRequiredFields.length + businessRequiredFields.length;
  const totalCompleted = userCompleted + businessCompleted;
  const progress = Math.round((totalCompleted / totalRequired) * 100);

  // Progress breakdown for detailed display
  const profileProgress = {
    overall: progress,
    user: {
      completed: userCompleted,
      total: userRequiredFields.length,
      percentage: Math.round((userCompleted / userRequiredFields.length) * 100)
    },
    business: {
      completed: businessCompleted,
      total: businessRequiredFields.length,
      percentage: Math.round((businessCompleted / businessRequiredFields.length) * 100)
    }
  };

  // For ProfileCard initials and name
  const cardBusiness = {
    initials:
      businessData.businessName
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "SA",
    name: businessData.businessName || "Business Name",
    email: businessData.email,
    profileImage: businessData.profileImage,
  };

  // Payment details formatted
  const paymentDetails =
    businessData.bankName && (businessData.bankAccountNumber || businessData.accountNumber)
      ? `${businessData.bankAccountNumber || businessData.accountNumber} - ${businessData.bankName}`
      : null;

  const businessWithFormattedDetails = {
    ...businessData,
    paymentDetails,
  };

  // Business update handler
  const handleUpdateBusiness = async ({ userData, businessData }) => {
    if (!businessData?.id && !userData) {
      toast?.danger?.('No data to update');
      return;
    }

    setUpdating(true);
    try {
      // Update user profile if userData is provided
      if (userData && Object.keys(userData).length > 0) {
        await authService.updateProfile(userData);
      }

      // Update business profile
      if (businessData && (businessData.id || Object.keys(businessData).length > 0)) {
        const hasFile = (businessData.profileImage instanceof File) || (businessData.faqs instanceof File) || (businessData.serviceLicense instanceof File);
        if (hasFile) {
          const formData = new FormData();
          Object.keys(businessData).forEach(key => {
            const val = businessData[key];
            if (val === null || val === undefined) return;
            if (val instanceof File) {
              formData.append(key, val);
            } else if (typeof val === 'string' && val.trim() === '') {
              // skip blank strings
            } else {
              formData.append(key, String(val));
            }
          });

          await businessService.updateBusiness(businessData.id || businessData.businessId, formData);
        } else {
          const payload = { ...businessData };
          Object.keys(payload).forEach(k => {
            if (payload[k] === null || payload[k] === undefined || (typeof payload[k] === 'string' && payload[k].trim() === '')) {
              delete payload[k];
            }
          });
          await businessService.updateBusiness(businessData.id || businessData.businessId, payload);
        }
      }

      // Update local state by refetching core endpoints
      await refetchProfile();
      await refetchBusiness();

      // Also refetch verification status for the business so UI reflects any verification-related changes
      try {
        const bizId = businessData.id || businessData.businessId || (businessData && businessData.id) || businessData;
        if (bizId) {
          await businessService.getVerificationStatus(bizId);
        }
      } catch (vErr) {
        console.debug('verification refetch failed', vErr);
      }

      toast?.success?.('Profile updated successfully');
      setShowEdit(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast?.danger?.(error?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  // Example handlers for the action buttons
  const handleSaveInfo = async () => {
    try {
      toast?.info?.('Save information functionality coming soon');
    } catch (err) {
      toast?.danger?.(err?.message || 'Failed to save information');
    }
  };

  const handleGetBookings = async () => {
    try {
      router.push('/dashboard/business/orders');
    } catch (err) {
      toast?.danger?.(err?.message || 'Failed to navigate to bookings');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      <DashboardHeader
        title="Business Profile"
        subtitle="Manage your business information and verification status"
        rightActions={(
          <>
            <button
              onClick={() => setShowEdit(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          </>
        )}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BusinessProfileCard business={cardBusiness} user={user} />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Progress */}
            <BusinessProfileProgress
              progress={progress}
              profileProgress={profileProgress}
              business={businessData}
              onEdit={() => setShowEdit(true)}
              onSaveInfo={handleSaveInfo}
              onGetBookings={handleGetBookings}
              onVerify={() => {
                const target = '/dashboard/business/settings';
                if (router && router.push) router.push(target);
                else window.location.href = target;
              }}
            />

            {/* Profile Details */}
            <BusinessProfileDetails
              business={businessWithFormattedDetails}
              user={user}
              onEdit={() => setShowEdit(true)}
            />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <BusinessEditProfileModal
          business={businessData}
          user={user}
          onClose={() => setShowEdit(false)}
          onSave={handleUpdateBusiness}
          loading={updating}
        />
      )}
    </div>
  );
}

export default function BusinessProfilePage() {
  return (
    <ProtectedPage>
      <BusinessProfileContent />
    </ProtectedPage>
  );
}
