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