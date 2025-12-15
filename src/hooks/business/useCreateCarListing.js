// Alias re-export to support alternate import casing of the car listing hook
export * from './useCreateCarListing';
export { default } from './useCreateCarListing';
// hooks/business/useCreateCarListing.js
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";
import { useBusiness } from "@/hooks/business/useBusiness";
import { useCreateListing } from "./useCreateListing";
import authService from '@/services/authService';
import { buildCarRentalPayload } from '@/utils/listingPayloadBuilder';
import { validateImages } from '@/utils/listingValidation';
import { handleApiError } from '@/utils/errorParser';

export const useCreateCarListing = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get token from storage helper
  const token = typeof window !== "undefined" ? authService.getAccessToken() : null;

  // Fetch business data to get businessId
  const { business, loading: businessLoading, error: businessError } = useBusiness(token);

  const { createListing } = useCreateListing();

  const createCarListing = async (formData, images) => {
    if (!token) {
      addToast("Authentication required. Please log in.", "error");
      return;
    }

    if (businessLoading) {
      addToast("Loading business information...", "info");
      return;
    }

    if (businessError) {
      addToast("Failed to load business information. Please try again.", "error");
      return;
    }

    if (!business) {
      addToast("Business account not found. Please create a business first.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get business ID
      const businessObj = Array.isArray(business) ? business[0] : business;
      const businessId = businessObj?.id || businessObj?._id || '';

      if (!businessId) {
        throw new Error("Business ID not found. Please ensure you have a valid business account.");
      }

      // Validate images
      const imageValidation = validateImages(images);
      if (!imageValidation.isValid) {
        imageValidation.errors.forEach(err => addToast(err, 'error'));
        return;
      }

      // Build payload using category-aware builder
      const payload = buildCarRentalPayload(formData, businessId, images);
      
      console.log('[useCreateCarListing] Payload:', payload);

      // Extract files for upload
      const files = images.map((img) => img?.file || img).filter(f => f instanceof File);

      await createListing(payload, files);

      addToast("Car rental listing created successfully!", "success");

      // Redirect after short delay
      setTimeout(() => {
        router.push("/dashboard/business/listings");
      }, 1000);

    } catch (error) {
      console.error("Error creating car listing:", error);
      handleApiError(error, { addToast }, { setLoading: setIsSubmitting });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createCarListing,
    isSubmitting,
    businessLoading,
    businessError,
    business,
  };
};