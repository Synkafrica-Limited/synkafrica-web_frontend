import { api } from '../lib/fetchClient';

async function getVendorStats(range = '30d') {
  return api.get(`/api/business/dashboard/stats?range=${range}`, { auth: true });
}

async function getRevenueChart(params = {}) {
  const { period = 'monthly', range = '30d' } = params;
  return api.get(`/api/dashboard/vendor/revenue/chart?period=${period}&range=${range}`, { auth: true });
}

async function getBookingsStats() {
  return api.get('/api/dashboard/vendor/bookings/stats', { auth: true });
}

async function getListingAnalytics(listingId) {
  return api.get(`/api/listings/${listingId}/analytics`, { auth: true });
}

export default {
  getVendorStats,
  getRevenueChart,
  getBookingsStats,
  getListingAnalytics,
};
