import { api } from '../lib/fetchClient';
import authService from './authService';

export function onboardBusiness(payload) {
  return api.post('/api/business', payload, { auth: true });
}

export async function getMyBusinesses() {
  try {
    const token = (typeof window !== 'undefined' && authService && authService.getAccessToken)
      ? authService.getAccessToken()
      : null;
    console.debug('[business.service] getMyBusinesses - token present:', !!token, token ? `${String(token).slice(0, 8)}...` : null);
    const res = await api.get('/api/business', { auth: true });
    console.debug('[business.service] getMyBusinesses response:', res);
    return res;
  } catch (err) {
    console.error('[business.service] getMyBusinesses error:', err);
    throw err;
  }
}

export function getBusinessById(id) {
  return api.get(`/api/business/${id}`, { auth: true });
}

export function updateBusiness(id, payload) {
  return api.patch(`/api/business/${id}`, payload, { auth: true });
}

export function deleteBusiness(id) {
  return api.del(`/api/business/${id}`, { auth: true });
}

export function addStaff(businessId, payload) {
  return api.post(`/api/business/${businessId}/staff`, payload, { auth: true });
}

export function removeStaff(businessId, staffId) {
  return api.del(`/api/business/${businessId}/staff/${staffId}`, { auth: true });
}

export function uploadVerification(businessId, formData) {
  // formData should be an instance of FormData
  return api.post(`/api/business/${businessId}/verification`, formData, { auth: true });
}

export function updateVerification(businessId, payload) {
  return api.patch(`/api/business/${businessId}/verification`, payload, { auth: true });
}

export function getVerificationStatus(businessId) {
  return api.get(`/api/business/${businessId}/verification`, { auth: true });
}

export function getVerificationDetails(businessId) {
  return api.get(`/api/business/${businessId}/verification/details`, { auth: true });
}

export function resubmitVerification(businessId, formData) {
  // formData should be an instance of FormData
  return api.put(`/api/business/${businessId}/verification`, formData, { auth: true });
}

export function cancelVerification(businessId) {
  return api.del(`/api/business/${businessId}/verification`, { auth: true });
}

export function getVerificationHistory(businessId) {
  return api.get(`/api/business/${businessId}/verification/history`, { auth: true });
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
