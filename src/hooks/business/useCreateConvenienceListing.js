import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import { useBusiness } from './useBusiness';
import { useCreateListing } from './useCreateListing';
import authService from '@/services/authService';
import { buildConveniencePayload } from '@/utils/listingPayloadBuilder';
import { validateImages } from '@/utils/listingValidation';
import { handleApiError } from '@/utils/errorParser';

export const useCreateConvenienceListing = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = typeof window !== 'undefined' ? authService.getAccessToken() : null;

  const { business, loading: businessLoading, error: businessError } = useBusiness(token);
  const { createListing } = useCreateListing();

  const createConvenienceListing = async (form, images = []) => {
    if (!token) {
      addToast({ message: 'Authentication required. Please log in.', type: 'error' });
      return;
    }

    if (businessLoading) {
      addToast({ message: 'Loading business information...', type: 'info' });
      return;
    }

    if (businessError) {
      addToast({ message: 'Failed to load business information. Please try again.', type: 'error' });
      return;
    }

    if (!business) {
      addToast({ message: 'Business account not found. Please create a business first.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      // Debug: Log the business object structure
      console.log('[useCreateConvenienceListing] Business object:', business);
      
      // Get business ID - handle both array and single object response
      const businessObj = Array.isArray(business) ? business[0] : business;
      const businessId = businessObj?.id || businessObj?._id || businessObj?.businessId || '';
      console.log('[useCreateConvenienceListing] Extracted businessId:', businessId);

      if (!businessId) {
        console.error('[useCreateConvenienceListing] Failed to extract business ID from:', businessObj);
        throw new Error('Business ID not found. Please ensure you have a valid business account.');
      }

      // Validate images
      const imageValidation = validateImages(images);
      if (!imageValidation.isValid) {
        imageValidation.errors.forEach(err => addToast({ message: err, type: 'error' }));
        return;
      }

      // Build payload using category-aware builder
      const payload = buildConveniencePayload(form, businessId, images);
      
      console.log('[useCreateConvenienceListing] Payload:', payload);

      // Extract files for upload
      const files = images.map((i) => i?.file || i).filter(f => f instanceof File);

      await createListing(payload, files);
      addToast({ message: 'Service listing created successfully', type: 'success' });
      router.push('/dashboard/business/listings');
    } catch (err) {
      handleApiError(err, { addToast }, { setLoading: setIsSubmitting });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createConvenienceListing, isSubmitting, businessLoading, businessError, business };
};

export default useCreateConvenienceListing;
