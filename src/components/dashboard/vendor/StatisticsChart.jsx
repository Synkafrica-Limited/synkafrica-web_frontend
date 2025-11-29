"use client";

import { useState } from "react";
import fallback from "@/lib/fallbackData/dashboard/statisticsSeries.json";

/**
 * Statistics Chart Component
 * Displays bar chart data with year selector (SVG)
 */
export default function StatisticsChart({ title, series }) {
  const [selectedYear, setSelectedYear] = useState("2025");

  const data = series && series.length ? series : fallback;
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  // convert data to SVG bars
  const bars = data.map((d, i) => ({
    ...d,
    height: (d.value / maxValue) * 100, // percent
    index: i,
  }));

  // compute bar sizing: use a narrower bar width and equal gaps
  const barBase = 100 / bars.length; // percent per slot
  const barWidthPercent = Math.max(barBase * 0.4, 3); // make bars ~40% of slot, min 3%
  const gapPercent = bars.length > 1 ? (100 - barWidthPercent * bars.length) / (bars.length - 1) : 0;

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
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

      <div className="relative h-48 sm:h-64">
        <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-16 flex flex-col justify-between text-[10px] sm:text-xs text-gray-500">
          <span>{Math.round(maxValue)}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
        <div className="absolute left-10 sm:left-16 right-0 top-0 bottom-6 sm:bottom-8 flex items-end gap-1 sm:gap-2">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {bars.map((b) => {
              const x = b.index * (barWidthPercent + gapPercent);
              const barWidth = barWidthPercent;
              return (
                <rect
                  key={b.index}
                  x={x}
                  y={100 - b.height}
                  width={barWidth}
                  height={b.height}
                  rx={2}
                  className="fill-current text-primary-500 hover:text-primary-600 transition-colors cursor-pointer"
                  role="img"
                  aria-label={`${b.month}: ${b.value}`}
                >
                  <title>{`${b.month}: ${b.value}`}</title>
                </rect>
              );
            })}
          </svg>
        </div>

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
