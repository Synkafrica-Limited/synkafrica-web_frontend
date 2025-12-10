"use client";

import { useState, useEffect, useCallback } from "react";
import bookingsService from "@/services/bookings.service";

export const useVendorBookings = (options = {}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract status to avoid object dependency issues
  const status = options.status;

  const fetchBookings = useCallback(async () => {
    // Map UI status (e.g. "pending") to backend enum (e.g. "PENDING")
    const backendStatus = status ? status.toString().toUpperCase() : undefined;

    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (backendStatus) params.status = backendStatus;

      console.log("Fetching vendor bookings with params:", params);

      const data = await bookingsService.getVendorBookings(params);

      // Normalize various possible response shapes to a flat array
      let normalized = [];

      if (Array.isArray(data)) {
        normalized = data;
      } else if (data?.bookings && Array.isArray(data.bookings)) {
        normalized = data.bookings;
      } else if (Array.isArray(data?.items)) {
        normalized = data.items;
      } else if (Array.isArray(data?.data)) {
        normalized = data.data;
      } else if (Array.isArray(data?.data?.items)) {
        normalized = data.data.items;
      }

      // Adapt backend shape to what the UI expects
      const adapted = normalized.map((booking) => {
        const statusLower = booking.status ? booking.status.toString().toLowerCase() : undefined;

        // Build a customer object if only flat fields are present
        const hasUserNames = booking.user?.firstName || booking.user?.lastName;
        const fullNameFromUser = hasUserNames
          ? [booking.user?.firstName, booking.user?.lastName].filter(Boolean).join(" ")
          : null;

        const customer = booking.customer || {
          name: booking.customerName || fullNameFromUser || 'N/A',
          email: booking.customerEmail || booking.user?.email || null,
          phone: booking.customerPhone || booking.user?.phoneNumber || null,
        };

        // Derive a human-friendly duration if not provided
        let duration = booking.duration;
        if (!duration && booking.startDate && booking.endDate) {
          const start = new Date(booking.startDate);
          const end = new Date(booking.endDate);
          if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end > start) {
            const msPerDay = 1000 * 60 * 60 * 24;
            const diffDays = Math.round((end.getTime() - start.getTime()) / msPerDay);
            if (diffDays > 0) {
              duration = diffDays === 1 ? '1 day' : `${diffDays} days`;
            }
          }
        }

        // Pick a best-effort location
        const location = booking.pickupLocation
          || booking.location
          || booking.listing?.location
          || null;

        return {
          ...booking,
          status: statusLower || booking.status,
          customer,
          duration,
          totalAmount: booking.totalAmount ?? booking.totalPrice ?? 0,
          pickupLocation: location,
        };
      });

      setBookings(adapted);
    } catch (err) {
      console.error("Failed to fetch vendor bookings:", {
        error: err,
        message: err?.message,
        status,
      });
      setError(err?.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [status]); // Only depend on status, not the entire options object

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
  };
};
