"use client";

import { useState, useEffect, useCallback } from "react";
import listingsService from "@/services/listings.service";
import { handleApiError } from "@/utils/errorParser";

/**
 * useVendorListings
 * Client-side hook to fetch listings for the authenticated vendor and provide helpers
 */
export function useVendorListings(token, options = {}) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListings = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError('Authentication required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await listingsService.getVendorListings();
      console.debug('[useVendorListings] raw response:', res);
      
      // Handle various response formats
      const data = res?.data?.listings || res?.data || res?.listings || res;
      const normalizedListings = Array.isArray(data) ? data : [];
      
      console.debug('[useVendorListings] normalized listings:', normalizedListings);
      setListings(normalizedListings);
    } catch (err) {
      console.error("useVendorListings fetch error", err);
      
      const parsed = handleApiError(err, {}, { setError, setLoading });
      
      // Check if it's a business not found error
      if (err?.status === 404 || parsed.message?.toLowerCase().includes('business')) {
        setError('Please complete your business profile before creating listings.');
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const refetch = async () => fetchListings();

  const deleteListing = useCallback(async (id) => {
    try {
      console.log('[useVendorListings] Deleting listing with ID:', id);
      
      // Call API to delete
      await listingsService.deleteListing(id);
      
      // Optimistic update: remove from local state immediately
      setListings((prev) => prev.filter((l) => (l.id || l._id) !== id));
      
      console.log('[useVendorListings] Listing deleted successfully');
      return { success: true };
    } catch (err) {
      console.error("[useVendorListings] deleteListing error", err);
      
      // Parse error for user-friendly message
      const parsed = handleApiError(err);
      
      // Check for conflict (e.g., active bookings)
      if (err?.status === 409) {
        return { 
          success: false, 
          message: parsed.message || 'Cannot delete listing with active bookings'
        };
      }
      
      return { 
        success: false, 
        message: parsed.message || 'Failed to delete listing'
      };
    }
  }, []);

  const toggleStatus = useCallback(async (id, newStatus) => {
    try {
      console.log('[useVendorListings] Toggling status:', id, newStatus);
      
      // Fetch the current listing to get all data
      const currentListing = await listingsService.getListing(id);
      
      // For status-only updates, we need to send a complete valid payload
      // because the backend validates category fields on every update
      // Build a minimal payload that includes required category fields
      const category = currentListing.category;
      const businessId = currentListing.businessId;
      
      // Build the payload based on category
      let payload = { status: newStatus };
      
      // Include category-specific required fields to pass validation
      if (category === 'RESORT' && currentListing.resort) {
        payload.resort = {
          resortType: currentListing.resort.resortType || currentListing.resortType,
          roomType: currentListing.resort.roomType || currentListing.roomType,
          capacity: currentListing.resort.capacity || currentListing.capacity,
        };
      } else if (category === 'CAR_RENTAL' && currentListing.carRental) {
        payload.carRental = {
          carMake: currentListing.carRental.carMake || currentListing.carMake,
          carModel: currentListing.carRental.carModel || currentListing.carModel,
          carYear: currentListing.carRental.carYear || currentListing.carYear,
          carSeats: currentListing.carRental.carSeats || currentListing.carSeats,
          carTransmission: currentListing.carRental.carTransmission || currentListing.carTransmission,
          carFuelType: currentListing.carRental.carFuelType || currentListing.carFuelType,
          carPlateNumber: currentListing.carRental.carPlateNumber || currentListing.carPlateNumber,
        };
      } else if (category === 'FINE_DINING' && currentListing.dining) {
        payload.dining = {
          diningType: currentListing.dining.diningType || currentListing.diningType,
        };
      } else if (category === 'CONVENIENCE_SERVICE' && currentListing.convenience) {
        payload.convenience = {
          serviceType: currentListing.convenience.serviceType || currentListing.serviceType,
          serviceDescription: currentListing.convenience.serviceDescription || currentListing.serviceDescription,
        };
      }
      
      // Call API to update status with category data
      const updated = await listingsService.updateListing(id, payload);
      
      // Update local state with returned data
      setListings((prev) => prev.map((l) => {
        if ((l.id || l._id) === id) {
          return { ...l, status: updated?.status || newStatus };
        }
        return l;
      }));
      
      return { success: true, listing: updated };
    } catch (err) {
      console.error("[useVendorListings] toggleStatus error", err);
      const parsed = handleApiError(err);
      return { 
        success: false, 
        message: parsed || 'Failed to update listing status'
      };
    }
  }, []);

  const updateListing = useCallback(async (id, updates) => {
    try {
      console.log('[useVendorListings] Updating listing:', id, updates);
      
      // Call API to update
      const updated = await listingsService.updateListing(id, updates);
      
      // Update local state with returned data
      setListings((prev) => prev.map((l) => {
        if ((l.id || l._id) === id) {
          return { ...l, ...updated };
        }
        return l;
      }));
      
      return { success: true, listing: updated };
    } catch (err) {
      console.error("[useVendorListings] updateListing error", err);
      const parsed = handleApiError(err);
      return { 
        success: false, 
        message: parsed.message || 'Failed to update listing'
      };
    }
  }, []);

  return { 
    listings, 
    loading, 
    error, 
    refetch, 
    deleteListing, 
    toggleStatus,
    updateListing
  };
}

export default useVendorListings;