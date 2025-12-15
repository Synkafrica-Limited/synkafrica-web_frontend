"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import NotificationBell from '@/components/dashboard/vendor/NotificationBell';

/**
 * DashboardHeader
 * Props:
 * - title: string
 * - subtitle: string
 * - rightActions: React node (buttons, filters, etc.)
 * - showBack: boolean
 * - backHref: string
 */
export default function DashboardHeader({ title, subtitle, rightActions, showBack = false, backHref = '/dashboard/business/home', className = '' }) {
  const router = useRouter();

  const handleBack = (e) => {
    e && e.preventDefault();
    if (backHref) router.push(backHref);
    else router.back();
  };

  return (
    <div className={`sticky top-0 z-40 bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pl-16 lg:pl-4">
        <div className="py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-4">
              {showBack && (
                <button onClick={handleBack} className="text-sm text-primary-600 hover:underline mr-2">
                  ← Back
                </button>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{title}</h1>
                {subtitle && <p className="mt-1 text-xs sm:text-sm text-gray-600 line-clamp-2">{subtitle}</p>}
              </div>
            </div>

            {/* Right Actions and Notification Bell */}
            <div className="flex flex-wrap items-end gap-2 sm:gap-3">
              {rightActions}
              {/* Notification Bell - Always visible */}
              <NotificationBell />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
