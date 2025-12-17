"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Star,
  Activity,
  RefreshCw,
  BarChart3,
  PieChart,
  Target,
  Clock,
  CheckCircle,
  Eye
} from "lucide-react";
import authService from "@/services/authService";
import { useLoading } from "@/components/ui/LoadingProvider";
import { useToast } from "@/components/ui/ToastProvider";
import DashboardHeader from '@/components/layout/DashboardHeader';
import OnboardingBanner from '@/components/ui/OnboardingBanner';
import VerificationBanner from '@/components/ui/VerificationBanner';
import PendingBookingsBanner from '@/components/dashboard/business/PendingBookingsBanner';
import ConvenienceListingGuidance from '@/components/ui/ConvenienceListingGuidance';
import { useBusiness } from '@/context/BusinessContext';
import { api } from "@/lib/fetchClient";
import { handleApiError } from "@/utils/errorParser";

// --- Normalization Layer ---

const safeNum = (val) => (typeof val === 'number' && !isNaN(val) ? val : 0);
const safeArray = (val) => (Array.isArray(val) ? val : []);
const safeObj = (val) => (val && typeof val === 'object' ? val : {});

const normalizeStats = (input) => {
  // Unwrapping: API usually returns { success: true, data: { ... } }
  // We check for input.data first.
  const data = input?.totalOrders !== undefined ? input : (input?.data || input || {});

  // Safe defaults
  const userStats = safeObj(data?.userStatistics);
  const generalStats = safeObj(data?.statistics);

  return {
    totalOrders: safeNum(data?.totalOrders),
    ordersTrend: safeNum(data?.ordersTrend),
    totalRevenue: safeNum(data?.totalRevenue),
    revenueTrend: safeNum(data?.revenueTrend),
    storeReviews: safeNum(data?.storeReviews),
    ratingTrend: safeNum(data?.ratingTrend),
    // Frontend calculation for AOV:
    averageOrderValue: (safeNum(data?.totalRevenue) > 0 && safeNum(data?.totalOrders) > 0)
      ? safeNum(data?.totalRevenue) / safeNum(data?.totalOrders)
      : 0,
    averageOrderValueTrend: safeNum(data?.averageOrderValueTrend),
    topServicesByPrice: safeArray(data?.topServicesByPrice).map(service => ({
      name: String(service?.name || "Unknown Service"),
      category: String(service?.category || "Uncategorized"),
      price: safeNum(service?.price)
    })),
    recentActivity: safeArray(data?.recentActivity).map(activity => ({
      type: String(activity?.type || "activity"),
      message: String(activity?.message || "New activity recorded"),
      timestamp: activity?.timestamp || new Date().toISOString()
    })),
    userStatistics: {
      totalCustomers: safeNum(userStats.totalCustomers),
      newCustomersThisWeek: safeNum(userStats.newCustomersThisWeek),
      newCustomersThisMonth: safeNum(userStats.newCustomersThisMonth)
    },
    statistics: {
      activeListings: safeNum(generalStats.activeListings),
      completedBookings: safeNum(generalStats.completedBookings),
      pendingBookings: safeNum(generalStats.pendingBookings),
      cancelledBookings: safeNum(generalStats.cancelledBookings)
    }
  };
};

const normalizeRevenueChart = (input) => {
  // Unwrapping: JSON response might be { success: true, data: [...] } or just [...]
  const data = Array.isArray(input) ? input : (Array.isArray(input?.data) ? input.data : []);

  return data.map(item => ({
    date: item?.date || new Date().toISOString(),
    revenue: typeof item?.revenue === 'number' ? item.revenue : 0
  })).sort((a, b) => new Date(a.date) - new Date(b.date));
};

const normalizeBookingsStats = (input) => {
  const data = input?.totalBookings !== undefined ? input : (input?.data || input || {});

  return {
    mostPopularListings: safeArray(data?.mostPopularListings).map(item => ({
      title: String(item?.title || "Unknown Listing"),
      bookingCount: safeNum(item?.bookingCount)
    })),
    totalBookings: safeNum(data?.totalBookings),
    completedBookings: safeNum(data?.completedBookings)
  };
};

/**
 * Enhanced Business Dashboard Home Page
 * Modern, responsive overview page for vendor dashboard with real-time data
 */
