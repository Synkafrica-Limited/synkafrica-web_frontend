"use client";

import { useState } from "react";
import { Download, Search, DollarSign, Clock, CheckCircle, Calendar, Eye, Send, AlertCircle, Filter } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useNotifications";

// Mock transactions data
const MOCK_TRANSACTIONS = [
  {
    id: "TXN-001",
    orderId: "ORD-001",
    customerName: "John Doe",
    serviceName: "Luxury SUV with Driver",
    amount: 25000,
    commission: 2500, // 10% platform fee
    netAmount: 22500,
    date: "2024-12-15",
    status: "completed",
    payoutStatus: "pending",
    payoutRequestDate: null,
    lastReminderDate: null,
  },
  {
    id: "TXN-002",
    orderId: "ORD-002",
    customerName: "Sarah Smith",
    serviceName: "Beach Resort Package",
    amount: 50000,
    commission: 5000,
    netAmount: 45000,
    date: "2024-12-14",
    status: "completed",
    payoutStatus: "requested",
    payoutRequestDate: "2024-12-16 10:30 AM",
    lastReminderDate: null,
  },
  {
    id: "TXN-003",
    orderId: "ORD-003",
    customerName: "Emily Johnson",
    serviceName: "Fine Dining Experience",
    amount: 45000,
    commission: 4500,
    netAmount: 40500,
    date: "2024-12-10",
    status: "completed",
    payoutStatus: "paid",
    payoutRequestDate: "2024-12-11 09:00 AM",
    payoutDate: "2024-12-13 02:45 PM",
    lastReminderDate: null,
  },
  {
    id: "TXN-004",
    orderId: "ORD-004",
    customerName: "David Wilson",
    serviceName: "Boat Cruise Package",
    amount: 75000,
    commission: 7500,
    netAmount: 67500,
    date: "2024-12-12",
    status: "completed",
    payoutStatus: "pending",
    payoutRequestDate: null,
    lastReminderDate: null,
  },
  {
    id: "TXN-005",
    orderId: "ORD-005",
    customerName: "Michael Brown",
    serviceName: "Private Chef Service",
    amount: 30000,
    commission: 3000,
    netAmount: 27000,
    date: "2024-12-13",
    status: "pending",
    payoutStatus: "unavailable",
    payoutRequestDate: null,
    lastReminderDate: null,
  },
];

