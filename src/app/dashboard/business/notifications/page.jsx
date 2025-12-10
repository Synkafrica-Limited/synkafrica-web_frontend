"use client";

import { useState, useMemo } from "react";
import { useRemoteNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle,
  Info,
  AlertTriangle,
  Mail,
  Search,
  Clock,
} from "lucide-react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import FilterTabs from "@/components/ui/FilterTabs";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    markAllRead,
    markRead,
  } = useRemoteNotifications();

  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  // Filter and Search Logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesQuery =
        n.title?.toLowerCase().includes(query.toLowerCase()) ||
        n.message?.toLowerCase().includes(query.toLowerCase());

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "unread"
            ? !n.isRead
            : n.type === filter;

      return matchesQuery && matchesFilter;
    });
  }, [notifications, filter, query]);

  // Group by Date
  const groupedNotifications = useMemo(() => {
    const groups = {
      today: [],
      yesterday: [],
      earlier: [],
    };

    filteredNotifications.forEach((n) => {
      const date = new Date(n.createdAt);
      if (isToday(date)) {
        groups.today.push(n);
      } else if (isYesterday(date)) {
        groups.yesterday.push(n);
      } else {
        groups.earlier.push(n);
      }
    });

    return groups;
  }, [filteredNotifications]);

  const hasNotifications = filteredNotifications.length > 0;

  const filterTabs = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread", count: unreadCount },
    { id: "booking", label: "Booking" },
    { id: "payout", label: "Payout" },
    { id: "verification", label: "Verification" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F6]">
      <DashboardHeader
        title="Notifications"
        subtitle="Stay updated with your business activity"
        rightActions={(
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${unreadCount > 0
              ? "bg-white text-primary-600 border border-primary-200 hover:bg-primary-50 hover:border-primary-300 shadow-sm"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            <CheckCircle size={16} />
            <span className="hidden sm:inline">Mark all as read</span>
          </button>
        )}
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Controls Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4 mt-4">
          {/* Filters */}
          <FilterTabs
            tabs={filterTabs}
            activeTab={filter}
            onTabChange={setFilter}
            layout="scroll"
          />

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-8">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <NotificationSkeleton key={i} />
              ))}
            </div>
          ) : !hasNotifications ? (
            <EmptyState filter={filter} query={query} setFilter={setFilter} setQuery={setQuery} />
          ) : (
            <AnimatePresence mode="popLayout">
              {groupedNotifications.today.length > 0 && (
                <NotificationGroup key="today" title="Today" items={groupedNotifications.today} markRead={markRead} />
              )}
              {groupedNotifications.yesterday.length > 0 && (
                <NotificationGroup key="yesterday" title="Yesterday" items={groupedNotifications.yesterday} markRead={markRead} />
              )}
              {groupedNotifications.earlier.length > 0 && (
                <NotificationGroup key="earlier" title="Earlier" items={groupedNotifications.earlier} markRead={markRead} />
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationGroup({ title, items, markRead }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-3"
    >
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">{title}</h2>
      <div className="space-y-3">
        {items.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} onMarkRead={markRead} />
        ))}
      </div>
    </motion.div>
  );
}

function NotificationItem({ notification, onMarkRead }) {
  const { id, type, title, message, createdAt, isRead } = notification;

  const getIcon = (type) => {
    switch (type) {
      case "booking":
        return { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" };
      case "payout":
        return { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" };
      case "verification":
        return { icon: Mail, color: "text-secondary-600", bg: "bg-secondary-50" };
      default:
        return { icon: Info, color: "text-gray-600", bg: "bg-gray-100" };
    }
  };

  const { icon: Icon, color, bg } = getIcon(type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`group relative flex items-start gap-4 p-5 rounded-xl border transition-all duration-200 ${isRead
        ? "bg-white border-gray-100 hover:border-gray-200"
        : "bg-primary-50/40 border-primary-100 hover:border-primary-200 shadow-sm"
        }`}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 p-2.5 rounded-full ${bg} ${color}`}>
        <Icon size={20} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`text-base font-semibold ${isRead ? "text-gray-900" : "text-primary-900"}`}>
            {title}
          </h3>
          <span className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap mt-1">
            <Clock size={12} />
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className={`mt-1 text-sm leading-relaxed ${isRead ? "text-gray-600" : "text-gray-700"}`}>
          {message}
        </p>
      </div>

      {/* Actions */}
      {!isRead && (
        <button
          onClick={() => onMarkRead(id)}
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-primary-600 hover:bg-primary-50 rounded-full"
          title="Mark as read"
        >
          <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />
        </button>
      )}

      {/* Unread Indicator (Mobile/Always visible) */}
      {!isRead && (
        <div className="absolute right-4 top-4 w-2 h-2 bg-primary-500 rounded-full group-hover:hidden" />
      )}
    </motion.div>
  );
}

function FilterPill({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${active
        ? "bg-primary-600 text-white shadow-md"
        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
        }`}
    >
      {label}
      {count > 0 && (
        <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-full ${active ? "bg-white text-primary-600" : "bg-gray-100 text-gray-600"
          }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function EmptyState({ filter, query, setFilter, setQuery }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="bg-white p-6 rounded-full shadow-sm mb-6">
        <Bell className="w-12 h-12 text-gray-300" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {query ? "No matches found" : "All caught up!"}
      </h3>
      <p className="text-gray-500 max-w-sm">
        {query
          ? `We couldn't find any notifications matching "${query}"`
          : filter === "unread"
            ? "You have no unread notifications. Great job!"
            : "You don't have any notifications yet. We'll let you know when something important happens."}
      </p>
      {(filter !== "all" || query) && (
        <button
          onClick={() => {
            setFilter("all");
            setQuery("");
          }}
          className="mt-6 text-primary-600 font-medium hover:underline"
        >
          Clear filters
        </button>
      )}
    </motion.div>
  );
}

function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-100 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}
