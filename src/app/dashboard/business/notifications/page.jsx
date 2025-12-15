"use client";

import { useState, useEffect } from "react";
import { useVendorNotifications } from "@/context/VendorNotificationContext";
import { Bell, Trash2, Check, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import notificationService from "@/services/notifications.service";
import { useToast } from "@/components/ui/ToastProvider";

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, removeNotification, addNotification } = useVendorNotifications();
  const router = useRouter();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch notifications from backend on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const backendNotifications = await notificationService.getNotifications({ limit: 50 });
      
      // Sync backend notifications with local context
      // Map backend format to local format
      backendNotifications.forEach(notification => {
        const localNotification = {
          id: notification.id || notification._id,
          title: notification.title || getNotificationTitle(notification.type),
          message: notification.message || notification.content || '',
          type: notification.type || 'general',
          timestamp: notification.createdAt || notification.timestamp || new Date().toISOString(),
          read: notification.read || notification.isRead || false,
          metadata: notification.metadata || {},
        };
        
        // Only add if not already in local storage
        const exists = notifications.find(n => n.id === localNotification.id);
        if (!exists) {
          addNotification(localNotification);
        }
      });
      
      console.log('[NotificationsPage] Fetched and synced notifications:', backendNotifications.length);
    } catch (error) {
      console.error('[NotificationsPage] Error fetching notifications:', error);
      addToast({ message: 'Could not load latest notifications', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchNotifications();
    setIsRefreshing(false);
    addToast({ message: 'Notifications refreshed', type: 'success', duration: 2000 });
  };

  const getNotificationTitle = (type) => {
    const titles = {
      booking_request: "New Booking Request",
      booking_expired: "Booking Expired",
      booking_accepted: "Booking Accepted",
      booking_cancelled: "Booking Cancelled",
      support_message: "Support Message",
      verification_update: "Verification Update",
      payment_received: "Payment Received",
      listing_approved: "Listing Approved",
      listing_rejected: "Listing Rejected",
      general: "Notification",
    };
    return titles[type] || "Notification";
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getNotificationIcon = (type) => {
    const icons = {
      booking_request: "🔔",
      booking_expired: "⏰",
      booking_accepted: "✅",
      booking_cancelled: "❌",
      support_message: "💬",
      verification_update: "📋",
    };
    return icons[type] || "📌";
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read locally
    markAsRead(notification.id);
    
    // Mark as read on backend if it has a backend ID
    if (notification.id && typeof notification.id === 'string' && notification.id.length > 20) {
      try {
        await notificationService.markAsRead(notification.id);
      } catch (error) {
        console.error('Failed to mark notification as read on backend:', error);
      }
    }

    const routes = {
      booking_request: "/dashboard/business/orders",
      booking_expired: "/dashboard/business/orders",
      booking_accepted: "/dashboard/business/orders",
      booking_cancelled: "/dashboard/business/orders",
      support_message: "/dashboard/business/support",
      verification_update: "/dashboard/business/settings",
      payment_received: "/dashboard/business/transaction",
      listing_approved: "/dashboard/business/listings",
      listing_rejected: "/dashboard/business/listings",
    };

    const route = routes[notification.type];
    if (route) {
      router.push(route);
    }
  };

  const handleMarkAllAsRead = async () => {
    markAllAsRead();
    
    try {
      await notificationService.markAllAsRead();
      addToast({ message: 'All notifications marked as read', type: 'success', duration: 2000 });
    } catch (error) {
      console.error('Failed to mark all as read on backend:', error);
    }
  };

  const handleRemoveNotification = async (e, notificationId) => {
    e.stopPropagation();
    
    // Remove locally
    removeNotification(notificationId);
    
    // Remove from backend if it has a backend ID
    if (notificationId && typeof notificationId === 'string' && notificationId.length > 20) {
      try {
        await notificationService.deleteNotification(notificationId);
      } catch (error) {
        console.error('Failed to delete notification from backend:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F6] p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F6] p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Notifications</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              title="Refresh notifications"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <Check className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer ${!notification.read ? "border-l-4 border-l-blue-500" : ""
                  }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{formatTime(notification.timestamp)}</span>
                      <button
                        onClick={(e) => handleRemoveNotification(e, notification.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
