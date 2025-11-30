import { useState } from 'react';
import { useToast } from '@/hooks/useNotifications';
import listingsService from '../../services/listings.service';

export function useCreateListing() {
	const { addToast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const createListing = async (payload, images = []) => {
		setIsSubmitting(true);
		try {
			// Basic validation
			if (!payload.title || !payload.category) {
				throw new Error('Title and category are required');
			}

			const hasFiles = Array.isArray(images) && images.some((i) => i instanceof File || i?.file instanceof File);

			let result;
			if (hasFiles) {
				result = await listingsService.createListingMultipart(payload, images);
			} else {
				result = await listingsService.createListing(payload);
			}

			addToast('Listing created successfully', 'success');
			return result;
		} catch (err) {
			console.error('createListing error:', err);
			addToast(err?.payload?.message || err?.message || 'Failed to create listing', 'error');
			throw err;
		} finally {
			setIsSubmitting(false);
		}
	};

	return { createListing, isSubmitting };
}

export default useCreateListing;
