"use client";
import { useState } from 'react';
import { useToast } from '@/components/ui/ToastProvider';
import listingsService from '../../services/listings.service';
import { handleApiError } from '@/utils/errorParser';

export function useCreateListing() {
	const { addToast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const createListing = async (payload, images = []) => {
		setIsSubmitting(true);
		try {
			console.log('[useCreateListing] Creating listing:', payload.category);

			// Validate payload has required fields
			if (!payload.title?.trim()) {
				throw new Error('Title is required');
			}

			if (!payload.category) {
				throw new Error('Category is required');
			}

			if (!payload.businessId) {
				throw new Error('Business ID is required. Please complete your business setup first.');
			}

			if (payload.basePrice === undefined || payload.basePrice === null) {
				throw new Error('Price is required');
			}

			// Determine if we have files to upload
			const hasFiles = Array.isArray(images) && images.some((i) => i instanceof File || i?.file instanceof File);

			let result;
			if (hasFiles) {
				console.log('[useCreateListing] Creating with multipart (files)');
				result = await listingsService.createListingMultipart(payload, images);
			} else {
				console.log('[useCreateListing] Creating with JSON');
				result = await listingsService.createListing(payload);
			}

			console.log('[useCreateListing] Success:', result);
			return result;
		} catch (err) {
			console.error('[useCreateListing] Error:', err);
			handleApiError(err, { addToast }, { setLoading: setIsSubmitting });
			throw err;
		} finally {
			setIsSubmitting(false);
		}
	};

	return { createListing, isSubmitting };
}

export default useCreateListing;
