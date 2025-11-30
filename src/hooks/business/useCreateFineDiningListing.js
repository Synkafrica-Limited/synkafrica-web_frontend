import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useNotifications';
import { useBusiness } from './useBusiness';
import { useCreateListing } from './useCreateListing';
import authService from '@/services/authService';

export const useCreateFineDiningListing = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = typeof window !== 'undefined' ? authService.getAccessToken() : null;

  const { business, loading: businessLoading, error: businessError } = useBusiness(token);
  const { createListing } = useCreateListing();

  const createFineDiningListing = async (form, images = [], menuPdf = null) => {
    if (!business) {
      addToast('Business account not found. Please create a business first.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!form.restaurantName || !form.location) {
        throw new Error('Restaurant name and location are required');
      }

      const files = images.map((i) => i?.file || i);
      // include menuPdf as a file if provided
      const menuFile = menuPdf?.file || (menuPdf instanceof File ? menuPdf : null);
      const allFiles = menuFile ? [...files, menuFile] : files;
      const hasFiles = allFiles.some((f) => f instanceof File);

      const payload = {
        businessId: business?.id || business?._id || '',
        title: form.restaurantName,
        description: form.description,
        category: 'FINE_DINING',
        basePrice: Number(form.priceRange) || 0,
        currency: 'NGN',
        ...(hasFiles ? {} : { images: images.map((i) => i.preview) }),
        location: {
          address: form.location,
          city: form.location?.split(',')[0]?.trim() || 'Lagos',
          country: 'Nigeria'
        },
        dining: {
          cuisineType: form.cuisineType || [],
          diningType: form.diningType || '',
          capacity: Number(form.capacity) || 0,
          amenities: form.amenities || [],
          menuUrl: menuPdf ? menuPdf.preview || null : null,
        }
      };

        await createListing(payload, allFiles);
      addToast('Fine dining listing created successfully', 'success');
      router.push('/dashboard/business/listings');
    } catch (err) {
      console.error('createFineDiningListing error', err);
      addToast(err?.message || 'Failed to create listing', 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createFineDiningListing, isSubmitting, businessLoading, businessError, business };
};

export default useCreateFineDiningListing;
