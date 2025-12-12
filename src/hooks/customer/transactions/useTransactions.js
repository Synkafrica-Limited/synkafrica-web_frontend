"use client";

import { useState, useCallback } from "react";
import transactionsService from "@/services/transactions.service";

export const useTransactions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState([]);

  /**
   * fetchTransactions
   * Fetches all transactions for the authenticated user
   * @returns {Promise<Array|null>}
   */
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await transactionsService.getCustomerTransactions();
      
      // The API might return the array directly or wrapped in an object
      // Adjust based on actual API response structure if needed
      const data = response.data || response;

      if (Array.isArray(data)) {
        setTransactions(data);
        return data;
      } else {
        // If data is not an array, it might be empty or in a different format
        // For now, default to empty array if not an array
        console.warn("Transactions data is not an array:", data);
        setTransactions([]);
        return [];
      }
    } catch (err) {
      console.error("Transactions fetch error:", err);
      setError(
        err.message || "Unable to fetch transactions. Please try again later."
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * refreshTransactions
   * Force refresh the transactions from server
   */
  const refreshTransactions = useCallback(async () => {
    return await fetchTransactions();
  }, [fetchTransactions]);

  /**
   * fetchTransactionDetails
   * Fetches details for a specific transaction
   * @param {string} transactionId - The ID of the transaction
   * @returns {Promise<Object|null>}
   */
  const fetchTransactionDetails = useCallback(async (transactionId) => {
    if (!transactionId) {
      setError("Transaction ID is required");
      return null;
    }

    setLoading(true);
    setError("");

    try {
      const response = await transactionsService.getTransactionDetails(transactionId);
      
      // The API might return the transaction directly or wrapped in an object
      const data = response.data || response;
      return data;
    } catch (err) {
      console.error("Transaction details fetch error:", err);
      setError(
        err.message || "Unable to fetch transaction details. Please try again later."
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    refreshTransactions,
    fetchTransactionDetails,
  };
};
