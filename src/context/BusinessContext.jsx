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
      console.debug('[BusinessContext] fetchBusiness response:', res);

      // Normalize responses: backend may return an array of businesses or a single object
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
            businessDescription: res.businessDescription || res.description || '',
            phoneNumber: res.phoneNumber || res.businessPhone || '',
            phoneNumber2: res.phoneNumber2 || '',
            businessURL: res.businessURL || res.url || '',
            bankName: res.bankName || '',
            accountName: res.accountName || '',
            accountNumber: res.accountNumber || '',
            faqs: res.faqs || null,
            serviceLicense: res.serviceLicense || null,
            availability: res.availability || '',
            profileImage: res.profileImage || res.logo || null,
          }
        : null;

      setBusiness(normalized);
      return normalized;
    } catch (err) {
      console.error('[BusinessContext] fetchBusiness error:', err);
      setError(err);
      setBusiness(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusiness();
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
  if (!ctx) {
    throw new Error('useBusiness must be used within BusinessProvider');
  }
  return ctx;
}

export default BusinessContext;
// "use client";

// import React, { createContext, useContext, useState, useCallback } from 'react';
// import businessService from '@/services/business.service';
// import authService from '@/services/authService';

// const BusinessContext = createContext({
//   business: null,
//   setBusiness: () => {},
//   fetchBusiness: async () => null,
// });

// export function BusinessProvider({ children, initialBusiness = null }) {
//   const [business, setBusiness] = useState(initialBusiness);

//   const fetchBusiness = useCallback(async () => {
//     try {
//       const token = (typeof window !== 'undefined' && authService && authService.getAccessToken)
//         ? authService.getAccessToken()
//         : null;
//       console.debug('[BusinessContext] fetchBusiness - token present:', !!token, token ? `${String(token).slice(0,8)}...` : null);

//       const res = await businessService.getMyBusinesses();
//       console.debug('[BusinessContext] fetchBusiness response:', res);

//       if (res) {
//         const normalized = {
//           id: res.id || res._id,
//           businessName: res.businessName || res.name || '',
//           businessLocation: res.businessLocation || '',
//           businessDescription: res.businessDescription || '',
//           phoneNumber: res.phoneNumber || '',
//           phoneNumber2: res.phoneNumber2 || '',
//           businessURL: res.businessURL || '',
//           bankName: res.bankName || '',
//           accountName: res.accountName || '',
//           accountNumber: res.accountNumber || '',
//           faqs: res.faqs || null,
//           serviceLicense: res.serviceLicense || null,
//           availability: res.availability || '',
//           profileImage: res.profileImage || null,
//         };
//         setBusiness(normalized);
//       } else {
//         setBusiness(null);
//       }

//       return res;
//     } catch (err) {
//       console.error('[BusinessContext] fetchBusiness error:', err);
//       throw err;
//     }
//   }, []);

//   return (
//     <BusinessContext.Provider value={{ business, setBusiness, fetchBusiness }}>
//       {children}
//     </BusinessContext.Provider>
//   );
// }

// export function useBusiness() {
//   return useContext(BusinessContext);
// }

// export default BusinessContext;
