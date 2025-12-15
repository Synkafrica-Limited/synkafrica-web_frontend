"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X } from "lucide-react";
import Link from "next/link";
import { useVendorNotifications } from "@/context/VendorNotificationContext";
import { useRouter } from "next/navigation";
import notificationService from "@/services/notifications.service";

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, markAsRead } = useVendorNotifications();
    const dropdownRef = useRef(null);
    const router = useRouter();

    // Get latest 5 notifications
    const latestNotifications = notifications
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

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
        // Mark as read
        markAsRead(notification.id);

        if (notification.id && typeof notification.id === 'string' && notification.id.length > 20) {
            try {
                await notificationService.markAsRead(notification.id);
            } catch (error) {
                console.error('Failed to mark notification as read:', error);
            }
        }

        // Close dropdown
        setIsOpen(false);

        // Navigate to relevant page
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

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto flex-1">
                        {latestNotifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p className="text-sm text-gray-500">No notifications</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {latestNotifications.map((notification, index) => (
                                    <div
                                        key={`${notification.id}-${index}`}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50/50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl flex-shrink-0">
                                                {getNotificationIcon(notification.type)}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <p className="font-medium text-sm text-gray-900 line-clamp-1">
                                                        {notification.title}
                                                    </p>
                                                    {!notification.read && (
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {formatTime(notification.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {latestNotifications.length > 0 && (
                        <div className="border-t border-gray-200 p-3">
                            <Link
                                href="/dashboard/business/notifications"
                                onClick={() => setIsOpen(false)}
                                className="block text-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                            >
                                View all notifications
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
