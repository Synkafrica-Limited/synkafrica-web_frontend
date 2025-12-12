"use client";

import { useState, useEffect } from "react";
import { useTransactions } from "@/hooks/customer/transactions/useTransactions";
import {
  Search,
  Filter,
  Download,
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight,
} from "lucide-react";

const TransactionsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { transactions, loading, error, fetchTransactions, fetchTransactionDetails } = useTransactions();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Helper to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "successful":
      case "paid":
        return { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle };
      case "pending":
      case "processing":
        return { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock };
      case "failed":
      case "cancelled":
        return { color: "bg-red-100 text-red-800 border-red-200", icon: AlertCircle };
      default:
        return { color: "bg-gray-100 text-gray-800 border-gray-200", icon: CreditCard };
    }
  };

  const filteredTransactions = transactions
    .filter((txn) => {
      if (activeTab === "all") return true;
      return txn.status?.toLowerCase() === activeTab;
    })
    .filter((txn) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        txn.reference?.toLowerCase().includes(query) ||
        txn.description?.toLowerCase().includes(query) ||
        txn.amount?.toString().includes(query)
      );
    });

  const getStatusCount = (tab) => {
    if (tab === "all") return transactions.length;
    return transactions.filter((t) => t.status?.toLowerCase() === tab).length;
  };

  const handleViewDetails = async (transaction) => {
    setLoadingDetails(true);
    setShowDetailsModal(true);
    
    // Fetch full transaction details
    const details = await fetchTransactionDetails(transaction.id);
    
    if (details) {
      setSelectedTransaction(details);
    } else {
      // If fetch fails, use the transaction data we already have
      setSelectedTransaction(transaction);
    }
    
    setLoadingDetails(false);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Transactions</h1>
        <p className="text-gray-600 mt-1">
          View your payment history and transaction details
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {["all", "successful", "pending", "failed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({getStatusCount(tab)})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {loading ? (
          <div className="px-6 py-16 text-center bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Loading transactions...
            </h3>
            <p className="text-gray-500 text-sm">
              Please wait while we fetch your transaction history
            </p>
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Failed to load transactions
            </h3>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <button
              onClick={() => fetchTransactions()}
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="px-6 py-16 text-center bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No transactions found
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {searchQuery.trim()
                ? `No transactions match "${searchQuery}"`
                : activeTab === "all"
                ? "You haven't made any transactions yet."
                : `You have no ${activeTab} transactions.`}
            </p>
          </div>
        ) : (
          filteredTransactions.map((txn) => {
            const statusConfig = getStatusConfig(txn.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={txn.id || txn.reference}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 hover:border-gray-300 transition-all cursor-pointer group"
                onClick={() => handleViewDetails(txn)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Transaction Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-gray-700 transition-colors">
                          {txn.description || "Payment"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 font-mono">
                          Ref: {txn.reference}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${statusConfig.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {txn.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 shrink-0 text-gray-400" />
                        <span>{formatDate(txn.createdAt || txn.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-900 font-semibold">
                        <CreditCard className="w-4 h-4 shrink-0 text-gray-400" />
                        <span>{formatCurrency(txn.amount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <button
                      className="flex-1 lg:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Transaction Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
              <button
                onClick={closeDetailsModal}
                className="p-2 hover:bg-gray-200 rounded-md transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {loadingDetails ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading transaction details...</p>
                </div>
              ) : selectedTransaction ? (
                <div className="space-y-8">
                  {/* Status Badge */}
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getStatusConfig(selectedTransaction.status).color.split(' ')[0]}`}>
                       {(() => {
                          const Icon = getStatusConfig(selectedTransaction.status).icon;
                          return <Icon className={`w-8 h-8 ${getStatusConfig(selectedTransaction.status).color.split(' ')[1]}`} />;
                       })()}
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Amount</p>
                      <p className="text-4xl font-bold text-gray-900 tracking-tight">{formatCurrency(selectedTransaction.amount)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusConfig(selectedTransaction.status).color} capitalize`}>
                      {selectedTransaction.status}
                    </span>
                  </div>

                  {/* Transaction Info Grid */}
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Reference</p>
                        <p className="font-mono text-sm text-gray-900">{selectedTransaction.reference}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</p>
                        <p className="text-sm text-gray-900">{formatDate(selectedTransaction.createdAt || selectedTransaction.date)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</p>
                        <p className="text-sm text-gray-900">{selectedTransaction.description || "Payment"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Transaction ID</p>
                        <p className="font-mono text-sm text-gray-900">{selectedTransaction.id}</p>
                      </div>
                      {selectedTransaction.paymentMethod && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Payment Method</p>
                          <p className="text-sm text-gray-900">{selectedTransaction.paymentMethod}</p>
                        </div>
                      )}
                      {selectedTransaction.customerName && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Customer</p>
                          <p className="text-sm text-gray-900">{selectedTransaction.customerName}</p>
                        </div>
                      )}
                      {selectedTransaction.customerEmail && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                          <p className="text-sm text-gray-900">{selectedTransaction.customerEmail}</p>
                        </div>
                      )}
                      {selectedTransaction.notes && (
                        <div className="sm:col-span-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Notes</p>
                          <p className="text-sm text-gray-900">{selectedTransaction.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-600">No transaction details available</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={closeDetailsModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
