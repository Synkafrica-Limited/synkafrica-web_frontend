"use client";

import { useState } from "react";
import authService from '@/services/authService';
import {
  Download,
  Search,
  DollarSign,
  Clock,
  CheckCircle,
  Calendar,
  Eye,
  Send,
  AlertCircle,
  Filter,
} from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/components/ui/ToastProvider";
import FilterBar from "@/components/ui/FilterBar";
import { useVendorTransactions } from "@/hooks/business/useVendorTransactions";
import { useBusiness } from '@/context/BusinessContext';
import transactionsService from "@/services/transactions.service";
import { PageLoadingScreen } from "@/components/ui/LoadingScreen";
import DashboardHeader from '@/components/layout/DashboardHeader';

const PAYOUT_STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  REQUESTED: {
    label: "Requested",
    color: "bg-blue-100 text-blue-700",
    icon: Send,
  },
  APPROVED: {
    label: "Approved",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle,
  },
  PROCESSING: {
    label: "Processing",
    color: "bg-purple-100 text-purple-700",
    icon: Clock,
  },
  PAID: {
    label: "Paid",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
  },
};

export default function TransactionsPage() {
  const token = typeof window !== "undefined" ? authService.getAccessToken() : null;
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showBulkPayoutModal, setShowBulkPayoutModal] = useState(false);
  const [showReminderConfirm, setShowReminderConfirm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeFilter, setTimeFilter] = useState("all"); // all, week, month
  const { toasts, addToast, removeToast } = useToast();

  // Get businessId from context
  const { business: ctxBusiness } = useBusiness();
  const businessId = ctxBusiness?.id || ctxBusiness?._id || ctxBusiness?.businessId;

  // Use the vendor transactions hook with backend-compliant parameters
  const {
    transactions,
    stats,
    loading,
    error,
    refetch
  } = useVendorTransactions(token, {
    businessId,
    status: selectedStatus !== "all" ? selectedStatus.toUpperCase() : undefined,
    dateRange: timeFilter !== "all" ? timeFilter : undefined
  });

  // Normalize status helper (must be declared before use)
  const normalizeStatus = (s) => (s || '').toString().toLowerCase();

  // Filter transactions (backend handles most filtering, this is for local search only)
  const filteredTransactions = transactions.filter((txn) => {
    const matchesStatus =
      selectedStatus === "all" || normalizeStatus(txn.payoutStatus) === normalizeStatus(selectedStatus);
    const matchesSearch =
      (txn.customerName || txn.customer?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (txn.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (txn.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (txn.serviceName || txn.booking?.listingTitle || '').toLowerCase().includes(searchQuery.toLowerCase());

    // Time filter
    let matchesTime = true;
    if (timeFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesTime = new Date(txn.date || txn.createdAt) >= weekAgo;
    } else if (timeFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesTime = new Date(txn.date || txn.createdAt) >= monthAgo;
    }

    return matchesStatus && matchesSearch && matchesTime;
  });

  // Derive stats from the filtered transactions so we reflect business-scoped values
  const derived = (() => {
    const sumBy = (arr, fn) => arr.reduce((acc, item) => acc + (Number(fn(item)) || 0), 0);

    if (!filteredTransactions || filteredTransactions.length === 0) {
      return {
        totalEarnings: 0,
        availableForPayout: 0,
        pendingPayouts: 0,
        paidOut: 0,
        transactionCount: 0,
        completedTransactions: 0,
      };
    }

    const totalEarnings = sumBy(filteredTransactions, (t) => t.vendorAmount ?? t.netAmount ?? t.amount);
    const availableForPayout = sumBy(
      filteredTransactions.filter((t) => normalizeStatus(t.payoutStatus) === 'pending'),
      (t) => t.vendorAmount ?? t.netAmount ?? t.amount
    );
    const pendingPayouts = sumBy(
      filteredTransactions.filter((t) => ['requested', 'approved', 'processing'].includes(normalizeStatus(t.payoutStatus))),
      (t) => t.vendorAmount ?? t.netAmount ?? t.amount
    );
    const paidOut = sumBy(
      filteredTransactions.filter((t) => normalizeStatus(t.payoutStatus) === 'paid'),
      (t) => t.vendorAmount ?? t.netAmount ?? t.amount
    );

    return {
      totalEarnings,
      availableForPayout,
      pendingPayouts,
      paidOut,
      transactionCount: filteredTransactions.length,
      completedTransactions: filteredTransactions.filter((t) => normalizeStatus(t.status) === 'completed' || normalizeStatus(t.transactionStatus) === 'completed').length,
    };
  })();

  // Debug log derived vs API stats for easier verification during development
  if (process.env.NODE_ENV === 'development') {
    console.debug('[TransactionsPage] derived stats:', derived, 'api stats:', stats);
  }

  // Get status counts
  const getStatusCount = (status) => {
    if (status === "all") return transactions.length;
    return transactions.filter((t) => t.payoutStatus === status).length;
  };

  // Handle single payout request
  const handlePayoutRequest = (transaction) => {
    setSelectedTransaction(transaction);
    setShowPayoutModal(true);
  };

  const confirmPayoutRequest = async () => {
    setIsProcessing(true);

    try {
      await transactionsService.requestPayout({ transactionIds: [selectedTransaction.id] });

      addToast(
        `Payout request submitted for ${selectedTransaction.id} (${formatCurrency(selectedTransaction?.netAmount || 0, selectedTransaction?.currency || stats?.currency || 'NGN')})`,
        "success"
      );
      setShowPayoutModal(false);
      setSelectedTransaction(null);
      refetch(); // Refresh the transactions list
    } catch (err) {
      addToast(err?.message || "Failed to submit payout request. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle bulk payout request
  const handleBulkPayoutRequest = () => {
    const eligibleTransactions = transactions.filter(
      (t) => t.payoutStatus === "pending"
    );
    if (eligibleTransactions.length === 0) {
      addToast("No transactions available for payout", "warning");
      return;
    }
    setShowBulkPayoutModal(true);
  };

  const confirmBulkPayout = async () => {
    setIsProcessing(true);

    try {
      const eligibleTransactions = transactions.filter(
        (t) => t.payoutStatus === "pending"
      );
      const transactionIds = eligibleTransactions.map((t) => t.id);

      await transactionsService.requestPayout({ transactionIds });

      const totalAmount = eligibleTransactions.reduce((sum, t) => sum + (t.netAmount || 0), 0);

      addToast(
        `Bulk payout request submitted for ${transactionIds.length} transactions (${formatCurrency(totalAmount, statsCurrency)})`,
        "success"
      );
      setShowBulkPayoutModal(false);
      refetch(); // Refresh the transactions list
    } catch (err) {
      addToast(
        err?.message || "Failed to submit bulk payout request. Please try again.",
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle send reminder
  const handleSendReminder = (transaction) => {
    setSelectedTransaction(transaction);
    setShowReminderConfirm(true);
  };

  const confirmSendReminder = async () => {
    setIsProcessing(true);

    try {
      // TODO: API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Optimistic update (in a real app, this would be handled by refetch or state update from API)
      // Since we don't have a setTransactions here (it comes from hook), we just refetch
      refetch();

      addToast(
        `Reminder sent to payment team for ${selectedTransaction.id}`,
        "success"
      );
      setShowReminderConfirm(false);
      setSelectedTransaction(null);
    } catch {
      addToast("Failed to send reminder. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Format currency safely — handle undefined/null and non-numeric values
  const currencySymbol = (code) => {
    if (!code) return '₦';
    const map = { NGN: '₦', USD: '$', EUR: '€' };
    return map[code.toUpperCase()] || code;
  };

  const formatCurrency = (amount, code = 'NGN') => {
    const n = Number(amount);
    if (!Number.isFinite(n)) return `${currencySymbol(code)}0`;
    return `${currencySymbol(code)}${n.toLocaleString()}`;
  };

  // Display stats: prefer derived business-scoped stats, fall back to API stats
  const displayStats = {
    totalEarnings: derived?.totalEarnings ?? stats?.totalEarnings ?? 0,
    availableForPayout: derived?.availableForPayout ?? stats?.availableForPayout ?? 0,
    pendingPayouts: derived?.pendingPayouts ?? stats?.pendingPayouts ?? 0,
    paidOut: derived?.paidOut ?? stats?.paidOut ?? 0,
    transactionCount: derived?.transactionCount ?? stats?.transactionCount ?? 0,
    completedTransactions: derived?.completedTransactions ?? stats?.completedTransactions ?? 0,
  };
  const statsCurrency = stats?.currency || (filteredTransactions[0]?.currency) || 'NGN';

  // Show loading state
  if (loading) {
    return <PageLoadingScreen message="Loading your transactions..." />;
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Transactions</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F6]">
      <div className="flex-1 flex flex-col w-full h-full max-w-full justify-center">
        <DashboardHeader
          title="Manage Transactions"
          subtitle="Manage your earnings and payout requests"
        />
        <section className="flex-1 flex flex-col gap-6 py-6 px-2 sm:px-4 md:px-8 lg:px-16">


          {/* Toast Notifications */}
          {toasts.map((toast, index) => (
            <div key={toast.id} style={{ top: `${1 + index * 5}rem` }}>
              <Toast
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                onClose={() => removeToast(toast.id)}
              />
            </div>
          ))}

          {/* Payout Request Modal */}
          <ConfirmDialog
            isOpen={showPayoutModal}
            onClose={() => !isProcessing && setShowPayoutModal(false)}
            onConfirm={confirmPayoutRequest}
            title="Request Payout"
            message={`Submit payout request for ${selectedTransaction?.id}? You will receive ${formatCurrency(selectedTransaction?.netAmount || 0, selectedTransaction?.currency || statsCurrency)} after processing.`}
            confirmText="Request Payout"
            cancelText="Cancel"
            type="info"
            isLoading={isProcessing}
          />

          {/* Bulk Payout Modal */}
          {showBulkPayoutModal && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
              <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md animate-fadeIn">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Request Bulk Payout
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Submit payout request for all pending transactions?
                  </p>

                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Transactions:</span>
                      <span className="font-semibold text-gray-900">
                        {
                          transactions.filter((t) => t.payoutStatus === "pending")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-primary-600 text-lg">
                        {formatCurrency(displayStats.availableForPayout, statsCurrency)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => !isProcessing && setShowBulkPayoutModal(false)}
                      disabled={isProcessing}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmBulkPayout}
                      disabled={isProcessing}
                      className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? "Processing..." : "Request Payout"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reminder Confirmation */}
          <ConfirmDialog
            isOpen={showReminderConfirm}
            onClose={() => !isProcessing && setShowReminderConfirm(false)}
            onConfirm={confirmSendReminder}
            title="Send Reminder"
            message={`Send a reminder to the payment team about ${selectedTransaction?.id}?`}
            confirmText="Send Reminder"
            cancelText="Cancel"
            type="warning"
            isLoading={isProcessing}
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Earnings</span>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(displayStats.totalEarnings, statsCurrency)}
              </p>
              <p className="text-xs text-gray-500 mt-1">From completed orders</p>
              <p className="text-xs text-gray-500 mt-1">{displayStats.completedTransactions} completed</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Available for Payout</span>
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(displayStats.availableForPayout, statsCurrency)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Ready to withdraw</p>
              <p className="text-xs text-gray-500 mt-1">{displayStats.transactionCount} transactions</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Pending Payouts</span>
                <Send className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(displayStats.pendingPayouts, statsCurrency)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Under processing</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Paid Out</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(displayStats.paidOut, statsCurrency)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Successfully transferred</p>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex gap-2">
              <button
                onClick={handleBulkPayoutRequest}
                disabled={displayStats.availableForPayout === 0}
                className="flex-1 sm:flex-none px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Request Bulk Payout</span>
                <span className="sm:hidden">Bulk Payout</span>
              </button>
              <button className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by customer, ID..."
            filters={[
              {
                value: "all",
                label: "All",
                count: getStatusCount("all"),
                activeClass: "bg-primary-500 text-white",
                inactiveClass: "bg-gray-100 text-gray-700 hover:bg-gray-200"
              },
              {
                value: "PENDING",
                label: "Pending",
                count: getStatusCount("PENDING"),
                activeClass: "bg-yellow-500 text-white",
                inactiveClass: "bg-gray-100 text-gray-700 hover:bg-gray-200"
              },
              {
                value: "REQUESTED",
                label: "Requested",
                count: getStatusCount("REQUESTED"),
                activeClass: "bg-blue-500 text-white",
                inactiveClass: "bg-gray-100 text-gray-700 hover:bg-gray-200"
              },
              {
                value: "PAID",
                label: "Paid",
                count: getStatusCount("PAID"),
                activeClass: "bg-green-500 text-white",
                inactiveClass: "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            ]}
            activeFilter={selectedStatus}
            onFilterChange={setSelectedStatus}
            dropdownFilters={[
              {
                label: "Period",
                value: timeFilter,
                onChange: setTimeFilter,
                options: [
                  { value: "all", label: "All Time" },
                  { value: "week", label: "Last 7 Days" },
                  { value: "month", label: "Last 30 Days" }
                ]
              }
            ]}
            className="mb-6"
          />

          {/* Transactions List */}
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <DollarSign className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No transactions found
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? "No transactions match your search criteria"
                  : selectedStatus === "all"
                    ? "You haven't received any payments yet"
                    : `No ${selectedStatus} transactions`}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="space-y-4 sm:hidden">
                {filteredTransactions.map((txn) => {
                  const payoutConfig = PAYOUT_STATUS_CONFIG[txn.payoutStatus] || PAYOUT_STATUS_CONFIG.unavailable;
                  const StatusIcon = payoutConfig.icon || AlertCircle;

                  return (
                    <div key={txn.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-sm font-medium text-gray-900">#{txn.id}</span>
                          <div className="text-xs text-gray-500">{txn.date}</div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${payoutConfig.color || 'bg-gray-100 text-gray-700'}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {payoutConfig.label || 'Unavailable'}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4 border-t border-gray-100 pt-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Customer</span>
                          <span className="font-medium">{txn.customerName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Service</span>
                          <span className="font-medium truncate max-w-[150px]">{txn.serviceName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Amount</span>
                          <span className="font-medium">{formatCurrency(txn.amount, txn.currency || statsCurrency)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Net Amount</span>
                          <span className="font-bold text-primary-600">{formatCurrency(txn.netAmount, txn.currency || statsCurrency)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {txn.payoutStatus === "pending" && (
                          <button
                            onClick={() => handlePayoutRequest(txn)}
                            className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                          >
                            Request Payout
                          </button>
                        )}
                        {txn.payoutStatus === "requested" && (
                          <button
                            onClick={() => handleSendReminder(txn)}
                            className="flex-1 px-3 py-2 border border-orange-300 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors flex items-center justify-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            Reminder
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Transaction
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Net Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredTransactions.map((txn) => {
                        const payoutConfig = PAYOUT_STATUS_CONFIG[txn.payoutStatus] || PAYOUT_STATUS_CONFIG.unavailable;
                        const StatusIcon = payoutConfig.icon || AlertCircle;

                        return (
                          <tr
                            key={txn.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {txn.id}
                              </div>
                              <div className="text-xs text-gray-500">
                                Order: {txn.orderId}
                              </div>
                              {process.env.NODE_ENV === 'development' && (
                                <div className="text-xxs text-gray-400 mt-1">
                                  bizId: <span className="font-mono">{txn.businessId || txn.business?.id || '—'}</span>
                                  {txn.business?.businessName && (
                                    <span> — {txn.business.businessName}</span>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">
                                {txn.customerName}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900 max-w-xs truncate">
                                {txn.serviceName}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(txn.amount, txn.currency || statsCurrency)}
                              </div>
                              <div className="text-xs text-gray-500">
                                Fee: -{formatCurrency(txn.commission, txn.currency || statsCurrency)}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm font-bold text-primary-600">
                                {formatCurrency(txn.netAmount, txn.currency || statsCurrency)}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">{txn.date}</div>
                              {txn.payoutRequestDate && (
                                <div className="text-xs text-blue-600 mt-1">
                                  Requested: {txn.payoutRequestDate}
                                </div>
                              )}
                              {txn.payoutDate && (
                                <div className="text-xs text-green-600 mt-1">
                                  Paid: {txn.payoutDate}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${payoutConfig.color || 'bg-gray-100 text-gray-700'}`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                {payoutConfig.label || 'Unavailable'}
                              </span>
                              {txn.lastReminderDate && (
                                <div className="text-xs text-gray-500 mt-2">
                                  Reminder: {txn.lastReminderDate}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-2">
                                {txn.payoutStatus === "pending" && (
                                  <button
                                    onClick={() => handlePayoutRequest(txn)}
                                    className="px-3 py-1 bg-primary-600 text-white rounded text-xs font-medium hover:bg-primary-700 transition-colors"
                                  >
                                    Request Payout
                                  </button>
                                )}
                                {txn.payoutStatus === "requested" && (
                                  <button
                                    onClick={() => handleSendReminder(txn)}
                                    className="px-3 py-1 border border-orange-300 text-orange-700 rounded text-xs font-medium hover:bg-orange-50 transition-colors flex items-center justify-center gap-1"
                                  >
                                    <Send className="w-3 h-3" />
                                    Send Reminder
                                  </button>
                                )}
                                {txn.payoutStatus === "paid" && (
                                  <span className="text-xs text-gray-500 text-center">
                                    No actions
                                  </span>
                                )}
                                {txn.payoutStatus === "unavailable" && (
                                  <span className="text-xs text-gray-500 text-center">
                                    Order pending
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Summary Footer */}
          {filteredTransactions.length > 0 && (
            <div className="mt-6 bg-linear-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 text-white">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm opacity-90">Filtered Transactions</p>
                  <p className="text-2xl font-bold">
                    {filteredTransactions.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Total Net Amount</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      filteredTransactions.reduce((sum, t) => sum + (t.netAmount || 0), 0),
                      statsCurrency
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Total Commission</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      filteredTransactions.reduce((sum, t) => sum + (t.commission || 0), 0),
                      statsCurrency
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
