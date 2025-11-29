import { api } from '../lib/fetchClient';

export function createBooking(payload) {
  return api.post('/api/bookings', payload, { auth: true });
}

export function getMyBookings() {
  return api.get('/api/bookings/me', { auth: true });
}

export function getBusinessBookings() {
  return api.get('/api/bookings/business/me', { auth: true });
}

export function getBooking(id) {
  return api.get(`/api/bookings/${id}`, { auth: true });
}

export function updateBookingStatus(id, payload) {
  return api.patch(`/api/bookings/${id}/status`, payload, { auth: true });
}

export function cancelBooking(id) {
  return api.patch(`/api/bookings/${id}/cancel`, null, { auth: true });
}

export function acceptBooking(id, payload) {
  return api.patch(`/api/dashboard/vendor/bookings/${id}/accept`, payload, { auth: true });
}

export function rejectBooking(id, payload) {
  return api.patch(`/api/dashboard/vendor/bookings/${id}/reject`, payload, { auth: true });
}

const bookingsService = {
  createBooking,
  getMyBookings,
  getBusinessBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  acceptBooking,
  rejectBooking,
};

export default bookingsService;
