"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/**
 * Business Dashboard Header Component
 * Simple header with page title, search bar, and profile avatar
 */
export default function BusinessDashboardHeader({ title = "Dashboard", user = null }) {
  // Get user initials if no profile image
  const initials = user?.name 
    ? user.name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()
    : "SA";

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 sticky top-0 z-30">
      <div className="flex items-center justify-between gap-4">
        {/* Page Title */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          {title}
        </h1>

        {/* Right: Search & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search customers, etc."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-48 lg:w-64 xl:w-80"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Mobile Search Icon */}
          <button className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* User Profile Avatar */}
          <Link 
            href="/dashboard/business/profile"
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-primary-500 transition-colors shrink-0 group"
          >
            {user?.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user.name || "User Profile"}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white text-sm font-semibold group-hover:bg-gray-800 transition-colors">
                {initials}
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
