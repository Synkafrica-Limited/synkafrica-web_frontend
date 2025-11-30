// hooks/business/useVendorTransactions.js
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import transactionsService from "@/services/transactions.service";
import { useBusiness } from "@/context/BusinessContext";
import authService from '@/services/authService';

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

      // If we have a business in context, filter transactions down to those
      // that belong to the current business/vendor. This prevents showing
      // transactions for other businesses when the API returns broader results.
      let filteredTxns = uniqueTxns;

      // Build a set of candidate ids that could represent this business
      const businessIdCandidates = new Set([
        business?.id,
        business?._id,
        business?.businessId,
        business?.vendorId,
        business?.ownerId,
      ].filter(Boolean));

      const businessNameNormalized = (business?.businessName || business?.name || '').toString().toLowerCase().trim();

      if (businessIdCandidates.size > 0 || businessNameNormalized) {
        // collect transaction-side identifiers for debugging
        const txnBizIds = uniqueTxns.map((t) => t?.businessId || t?.business?.id || t?.business?._id || null);

        console.debug('[useVendorTransactions] business filter candidates:', Array.from(businessIdCandidates), 'businessName:', businessNameNormalized, 'txnBizIds sample:', txnBizIds.slice(0,5));

        filteredTxns = uniqueTxns.filter((t) => {
          const txnBizId = t?.businessId || t?.business?.id || t?.business?._id || null;
          const txnVendorId = t?.vendorId || t?.vendor?.id || t?.vendor?._id || null;
          const txnBizName = (t?.business?.businessName || t?.businessName || '').toString().toLowerCase().trim();

          const idMatch = (txnBizId && businessIdCandidates.has(txnBizId)) || (txnVendorId && businessIdCandidates.has(txnVendorId));
          const nameMatch = businessNameNormalized && txnBizName && businessNameNormalized === txnBizName;

          return idMatch || nameMatch;
        });
      }

      // Fallback: if filtering by business produced zero results but there are
      // transactions returned that belong to the current vendor, accept those
      // (useful when BusinessContext is not yet fully populated or the backend
      // returns vendor-scoped transactions without explicit business scoping).
      if ((filteredTxns.length === 0) && uniqueTxns.length > 0) {
        try {
          const currentUser = authService.getUser();
          const currentUserId = currentUser?.id || currentUser?.userId || null;
          if (currentUserId) {
            const vendorMatches = uniqueTxns.filter((t) => (t?.vendorId === currentUserId || t?.vendor?.id === currentUserId));
            if (vendorMatches.length > 0) {
              console.debug('[useVendorTransactions] business filter yielded 0; falling back to vendorId match', currentUserId, 'matched', vendorMatches.length);
              filteredTxns = vendorMatches;
            }
          }
        } catch (e) {
          console.debug('[useVendorTransactions] vendor fallback threw', e?.message || e);
        }
      }

      console.debug('[useVendorTransactions] fetched', (transactionsResponse && (Array.isArray(transactionsResponse) ? transactionsResponse.length : 1)), 'returned,', uniqueTxns.length, 'unique,', filteredTxns.length, 'filtered for business');

      setTransactions(filteredTxns);
      setStats(statsResponse || null);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError(err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [business]);

  useEffect(() => {
    // Do not attempt to fetch until we have a token and the business context
    // has finished loading and a business is available. This avoids fetching
    // global or unrelated transactions before we can filter them.
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