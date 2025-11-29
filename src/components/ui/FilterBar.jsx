"use client";

import { Search, Filter } from "lucide-react";

export default function FilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  activeFilter,
  onFilterChange,
  dropdownFilters = [],
  className = "",
}) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        {onSearchChange && (
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Dropdown Filters */}
        {dropdownFilters.map((dropdown, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">
              {dropdown.label}:
            </span>
            <select
              value={dropdown.value}
              onChange={(e) => dropdown.onChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {dropdown.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Button Filters */}
        {filters.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => onFilterChange(filter.value)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  activeFilter === filter.value
                    ? filter.activeClass || "bg-primary-500 text-white"
                    : filter.inactiveClass || "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label} {filter.count !== undefined && `(${filter.count})`}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}