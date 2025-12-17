import api from '@/lib/fetchClient';

/**
 * Notification Service
 * Handles all notification-related API calls for vendors
 */
class NotificationService {
  /**
   * Get all notifications for the vendor
   * @param {Object} params - Query parameters
   * @param {boolean} params.unreadOnly - Get only unread notifications
   * @param {number} params.limit - Number of notifications to fetch
   * @param {number} params.offset - Pagination offset
   * @returns {Promise<Array>} List of notifications
   */
  async getNotifications(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.unreadOnly) queryParams.append('unreadOnly', 'true');
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.offset) queryParams.append('offset', params.offset);

      const queryString = queryParams.toString();
      const url = `/api/notifications${queryString ? `?${queryString}` : ''}`;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[notifications.service] Fetching notifications:', url);
      }
      const response = await api.get(url, { auth: true });
      if (process.env.NODE_ENV === 'development') {
        console.log('[notifications.service] Full API response:', response);
      }
      
      // Handle wrapped response - API returns { data: { items: [...], unread: 40 } }
      const data = response?.data || response;
      const notifications = data?.items || data?.notifications || data || [];
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[notifications.service] Fetched notifications:', notifications.length);
      }
      return Array.isArray(notifications) ? notifications : [];
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[notifications.service] Error fetching notifications:', error);
      }
      // Return empty array instead of throwing to prevent UI breaks
      return [];
    }
  }

  /**
   * Mark a specific notification as read
   * @param {string} notificationId - The notification ID
   * @returns {Promise<Object>} Updated notification
   */
  async markAsRead(notificationId) {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('[notifications.service] Marking notification as read:', notificationId);
      }
      const response = await api.patch(`/api/notifications/${notificationId}/read`, {}, { auth: true });
      
      const data = response?.data || response;
      if (process.env.NODE_ENV === 'development') {
        console.log('[notifications.service] Marked as read:', data);
      }
      return data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[notifications.service] Error marking notification as read:', error);
      }
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   * @returns {Promise<Object>} Response
   */
  async markAllAsRead() {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('[notifications.service] Marking all notifications as read');
      }
      const response = await api.patch('/api/notifications/mark-all-read', {}, { auth: true });
      
      const data = response?.data || response;
      if (process.env.NODE_ENV === 'development') {
        console.log('[notifications.service] All marked as read:', data);
      }
      return data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[notifications.service] Error marking all as read:', error);
      }
      throw error;
    }
  }

  /**
   * Delete a specific notification
   * @param {string} notificationId - The notification ID
   * @returns {Promise<Object>} Response
   */
  async deleteNotification(notificationId) {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('[notifications.service] Deleting notification:', notificationId);
      }
      const response = await api.del(`/api/notifications/${notificationId}`, { auth: true });
      
      const data = response?.data || response;
      if (process.env.NODE_ENV === 'development') {
        console.log('[notifications.service] Deleted notification:', data);
      }
      return data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[notifications.service] Error deleting notification:', error);
      }
      throw error;
    }
  }

  /**
   * Get unread notification count
   * @returns {Promise<number>} Unread count
   */
  async getUnreadCount() {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('[notifications.service] Fetching unread count');
      }
      const response = await api.get('/api/notifications/unread/count', { auth: true });
      
      const data = response?.data || response;
      const count = data?.count || data?.unreadCount || 0;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('[notifications.service] Unread count:', count);
      }
      return count;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[notifications.service] Error fetching unread count:', error);
      }
      return 0;
    }
  }

  /**
   * Subscribe to real-time notifications (WebSocket/SSE)
   * @returns {Function} Cleanup function
   */
  subscribeToNotifications() {
    // TODO: Implement WebSocket or SSE subscription when backend supports it
    if (process.env.NODE_ENV === 'development') {
      console.log('[notifications.service] Real-time notifications not yet implemented');
    }
    return () => {}; // Return cleanup function
  }
}

const notificationService = new NotificationService();
export default notificationService;
