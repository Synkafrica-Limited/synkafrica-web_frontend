"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRemoteNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, fetchNotifications, markRead, markAllRead } = useRemoteNotifications({ pollInterval: 30000 });
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const load = async () => {
      await fetchNotifications({ skip: page * pageSize, take: pageSize });
    };
    load();
  }, [fetchNotifications, page]);

  useEffect(() => {
    if (!query) setFiltered(notifications);
    else {
      const q = query.toLowerCase().trim();
      setFiltered(
        notifications.filter((n) => {
          return (
            String(n.title || n.subject || '').toLowerCase().includes(q) ||
            String(n.body || n.message || '').toLowerCase().includes(q)
          );
        })
      );
    }
  }, [query, notifications]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-50 rounded-md">
            <Bell className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Notifications</h1>
            <p className="text-sm text-gray-500">Manage your notifications and alerts</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-600">Unread: <span className="font-semibold">{unreadCount}</span></div>
          <button onClick={markAllRead} className="px-3 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200">Mark all read</button>
          <Link href="/dashboard" className="px-3 py-2 bg-white border rounded-md text-sm hover:bg-gray-50">Back</Link>
        </div>
      </div>

      <div className="mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notifications"
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
      </div>

      <div className="bg-white border rounded-lg shadow-sm">
        <div className="divide-y">
          {loading && (
            <div className="p-6 text-center text-sm text-gray-500">Loading notifications…</div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="p-8 text-center text-gray-500">No notifications found.</div>
          )}

          {!loading && filtered.map((n) => (
            <div key={n.id} className={`p-4 flex items-start justify-between ${n.read || n.isRead ? 'bg-gray-50' : 'bg-white'}`}>
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <p className="text-sm font-semibold text-gray-900">{n.title || n.subject || 'Notification'}</p>
                  {!n.read && !n.isRead && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">New</span>}
                </div>
                <p className="text-sm text-gray-600 mt-1">{n.body || n.message || n.description}</p>
                <p className="text-xs text-gray-400 mt-2">{n.time || (n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : '')}</p>
              </div>

              <div className="ml-4 flex-shrink-0">
                {!n.read && !n.isRead && (
                  <button onClick={() => markRead(n.id)} className="px-3 py-1 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100">Mark read</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-600">Showing {filtered.length} of {notifications.length} items</div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Prev</button>
              <button onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
