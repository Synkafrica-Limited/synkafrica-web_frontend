"use client";

import { useState, useEffect, useCallback } from "react";
import { useBusiness } from "./useBusiness";

const API_URL = "https://synkkafrica-backend-core.onrender.com/api/listings/business";

/**
 * useVendorListings
 * Fetches listings created by the vendor using their business ID
 * @param {string} token - Vendor auth token
 * @returns {object} { listings, loading, error, refetch, businessLoading, businessError }
 */
export const useVendorListings = (token) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch business data to get businessId
  const { business, loading: businessLoading, error: businessError } = useBusiness(token);

  const fetchListings = useCallback(async () => {
    if (!token || !business) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/${business.id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setListings(data || []);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [token, business]);

  useEffect(() => {
    if (!businessLoading && business) {
      fetchListings();
    } else if (!businessLoading && !business) {
      // If business loading is done but no business found
      setLoading(false);
    }
  }, [fetchListings, business, businessLoading]);

  // Combined loading state
  const combinedLoading = loading || businessLoading;
  // Combined error state (prioritize business errors first)
  const combinedError = businessError || error;

  return { 
    listings, 
    loading: combinedLoading, 
    error: combinedError, 
    refetch: fetchListings,
    businessLoading,
    businessError
  };
};