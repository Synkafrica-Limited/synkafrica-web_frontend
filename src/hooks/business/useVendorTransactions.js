// hooks/business/useVendorTransactions.js
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import transactionsService from "@/services/transactions.service";
import { useBusiness } from "@/context/BusinessContext";

export const useVendorTransactions = (token, options = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use refs to prevent unnecessary re-renders
  const optionsRef = useRef(options);
  const tokenRef = useRef(token);
  const { business, loading: businessLoading } = useBusiness();

  // Update refs when dependencies change
  useEffect(() => {
    optionsRef.current = options;
    tokenRef.current = token;
  }, [options, token]);

  const fetchTransactions = useCallback(async () => {
    const currentToken = tokenRef.current;
    const currentOptions = optionsRef.current;

    if (!currentToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build query parameters for transactionsService - match backend contract exactly
      const params = {};
      
      // Add businessId if provided in options (backend will filter by it)
      if (currentOptions.businessId) params.businessId = currentOptions.businessId;
      
      // Map status filter to payoutStatus (backend param name)
      if (currentOptions.status) params.payoutStatus = currentOptions.status;
      
      // Convert dateRange shortcuts to ISO startDate/endDate
      if (currentOptions.startDate) {
        params.startDate = currentOptions.startDate;
      } else if (currentOptions.dateRange) {
        if (currentOptions.dateRange === 'week') {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          params.startDate = weekAgo.toISOString();
        } else if (currentOptions.dateRange === 'month') {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          params.startDate = monthAgo.toISOString();
        }
      }
      
      if (currentOptions.endDate) params.endDate = currentOptions.endDate;
      if (currentOptions.page) params.skip = (currentOptions.page - 1) * (currentOptions.limit || 20);
      if (currentOptions.limit) params.take = currentOptions.limit;

      const [transactionsResponse, statsResponse] = await Promise.all([
        transactionsService.getVendorTransactions(params),
        transactionsService.getVendorStats()
      ]);

      // Normalize transactions response into an array, supporting wrapped shapes
      const normalizeToArray = (resp) => {
        if (!resp && resp !== 0) return [];

        // If already an array
        if (Array.isArray(resp)) return resp;

        // Common wrappers
        if (resp.data && Array.isArray(resp.data)) return resp.data;
        if (resp.transactions && Array.isArray(resp.transactions)) return resp.transactions;
        if (resp.items && Array.isArray(resp.items)) return resp.items;
        if (resp.results && Array.isArray(resp.results)) return resp.results;

        // If resp is an object with nested array at any key, try to find it
        for (const key of Object.keys(resp)) {
          if (Array.isArray(resp[key])) return resp[key];
        }

        // Fallback: wrap single object into array
        return [resp];
      };

      let txns = normalizeToArray(transactionsResponse || []);

      // Deduplicate using multiple possible id keys
      const idCandidates = (t) => t?.id || t?._id || t?.transactionId || t?.txnId || t?.reference || t?.ref || null;
      const map = new Map();
      txns.forEach((t) => {
        const id = idCandidates(t) || JSON.stringify(t);
        if (!map.has(id)) map.set(id, t);
      });
      const uniqueTxns = Array.from(map.values());

      // Backend now handles businessId filtering - no client-side filtering needed
      // Trust the backend response since we pass businessId in query params
      if (process.env.NODE_ENV === 'development') {
        console.debug('[useVendorTransactions] fetched', uniqueTxns.length, 'transactions from backend');
      }

      setTransactions(uniqueTxns);
      setStats(statsResponse || null);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Failed to fetch transactions:", err);
      }
      setError(err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Wait for token and business context to load
    if (!token) {
      setLoading(false);
      setTransactions([]);
      setStats(null);
      return;
    }

    if (businessLoading) {
      // wait until business context finishes loading
      return;
    }

    if (!business) {
      // No business found for this vendor/context — clear transactions
      setLoading(false);
      setTransactions([]);
      setStats(null);
      return;
    }

    // Inject businessId into options for backend filtering
    const businessId = business?.id || business?._id || business?.businessId;
    if (businessId && !optionsRef.current.businessId) {
      optionsRef.current = { ...optionsRef.current, businessId };
    }

    // business is present and ready
    fetchTransactions();
  }, [fetchTransactions, token, business, businessLoading]);

  return {
    transactions,
    stats,
    loading,
    error,
    refetch: fetchTransactions
  };
};

export default useVendorTransactions;