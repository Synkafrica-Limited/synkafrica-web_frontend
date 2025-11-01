"use client";

import { useState } from "react";
import BusinessSidebar from "@/components/dashboard/vendor/BusinessSidebar";
import DashboardHeader from "@/components/dashboard/vendor/DashboardHeader";
import StatsCard from "@/components/dashboard/vendor/StatsCard";
import StatisticsChart from "@/components/dashboard/vendor/StatisticsChart";
import RevenueChart from "@/components/dashboard/vendor/RevenueChart";
import TopServicesList from "@/components/dashboard/vendor/TopServicesList";
import RecentActivity from "@/components/dashboard/vendor/RecentActivity";
import UserStatistics from "@/components/dashboard/vendor/UserStatistics";
import { ShoppingCart, Star, DollarSign, TrendingUp } from "lucide-react";

/**
 * Business Dashboard Home Page
 * Main overview page for vendor dashboard
 */
export default function BusinessDashboard() {
  const [timeFilter, setTimeFilter] = useState("24h");
  
  const handleRefresh = () => {
    // Refresh dashboard data
    console.log("Refreshing dashboard data...");
    // TODO: Implement actual data refresh logic
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">


        {/* Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* Time Filter and Refresh - Dashboard Only */}
          <div className="flex items-center justify-end gap-2 sm:gap-4 mb-4 sm:mb-6">
            {/* Time Filter */}
            <div className="relative">
              <select 
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="appearance-none bg-primary-500 text-white px-3 sm:px-4 py-2 pr-8 rounded-lg text-xs sm:text-sm font-medium cursor-pointer hover:bg-primary-600 transition-colors"
              >
                <option value="24h">Last 24h</option>
                <option value="7d">7 days</option>
                <option value="30d">30 days</option>
                <option value="90d">90 days</option>
              </select>
              <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Refresh Button */}
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-600 transition-colors"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <StatsCard
              icon={ShoppingCart}
              title="Total orders"
              value="15"
              link="/dashboard/business/orders"
            />
            <StatsCard
              icon={Star}
              title="Store reviews"
              value="4.5/5"
              trend="10%"
            />
            <StatsCard
              icon={DollarSign}
              title="Average order value"
              value="₦20,000"
              trend="10%"
            />
            <StatsCard
              icon={TrendingUp}
              title="Total Revenue"
              value="₦60,000"
              trend="10%"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="lg:col-span-1">
              <StatisticsChart title="Statistics" />
            </div>
            <div className="lg:col-span-1">
              <RevenueChart />
            </div>
            <div className="lg:col-span-1">
              <TopServicesList />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
            <div className="lg:col-span-1">
              <UserStatistics />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
