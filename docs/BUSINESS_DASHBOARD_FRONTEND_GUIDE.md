# Business Dashboard Frontend Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing a business dashboard frontend that integrates with the SynkkAfrica backend API. The dashboard provides vendors with insights into their business performance, including revenue analytics, booking management, listing performance, and customer interactions.

## Prerequisites

### Required Dependencies
```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.0.0",
    "react": "^18.0.0",
    "axios": "^1.6.0",
    "chart.js": "^4.0.0",
    "react-chartjs-2": "^5.0.0",
    "lucide-react": "^0.294.0",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Environment Variables
```env
REACT_APP_API_BASE_URL=https://api.synkkafrica.com/api
REACT_APP_WS_URL=wss://api.synkkafrica.com
```

## Project Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx
│   │   ├── KPICard.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── BookingsTable.tsx
│   │   └── RecentActivity.tsx
│   ├── common/
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ScreenReaderOnly.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Table.tsx
├── hooks/
│   ├── useDashboard.ts
│   ├── useAuth.ts
│   └── useWebSocket.ts
├── services/
│   ├── api.ts
│   └── auth.ts
├── types/
│   └── dashboard.ts
├── utils/
│   ├── formatters.ts
│   └── constants.ts
└── pages/
    ├── Dashboard.tsx
    ├── Analytics.tsx
    ├── Bookings.tsx
    └── Profile.tsx
```

## Step 1: API Client Setup

### Create API Client (`src/services/api.ts`)

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return Promise.reject(new Error('Authentication required'));
    }

    if (error.response?.status >= 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }

    return Promise.reject(error);
  }
);

export default api;
```

### Create Auth Service (`src/services/auth.ts`)

```typescript
import { api } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/signin', credentials);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  },

  getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
};
```

## Step 2: Type Definitions

### Create Dashboard Types (`src/types/dashboard.ts`)

```typescript
export interface VendorDashboardStats {
  totalOrders: number;
  storeReviews: number;
  averageOrderValue: number;
  totalRevenue: number;
  recentActivity: Array<{
    id: string;
    message: string;
    timestamp: Date;
    type: 'booking' | 'listing' | 'transaction' | 'review';
  }>;
  topServicesByPrice: Array<{
    name: string;
    price: number;
    category: string;
  }>;
  statistics: {
    completedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    activeListings: number;
    draftListings: number;
  };
  userStatistics: {
    totalCustomers: number;
    newCustomersThisWeek: number;
    newCustomersThisMonth: number;
  };
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  bookingCount: number;
}

export interface BookingsStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  averageBookingValue: number;
  mostPopularListings: Array<{
    listingId: string;
    title: string;
    bookingCount: number;
  }>;
}

export interface ListingPerformance {
  id: string;
  title: string;
  category: string;
  basePrice: number;
  status: string;
  isFeatured: boolean;
  isFlagged: boolean;
  viewsCount: number;
  bookingCount: number;
  revenue: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
}

