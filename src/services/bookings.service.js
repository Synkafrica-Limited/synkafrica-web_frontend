import { api } from '../lib/fetchClient';

class BookingsService {
  /**
   * Get vendor bookings with filters and pagination
   * @param {Object} params - Query parameters
   * @param {number} params.skip - Number of records to skip (pagination)
   * @param {number} params.take - Number of records to take (pagination)
   * @param {string} params.status - Filter by status (PENDING, CONFIRMED, COMPLETED, CANCELLED)
   * @param {string} params.search - Search term
   * @param {string} params.startDate - Filter by start date
   * @param {string} params.endDate - Filter by end date
   * @param {string} params.paymentStatus - Filter by payment status
   */
  async getVendorBookings(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.skip !== undefined) queryParams.append('skip', params.skip);
    if (params.take !== undefined) queryParams.append('take', params.take);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);

    const queryString = queryParams.toString();
    const url = `/api/bookings${queryString ? `?${queryString}` : ''}`;
    
    return await api.get(url, { auth: true });
  }

  /**
   * Get bookings for a specific business
   * @param {string} businessId - Business ID
   * @param {Object} params - Query parameters (same as getVendorBookings)
   */
  async getBusinessBookings(businessId, params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.skip !== undefined) queryParams.append('skip', params.skip);
    if (params.take !== undefined) queryParams.append('take', params.take);
    if (params.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const url = `/api/bookings/business/${businessId}${queryString ? `?${queryString}` : ''}`;
    
    return await api.get(url, { auth: true });
  }

  /**
   * Get single booking details
   * @param {string} bookingId - Booking ID
   */
  async getBooking(bookingId) {
    return await api.get(`/api/bookings/${bookingId}`, { auth: true });
  }

  /**
   * Accept a booking
   * @param {string} bookingId - Booking ID
   * @param {Object} data - Accept data
   * @param {string} data.notes - Optional notes for the customer
   */
  async acceptBooking(bookingId, data = {}) {
    return await api.patch(`/api/bookings/${bookingId}/accept`, data, { auth: true });
  }

  /**
   * Reject a booking
   * @param {string} bookingId - Booking ID
   * @param {Object} data - Rejection data
   * @param {string} data.reason - Reason for rejection (required)
   * @param {string} data.notes - Optional additional notes
   */
  async rejectBooking(bookingId, data) {
    if (!data.reason) {
      throw new Error('Rejection reason is required');
    }
    return await api.patch(`/api/bookings/${bookingId}/reject`, data, { auth: true });
  }

  /**
   * Cancel a booking
   * @param {string} bookingId - Booking ID
   * @param {Object} data - Cancellation data
   * @param {string} data.reason - Optional reason for cancellation
   */
  async cancelBooking(bookingId, data = {}) {
    return await api.patch(`/api/bookings/${bookingId}/cancel`, data, { auth: true });
  }

  /**
   * Mark booking as paid
   * @param {string} bookingId - Booking ID
   * @param {Object} data - Payment data
   * @param {string} data.paymentReference - Payment reference (required)
   * @param {string} data.paymentMethod - Payment method (required)
   */
  async markAsPaid(bookingId, data) {
    if (!data.paymentReference || !data.paymentMethod) {
      throw new Error('Payment reference and method are required');
    }
    return await api.patch(`/api/bookings/${bookingId}/mark-paid`, data, { auth: true });
  }

  /**
   * Get vendor dashboard stats
   */
  async getVendorStats() {
    return await api.get('/api/business/dashboard/stats', { auth: true });
  }

  /**
   * Get transaction stats
   */
  async getTransactionStats() {
    return await api.get('/api/transactions/vendor/stats', { auth: true });
  }

  /**
   * Get vendor notifications
   * @param {Object} params - Query parameters
   * @param {boolean} params.unreadOnly - Get only unread notifications
   */
  async getNotifications(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.unreadOnly) queryParams.append('unreadOnly', 'true');
    queryParams.append('vendor', 'true');

    const queryString = queryParams.toString();
    const url = `/api/notifications${queryString ? `?${queryString}` : ''}`;
    
    return await api.get(url, { auth: true });
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   */
  async markNotificationAsRead(notificationId) {
    return await api.patch(`/api/notifications/${notificationId}/read`, {}, { auth: true });
  }
}

// Create and export singleton instance
const bookingsService = new BookingsService();

export default bookingsService;
