"use client";

import { useState, useEffect, useCallback } from "react";

const API_URL = "https://synkkafrica-backend-core.onrender.com/api/bookings/vendor";

export const useVendorBookings = (token, options = {}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract status to avoid object dependency issues
  const status = options.status;

  const fetchBookings = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    const params = new URLSearchParams();
    if (status) params.append("status", status);

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}?${params}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to load bookings");
      }

      const data = await response.json();
      
      // Handle different response structures
      if (Array.isArray(data)) {
        setBookings(data);
      } else if (data.bookings && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setError(err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [token, status]); // Only depend on token and status, not the entire options object

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
