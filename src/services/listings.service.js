import { api } from '../lib/fetchClient';
import { appendNested } from '@/utils/appendNested';

// Create a full listing (JSON)
export function createListing(payload) {
	return api.post('/api/listings', payload, { auth: true });
}

// Quick listing endpoint (lighter payload)
export function createQuickListing(payload) {
	return api.post('/api/listings/quick', payload, { auth: true });
}

// Create listing with multipart form data (images/files)
export function createListingMultipart(payload, files = []) {
	const form = new FormData();

	// 1) Append primitive top-level fields
	Object.entries(payload || {}).forEach(([key, value]) => {
		if (value === undefined || value === null) return;
		if (typeof value !== 'object') {
			form.append(key, String(value));
		}
	});

	// 2) Append nested objects using bracketed notation expected by backend
	if (payload.location) appendNested(form, 'location', payload.location);
	if (payload.resort) appendNested(form, 'resort', payload.resort);
	if (payload.carRental) appendNested(form, 'carRental', payload.carRental);
	if (payload.convenience) appendNested(form, 'convenience', payload.convenience);
	if (payload.dining) appendNested(form, 'dining', payload.dining);

	// 3) Attach files (images and any other File objects passed)
	files.forEach((f, idx) => {
		const file = f instanceof File ? f : f?.file || f;
		if (file instanceof File) {
			form.append('images', file, file.name || `image_${idx}`);
		}
	});

	return api.post('/api/listings', form, { auth: true, multipart: true });
}

// Get listings with optional filters
export function getListings(params = {}) {
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
	return api.get(path);
}

export function updateListing(id, payload) {
	return api.patch(`/api/listings/${id}`, payload, { auth: true });
}

export function updateListingMultipart(id, payload, files = []) {
	const form = new FormData();

	// 1) Append primitive top-level fields
	Object.entries(payload || {}).forEach(([key, value]) => {
		if (value === undefined || value === null) return;
		if (typeof value !== 'object') {
			form.append(key, String(value));
		}
	});

	// 2) Append nested objects using bracketed notation
	if (payload.location) appendNested(form, 'location', payload.location);
	if (payload.resort) appendNested(form, 'resort', payload.resort);
	if (payload.carRental) appendNested(form, 'carRental', payload.carRental);
	if (payload.convenience) appendNested(form, 'convenience', payload.convenience);
	if (payload.dining) appendNested(form, 'dining', payload.dining);

	// 3) Attach files
	files.forEach((f, idx) => {
		const file = f instanceof File ? f : f?.file || f;
		if (file instanceof File) {
			form.append('images', file, file.name || `image_${idx}`);
		}
	});

	return api.patch(`/api/listings/${id}`, form, { auth: true, multipart: true });
}

export function deleteListing(id) {
	return api.del(`/api/listings/${id}`, { auth: true });
}

export function getVendorListings() {
	return api.get('/api/listings/vendor/me', { auth: true });
}

export function getListing(id) {
	return api.get(`/api/listings/${id}`);
}

export function toggleListingAvailability(id, payload) {
	return api.patch(`/api/listings/${id}/availability`, payload, { auth: true });
}

export function updateListingStatus(id, status) {
	return updateListing(id, { status });
}

export function getListingAnalytics(listingId) {
	return api.get(`/api/listings/${listingId}/analytics`, { auth: true });
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

