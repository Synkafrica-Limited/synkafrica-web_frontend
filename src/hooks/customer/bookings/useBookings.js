// hooks/customer/bookings/useBookings.js
"use client";

import { useState, useCallback } from "react";

const BOOKINGS_URL = "https://synkkafrica-backend-core.onrender.com/api/bookings";

export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);

  /**
   * fetchBookings
   * Fetches all bookings for the authenticated user
   * @returns {Promise<Array|null>}
   */
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const accessToken = localStorage.getItem("customerToken");
      
      if (!accessToken) {
        setError("No authentication token found");
        return null;
      }

      const response = await fetch(BOOKINGS_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
      });

      let data = {};
      try {
        data = await response.json();
      } catch (parseError) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to parse response JSON", parseError);
        }
        setError("Failed to parse server response");
        return null;
      }

      if (!response.ok) {
        setError(data?.message || "Failed to fetch bookings");
        return null;
      }

      // Success - set the bookings
      setBookings(Array.isArray(data) ? data : []);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Bookings fetch error:", err);
      }
      setError(
        err.message || "Unable to reach server. Please try again later."
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * refreshBookings
   * Force refresh the bookings from server
   * @returns {Promise<Array|null>}
   */
  const refreshBookings = useCallback(async () => {
    return await fetchBookings();
  }, [fetchBookings]);

  /**
   * clearBookings
   * Clear the bookings from state
   */
  const clearBookings = useCallback(() => {
    setBookings([]);
    setError("");
  }, []);

  return {
    // State
    bookings,
    loading,
    error,
    
    // Actions
    fetchBookings,
    refreshBookings,
    clearBookings,
  };
};
