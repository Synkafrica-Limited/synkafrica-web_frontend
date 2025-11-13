"use client";

import { useState } from "react";

/**
 * Revenue Chart Component
 * Displays revenue bar chart data with year selector
 */
export default function RevenueChart() {
  const [selectedYear, setSelectedYear] = useState("2025");

  // Sample data - replace with actual data from API
  const data = [
    { month: 1, value: 450000 },
    { month: 2, value: 620000 },
    { month: 3, value: 580000 },
    { month: 4, value: 720000 },
    { month: 5, value: 680000 },
    { month: 6, value: 820000 },
    { month: 7, value: 780000 },
    { month: 8, value: 920000 },
    { month: 9, value: 850000 },
    { month: 10, value: 980000 },
    { month: 11, value: 900000 },
    { month: 12, value: 1050000 },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Revenue</h3>
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="appearance-none bg-primary-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 pr-7 sm:pr-8 rounded-lg text-xs sm:text-sm font-medium cursor-pointer hover:bg-primary-600 transition-colors"
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
          <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-48 sm:h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 flex flex-col justify-between text-[10px] sm:text-xs text-gray-500">
          <span>1M</span>
          <span>500k</span>
          <span>100k</span>
          <span>50k</span>
          <span>10k</span>
          <span>5</span>
        </div>

        {/* Bars */}
        <div className="absolute left-8 sm:left-12 right-0 top-0 bottom-6 sm:bottom-8 flex items-end gap-1 sm:gap-2">
          {data.map((item) => (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-primary-500 rounded-t-md hover:bg-primary-600 transition-all cursor-pointer relative group"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              >
                <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ₦{(item.value / 1000).toFixed(0)}k
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* X-axis labels */}
        <div className="absolute left-8 sm:left-12 right-0 bottom-0 h-6 sm:h-8 flex items-center gap-1 sm:gap-2">
          {data.map((item) => (
            <div key={item.month} className="flex-1 text-center text-[10px] sm:text-xs text-gray-500">
              {item.month}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