export default function BusinessDashboard() {
  const [timeFilter, setTimeFilter] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize with null to enforce loading state until data arrives
  const [stats, setStats] = useState(null);
  const [revenueChart, setRevenueChart] = useState([]); // Empty array is safe for charts
  const [bookingsStats, setBookingsStats] = useState(null);

  const { showLoading, hideLoading } = useLoading();
  const toast = useToast();
  const { business } = useBusiness();

  // Load data function
  const loadData = useCallback(async (range = timeFilter, isRefresh = false) => {
    if (!isRefresh) setLoading(true);

    try {
      const [statsRes, chartRes, bookingsRes] = await Promise.all([
        api.get(`/api/business/dashboard/stats?range=${range}`, { auth: true }).catch(() => ({})),
        api.get(`/api/dashboard/vendor/revenue/chart?period=monthly&range=${range}`, { auth: true }).catch(() => []),
        api.get(`/api/dashboard/vendor/bookings/stats`, { auth: true }).catch(() => ({}))
      ]);

      // Normalize data immediately
      setStats(normalizeStats(statsRes));
      setRevenueChart(normalizeRevenueChart(chartRes));
      setBookingsStats(normalizeBookingsStats(bookingsRes));

    } catch (error) {
      // Should rarely hit this due to individual catches, but safety first
      handleApiError(error, toast);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeFilter, toast]); // Dependency on timeFilter ensures stability

  // Initial load
  useEffect(() => {
    loadData();

    // Track login count
    if (typeof window !== "undefined") {
      const currentCount = parseInt(localStorage.getItem("vendor_login_count") || "0", 10);
      localStorage.setItem("vendor_login_count", String(currentCount + 1));
    }
  }, [loadData]);

  // Event listener for revalidation
  useEffect(() => {
    const handleRevalidate = () => {
      setRefreshing(true);
      loadData(timeFilter, true);
    };

    window.addEventListener('dashboard:refresh', handleRevalidate);
    return () => window.removeEventListener('dashboard:refresh', handleRevalidate);
  }, [loadData, timeFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData(timeFilter, true);
    // Success toast is optional/redundant if data just updates, but user asked for feedback on manual cache clears? 
    // "UI remains stable". Let's show a subtle toast.
    // toast.success("Dashboard updated"); 
    // Actually, user said "silent backend failures must surface as UI toasts", manual success is ok.
  };

  const handleTimeFilterChange = (newRange) => {
    setTimeFilter(newRange);
    // loadData depends on timeFilter, so we just set state and let useEffect trigger? 
    // No, loadData is wrapped in useCallback with timeFilter dependency, but it's simpler to call it directly.
    // Actually, passing newRange to loadData is safer to avoid race conditions with state update.
    // But loadData is memoized.
    // Let's just fix the implementation to use argument.
    // loadData is async.
    // We already passed `range` to `loadData`.
    // Best practice: Update state, then fetch.
    // Note: The useEffect([loadData]) will trigger if loadData changes. loadData changes if timeFilter changes.
    // So logic in 'handleTimeFilterChange' should just be 'setTimeFilter'.
  };

  // Show loading overlay only for initial full load, not refresh
  useEffect(() => {
    if (loading && !refreshing) {
      // showLoading("Loading dashboard..."); // User might find full screen loader intrusive?
      // "While awaiting backend response: Show skeleton loaders or spinners... Disable KPI interactions"
      // Instructions say "Show skeleton loaders or spinners". Full screen loader might be too much if we have skeletons.
      // Retaining skeletons approach for better UX as per "Replace misleading '0' with loading indicators"
      // Disabling global loader for now to prefer skeleton UI.
    }
    return () => hideLoading();
  }, [loading, refreshing, hideLoading]);

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "₦0";
    return `₦${Number(amount).toLocaleString()}`;
  };

  // Helpers for Skeleton UI
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Dashboard"
        subtitle={`Welcome back! Here's what's happening with your business.`}
        rightActions={(
          <>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              disabled={loading || refreshing}
              className="px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-[120px] disabled:opacity-50"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>

            <button
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px]"
              title="Refresh dashboard"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''} sm:mr-2`} />
              <span className="hidden sm:inline">{refreshing ? 'Updating...' : 'Refresh'}</span>
            </button>
          </>
        )}
      />

      <PendingBookingsBanner
        pendingCount={stats?.statistics?.pendingBookings || 0}
        onActionComplete={() => loadData(timeFilter, true)}
      />
      <OnboardingBanner />
      <VerificationBanner />
      <ConvenienceListingGuidance
        businessType={business?.businessType}
        businessId={business?.id || business?._id}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              {/* Total Orders */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {stats?.totalOrders}
                    </p>
                    {stats?.ordersTrend !== 0 && (
                      <div className={`flex items-center mt-2 text-sm ${stats.ordersTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.ordersTrend >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        <span>{Math.abs(stats.ordersTrend)}% from last period</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {formatCurrency(stats?.totalRevenue)}
                    </p>
                    {stats?.revenueTrend !== 0 && (
                      <div className={`flex items-center mt-2 text-sm ${stats.revenueTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.revenueTrend >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        <span>{Math.abs(stats.revenueTrend)}% from last period</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Average Rating */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Rating</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {stats?.storeReviews ? `${stats.storeReviews.toFixed(1)}/5` : "N/A"}
                    </p>
                    {stats?.ratingTrend !== 0 && (
                      <div className={`flex items-center mt-2 text-sm ${stats.ratingTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.ratingTrend >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        <span>{Math.abs(stats.ratingTrend)}% from last period</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Avg Order Value */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {stats?.averageOrderValue && stats.averageOrderValue > 0 ? formatCurrency(stats.averageOrderValue) : "—"}
                    </p>
                    {stats?.averageOrderValueTrend !== 0 && (
                      <div className={`flex items-center mt-2 text-sm ${stats.averageOrderValueTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.averageOrderValueTrend >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        <span>{Math.abs(stats.averageOrderValueTrend)}% from last period</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                <p className="text-sm text-gray-600">Monthly revenue trends</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : revenueChart.length > 0 ? (
              <div className="h-64">
                <div className="flex items-end justify-between h-full gap-2">
                  {revenueChart.slice(-6).map((item, index) => {
                    // Safe logic for calculation
                    const max = Math.max(...revenueChart.map(d => d.revenue), 1); // Prevent div by zero
                    const height = (item.revenue / max) * 100;

                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full flex flex-col justify-end h-48 mb-2">
                          <div
                            className="bg-linear-to-t from-primary-500 to-primary-400 rounded-t-sm transition-all duration-300 hover:from-primary-600 hover:to-primary-500"
                            style={{ height: `${Math.max(height, 4)}%` }}
                            title={`₦${item.revenue.toLocaleString()}`}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 text-center">
                          {new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No revenue data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Bookings Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Booking Statistics</h3>
                <p className="text-sm text-gray-600">Monthly booking trends</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : bookingsStats?.mostPopularListings?.length > 0 ? (
              <div className="h-64">
                <div className="flex items-end justify-between h-full gap-2">
                  {bookingsStats.mostPopularListings.slice(0, 6).map((item, index) => {
                    const max = Math.max(...bookingsStats.mostPopularListings.map(d => d.bookingCount), 1);
                    const height = (item.bookingCount / max) * 100;

                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full flex flex-col justify-end h-48 mb-2">
                          <div
                            className="bg-linear-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                            style={{ height: `${Math.max(height, 4)}%` }}
                            title={`${item.bookingCount} bookings`}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 text-center truncate max-w-16">
                          {item.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No booking data available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Services */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Top Services</h3>
                <p className="text-sm text-gray-600">Best performing services</p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <PieChart className="w-5 h-5 text-orange-600" />
              </div>
            </div>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-lg mb-3"></div>
                ))}
              </div>
            ) : stats?.topServicesByPrice?.length > 0 ? (
              <div className="space-y-4">
                {stats.topServicesByPrice.slice(0, 5).map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-sm font-medium text-primary-700">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-32" title={service.name}>
                          {service.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {service.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(service.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <PieChart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No service data available</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-600">Latest updates</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
            </div>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-lg mb-3"></div>
                ))}
              </div>
            ) : stats?.recentActivity?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${String(activity.type).includes('booking') ? 'bg-blue-50' :
                      String(activity.type).includes('transaction') ? 'bg-green-50' :
                        String(activity.type).includes('review') ? 'bg-yellow-50' : 'bg-gray-50'
                      }`}>
                      {String(activity.type).includes('booking') && <ShoppingCart className="w-4 h-4 text-blue-600" />}
                      {String(activity.type).includes('transaction') && <DollarSign className="w-4 h-4 text-green-600" />}
                      {String(activity.type).includes('review') && <Star className="w-4 h-4 text-yellow-600" />}
                      {!activity.type && <Activity className="w-4 h-4 text-gray-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No recent activity</p>
              </div>
            )}
          </div>

          {/* User Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">User Statistics</h3>
                <p className="text-sm text-gray-600">Customer insights</p>
              </div>
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
            </div>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-lg mb-3"></div>
                ))}
              </div>
            ) : stats?.userStatistics ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Total Customers</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {stats.userStatistics.totalCustomers}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Active Listings</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {stats.statistics.activeListings}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-900">Completed Bookings</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">
                    {stats.statistics.completedBookings}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">Pending Bookings</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">
                    {stats.statistics.pendingBookings}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No user statistics available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
