"use client";

import Image from "next/image";
import Link from "next/link";
import { useUserProfile } from "@/hooks/business/useUserProfileVendor";
import { useState, useEffect } from "react";
import authService from '@/services/authService';

// Skeleton Loader
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export default function BusinessDashboardHeader({ title = "Dashboard" }) {
  const [token, setToken] = useState(null);

  // Load token after client mount
  useEffect(() => {
    const t = authService.getAccessToken();
    setToken(t);
  }, []);

  // Only use hook if token exists
  const { user, loading, error } = useUserProfile(token);

  // Compute initials
  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ""}`.toUpperCase()
    : "SA";

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 sticky top-0 z-30">
      <div className="flex items-center justify-between gap-4">
        {/* Page Title */}
        <h2 className="text-lg sm:text-lg lg:text-2xl font-bold text-gray-900">
          {title}
        </h2>

        {/* Right: Profile (search removed) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* User Profile Avatar */}
          <Link
            href="/dashboard/business/profile"
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-primary-500 transition-colors shrink-0 group"
          >
            {!token || loading ? (
              <Skeleton className="w-full h-full" />
            ) : error ? (
              <div className="w-full h-full bg-red-500 flex items-center justify-center text-white text-sm font-semibold">
                !
              </div>
            ) : user?.avatar ? (
              <Image
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
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
