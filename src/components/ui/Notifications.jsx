"use client";

import { useState, useEffect } from "react";
import { Bell, Package, X } from "lucide-react";

/**
 * Notification Badge Component
 * Shows notification count with bounce animation
 */
export function NotificationBadge({ count = 0, onClick }) {
  const [showBounce, setShowBounce] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setShowBounce(true);
      const timer = setTimeout(() => setShowBounce(false), 600);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <button
      onClick={onClick}
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <Bell className={`w-6 h-6 text-gray-600 ${showBounce ? 'animate-bounce' : ''}`} />
      {count > 0 && (
        <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-ping-once">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}

/**
 * Notification Popup Component
 * Shows detailed notifications
 */
export function NotificationPopup({ notifications = [], onClose, onMarkAsRead }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-black/20 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mt-16 mr-4 animate-slideInRight">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Bell className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">No new notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200 text-center">
            <button
              onClick={() => onMarkAsRead('all')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes pingOnce {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
        .animate-ping-once {
          animation: pingOnce 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}

/**
 * Individual Notification Item
 */
function NotificationItem({ notification, onMarkAsRead }) {
  const getIcon = (type) => {
    switch (type) {
      case 'booking':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'order':
        return <Package className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className="flex gap-3">
        <div className="shrink-0 mt-1">
          {getIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
            {notification.title}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {notification.time}
          </p>
        </div>
        {!notification.read && (
          <div className="shrink-0">
            <span className="w-2 h-2 bg-blue-600 rounded-full block"></span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Booking Order Notification Toast
 * Special notification for new bookings
 */
export function BookingNotification({ booking, onClose, onView }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300);
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 
        max-w-md overflow-hidden
        ${isExiting ? 'animate-slideOut' : 'animate-slideIn'}
      `}
    >
      {/* Colored Top Bar */}
      <div className="h-1 bg-linear-to-r from-primary-400 to-primary-600"></div>

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="shrink-0 p-2 bg-primary-100 rounded-lg">
            <Package className="w-6 h-6 text-primary-600" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              New Booking Order! 🎉
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              {booking.customerName} booked {booking.serviceName}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-medium text-primary-600">{booking.price}</span>
              <span>•</span>
              <span>{booking.date}</span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              setIsExiting(true);
              setTimeout(() => {
                setIsVisible(false);
                onClose?.();
              }, 300);
            }}
            className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setIsExiting(true);
              setTimeout(() => {
                setIsVisible(false);
                onClose?.();
              }, 300);
            }}
            className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={() => {
              onView?.();
              setIsExiting(true);
              setTimeout(() => {
                setIsVisible(false);
                onClose?.();
              }, 300);
            }}
            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
          >
            View Order
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        .animate-slideOut {
          animation: slideOut 0.3s ease-in forwards;
        }
      `}</style>
    </div>
  );
}
