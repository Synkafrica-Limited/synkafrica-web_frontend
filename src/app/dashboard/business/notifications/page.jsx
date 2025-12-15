"use client";

import { useState, useEffect } from "react";
import { useVendorNotifications } from "@/context/VendorNotificationContext";
import { Bell, Trash2, Check, RefreshCw, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import notificationService from "@/services/notifications.service";
import { useToast } from "@/components/ui/ToastProvider";
import DashboardHeader from '@/components/layout/DashboardHeader';
import NotificationBell from "@/components/dashboard/vendor/NotificationBell";
import { Plus } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, removeNotification, addNotification } = useVendorNotifications();
  const router = useRouter();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch notifications from backend on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const backendNotifications = await notificationService.getNotifications({ limit: 50 });

      // Map backend format to local format
      const mappedNotifications = backendNotifications.map(notification => ({
        id: notification.id || notification._id,
        title: notification.title || getNotificationTitle(notification.type),
        message: notification.message || notification.content || '',
        type: notification.type || 'general',
        timestamp: notification.createdAt || notification.timestamp || new Date().toISOString(),
        read: notification.read || notification.isRead || false,
        metadata: notification.metadata || {},
      }));

      // Add only new notifications that don't exist in local context
      const existingIds = new Set(notifications.map(n => n.id));
      const newNotifications = mappedNotifications.filter(n => !existingIds.has(n.id));

      newNotifications.forEach(notification => {
        addNotification(notification);
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
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    const icons = {
      booking_request: "🔔",
      booking_expired: "⏰",
      booking_accepted: "✅",
      booking_cancelled: "❌",
      support_message: "💬",
      verification_update: "📋",
      payment_received: "💰",
      listing_approved: "✅",
      listing_rejected: "❌",
    };
    return icons[type] || "📌";
  };

  const handleNotificationClick = async (notification) => {
    markAsRead(notification.id);

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
    removeNotification(notificationId);

    if (notificationId && typeof notificationId === 'string' && notificationId.length > 20) {
      try {
        await notificationService.deleteNotification(notificationId);
      } catch (error) {
        console.error('Failed to delete notification from backend:', error);
      }
    }
  };

  const handleDeleteAll = () => {
    setShowDeleteAllConfirm(true);
  };

  const confirmDeleteAll = async () => {
    setIsDeleting(true);
    try {
      // Delete all notifications from local context
      notifications.forEach(notification => {
        removeNotification(notification.id);
      });

      // Delete all from backend
      await Promise.all(
        notifications.map(notification =>
          notificationService.deleteNotification(notification.id).catch(err => {
            console.error('Failed to delete notification:', notification.id, err);
          })
        )
      );

      addToast({ message: 'All notifications deleted', type: 'success', duration: 2000 });
      setShowDeleteAllConfirm(false);
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
      addToast({ message: 'Failed to delete some notifications', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  // Categorize notifications
  const categorizeNotifications = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const categories = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: []
    };

    filteredNotifications.forEach(notification => {
      const notifDate = new Date(notification.timestamp);
      if (notifDate >= today) {
        categories.today.push(notification);
      } else if (notifDate >= yesterday) {
        categories.yesterday.push(notification);
      } else if (notifDate >= weekAgo) {
        categories.thisWeek.push(notification);
      } else {
        categories.older.push(notification);
      }
    });

    return categories;
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !notification.read;
    if (activeFilter === "bookings") return notification.type?.includes("booking");
    if (activeFilter === "listings") return notification.type?.includes("listing");
    if (activeFilter === "verification") return notification.type?.includes("verification");
    return true;
  });

  const categorized = categorizeNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const filters = [
    { id: "all", label: "All", count: notifications.length },
    { id: "unread", label: "Unread", count: unreadCount },
    { id: "bookings", label: "Bookings", count: notifications.filter(n => n.type?.includes("booking")).length },
    { id: "listings", label: "Listings", count: notifications.filter(n => n.type?.includes("listing")).length },
    { id: "verification", label: "Verification", count: notifications.filter(n => n.type?.includes("verification")).length },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F6]">
        <DashboardHeader
          title="Manage Listings"
          subtitle="Create and manage your service listings"

        />
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderNotificationGroup = (title, notificationsList, categoryKey) => {
    if (notificationsList.length === 0) return null;

    return (
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{title}</h3>
        <div className="space-y-2">
          {notificationsList.map((notification, index) => (
            <div
              key={`${categoryKey}-${notification.id}-${index}`}
              className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-all cursor-pointer ${!notification.read ? "border-l-4 border-l-primary-500 border-gray-200" : "border-gray-200"
                }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-4 p-4">
                <span className="text-2xl flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{notification.title}</h4>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1.5"></span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{notification.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
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
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      <DashboardHeader
        title="Notifications"
        subtitle="Latest Updates here"

      // rightActions={(
      //   <NotificationBell />
      // )}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === filter.id
                    ? "bg-primary-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {filter.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${activeFilter === filter.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-600"
                    }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              {filteredNotifications.length > 0 && (
                <>
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Mark all as read
                  </button>
                  <button
                    onClick={handleDeleteAll}
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete all
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Notifications */}
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">
                {activeFilter === "all" ? "You're all caught up!" : `No ${activeFilter} notifications`}
              </p>
            </div>
          ) : (
            <div>
              {renderNotificationGroup("Today", categorized.today, "today")}
              {renderNotificationGroup("Yesterday", categorized.yesterday, "yesterday")}
              {renderNotificationGroup("This Week", categorized.thisWeek, "thisWeek")}
              {renderNotificationGroup("Older", categorized.older, "older")}
            </div>
          )}
        </div>
      </div>

      {/* Delete All Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteAllConfirm}
        onClose={() => !isDeleting && setShowDeleteAllConfirm(false)}
        onConfirm={confirmDeleteAll}
        title="Delete All Notifications"
        message="Are you sure you want to delete all notifications? This action cannot be undone."
        confirmText="Delete All"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
