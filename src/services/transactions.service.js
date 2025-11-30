import { api } from '../lib/fetchClient';

class TransactionsService {
  /**
   * Get vendor transactions with filters
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status (PENDING, COMPLETED, FAILED, REFUNDED)
   * @param {string} params.payoutStatus - Filter by payout status (PENDING, REQUESTED, APPROVED, PROCESSING, PAID, REJECTED)
   * @param {string} params.startDate - Filter by start date (ISO string)
   * @param {string} params.endDate - Filter by end date (ISO string)
   * @param {number} params.skip - Pagination skip
   * @param {number} params.take - Pagination take
   */
  async getVendorTransactions(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.payoutStatus) queryParams.append('payoutStatus', params.payoutStatus);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.skip !== undefined) queryParams.append('skip', params.skip);
    if (params.take !== undefined) queryParams.append('take', params.take);

    const queryString = queryParams.toString();
    const url = `/api/transactions/vendor/my-transactions${queryString ? `?${queryString}` : ''}`;
    
    return await api.get(url, { auth: true });
  }

  /**
   * Get vendor transaction statistics
   * Returns: { totalEarnings, availableForPayout, pendingPayouts, paidOut, transactionCount }
   */
  async getVendorStats() {
    return await api.get('/api/transactions/vendor/stats', { auth: true });
  }

  /**
   * Get single transaction details
   * @param {string} transactionId - Transaction ID
   */
  async getTransaction(transactionId) {
    return await api.get(`/api/transactions/${transactionId}`, { auth: true });
  }

  /**
   * Request payout for selected transactions
   * @param {Object} data - Payout request data
   * @param {string[]} data.transactionIds - Array of transaction IDs (optional, if empty requests all eligible)
   * @param {string} data.bankAccountNumber - Bank account number (optional)
   * @param {string} data.bankName - Bank name (optional)
   * @param {string} data.accountName - Account name (optional)
   */
  async requestPayout(data = {}) {
    return await api.post('/api/transactions/vendor/request-payout', data, { auth: true });
  }

  /**
   * Get vendor notifications
   * @param {Object} params - Query parameters
   * @param {boolean} params.unreadOnly - Get only unread notifications
   */
  async getNotifications(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.unreadOnly) queryParams.append('unreadOnly', 'true');
    queryParams.append('vendor', 'true');

    const queryString = queryParams.toString();
    const url = `/api/notifications${queryString ? `?${queryString}` : ''}`;
    
    return await api.get(url, { auth: true });
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   */
  async markNotificationAsRead(notificationId) {
    return await api.patch(`/api/notifications/${notificationId}/read`, {}, { auth: true });
  }

  /**
   * Calculate total amount from selected transactions
   * @param {Array} transactions - Array of transaction objects
   * @returns {number} Total vendor amount
   */
  calculateTotalAmount(transactions) {
    return transactions.reduce((sum, t) => sum + (t.vendorAmount || t.amount || 0), 0);
  }

  /**
   * Check if transaction is eligible for payout
   * @param {Object} transaction - Transaction object
   * @returns {boolean} True if eligible
   */
  isEligibleForPayout(transaction) {
    return (
      transaction.status === 'COMPLETED' &&
      transaction.payoutStatus === 'PENDING'
    );
  }

  /**
   * Filter eligible transactions from a list
   * @param {Array} transactions - Array of transaction objects
   * @returns {Array} Filtered eligible transactions
   */
  getEligibleTransactions(transactions) {
    return transactions.filter(t => this.isEligibleForPayout(t));
  }

  /**
   * Get payout status badge configuration
   * @param {string} status - Payout status
   * @returns {Object} Badge configuration
   */
  getPayoutStatusConfig(status) {
    const configs = {
      PENDING: {
        label: 'Pending',
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: 'Clock',
      },
      REQUESTED: {
        label: 'Requested',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: 'AlertCircle',
      },
      APPROVED: {
        label: 'Approved',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: 'CheckCircle',
      },
      PROCESSING: {
        label: 'Processing',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: 'Loader2',
      },
      PAID: {
        label: 'Paid',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: 'CheckCircle',
      },
      REJECTED: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: 'XCircle',
      },
    };

    return configs[status] || configs.PENDING;
  }

  /**
   * Get transaction status badge configuration
   * @param {string} status - Transaction status
   * @returns {Object} Badge configuration
   */
  getTransactionStatusConfig(status) {
    const configs = {
      PENDING: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: 'Clock',
      },
      COMPLETED: {
        label: 'Completed',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: 'CheckCircle',
      },
      FAILED: {
        label: 'Failed',
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: 'XCircle',
      },
      REFUNDED: {
        label: 'Refunded',
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: 'RotateCcw',
      },
    };

    return configs[status] || configs.PENDING;
  }

  /**
   * Format currency for display
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code (default: NGN)
   * @returns {string} Formatted currency string
   */
  formatCurrency(amount, currency = 'NGN') {
    if (!amount) return '₦0';
    
    const symbols = {
      NGN: '₦',
      USD: '$',
      EUR: '€',
      GBP: '£',
    };

    const symbol = symbols[currency] || currency;
    return `${symbol}${amount.toLocaleString()}`;
  }

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Format date and time for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date and time
   */
  formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

// Create and export singleton instance
const transactionsService = new TransactionsService();

export default transactionsService;
