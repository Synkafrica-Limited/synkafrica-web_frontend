import { api } from '../lib/fetchClient';

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
	Object.keys(payload || {}).forEach((key) => {
		const val = payload[key];
		if (val === undefined || val === null) return;
		if (typeof val === 'object') {
			try {
				form.append(key, JSON.stringify(val));
			} catch (e) {
				form.append(key, String(val));
			}
		} else {
			form.append(key, String(val));
		}
	});

	files.forEach((f, idx) => {
		const file = f instanceof File ? f : f?.file || f;
		if (file) form.append('images', file, file.name || `image_${idx}`);
	});

	return api.post('/api/listings', form, { auth: true });
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
	Object.keys(payload || {}).forEach((key) => {
		const val = payload[key];
		if (val === undefined || val === null) return;
		if (typeof val === 'object') {
			try {
				form.append(key, JSON.stringify(val));
			} catch (e) {
				form.append(key, String(val));
			}
		} else {
			form.append(key, String(val));
		}
	});

	files.forEach((f, idx) => {
		const file = f instanceof File ? f : f?.file || f;
		if (file) form.append('images', file, file.name || `image_${idx}`);
	});

	return api.patch(`/api/listings/${id}`, form, { auth: true });
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
	getListings,
	getVendorListings,
	getListing,
	updateListing,
	deleteListing,
	toggleListingAvailability,
	updateListingStatus,
	getListingAnalytics,
};

export default listingsService;

