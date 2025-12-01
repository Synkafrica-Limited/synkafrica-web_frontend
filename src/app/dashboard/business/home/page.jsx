"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Star,
  Activity,
  RefreshCw,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye
} from "lucide-react";
import authService from "@/services/authService";
import { useLoading } from "@/components/ui/LoadingProvider";
import { useToast } from "@/components/ui/ToastProvider";
import DashboardHeader from '@/components/layout/DashboardHeader';
import OnboardingBanner from '@/components/ui/OnboardingBanner';
import VerificationBanner from '@/components/ui/VerificationBanner';
import { api } from "@/lib/fetchClient";

/**
 * Enhanced Business Dashboard Home Page
 * Modern, responsive overview page for vendor dashboard with real-time data
 */
export default function BusinessDashboard() {
  const [timeFilter, setTimeFilter] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [revenueChart, setRevenueChart] = useState(null);
  const [bookingsStats, setBookingsStats] = useState(null);
  const { showLoading, hideLoading } = useLoading();
  const toast = useToast();

  // Load data function
  const loadData = async (range = timeFilter) => {
    setLoading(true);
    try {
      const [statsData, chartData, bookingsData] = await Promise.all([
        api.get(`/api/business/dashboard/stats?range=${range}`, { auth: true }),
        api.get(`/api/dashboard/vendor/revenue/chart?period=monthly&range=${range}`, { auth: true }),
        api.get(`/api/dashboard/vendor/bookings/stats`, { auth: true })
      ]);

      setStats(statsData);
      setRevenueChart(chartData);
      setBookingsStats(bookingsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast?.danger?.('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadData();
      toast?.success?.("Dashboard updated successfully");
    } catch (err) {
      toast?.danger?.("Failed to refresh dashboard");
    } finally {
      setRefreshing(false);
    }
  };

  const handleTimeFilterChange = async (newRange) => {
    setTimeFilter(newRange);
    await loadData(newRange);
  };

  // Show loading overlay for initial load
  useEffect(() => {
    if (loading && !refreshing) {
      showLoading("Loading dashboard...");
    } else {
      hideLoading();
    }
  }, [loading, refreshing, showLoading, hideLoading]);

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "₦0";
    return `₦${Number(amount).toLocaleString()}`;
  };

  // Format percentage
  const formatPercent = (value) => {
    if (!value) return "0%";
    return `${Number(value).toFixed(1)}%`;
  };

  // Calculate trends
  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change),
      isPositive: change >= 0,
      formatted: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Dashboard"
        subtitle={`Welcome back! Here's what's happening with your business.`}
        rightActions={(
          <>
            <select
              value={timeFilter}
              onChange={(e) => handleTimeFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-[120px]"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px]"
              title="Refresh dashboard"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''} sm:mr-2`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </>
        )}
      />
      {/* Onboarding prompt - shows when business is missing */}
      <OnboardingBanner />
      {/* Verification banner - when business exists but not verified */}
      <VerificationBanner />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {loading ? "—" : (stats?.totalOrders || 0)}
                </p>
                {stats?.ordersTrend && (
                  <div className={`flex items-center mt-2 text-sm ${stats.ordersTrend >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {stats.ordersTrend >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
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
                  {loading ? "—" : formatCurrency(stats?.totalRevenue || 0)}
                </p>
                {stats?.revenueTrend && (
                  <div className={`flex items-center mt-2 text-sm ${stats.revenueTrend >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {stats.revenueTrend >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
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
                  {loading ? "—" : (stats?.storeReviews ? `${stats.storeReviews.toFixed(1)}/5` : "—")}
                </p>
                {stats?.ratingTrend && (
                  <div className={`flex items-center mt-2 text-sm ${stats.ratingTrend >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {stats.ratingTrend >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    <span>{Math.abs(stats.ratingTrend)}% from last period</span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {loading ? "—" : formatCurrency(stats?.averageOrderValue || 0)}
                </p>
                {stats?.averageOrderValueTrend && (
                  <div className={`flex items-center mt-2 text-sm ${stats.averageOrderValueTrend >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {stats.averageOrderValueTrend >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    <span>{Math.abs(stats.averageOrderValueTrend)}% from last period</span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
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
            ) : revenueChart && revenueChart.length > 0 ? (
              <div className="h-64">
                <div className="flex items-end justify-between h-full gap-2">
                  {revenueChart.slice(-6).map((item, index) => {
                    const maxValue = Math.max(...revenueChart.map(d => d.revenue));
                    const height = maxValue > 0 ? (item.revenue / maxValue) * 100 : 0;

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
            ) : bookingsStats?.mostPopularListings && bookingsStats.mostPopularListings.length > 0 ? (
              <div className="h-64">
                <div className="flex items-end justify-between h-full gap-2">
                  {bookingsStats.mostPopularListings.slice(0, 6).map((item, index) => {
                    const maxValue = Math.max(...bookingsStats.mostPopularListings.map(d => d.bookingCount));
                    const height = maxValue > 0 ? (item.bookingCount / maxValue) * 100 : 0;

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
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : stats?.topServicesByPrice && stats.topServicesByPrice.length > 0 ? (
              <div className="space-y-4">
                {stats.topServicesByPrice.slice(0, 5).map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-sm font-medium text-primary-700">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-32">
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
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${activity.type === 'booking' ? 'bg-blue-50' :
                        activity.type === 'transaction' ? 'bg-green-50' :
                          activity.type === 'review' ? 'bg-yellow-50' : 'bg-gray-50'
                      }`}>
                      {activity.type === 'booking' && <ShoppingCart className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'transaction' && <DollarSign className="w-4 h-4 text-green-600" />}
                      {activity.type === 'review' && <Star className="w-4 h-4 text-yellow-600" />}
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
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
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
                    {stats.userStatistics.totalCustomers || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Active Listings</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {stats.statistics?.activeListings || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-900">Completed Bookings</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">
                    {stats.statistics?.completedBookings || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">Pending Bookings</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">
                    {stats.statistics?.pendingBookings || 0}
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
