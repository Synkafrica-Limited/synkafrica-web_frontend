"use client";

import { useState, useCallback } from "react";

/**
 * Custom hook for managing toast notifications
 * Usage:
 * const { toasts, addToast, removeToast } = useToast();
 * addToast('Success!', 'success');
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

/**
 * Custom hook for managing notifications
 * Usage:
 * const { notifications, unreadCount, addNotification, markAsRead } = useNotifications();
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      read: false,
      time: "Just now",
      ...notification,
    };
    setNotifications((prev) => [newNotification, ...prev]);
    return id;
  }, []);

  const markAsRead = useCallback((id) => {
    if (id === 'all') {
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    } else {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    removeNotification,
  };
}
