import { api } from '../lib/fetchClient';
import authService from './authService';
import { parseApiError } from '@/utils/errorParser';

export async function onboardBusiness(payload) {
  try {
    return await api.post('/api/business', payload, { auth: true });
  } catch (err) {
    const message = parseApiError(err);
    console.error('[business.service] onboardBusiness error:', message);
    throw new Error(message);
  }
}

export async function getMyBusinesses() {
  try {
    const token = (typeof window !== 'undefined' && authService && authService.getAccessToken)
      ? authService.getAccessToken()
      : null;
    console.debug('[business.service] getMyBusinesses - token present:', !!token, token ? `${String(token).slice(0, 8)}...` : null);
    const res = await api.get('/api/business', { auth: true });
    console.debug('[business.service] getMyBusinesses raw response:', res);
    
    // Handle wrapped response format: { success, message, data: { business } } or { success, message, data: [businesses] }
    // or direct format: { business } or [businesses] or single business object
    const responseData = res?.data || res;
    console.debug('[business.service] getMyBusinesses extracted data:', responseData);
    
    // Normalize backend payloads: some backends return an array, others return { business } or a single object
    let business = responseData;
    if (Array.isArray(responseData)) {
      business = responseData.length > 0 ? responseData[0] : null;
    }
    if (business && business.business) {
      business = business.business;
    }

    console.debug('[business.service] getMyBusinesses final normalized business:', business);
    return business;
  } catch (err) {
    const message = parseApiError(err);
    console.error('[business.service] getMyBusinesses error:', message);
    throw new Error(message);
  }
}

export async function getBusinessById(id) {
  try {
    return await api.get(`/api/business/${id}`, { auth: true });
  } catch (err) {
    const message = parseApiError(err);
    console.error('[business.service] getBusinessById error:', message);
    throw new Error(message);
  }
}

export async function updateBusiness(id, payload) {
  try {
    return await api.patch(`/api/business/${id}`, payload, { auth: true });
  } catch (err) {
    const message = parseApiError(err);
    console.error('[business.service] updateBusiness error:', message);
    throw new Error(message);
  }
}

export async function deleteBusiness(id) {
  try {
    return await api.del(`/api/business/${id}`, { auth: true });
  } catch (err) {
    const message = parseApiError(err);
    console.error('[business.service] deleteBusiness error:', message);
    throw new Error(message);
  }
}

export async function addStaff(businessId, payload) {
  try {
    return await api.post(`/api/business/${businessId}/staff`, payload, { auth: true });
  } catch (err) {
    const message = parseApiError(err);
    console.error('[business.service] addStaff error:', message);
    throw new Error(message);
  }
}

export async function removeStaff(businessId, staffId) {
  try {
    return await api.del(`/api/business/${businessId}/staff/${staffId}`, { auth: true });
  } catch (err) {
    const message = parseApiError(err);
    console.error('[business.service] removeStaff error:', message);
    throw new Error(message);
  }
}

export async function uploadVerification(businessId, formData) {
  try {
    return await api.post(`/api/business/${businessId}/verification`, formData, { auth: true });
  } catch (err) {
    const message = parseApiError(err);
    console.error('[business.service] uploadVerification error:', message);
    throw new Error(message);
  }
}

export async function updateVerification(businessId, payload) {
  try {
    return await api.patch(`/api/business/${businessId}/verification`, payload, { auth: true });
  } catch (err) {
    const message = parseApiError(err);
    console.error('[business.service] updateVerification error:', message);
    throw new Error(message);
  }
}

export async function getVerificationStatus(businessId) {
  try {
    return await api.get(`/api/business/${businessId}/verification`, { auth: true });
  } catch (err) {
    const message = parseApiError(err);
    console.error('[business.service] getVerificationStatus error:', message);
    throw new Error(message);
  }
}

export async function getVerificationDetails(businessId) {
  try {
    return await api.get(`/api/business/${businessId}/verification/details`, { auth: true });
  } catch (err) {
    const message = parseApiError(err);
    console.error('[business.service] getVerificationDetails error:', message);
    throw new Error(message);
  }
}

export async function resubmitVerification(businessId, formData) {
  try {
    // formData should be an instance of FormData
    return await api.put(`/api/business/${businessId}/verification`, formData, { auth: true });
  } catch (err) {
    const message = parseApiError(err);
    console.error('[business.service] resubmitVerification error:', message);
    throw new Error(message);
  }
}

export async function cancelVerification(businessId) {
  try {
    return await api.del(`/api/business/${businessId}/verification`, { auth: true });
  } catch (err) {
    const message = parseApiError(err);
    console.error('[business.service] cancelVerification error:', message);
    throw new Error(message);
  }
}

export async function getVerificationHistory(businessId) {
  try {
    return await api.get(`/api/business/${businessId}/verification/history`, { auth: true });
  } catch (err) {
    const message = parseApiError(err);
    console.error('[business.service] getVerificationHistory error:', message);
    throw new Error(message);
  }
}

// Helper function to check if business is verified
export function isBusinessVerified(businessId) {
  return getVerificationStatus(businessId)
    .then(status => status?.status === 'verified')
    .catch(() => false);
}

// Helper function to get verification progress percentage
export function getVerificationProgress(businessId) {
  return getVerificationStatus(businessId)
    .then(status => ({
      status: status?.status || 'not_started',
      progress: status?.progress || 0
    }))
    .catch(() => ({
      status: 'not_started',
      progress: 0
    }));
}

const businessService = {
  onboardBusiness,
  getMyBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  addStaff,
  removeStaff,
  uploadVerification,
  updateVerification,
  getVerificationStatus,
  getVerificationDetails,
  resubmitVerification,
  cancelVerification,
  getVerificationHistory,
  isBusinessVerified,
  getVerificationProgress,
};

export default businessService;
