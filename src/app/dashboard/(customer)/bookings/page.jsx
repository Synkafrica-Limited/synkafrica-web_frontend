"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBookings } from "@/hooks/customer/bookings/useBookings";
import {
  Search,
  Calendar,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Package,
} from "lucide-react";
import { PageLoadingScreen } from "@/components/ui/LoadingScreen";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle,
  },
  upcoming: {
    label: "Upcoming",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Calendar,
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
  ongoing: {
    label: "Ongoing",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: Clock,
  },
  active: {
    label: "Active",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: Clock,
  },
};

export default function BookingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Use the bookings hook
  const { bookings, loading, error, fetchBookings } = useBookings();

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Filter bookings based on active tab and search query
  const filteredBookings = bookings
    .filter((b) => {
      // Tab filter
      if (activeTab === "all") return true;
      const status = b.status?.toLowerCase();
      if (activeTab === "upcoming") return ["upcoming", "confirmed", "pending", "active"].includes(status);
      return status === activeTab;
    })
    .filter((b) => {
      // Search filter
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        b.service?.toLowerCase().includes(query) ||
        b.provider?.toLowerCase().includes(query) ||
        b.type?.toLowerCase().includes(query) ||
        b.location?.toLowerCase().includes(query) ||
        b.id?.toString().toLowerCase().includes(query)
      );
    });

  const getStatusCount = (tab) => {
    if (tab === "all") return bookings.length;
    if (tab === "upcoming") {
      return bookings.filter(b => ["upcoming", "confirmed", "pending", "active"].includes(b.status?.toLowerCase())).length;
    }
    return bookings.filter((b) => b.status?.toLowerCase() === tab).length;
  };

  const handleBookingClick = (booking) => {
    const detailsPath = `/dashboard/bookings/${booking.serviceType}/${booking.id}`;
    router.push(detailsPath);
  };

  if (loading) return <PageLoadingScreen message="Loading your bookings..." />;

  if (error)
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Bookings</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchBookings()}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-1">
          Manage and track all your service bookings
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bookings..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {['all', 'upcoming', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({getStatusCount(tab)})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No bookings found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery.trim()
              ? `No bookings match "${searchQuery}"`
              : activeTab === 'all'
                ? "You haven't made any bookings yet."
                : `You have no ${activeTab} bookings.`}
          </p>
          <button className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
            Explore Services
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const statusKey = booking.status?.toLowerCase() || 'pending';
            const statusConfig = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={booking.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 hover:border-gray-300 transition-all cursor-pointer group"
                onClick={() => handleBookingClick(booking)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Booking Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-gray-700 transition-colors">
                          {booking.service}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 font-mono">
                          ID: {booking.id}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${statusConfig.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 shrink-0 text-gray-400" />
                        <span>{booking.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
                        <span className="truncate">{booking.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Package className="w-4 h-4 shrink-0 text-gray-400" />
                        <span className="capitalize">{booking.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-900 font-semibold">
                        <CreditCard className="w-4 h-4 shrink-0 text-gray-400" />
                        <span>{booking.amount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <button
                      className="flex-1 lg:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}