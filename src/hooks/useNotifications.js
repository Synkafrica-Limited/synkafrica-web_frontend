"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/fetchClient";
import authService from "@/services/authService";

/**
 * Remote Notifications Hook
 * Supports:
 * - Authenticated polling
 * - Pagination
 * - Mark single notification read
 * - Mark all read
 * - Robust response validation
 * - Zero JSON parsing errors
 */
export function useRemoteNotifications({
  pollInterval = 30000,
  pageSize = 20,
} = {}) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  /**
   * Fetch list of notifications
   */
  const fetchNotifications = useCallback(
    async ({ skip = page * pageSize, take = pageSize } = {}) => {
      setLoading(true);
      try {
        const token = authService.getAccessToken();
        if (!token) throw new Error("Auth token missing");

        const res = await api.get(
          `/api/notifications?skip=${skip}&take=${take}`,
          { auth: true }
        );

        if (!res || typeof res !== "object") {
          console.error("Unexpected notifications response:", res);
          return;
        }

        const items = Array.isArray(res.items) ? res.items : [];
        const unread = Number(res.unread ?? 0);

        setNotifications(items);
        setUnreadCount(unread);
      } catch (err) {
        console.error("[Notifications] Fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize]
  );

  /**
   * Mark a single notification as read
   */
  const markRead = useCallback(async (id) => {
    try {
      await api.patch(`/api/notifications/${id}/read`, {}, { auth: true });

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("[Notifications] markRead error:", err);
    }
  }, []);

  /**
   * Mark ALL as read
   */
  const markAllRead = useCallback(async () => {
    try {
      await api.patch(`/api/notifications/read-all`, {}, { auth: true });

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );

      setUnreadCount(0);
    } catch (err) {
      console.error("[Notifications] markAllRead error:", err);
    }
  }, []);

  /**
   * Auto-refresh
   */
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, pollInterval);
    return () => clearInterval(interval);
  }, [fetchNotifications, pollInterval]);

  return {
    notifications,
    unreadCount,
    loading,
    page,
    setPage,
    fetchNotifications,
    markRead,
    markAllRead,
  };
}
