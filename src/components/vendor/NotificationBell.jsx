"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, X, Eye, Trash2 } from "lucide-react";
import { useVendorNotifications } from "@/context/VendorNotificationContext";
import { useRouter } from "next/navigation";

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useVendorNotifications();
    const dropdownRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
            setIsOpen(false);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
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
        };
        return icons[type] || "📌";
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                                >
                                    <Check className="w-3 h-3" />
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.slice(0, 20).map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? "bg-blue-50" : ""
                                            }`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl flex-shrink-0">
                                                {getNotificationIcon(notification.type)}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="font-medium text-sm text-gray-900 truncate">
                                                        {notification.title}
                                                    </h4>
                                                    {!notification.read && (
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs text-gray-500">
                                                        {formatTime(notification.timestamp)}
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeNotification(notification.id);
                                                        }}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 text-center">
                            <button
                                onClick={() => {
                                    router.push("/dashboard/business/notifications");
                                    setIsOpen(false);
                                }}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