const PAYOUT_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  requested: {
    label: "Requested",
    color: "bg-blue-100 text-blue-700",
    icon: Send,
  },
  paid: {
    label: "Paid",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  unavailable: {
    label: "Unavailable",
    color: "bg-gray-100 text-gray-700",
    icon: AlertCircle,
  },
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
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

  // Calculate summary stats
  const stats = {
    totalEarnings: transactions
      .filter(t => t.status === "completed")
      .reduce((sum, t) => sum + t.netAmount, 0),
    pendingPayouts: transactions
      .filter(t => t.payoutStatus === "pending" || t.payoutStatus === "requested")
      .reduce((sum, t) => sum + t.netAmount, 0),
    paidOut: transactions
      .filter(t => t.payoutStatus === "paid")
      .reduce((sum, t) => sum + t.netAmount, 0),
    availableForPayout: transactions
      .filter(t => t.payoutStatus === "pending")
      .reduce((sum, t) => sum + t.netAmount, 0),
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(txn => {
    const matchesStatus = selectedStatus === "all" || txn.payoutStatus === selectedStatus;
    const matchesSearch = 
      txn.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Time filter
    let matchesTime = true;
    if (timeFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesTime = new Date(txn.date) >= weekAgo;
    } else if (timeFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesTime = new Date(txn.date) >= monthAgo;
    }
    
    return matchesStatus && matchesSearch && matchesTime;
  });

  // Get status counts
  const getStatusCount = (status) => {
    if (status === "all") return transactions.length;
    return transactions.filter(t => t.payoutStatus === status).length;
  };

  // Handle single payout request
  const handlePayoutRequest = (transaction) => {
    setSelectedTransaction(transaction);
    setShowPayoutModal(true);
  };

  const confirmPayoutRequest = async () => {
    setIsProcessing(true);

    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setTransactions(prev =>
        prev.map(t =>
          t.id === selectedTransaction.id
            ? { ...t, payoutStatus: "requested", payoutRequestDate: new Date().toLocaleString() }
            : t
        )
      );

      addToast(
        `Payout request submitted for ${selectedTransaction.id} (₦${selectedTransaction.netAmount.toLocaleString()})`,
        "success"
      );
      setShowPayoutModal(false);
      setSelectedTransaction(null);
    } catch {
      addToast("Failed to submit payout request. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle bulk payout request
  const handleBulkPayoutRequest = () => {
    const eligibleTransactions = transactions.filter(t => t.payoutStatus === "pending");
    if (eligibleTransactions.length === 0) {
      addToast("No transactions available for payout", "warning");
      return;
    }
    setShowBulkPayoutModal(true);
  };

  const confirmBulkPayout = async () => {
    setIsProcessing(true);

    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const eligibleIds = transactions
        .filter(t => t.payoutStatus === "pending")
        .map(t => t.id);

      setTransactions(prev =>
        prev.map(t =>
          eligibleIds.includes(t.id)
            ? { ...t, payoutStatus: "requested", payoutRequestDate: new Date().toLocaleString() }
            : t
        )
      );

      const totalAmount = transactions
        .filter(t => eligibleIds.includes(t.id))
        .reduce((sum, t) => sum + t.netAmount, 0);

      addToast(
        `Bulk payout request submitted for ${eligibleIds.length} transactions (₦${totalAmount.toLocaleString()})`,
        "success"
      );
      setShowBulkPayoutModal(false);
    } catch {
      addToast("Failed to submit bulk payout request. Please try again.", "error");
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
      await new Promise(resolve => setTimeout(resolve, 1000));

      setTransactions(prev =>
        prev.map(t =>
          t.id === selectedTransaction.id
            ? { ...t, lastReminderDate: new Date().toLocaleString() }
            : t
        )
      );

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

  // Format currency
  const formatCurrency = (amount) => `₦${amount.toLocaleString()}`;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
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
        message={`Submit payout request for ${selectedTransaction?.id}? You will receive ${formatCurrency(selectedTransaction?.netAmount || 0)} after processing.`}
        confirmText="Request Payout"
        cancelText="Cancel"
        type="info"
        isLoading={isProcessing}
      />

      {/* Bulk Payout Modal */}
      {showBulkPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
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
                    {transactions.filter(t => t.payoutStatus === "pending").length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-primary-600 text-lg">
                    {formatCurrency(stats.availableForPayout)}
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

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-600 mt-1">Manage your earnings and payout requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Earnings</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats.totalEarnings)}
          </p>
          <p className="text-xs text-gray-500 mt-1">From completed orders</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Available for Payout</span>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats.availableForPayout)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Ready to withdraw</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pending Payouts</span>
            <Send className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats.pendingPayouts)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Under processing</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Paid Out</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats.paidOut)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Successfully transferred</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handleBulkPayoutRequest}
              disabled={stats.availableForPayout === 0}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Request Bulk Payout
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Time Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Period:</span>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer, transaction ID, order ID, or service..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                selectedStatus === "all"
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({getStatusCount("all")})
            </button>
            <button
              onClick={() => setSelectedStatus("pending")}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                selectedStatus === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending ({getStatusCount("pending")})
            </button>
            <button
              onClick={() => setSelectedStatus("requested")}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                selectedStatus === "requested"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Requested ({getStatusCount("requested")})
            </button>
            <button
              onClick={() => setSelectedStatus("paid")}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                selectedStatus === "paid"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Paid ({getStatusCount("paid")})
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <DollarSign className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-600">
            {searchQuery
              ? "No transactions match your search criteria"
              : selectedStatus === "all"
              ? "You haven't received any payments yet"
              : `No ${selectedStatus} transactions`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                  const StatusIcon = PAYOUT_STATUS_CONFIG[txn.payoutStatus].icon;
                  
                  return (
                    <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">{txn.id}</div>
                        <div className="text-xs text-gray-500">Order: {txn.orderId}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{txn.customerName}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {txn.serviceName}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(txn.amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Fee: -{formatCurrency(txn.commission)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-bold text-primary-600">
                          {formatCurrency(txn.netAmount)}
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
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${PAYOUT_STATUS_CONFIG[txn.payoutStatus].color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {PAYOUT_STATUS_CONFIG[txn.payoutStatus].label}
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
      )}

      {/* Summary Footer */}
      {filteredTransactions.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 text-white">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm opacity-90">Filtered Transactions</p>
              <p className="text-2xl font-bold">{filteredTransactions.length}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Total Net Amount</p>
              <p className="text-2xl font-bold">
                {formatCurrency(
                  filteredTransactions.reduce((sum, t) => sum + t.netAmount, 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90">Total Commission</p>
              <p className="text-2xl font-bold">
                {formatCurrency(
                  filteredTransactions.reduce((sum, t) => sum + t.commission, 0)
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
