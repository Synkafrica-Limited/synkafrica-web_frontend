"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import transactionsService from "@/services/transactions.service";

/**
 * useTransactions Hook
 * Fetches customer transactions with filtering and pagination
 * @param {Object} options - Fetch options (status, dateRange, startDate, endDate, page, limit)
 */
export const useTransactions = (options = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null); // Pagination metadata if provided

  // Use refs to prevent unnecessary re-renders loop
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const currentOptions = optionsRef.current;

    try {
      const params = {};

      if (currentOptions.status) params.status = currentOptions.status;

      // Handle Date Ranges
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

      const response = await transactionsService.getCustomerTransactions(params);

      // Normalize response
      const normalizeToArray = (resp) => {
        if (!resp && resp !== 0) return [];
        if (Array.isArray(resp)) return resp;
        if (resp.data && Array.isArray(resp.data)) return resp.data;
        if (resp.transactions && Array.isArray(resp.transactions)) return resp.transactions;
        if (resp.items && Array.isArray(resp.items)) return resp.items;
        if (resp.results && Array.isArray(resp.results)) return resp.results;
        return [resp];
      };

      const txns = normalizeToArray(response || []);

      // Deduplicate
      const idCandidates = (t) => t?.id || t?._id || t?.transactionId || t?.txnId || t?.reference || t?.ref || null;
      const map = new Map();
      txns.forEach((t) => {
        const id = idCandidates(t) || JSON.stringify(t);
        if (!map.has(id)) map.set(id, t);
      });

      setTransactions(Array.from(map.values()));
      
      // Capture pagination meta if available
      if (response && response.meta) {
         setMeta(response.meta);
      }

    } catch (err) {
      console.error("Transactions fetch error:", err);
      setError(err.message || "Unable to fetch transactions.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * fetchTransactionDetails
   */
  const fetchTransactionDetails = useCallback(async (transactionId) => {
    if (!transactionId) return null;
    setLoading(true);
    try {
      const response = await transactionsService.getTransactionDetails(transactionId);
      return response.data || response;
    } catch (err) {
      console.error("Transaction details error:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    meta,
    refetch: fetchTransactions,
    fetchTransactions,
    fetchTransactionDetails,
  };
};
