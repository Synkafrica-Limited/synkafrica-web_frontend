import { api } from '../lib/fetchClient';

export function getVendorTransactions(query = '') {
  return api.get(`/api/transactions${query}`, { auth: true });
}

export function getVendorStats() {
  return api.get('/api/transactions/stats', { auth: true });
}

export function requestPayout(payload) {
  return api.post('/api/transactions/payouts', payload, { auth: true });
}

export function requestPayoutForTransactions(payload) {
  return api.post('/api/transactions/payouts/selected', payload, { auth: true });
}

export function getCustomerTransactions() {
  return api.get('/api/transactions/me', { auth: true });
}

const transactionsService = {
  getVendorTransactions,
  getVendorStats,
  requestPayout,
  requestPayoutForTransactions,
  getCustomerTransactions,
};

export default transactionsService;
