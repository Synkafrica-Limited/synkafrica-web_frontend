import { useState } from 'react';
import { useToast } from '@/hooks/useNotifications';
import listingsService from '@/services/listings.service';
import { useRouter } from 'next/navigation';

export function useQuickListing() {
  const { addToast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createQuickListing = async (payload) => {
    setIsSubmitting(true);
    try {
      if (!payload.businessId) throw new Error('businessId is required');
      if (!payload.title) throw new Error('title is required');
      const res = await listingsService.createQuickListing(payload);
      addToast('Quick listing created', 'success');
      // navigate to listings
      setTimeout(() => router.push('/dashboard/business/listings'), 800);
      return res;
    } catch (err) {
      console.error('createQuickListing error:', err);
      addToast(err?.message || 'Failed to create quick listing', 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createQuickListing, isSubmitting };
}

export default useQuickListing;
