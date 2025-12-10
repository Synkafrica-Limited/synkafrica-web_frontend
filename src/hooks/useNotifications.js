"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { api } from '@/lib/fetchClient';
import authService from '@/services/authService';

function normalizeNotification(n) {
  return {
    ...n,
    isRead: n.isRead ?? n.read ?? false,
    type: n.type ?? n.category ?? n.eventType ?? 'general',
  };
}

/**
 * Simple toast hook (in-memory) for UI components to use locally.
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const t = { id, message, type, duration };
    setToasts((s) => [...s, t]);
    // auto remove
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), duration);
    return id;
  }, []);

  const remove = useCallback((id) => setToasts((s) => s.filter((t) => t.id !== id)), []);

  return { toasts, add, remove, success: (m) => add(m, 'success'), danger: (m) => add(m, 'danger'), info: (m) => add(m, 'info') };
}

/**
 * In-memory notifications hook (local only)
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const n = { id, read: false, time: 'Just now', ...notification };
    setNotifications((s) => [n, ...s]);
    return id;
  }, []);

  const markAsRead = useCallback((id) => setNotifications((s) => s.map((n) => (n.id === id ? { ...n, read: true } : n))), []);
  const removeNotification = useCallback((id) => setNotifications((s) => s.filter((n) => n.id !== id)), []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, addNotification, markAsRead, removeNotification };
}

/**
 * Remote notifications hook — connects to backend and supports websocket + polling
 * Returns: { notifications, unreadCount, loading, error, fetchNotifications, markRead, markAllRead, ack }
 */
export function useRemoteNotifications({ pollInterval = 20000 } = {}) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pollRef = useRef(null);

  const token = typeof window !== 'undefined' ? authService.getAccessToken() : null;

  const fetchCounts = useCallback(async () => {
    try {
      const res = await api.get('/api/notifications/counts', { auth: true });
      if (res && typeof res.unread === 'number') {
        setUnreadCount(res.unread);
      } else if (res && typeof res.data === 'object' && typeof res.data.unread === 'number') {
        setUnreadCount(res.data.unread);
      }
    } catch (err) {
      console.debug('fetchCounts err', err);
    }
  }, []);

  const fetchNotifications = useCallback(async ({ skip = 0, take = 20 } = {}) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      qs.append('skip', String(skip));
      qs.append('take', String(take));
      const url = `/api/notifications?${qs.toString()}`;
      const data = await api.get(url, { auth: true });
      let items = Array.isArray(data) ? data : (data?.items || data?.data || []);
      items = items.map(normalizeNotification);
      setNotifications(items);
      setUnreadCount(items.filter((n) => !n.isRead).length);
      setError(null);
      return items;
    } catch (err) {
      setError(err?.message || String(err));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const markRead = useCallback(async (id) => {
    const prevNotifications = [...notifications];
    const prevCount = unreadCount;
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      const result = await api.patch(`/api/notifications/${id}/read`, {}, { auth: true });
      if (result && result.id) {
        setNotifications((prev) => prev.map((n) => 
          n.id === id ? normalizeNotification({ ...n, ...result }) : n
        ));
      }
      await fetchCounts();
    } catch (err) {
      console.error('markRead error:', err);
      setNotifications(prevNotifications);
      setUnreadCount(prevCount);
    }
  }, [notifications, unreadCount, fetchCounts]);

  const markAllRead = useCallback(async () => {
    const prevNotifications = [...notifications];
    const prevCount = unreadCount;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await api.patch('/api/notifications/mark-all-read', {}, { auth: true });
      await fetchCounts();
    } catch (err) {
      console.error('markAllRead error:', err);
      setNotifications(prevNotifications);
      setUnreadCount(prevCount);
    }
  }, [notifications, unreadCount, fetchCounts]);

  const ack = useCallback(async (payload = {}) => {
    try {
      await api.post('/api/notifications/ack', payload, { auth: true });
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    // Socket support intentionally omitted when dependency is not installed.
    // Rely on polling to refresh counts.
    fetchNotifications();
    fetchCounts();

    pollRef.current = setInterval(async () => {
      try {
        await fetchCounts();
      } catch (err) {
        console.debug('poll fetchCounts err', err);
      }
    }, pollInterval);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [token, fetchNotifications, fetchCounts, pollInterval]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markRead,
    markAllRead,
    ack,
  };
}
