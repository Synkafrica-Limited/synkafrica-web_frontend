import { api } from '../lib/fetchClient';


// Create a full listing (JSON)
export async function createListing(payload) {
	try {
		console.log('[listings.service] Creating listing:', payload.category);
		const res = await api.post('/api/listings', payload, { auth: true });
		console.log('[listings.service] Create response:', res);
		
		// Handle wrapped response
		const data = res?.data || res;
		
		if (data?.listing) {
			return data.listing;
		}
		
		return data;
	} catch (err) {
		console.error('[listings.service] createListing error:', err);
		throw err;
	}
}

// Quick listing endpoint (lighter payload)
export async function createQuickListing(payload) {
	try {
		console.log('[listings.service] Creating quick listing');
		const res = await api.post('/api/listings/quick', payload, { auth: true });
		console.log('[listings.service] Quick create response:', res);
		
		// Handle wrapped response
		const data = res?.data || res;
		
		if (data?.listing) {
			return data.listing;
		}
		
		return data;
	} catch (err) {
		console.error('[listings.service] createQuickListing error:', err);
		throw err;
	}
}

// Create listing with multipart form data (images/files)
// Create listing with multipart form data (images/files)
export async function createListingMultipart(payload, files = []) {
	try {
		const form = new FormData();

		// Helper to flatten payload into FormData
		const appendToForm = (data, parentKey = '') => {
			if (data === null || data === undefined) return;

			if (data instanceof Date) {
				form.append(parentKey, data.toISOString());
				return;
			}

			if (Array.isArray(data)) {
				data.forEach((item, index) => {
					// Use bracket notation for arrays: key[] or key[index]
					// Using repeated keys for arrays is safer for some backends, 
					// but bracket notation is standard for body-parser extended
					const key = `${parentKey}[]`;
					if (typeof item === 'object' && !(item instanceof File)) {
						appendToForm(item, `${parentKey}[${index}]`);
					} else {
						form.append(parentKey, item); // Repeated key pattern often safest for simple arrays
					}
				});
				return;
			}

			if (typeof data === 'object' && !(data instanceof File)) {
				Object.keys(data).forEach((key) => {
					const value = data[key];
					const formKey = parentKey ? `${parentKey}[${key}]` : key;
					appendToForm(value, formKey);
				});
				return;
			}

			form.append(parentKey, String(data));
		};

		// Flatten the payload
		appendToForm(payload);

		// Attach image files - only send actual File objects
		const validFiles = files.filter((f) => {
			const file = f instanceof File ? f : f?.file || f;
			return file instanceof File;
		});
		
		validFiles.forEach((f, idx) => {
			const file = f instanceof File ? f : f.file;
			form.append('images', file, file.name || `image_${idx}`);
		});

		console.log('[listings.service] Creating listing multipart:', payload.category, 'files:', validFiles.length);
		if (process.env.NODE_ENV === 'development') {
			console.log('[listings.service] Payload structure flattened.');
		}
		
		const res = await api.post('/api/listings', form, { auth: true, multipart: true });
		console.log('[listings.service] Create multipart response:', res);
		
		// Handle wrapped response
		const data = res?.data || res;
		
		if (data?.listing) {
			return data.listing;
		}
		
		return data;
	} catch (err) {
		console.error('[listings.service] createListingMultipart error:', err);
		throw err;
	}
}

// Get listings with optional filters
export async function getListings(params = {}) {
	try {
		const search = new URLSearchParams();
		Object.keys(params).forEach((k) => {
			const v = params[k];
			if (v == null) return;
			if (Array.isArray(v)) {
				v.forEach((val) => search.append(k, String(val)));
			} else if (typeof v === 'object') {
				search.append(k, JSON.stringify(v));
			} else {
				search.append(k, String(v));
			}
		});

		const path = `/api/listings${search.toString() ? `?${search.toString()}` : ''}`;
		console.log('[listings.service] Fetching listings:', path);
		const res = await api.get(path);
		console.log('[listings.service] API response:', res);
		
		// Return the full response object {success, message, data}
		return res;
	} catch (err) {
		console.error('[listings.service] getListings error:', err);
		throw err;
	}
}

export async function updateListing(id, payload) {
	try {
		console.log('[listings.service] Updating listing:', id, payload);
		const res = await api.patch(`/api/listings/${id}`, payload, { auth: true });
		console.log('[listings.service] Update response:', res);
		
		// Handle wrapped response
		const data = res?.data || res;
		
		if (data?.listing) {
			return data.listing;
		}
		
		return data;
	} catch (err) {
		console.error('[listings.service] updateListing error:', err);
		throw err;
	}
}

export async function updateListingMultipart(id, payload, files = []) {
	try {
		const form = new FormData();

		// Send the entire payload as JSON in a 'data' field to preserve types
		// This ensures integers remain integers and booleans remain booleans
		form.append('data', JSON.stringify(payload));

		// Attach image files
		files.forEach((f, idx) => {
			const file = f instanceof File ? f : f?.file || f;
			if (file instanceof File) {
				form.append('images', file, file.name || `image_${idx}`);
			}
		});

		console.log('[listings.service] Updating listing multipart:', id, 'files:', files.length);
		console.log('[listings.service] Payload:', payload);
		const res = await api.patch(`/api/listings/${id}`, form, { auth: true, multipart: true });
		console.log('[listings.service] Update multipart response:', res);
		
		// Handle wrapped response
		const data = res?.data || res;
		
		if (data?.listing) {
			return data.listing;
		}
		
		return data;
	} catch (err) {
		console.error('[listings.service] updateListingMultipart error:', err);
		throw err;
	}
}

