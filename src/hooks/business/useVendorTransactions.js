// hooks/business/useVendorTransactions.js
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import transactionsService from "@/services/transactions.service";

export const useVendorTransactions = (token, options = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
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
      // Build query parameters for transactionsService
      const params = {};
      if (currentOptions.status) params.payoutStatus = currentOptions.status;
      if (currentOptions.dateRange) {
        // Convert dateRange to startDate/endDate
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

      console.debug('[useVendorTransactions] fetched', (transactionsResponse && (Array.isArray(transactionsResponse) ? transactionsResponse.length : 1)) , 'returned,', uniqueTxns.length, 'unique');

      setTransactions(uniqueTxns);
      setStats(statsResponse || null);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError(err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchTransactions();
    } else {
      setLoading(false);
      setTransactions([]);
      setStats(null);
    }
  }, [fetchTransactions, token]);

  return {
    transactions,
    stats,
    loading,
    error,
    refetch: fetchTransactions
  };
};

export default useVendorTransactions;