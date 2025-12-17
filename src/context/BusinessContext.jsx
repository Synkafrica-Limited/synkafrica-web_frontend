"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import businessService from "@/services/business.service";

const BusinessContext = createContext(null);

export function BusinessProvider({ children }) {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBusiness = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let res = await businessService.getMyBusinesses();

      if (process.env.NODE_ENV === 'development') {
        console.debug('[BusinessContext] fetchBusiness response:', res);
      }

      // The businessService already handles wrapped responses and normalization
      // so res should already be the normalized business object or null

      // Additional normalization just in case
      if (Array.isArray(res)) {
        res = res.length > 0 ? res[0] : null;
      }

      // If the response wraps user/business ({ user, business }) extract business
      if (res && res.business) {
        res = res.business;
      }

      // Normalize fields into a consistent business object
      const normalized = res
        ? {
          id: res.id || res._id || res.businessId || null,
          businessName: res.businessName || res.name || '',
          businessLocation: res.businessLocation || res.location || '',
          businessDescription: res.description || res.businessDescription || '',
          phoneNumber: res.phoneNumber || res.businessPhone || '',
          secondaryPhone: res.secondaryPhone || res.phoneNumber2 || '',
          url: res.url || res.businessURL || '',
          bankName: res.bankName || '',
          bankAccountName: res.bankAccountName || res.accountName || '',
          bankAccountNumber: res.bankAccountNumber || res.accountNumber || '',
          faqs: res.faqs || null,
          serviceLicense: res.serviceLicense || null,
          availability: res.availability || '',
          profileImage: res.profileImage || res.logo || null,
          verificationStatus: res.verificationStatus || 'not_started',
          verificationProgress: res.verificationProgress || 0,
          isVerified: res.isVerified || false,
        }
        : null;

      if (process.env.NODE_ENV === 'development') {
        console.debug('[BusinessContext] fetchBusiness normalized:', normalized);
      }
      setBusiness(normalized);
      return normalized;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[BusinessContext] fetchBusiness error:', err);
      }
      setError(err);
      setBusiness(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusiness();
    if (typeof window !== 'undefined') {
      window.__BUSINESS_CONTEXT_REFRESH__ = fetchBusiness;
    }
  }, [fetchBusiness]);

  const value = {
    business,
    loading,
    error,
    refresh: fetchBusiness,
    setBusiness,
  };

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  // Return context if available; allow callers to handle null when provider is not present
  if (!ctx) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('useBusiness called outside BusinessProvider - returning null');
    }
    return null;
  }
  return ctx;
}

export default BusinessContext;
