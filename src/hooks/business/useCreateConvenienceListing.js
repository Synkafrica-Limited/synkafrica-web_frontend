import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useNotifications';
import { useBusiness } from './useBusiness';
import { useCreateListing } from './useCreateListing';
import authService from '@/services/authService';
import { handleApiError } from '@/utils/errorParser';

export const useCreateConvenienceListing = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = typeof window !== 'undefined' ? authService.getAccessToken() : null;

  const { business, loading: businessLoading, error: businessError } = useBusiness(token);
  const { createListing } = useCreateListing();

  const createConvenienceListing = async (form, images = []) => {
    if (!business) {
      addToast('Business account not found. Please create a business first.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!form.serviceName || !form.location) {
        throw new Error('Service name and location are required');
      }

      const files = images.map((i) => i?.file || i);
      const hasFiles = files.some((f) => f instanceof File);

      const payload = {
        businessId: business?.id || business?._id || '',
        title: form.serviceName,
        description: form.description,
        category: 'CONVENIENCE_SERVICE',
        basePrice: Number(form.priceType === 'fixed' ? form.fixedPrice || 0 : form.hourlyRate || 0) || 0,
        currency: 'NGN',
        ...(hasFiles ? {} : { images: images.map((i) => i.preview) }),
        location: {
          address: form.location,
          city: form.location?.split(',')[0]?.trim() || 'Lagos',
          country: 'Nigeria'
        },
        convenience: {
          serviceType: form.serviceType,
          priceType: form.priceType,
          minimumOrder: Number(form.minimumOrder || 0),
          deliveryFee: Number(form.deliveryFee || 0),
          features: form.features || []
        }
      };

      await createListing(payload, files);
      addToast('Service listing created successfully', 'success');
      router.push('/dashboard/business/listings');
    } catch (err) {
      handleApiError(err, { addToast }, { setLoading: setIsSubmitting });
      throw err;
    }
  };

  return { createConvenienceListing, isSubmitting, businessLoading, businessError, business };
};

export default useCreateConvenienceListing;
