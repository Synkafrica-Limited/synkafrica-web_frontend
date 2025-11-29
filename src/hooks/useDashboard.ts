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
    queryFn: async (): Promise<{ reviews: Review[]; pagination: { total: number; page: number; limit: number } }> => {
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