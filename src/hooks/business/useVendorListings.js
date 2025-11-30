"use client";

import { useState, useEffect, useCallback } from "react";
import { useBusiness } from "./useBusiness";
import listingsService from "@/services/listings.service";

/**
 * useVendorListings
 * Client-side hook to fetch listings for the authenticated vendor and provide helpers
 */
export function useVendorListings(token) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { business, loading: businessLoading } = useBusiness(token);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listingsService.getVendorListings();
      const data = res?.data || res;
      setListings(Array.isArray(data) ? data : data.listings || []);
    } catch (err) {
      console.error("useVendorListings fetch error", err);
      setError(err?.message || String(err) || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // only fetch when business info is ready (if business gating is required)
    if (businessLoading) return;
    fetchListings();
  }, [fetchListings, businessLoading]);

  const refetch = async () => fetchListings();

  const deleteListing = useCallback(async (id) => {
    try {
      await listingsService.deleteListing(id);
      setListings((prev) => prev.filter((l) => (l.id || l._id) !== id));
      return true;
    } catch (err) {
      console.error("deleteListing error", err);
      throw err;
    }
  }, []);

  const toggleStatus = useCallback(async (id, newStatus) => {
    try {
      await listingsService.updateListing(id, { status: newStatus });
      setListings((prev) => prev.map((l) => {
        if ((l.id || l._id) === id) return { ...l, status: newStatus };
        return l;
      }));
      return true;
    } catch (err) {
      console.error("toggleStatus error", err);
      throw err;
    }
  }, []);

  return { listings, loading, error, refetch, deleteListing, toggleStatus };
}

export default useVendorListings;