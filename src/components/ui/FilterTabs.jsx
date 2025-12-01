"use client";
import React from 'react';

export default function FilterTabs({ tabs, activeTab, onTabChange, layout = 'scroll', className = '' }) {
    // layout: 'scroll' (default) or 'wrap'
    const containerClasses = layout === 'wrap'
        ? 'flex flex-wrap gap-2'
        : 'flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide';

    return (
        <div className={`${containerClasses} ${className}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                            ? "bg-primary-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    {tab.label}
                    {tab.count !== undefined && ` (${tab.count})`}
                </button>
            ))}
        </div>
    );
}
