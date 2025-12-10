import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import { useBusiness } from './useBusiness';
import { useCreateListing } from './useCreateListing';
import authService from '@/services/authService';

export const useCreateResortListing = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = typeof window !== 'undefined' ? authService.getAccessToken() : null;

  const { business, loading: businessLoading, error: businessError } = useBusiness(token);
  const { createListing } = useCreateListing();

  const createResortListing = async (form, images = []) => {
    if (!business) {
      addToast('Business account not found. Please create a business first.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Basic validation
      if (!form.resortName || !form.location || !form.pricePerPerson) {
        throw new Error('Name, location and price are required');
      }

      const hasFiles = Array.isArray(images) && images.some((i) => i instanceof File || i?.file instanceof File);

      const payload = {
        businessId: business.id || business._id || '',
        title: form.resortName,
        description: form.description,
        category: 'RESORT',
        basePrice: Number.parseInt(Number(form.pricePerPerson) || 0, 10),
        currency: 'NGN',
        // Only include image preview URLs when there are no new files to upload
        ...(hasFiles ? {} : { images: images.map((i) => i.preview) }),
        location: {
          address: form.location,
          city: form.location?.split(',')[0]?.trim() || 'Lagos',
          country: 'Nigeria'
        },
        resort: {
          packageType: form.packageType,
          duration: form.duration,
          capacity: Number.parseInt(Number(form.capacity) || 0, 10),
          inclusions: form.inclusions || [],
          attractions: form.attractions || [],
          bookingAdvanceHours: Number.parseInt(Number(form.bookingAdvance) || 24, 10),
        }
      };

      await createListing(payload, images);
      addToast('Resort listing created successfully', 'success');
      router.push('/dashboard/business/listings');
    } catch (err) {
      console.error('createResortListing error', err);
      addToast(err?.message || 'Failed to create listing', 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createResortListing, isSubmitting, businessLoading, businessError, business };
};

export default useCreateResortListing;

