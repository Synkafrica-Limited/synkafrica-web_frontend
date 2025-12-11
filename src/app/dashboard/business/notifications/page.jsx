"use client";

import { useVendorNotifications } from "@/context/VendorNotificationContext";
import { Bell, Trash2, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useVendorNotifications();
  const router = useRouter();

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

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    const routes = {
      booking_request: "/dashboard/business/orders",
      booking_expired: "/dashboard/business/orders",
      booking_accepted: "/dashboard/business/orders",
      booking_cancelled: "/dashboard/business/orders",
      support_message: "/dashboard/business/support",
      verification_update: "/dashboard/business/settings",
    };

    const route = routes[notification.type];
    if (route) {
      router.push(route);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F6] p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Notifications</h1>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
          )}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
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
