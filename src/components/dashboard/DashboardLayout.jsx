import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DASHBOARD_TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'bookings', label: 'Bookings', icon: '📅' },
  { id: 'listings', label: 'Listings', icon: '📋' },
  { id: 'reviews', label: 'Reviews', icon: '⭐' },
  { id: 'payments', label: 'Payments', icon: '💳' },
  { id: 'profile', label: 'Business Profile', icon: '🏢' },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
}) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Business Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.email}
              </span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <nav className="w-64 bg-white rounded-lg shadow-sm p-4">
            <ul className="space-y-2">
              {DASHBOARD_TABS.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => onTabChange(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};