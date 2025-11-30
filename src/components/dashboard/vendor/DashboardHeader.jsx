"use client";

import { Search, Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/ui/ToastProvider";
import { usePathname } from 'next/navigation';

/**
 * Dashboard Header Component
 * Contains page title, time filter, search, and user profile
 */
export default function DashboardHeader({ title = "Overview" }) {
  const { addToast } = useToast();
  const pathname = usePathname?.() || '';
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-30">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: Title */}
        <h2 className="text-md sm:text-md font-bold text-gray-900 pl-12 lg:pl-0">{title}</h2>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* Time Filter */}
          <div className="relative">
            <select className="appearance-none bg-primary-500 text-white px-3 sm:px-4 py-2 pr-8 rounded-lg text-xs sm:text-sm font-medium cursor-pointer hover:bg-primary-600 transition-colors">
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
            onClick={() => {
              // simple UX: show feedback via toast
              try {
                addToast({ message: "Data refreshed", type: "success" });
              } catch {
                // fallback
              }
            }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Search - Desktop only */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search customers, etc."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-48 lg:w-64"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Mobile Search Icon */}
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* Notifications - Mobile/Tablet */}
          <Link href="/dashboard/notifications" className="lg:hidden p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Link>

          {/* User Profile */}
          {/* Quick verify CTA */}
          <Link href="/dashboard/business/settings?tab=verification" className="hidden lg:inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-primary-500 text-primary-600 hover:bg-primary-50 transition-colors text-sm">
            Verify business
          </Link>
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-primary-500 transition-colors shrink-0">
            <Image
              src="/images/brand/synkafrica-logo-single.png"
              alt="User Profile"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="relative md:hidden mt-4">
        <input
          type="text"
          placeholder="Search customers, etc."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>
    </header>
  );
}
