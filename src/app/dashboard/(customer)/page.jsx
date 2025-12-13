"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUserProfile } from "@/hooks/customer/details/useUserProfileDetails";
import { useBookings } from "@/hooks/customer/bookings/useBookings";
import {
  Car,
  UtensilsCrossed,
  Waves,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { PageLoadingScreen } from "@/components/ui/LoadingScreen";

const QUICK_ACTIONS = [
  {
    label: "Rent a Car",
    icon: Car,
    href: "/dashboard/services/car-rental",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    description: "Find the perfect ride",
  },
  {
    label: "Book a Resort",
    icon: Waves,
    href: "/dashboard/services/resorts",
    bgColor: "bg-cyan-50",
    iconColor: "text-cyan-600",
    description: "Relax and unwind",
  },
  {
    label: "Fine Dining",
    icon: UtensilsCrossed,
    href: "/dashboard/services/dining",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
    description: "Experience gourmet food",
  },
  {
    label: "Convenience",
    icon: Package,
    href: "/dashboard/services/convenience",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    description: "Everyday essentials",
  },
];

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
  },
  upcoming: {
    label: "Upcoming",
    color: "bg-blue-100 text-blue-800",
    icon: Calendar,
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
  ongoing: {
    label: "Ongoing",
    color: "bg-orange-100 text-orange-800",
    icon: Clock,
  },
  active: {
    label: "Active",
    color: "bg-orange-100 text-orange-800",
    icon: Clock,
  },
};

export default function DashboardOverview() {
  const { userProfile, loading: profileLoading, fetchUserProfile } = useUserProfile();
  const { bookings, loading: bookingsLoading, fetchBookings } = useBookings();

  useEffect(() => {
    fetchUserProfile();
    fetchBookings();
  }, [fetchUserProfile, fetchBookings]);

  // Calculate Stats
  const activeBookingsCount = bookings.filter(b => 
    ['upcoming', 'confirmed', 'pending', 'active', 'ongoing'].includes(b.status?.toLowerCase())
  ).length;

  const totalSpent = bookings
    .filter(b => ['completed', 'paid'].includes(b.status?.toLowerCase()))
    .reduce((sum, b) => {
      // Extract numeric value from amount string (e.g., "₦50,000" -> 50000)
      const amount = parseFloat(b.amount?.replace(/[^0-9.-]+/g, "") || 0);
      return sum + amount;
    }, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const recentBookings = bookings.slice(0, 3); // Top 3 recent bookings

  if (profileLoading || bookingsLoading) {
    return <PageLoadingScreen message="Loading dashboard..." />;
  }

  const userName = userProfile?.firstName || "Customer";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, {userName}
        </h1>
        <p className="mt-1 text-gray-600">
          Here's what's happening with your bookings today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-100 rounded-md">
              <Calendar className="w-5 h-5 text-gray-700" />
            </div>
            <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-100">
              Active
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{activeBookingsCount}</h3>
          <p className="text-sm text-gray-500">Active Bookings</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-100 rounded-md">
              <Package className="w-5 h-5 text-gray-700" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{bookings.length}</h3>
          <p className="text-sm text-gray-500">Total Bookings</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-100 rounded-md">
              <TrendingUp className="w-5 h-5 text-gray-700" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</h3>
          <p className="text-sm text-gray-500">Total Spent</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="group bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200"
              >
                <div className={`${action.bgColor} w-10 h-10 rounded-md flex items-center justify-center ${action.iconColor} mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.label}</h3>
                <p className="text-xs text-gray-500">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <Link 
            href="/dashboard/bookings" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">No recent activity</h3>
            <p className="text-xs text-gray-500 mt-1">Your recent bookings will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((booking) => {
              const statusKey = booking.status?.toLowerCase() || 'pending';
              const statusConfig = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{booking.service}</h4>
                          <p className="text-xs text-gray-500 mt-0.5 font-mono">ID: {booking.id}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 border ${statusConfig.color.replace('text-', 'border-').replace('800', '200')} ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {booking.startDate}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {booking.location}
                        </div>
                        <div className="flex items-center gap-1.5 font-medium text-gray-900 ml-auto sm:ml-0">
                          <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                          {booking.amount}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
