"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, MessageSquare, Eye, Calendar, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import FilterBar from "@/components/ui/FilterBar";

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // all, unread, today
  const [searchQuery, setSearchQuery] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Attempt to fetch notifications - endpoint may not exist yet, handle gracefully
        const res = await fetch("/api/notifications");
        if (!res.ok) throw new Error("Could not load notifications");
        const data = await res.json();
        if (mounted) setNotifications(data || []);
      } catch (err) {
        // show a toast but continue with empty list
        try {
          addToast({ message: err.message || "Failed to load notifications", type: "error" });
        } catch {}
        if (mounted) setNotifications([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [addToast]);

  // Filter notifications based on selected filter and search
  const filteredNotifications = notifications.filter(n => {
    // Filter logic
    let matchesFilter = true;
    switch (filter) {
      case "unread":
        matchesFilter = !n.read;
        break;
      case "today":
        try {
          matchesFilter = new Date(n.createdAt).toDateString() === new Date().toDateString();
        } catch {
          matchesFilter = false;
        }
        break;
      default:
        matchesFilter = true;
    }

    // Search logic
    const matchesSearch = !searchQuery ||
      n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.body?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/business/home" className="text-sm text-primary-600 hover:underline">← Back to dashboard</Link>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="col-span-1 p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <div className="text-sm text-gray-500">Total Notifications</div>
            </div>
            <div className="text-2xl font-bold mt-2">{notifications.length}</div>
          </div>
          <div className="col-span-1 p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-orange-500" />
              <div className="text-sm text-gray-500">Unread</div>
            </div>
            <div className="text-2xl font-bold mt-2">{notifications.filter(n => !n.read).length}</div>
          </div>
          <div className="col-span-1 p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-green-500" />
              <div className="text-sm text-gray-500">Today</div>
            </div>
            <div className="text-2xl font-bold mt-2">{notifications.filter(n => {
              try { return new Date(n.createdAt).toDateString() === new Date().toDateString(); } catch { return false; }
            }).length}</div>
          </div>
        </div>

        {/* Filter Section */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search notifications..."
          filters={[
            {
              value: "all",
              label: "All",
              count: notifications.length,
              activeClass: "bg-primary-500 text-white",
              inactiveClass: "bg-gray-100 text-gray-700 hover:bg-gray-200"
            },
            {
              value: "unread",
              label: "Unread",
              count: notifications.filter(n => !n.read).length,
              activeClass: "bg-yellow-500 text-white",
              inactiveClass: "bg-gray-100 text-gray-700 hover:bg-gray-200"
            },
            {
              value: "today",
              label: "Today",
              count: notifications.filter(n => {
                try { return new Date(n.createdAt).toDateString() === new Date().toDateString(); } catch { return false; }
              }).length,
              activeClass: "bg-green-500 text-white",
              inactiveClass: "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
          ]}
          activeFilter={filter}
          onFilterChange={setFilter}
        />

        <div className="bg-white rounded-lg border border-gray-100 p-6 min-h-[200px]">
          {loading ? (
            <div className="text-center text-gray-500">Loading notifications…</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <div className="text-4xl mb-4">
                {searchQuery ? "🔍" : filter === "unread" ? "👀" : filter === "today" ? "📅" : "🔔"}
              </div>
              <div className="text-lg font-medium">
                {searchQuery
                  ? "No notifications match your search"
                  : filter === "unread"
                  ? "No unread notifications"
                  : filter === "today"
                  ? "No notifications today"
                  : "No notifications found"}
              </div>
              <div className="text-sm">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : filter === "unread"
                  ? "All caught up!"
                  : filter === "today"
                  ? "Check back tomorrow"
                  : "You're all caught up!"}
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredNotifications.map((n) => (
                <li key={n.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-0.5">
                        {n.type === "success" ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : n.type === "warning" ? (
                          <AlertCircle className="w-5 h-5 text-yellow-500" />
                        ) : n.type === "error" ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <Info className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-800 font-medium">{n.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{n.body}</div>
                        <div className="text-xs text-gray-400 mt-2">{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