export interface Booking {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: Date;
  listing: {
    title: string;
  };
  user: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
  };
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  listing: {
    title: string;
  };
  user: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
}
```

## Step 3: Custom Hooks

### Dashboard Data Hook (`src/hooks/useDashboard.ts`)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import {
  VendorDashboardStats,
  RevenueChartData,
  BookingsStats,
  ListingPerformance,
  Booking,
  Review
} from '../types/dashboard';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async (): Promise<VendorDashboardStats> => {
      const response = await api.get('/business/dashboard/stats');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useRevenueChart = (period: 'daily' | 'weekly' | 'monthly' = 'monthly') => {
  return useQuery({
    queryKey: ['dashboard', 'revenue-chart', period],
    queryFn: async (): Promise<RevenueChartData[]> => {
      const response = await api.get(`/dashboard/vendor/revenue/chart?period=${period}`);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useBookingsStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'bookings-stats'],
    queryFn: async (): Promise<BookingsStats> => {
      const response = await api.get('/dashboard/vendor/bookings/stats');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useRecentBookings = (limit: number = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-bookings', limit],
    queryFn: async (): Promise<Booking[]> => {
      const response = await api.get(`/dashboard/vendor/bookings/recent?limit=${limit}`);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useListingsPerformance = () => {
  return useQuery({
    queryKey: ['dashboard', 'listings-performance'],
    queryFn: async (): Promise<ListingPerformance[]> => {
      const response = await api.get('/dashboard/vendor/listings/performance');
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useVendorReviews = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'reviews', page, limit],
    queryFn: async (): Promise<{ reviews: Review[]; pagination: any }> => {
      const response = await api.get(`/dashboard/vendor/reviews?page=${page}&limit=${limit}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      const response = await api.patch(`/api/bookings/${bookingId}`, { status });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'bookings-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'recent-bookings'] });
    },
  });
};
```

### Auth Hook (`src/hooks/useAuth.ts`)

```typescript
import { useState, useEffect } from 'react';
import { authService, AuthResponse } from '../services/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authService.getStoredToken();
    if (token) {
      // TODO: Validate token with backend
      setIsAuthenticated(true);
      // TODO: Decode token to get user info
    }
    setLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('authToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };
};
```

## Step 4: UI Components

### Dashboard Layout (`src/components/dashboard/DashboardLayout.tsx`)

```typescript
import React, { useState } from 'react';
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
```

### KPI Card Component (`src/components/dashboard/KPICard.tsx`)

```typescript
import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ReactNode;
  format?: 'currency' | 'number' | 'percentage';
  loading?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon,
  format = 'number',
  loading = false,
}) => {
  const formatValue = (val: string | number) => {
    if (loading) return '---';

    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(Number(val));
    }
    if (format === 'percentage') {
      return `${val}%`;
    }
    return val.toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatValue(value)}
          </p>
          {change && (
            <p className={`text-sm flex items-center ${
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change.type === 'increase' ? '↗' : '↘'}
              {Math.abs(change.value)}% from last month
            </p>
          )}
        </div>
        <div className="text-gray-400">{icon}</div>
      </div>
    </div>
  );
};
```

### Revenue Chart Component (`src/components/dashboard/RevenueChart.tsx`)

```typescript
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { RevenueChartData } from '../../types/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueChartProps {
  data: RevenueChartData[];
  period: 'daily' | 'weekly' | 'monthly';
  loading?: boolean;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  period,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const formatDate = (dateStr: string, period: string) => {
    const date = new Date(dateStr);
    switch (period) {
      case 'daily':
        return date.toLocaleDateString();
      case 'weekly':
        return `Week of ${date.toLocaleDateString()}`;
      case 'monthly':
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      default:
        return dateStr;
    }
  };

  const chartData = {
    labels: data.map(item => formatDate(item.date, period)),
    datasets: [
      {
        label: 'Revenue',
        data: data.map(item => item.revenue),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y',
        tension: 0.4,
      },
      {
        label: 'Bookings',
        data: data.map(item => item.bookingCount),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        yAxisID: 'y1',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: `Revenue Analytics (${period})`,
      },
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Revenue ($)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Bookings',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <Line data={chartData} options={options} />
    </div>
  );
};
```

### Bookings Table Component (`src/components/dashboard/BookingsTable.tsx`)

```typescript
import React, { useState } from 'react';
import { Booking } from '../../types/dashboard';
import { useUpdateBookingStatus } from '../../hooks/useDashboard';

interface BookingsTableProps {
  bookings: Booking[];
  loading?: boolean;
}

export const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings,
  loading = false
}) => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const updateBookingStatus = useUpdateBookingStatus();

  const sortedBookings = [...bookings].sort((a, b) => {
    const aValue = a[sortField as keyof Booking];
    const bValue = b[sortField as keyof Booking];

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      await updateBookingStatus.mutateAsync({ bookingId, status });
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border animate-pulse">
        <div className="h-12 bg-gray-200 rounded-t-lg"></div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {booking.user.firstName} {booking.user.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.user.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {booking.listing.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${booking.totalAmount.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                    disabled={updateBookingStatus.isPending}
                    className="text-sm border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirm</option>
                    <option value="COMPLETED">Complete</option>
                    <option value="CANCELLED">Cancel</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

## Step 5: Main Dashboard Page

### Dashboard Page (`src/pages/Dashboard.tsx`)

```typescript
import React, { useState } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { KPICard } from '../components/dashboard/KPICard';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { BookingsTable } from '../components/dashboard/BookingsTable';
import { useDashboardStats, useRevenueChart, useRecentBookings } from '../hooks/useDashboard';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueChart();
  const { data: bookings, isLoading: bookingsLoading } = useRecentBookings();

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value={stats?.totalRevenue || 0}
          format="currency"
          icon="💰"
          loading={statsLoading}
        />
        <KPICard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon="📦"
          loading={statsLoading}
        />
        <KPICard
          title="Active Listings"
          value={stats?.statistics.activeListings || 0}
          icon="📋"
          loading={statsLoading}
        />
        <KPICard
          title="Average Rating"
          value={stats?.storeReviews || 0}
          format="number"
          icon="⭐"
          loading={statsLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart
          data={revenueData || []}
          period="monthly"
          loading={revenueLoading}
        />
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {stats?.recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <span className="text-sm">📅</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <BookingsTable
        bookings={bookings || []}
        loading={bookingsLoading}
      />
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart
          data={revenueData || []}
          period="monthly"
          loading={revenueLoading}
        />
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Completed Bookings</span>
              <span className="text-sm font-medium">{stats?.statistics.completedBookings || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pending Bookings</span>
              <span className="text-sm font-medium">{stats?.statistics.pendingBookings || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Cancelled Bookings</span>
              <span className="text-sm font-medium">{stats?.statistics.cancelledBookings || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Customers</span>
              <span className="text-sm font-medium">{stats?.userStatistics.totalCustomers || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'analytics':
        return renderAnalytics();
      case 'bookings':
        return <BookingsTable bookings={bookings || []} loading={bookingsLoading} />;
      default:
        return renderOverview();
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;
```

## Step 6: App Setup

### Main App Component (`src/App.tsx`)

```typescript
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import LoadingSpinner from './components/common/LoadingSpinner';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/dashboard/*"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
```

### Login Page (`src/pages/Login.tsx`)

```typescript
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(credentials);

    if (!result.success) {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
```

## Step 7: Utility Functions

### Formatters (`src/utils/formatters.ts`)

```typescript
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: Date | string): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

export const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`;
};
```

### Constants (`src/utils/constants.ts`)

```typescript
export const API_ENDPOINTS = {
  DASHBOARD_STATS: '/business/dashboard/stats',
  REVENUE_CHART: '/dashboard/vendor/revenue/chart',
  BOOKINGS_STATS: '/dashboard/vendor/bookings/stats',
  RECENT_BOOKINGS: '/dashboard/vendor/bookings/recent',
  LISTINGS_PERFORMANCE: '/dashboard/vendor/listings/performance',
  VENDOR_REVIEWS: '/dashboard/vendor/reviews',
  BUSINESS_PROFILE: '/business/profile',
  UPDATE_BOOKING_STATUS: '/api/bookings',
} as const;

export const BOOKING_STATUSES = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const CHART_PERIODS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
} as const;

export const DASHBOARD_TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'bookings', label: 'Bookings', icon: '📅' },
  { id: 'listings', label: 'Listings', icon: '📋' },
  { id: 'reviews', label: 'Reviews', icon: '⭐' },
  { id: 'payments', label: 'Payments', icon: '💳' },
  { id: 'profile', label: 'Business Profile', icon: '🏢' },
] as const;
```

## Step 8: Testing

### Dashboard Component Test (`src/__tests__/Dashboard.test.tsx`)

```typescript
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from '../pages/Dashboard';
import { api } from '../services/api';

// Mock the API
jest.mock('../services/api');
const mockedApi = api as jest.Mocked<typeof api>;

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('Dashboard', () => {
  beforeEach(() => {
    mockedApi.get.mockClear();
  });

  test('renders dashboard with loading states', () => {
    mockedApi.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Business Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  test('renders dashboard data when loaded', async () => {
    const mockStats = {
      totalOrders: 150,
      totalRevenue: 25000,
      statistics: {
        activeListings: 12,
        completedBookings: 145,
        pendingBookings: 5,
        cancelledBookings: 0,
      },
      userStatistics: {
        totalCustomers: 89,
      },
      storeReviews: 4.5,
      recentActivity: [],
      topServicesByPrice: [],
      averageOrderValue: 166.67,
    };

    mockedApi.get.mockResolvedValueOnce({ data: mockStats });

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('$25,000.00')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });
  });
});
```

## Step 9: Deployment Configuration

### Environment Variables for Production

```env
# Production Environment Variables
REACT_APP_API_BASE_URL=https://your-api-domain.com/api
REACT_APP_WS_URL=wss://your-api-domain.com
REACT_APP_ENVIRONMENT=production
```

### Build Configuration (`package.json`)

```json
{
  "scripts": {
    "build": "react-scripts build",
    "build:staging": "env-cmd -f .env.staging react-scripts build",
    "build:production": "env-cmd -f .env.production react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "start": "react-scripts start",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix"
  }
}
```

### Docker Configuration (`Dockerfile`)

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration (`nginx.conf`)

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

## Implementation Checklist

### Phase 1: Core Setup
- [ ] Install dependencies
- [ ] Set up project structure
- [ ] Configure API client
- [ ] Create authentication system
- [ ] Set up routing

### Phase 2: Dashboard Components
- [ ] Create dashboard layout
- [ ] Implement KPI cards
- [ ] Build revenue chart
- [ ] Create bookings table
- [ ] Add loading states

### Phase 3: Data Integration
- [ ] Connect to dashboard stats API
- [ ] Implement revenue analytics
- [ ] Add booking management
- [ ] Integrate listing performance
- [ ] Connect review system

### Phase 4: Advanced Features
- [ ] Add real-time updates (WebSocket)
- [ ] Implement error boundaries
- [ ] Add accessibility features
- [ ] Create responsive design
- [ ] Add offline support

### Phase 5: Testing & Deployment
- [ ] Write unit tests
- [ ] Add integration tests
- [ ] Configure CI/CD
- [ ] Set up monitoring
- [ ] Deploy to production

## Common Issues & Solutions

### Issue: API Authentication Errors
**Solution**: Ensure JWT token is properly stored and included in request headers.

### Issue: Chart Not Rendering
**Solution**: Verify Chart.js is properly registered and data format matches expectations.

### Issue: Loading States Not Working
**Solution**: Check React Query configuration and ensure proper loading states are handled.

### Issue: File Upload Failures
**Solution**: Verify Multer configuration on backend and form data format on frontend.

This guide provides a complete, step-by-step implementation that can be followed by an AI or human developer to create a fully functional business dashboard.</content>
<parameter name="filePath">c:\Users\admin\Developer\synkkafrica_backend_core\docs\BUSINESS_DASHBOARD_FRONTEND_GUIDE.md