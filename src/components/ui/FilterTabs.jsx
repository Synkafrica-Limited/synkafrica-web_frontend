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
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                            ? "bg-primary-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <span>{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                        <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold rounded-full ${
                            activeTab === tab.id ? "bg-white text-primary-600" : "bg-primary-100 text-primary-700"
                        }`}>
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}
