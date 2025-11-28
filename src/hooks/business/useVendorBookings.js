// hooks/business/useVendorBookings.js
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useBusiness } from "@/hooks/business/useBusiness";

const API_URL = "https://synkkafrica-backend-core.onrender.com/api/bookings/business";

export const useVendorBookings = (token, options = {}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use refs to prevent unnecessary re-renders
  const optionsRef = useRef(options);
  const tokenRef = useRef(token);

  // Update refs when dependencies change
  useEffect(() => {
    optionsRef.current = options;
    tokenRef.current = token;
  }, [options, token]);

  // Fetch business data to get businessId
  const { business, loading: businessLoading, error: businessError } = useBusiness(token);

  const fetchBookings = useCallback(async () => {
    const currentToken = tokenRef.current;
    const currentOptions = optionsRef.current;

    if (!currentToken || !business) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (currentOptions.status) queryParams.append('status', currentOptions.status);
      if (currentOptions.dateRange) queryParams.append('dateRange', currentOptions.dateRange);
      
      const queryString = queryParams.toString();
      const url = `${API_URL}/${business.id}${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${currentToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setBookings(data || []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [business]); // Only depend on business

  useEffect(() => {
    if (!businessLoading && business) {
      fetchBookings();
    } else if (!businessLoading && !business) {
      // If business loading is done but no business found
      setLoading(false);
      setBookings([]);
    }
  }, [fetchBookings, business, businessLoading]);

  // Combined loading state
  const combinedLoading = loading || businessLoading;
  // Combined error state (prioritize business errors first)
  const combinedError = businessError || error;

  return { 
    bookings, 
    loading: combinedLoading, 
    error: combinedError, 
    refetch: fetchBookings,
    businessLoading,
    businessError
  };
};

export default useVendorBookings;