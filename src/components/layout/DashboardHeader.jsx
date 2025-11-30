"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              {showBack && (
                <button onClick={handleBack} className="text-sm text-primary-600 hover:underline mr-2">
                  ← Back
                </button>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {rightActions}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