export async function deleteListing(id) {
	try {
		console.log('[listings.service] Deleting listing:', id);
		const res = await api.del(`/api/listings/${id}`, { auth: true });
		console.log('[listings.service] Delete response:', res);
		return res;
	} catch (err) {
		console.error('[listings.service] deleteListing error:', err);
		throw err;
	}
}

export async function getVendorListings() {
	try {
		const res = await api.get('/api/listings/vendor/me', { auth: true });
		console.debug('[listings.service] getVendorListings raw response:', res);
		
		// Handle wrapped response: { success, message, data: { listings } } or direct: { listings } or [listings]
		const data = res?.data || res;
		
		// Return normalized data structure
		if (Array.isArray(data)) {
			return data;
		}
		
		if (data?.listings && Array.isArray(data.listings)) {
			return data.listings;
		}
		
		// If data is an object with listing properties, might be single listing
		if (data && typeof data === 'object' && data.id) {
			return [data];
		}
		
		return [];
	} catch (err) {
		console.error('[listings.service] getVendorListings error:', err);
		
		// Provide more context for business-related errors
		if (err?.status === 404) {
			throw new Error('No business profile found. Please complete your business setup first.');
		}
		
		throw err;
	}
}

export async function getListing(id) {
	try {
		console.log('[listings.service] Getting listing:', id);
		const res = await api.get(`/api/listings/${id}`);
		console.log('[listings.service] getListing raw response:', res);
		
		// Handle wrapped response: { success, message, data: { listing } } or direct: { listing } or listing object
		const data = res?.data || res;
		
		// If data has a listing property, extract it
		if (data?.listing) {
			console.log('[listings.service] getListing extracted listing:', data.listing);
			return data.listing;
		}
		
		// If data is already the listing object (has id or _id)
		if (data && (data.id || data._id)) {
			console.log('[listings.service] getListing direct listing:', data);
			return data;
		}
		
		console.warn('[listings.service] getListing: unexpected response format', res);
		return data;
	} catch (err) {
		console.error('[listings.service] getListing error:', err);
		throw err;
	}
}

export async function toggleListingAvailability(id, payload) {
	try {
		console.log('[listings.service] Toggling availability:', id, payload);
		const res = await api.patch(`/api/listings/${id}/availability`, payload, { auth: true });
		
		// Handle wrapped response
		const data = res?.data || res;
		
		if (data?.listing) {
			return data.listing;
		}
		
		return data;
	} catch (err) {
		console.error('[listings.service] toggleListingAvailability error:', err);
		throw err;
	}
}

export async function updateListingStatus(id, status) {
	try {
		console.log('[listings.service] Updating status:', id, status);
		return await updateListing(id, { status });
	} catch (err) {
		console.error('[listings.service] updateListingStatus error:', err);
		throw err;
	}
}

export async function getListingAnalytics(listingId) {
	try {
		console.log('[listings.service] Fetching analytics:', listingId);
		const res = await api.get(`/api/listings/${listingId}/analytics`, { auth: true });
		
		// Handle wrapped response
		const data = res?.data || res;
		return data;
	} catch (err) {
		console.error('[listings.service] getListingAnalytics error:', err);
		throw err;
	}
}

const listingsService = {
	createListing,
	createQuickListing,
	createListingMultipart,
	updateListingMultipart,
	getListings,
	getVendorListings,
	getListing,
	updateListing,
	deleteListing,
	toggleListingAvailability,
	updateListingStatus,
	quickSearchListings,
};

/**
 * Quick search listings endpoint
 * @param {Object} params - Search parameters
 * @param {string} params.q - Search query (optional)
 * @param {string} params.location - Location filter (optional)
 * @param {string} params.serviceType - Service type: CAR_RENTAL | WATER_RECREATION | DINING | RESORT_STAY (optional)
 * @param {string} params.date - Date filter (optional)
 * @param {string} params.time - Time filter (optional)
 * @param {string} params.startDate - Start date for stays (optional)
 * @param {string} params.endDate - End date for stays (optional)
 * @param {number} params.limit - Result limit (default: 20)
 * @param {number} params.skip - Pagination offset (default: 0)
 * @returns {Promise<{results: Array, meta: Object}>}
 */
export function quickSearchListings(params = {}) {
	const search = new URLSearchParams();
	Object.keys(params).forEach((k) => {
		const v = params[k];
		if (v == null) return;
		if (Array.isArray(v)) {
			v.forEach((val) => search.append(k, String(val)));
		} else if (typeof v === 'object') {
			search.append(k, JSON.stringify(v));
		} else {
			search.append(k, String(v));
		}
	});

	const path = `/api/listings/quick-search${search.toString() ? `?${search.toString()}` : ''}`;
	return api.get(path);
}

export default listingsService;

