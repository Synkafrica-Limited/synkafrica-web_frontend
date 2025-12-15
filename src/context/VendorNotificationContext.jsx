"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const VendorNotificationContext = createContext();

const STORAGE_KEY = "vendor_notifications";
const CHANNEL_NAME = "vendor_notifications_sync";

export const VendorNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [channel, setChannel] = useState(null);

  // Initialize BroadcastChannel for multi-tab sync
  useEffect(() => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const bc = new BroadcastChannel(CHANNEL_NAME);
      setChannel(bc);

      bc.onmessage = (event) => {
        const { type, payload } = event.data;
        
        switch (type) {
          case "ADD_NOTIFICATION":
            setNotifications((prev) => [payload, ...prev]);
            break;
          case "MARK_READ":
            setNotifications((prev) =>
              prev.map((n) => (n.id === payload ? { ...n, read: true } : n))
            );
            break;
          case "MARK_ALL_READ":
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            break;
          case "CLEAR":
            setNotifications([]);
            break;
          default:
            break;
        }
      };

      return () => bc.close();
    }
  }, []);

  // Load notifications from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setNotifications(parsed);
        } catch (e) {
          console.error("Failed to parse stored notifications:", e);
        }
      }
    }
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }
  }, [notifications]);

  // Update unread count
  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };

    setNotifications((prev) => [newNotification, ...prev].slice(0, 100));

    if (channel) {
      channel.postMessage({ type: "ADD_NOTIFICATION", payload: newNotification });
    }

    return newNotification;
  }, [channel]);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    if (channel) {
      channel.postMessage({ type: "MARK_READ", payload: id });
    }
  }, [channel]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    if (channel) {
      channel.postMessage({ type: "MARK_ALL_READ" });
    }
  }, [channel]);

  const clearAll = useCallback(() => {
    setNotifications([]);

    if (channel) {
      channel.postMessage({ type: "CLEAR" });
    }
  }, [channel]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <VendorNotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        removeNotification,
      }}
    >
      {children}
    </VendorNotificationContext.Provider>
  );
};

export const useVendorNotifications = () => {
  const context = useContext(VendorNotificationContext);
  if (!context) {
    throw new Error("useVendorNotifications must be used within VendorNotificationProvider");
  }
  return context;
};
