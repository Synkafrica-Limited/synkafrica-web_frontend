// hooks/business/useVendorTransactions.js
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getVendorTransactions, getVendorStats } from "@/services/transactions.service";

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
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (currentOptions.status) queryParams.append('status', currentOptions.status);
      if (currentOptions.dateRange) queryParams.append('dateRange', currentOptions.dateRange);
      if (currentOptions.page) queryParams.append('page', currentOptions.page);
      if (currentOptions.limit) queryParams.append('limit', currentOptions.limit);

      const queryString = queryParams.toString();
      const query = queryString ? `?${queryString}` : '';

      const [transactionsResponse, statsResponse] = await Promise.all([
        getVendorTransactions(query),
        getVendorStats()
      ]);

      setTransactions(transactionsResponse || []);
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