"use client";

import { useState } from "react";
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  User,
  Package,
  DollarSign,
  MapPin,
  Users,
  CreditCard,
  TrendingUp,
  FileText,
} from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/components/ui/ToastProvider";
import { useVendorBookings } from "@/hooks/business/useVendorBookings";
import bookingsService from "@/services/bookings.service";
import DashboardHeader from '@/components/layout/DashboardHeader';
import FilterTabs from '@/components/ui/FilterTabs';

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: XCircle },
  completed: { label: "Completed", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
};

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const { toasts, addToast, removeToast } = useToast();

  const { bookings, loading, error, refetch } = useVendorBookings({});

  const filteredBookings = bookings.filter((booking) => {
    // Status filter
    const matchesStatus = selectedStatus === "all" || booking.status === selectedStatus;
    
    // Search filter
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      booking.customer?.name?.toLowerCase().includes(query) ||
      booking.id?.toLowerCase().includes(query) ||
      booking.orderId?.toLowerCase().includes(query) ||
      booking.listing?.title?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const getStatusCount = (status) => {
    if (status === "all") return bookings.length;
    return bookings.filter((b) => b.status === status).length;
  };

  const handleAccept = (booking) => {
    setSelectedOrder(booking);
    setShowAcceptConfirm(true);
  };

  const confirmAccept = async () => {
    setIsProcessing(true);
    try {
      await bookingsService.acceptBooking(selectedOrder.id, {
        notes: "Booking accepted by vendor"
      });
      const displayId = selectedOrder.orderId || selectedOrder.id;
      addToast({ message: `Booking ${displayId} accepted successfully!`, type: "success" });
      setShowAcceptConfirm(false);
      setSelectedOrder(null);
      refetch();
    } catch (err) {
      console.error('Accept booking error:', err);
      addToast({ message: err?.message || "Failed to accept booking. Please try again.", type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = (booking) => {
    setSelectedOrder(booking);
    setDeclineReason("");
    setShowDeclineConfirm(true);
  };

  const confirmDecline = async () => {
    if (!declineReason.trim()) {
      addToast({ message: "Please provide a reason for declining", type: "warning" });
      return;
    }
    setIsProcessing(true);
    try {
      await bookingsService.rejectBooking(selectedOrder.id, {
        reason: declineReason,
        notes: "Booking declined by vendor"
      });
      const displayId = selectedOrder.orderId || selectedOrder.id;
      addToast({ message: `Booking ${displayId} declined`, type: "info" });
      setShowDeclineConfirm(false);
      setSelectedOrder(null);
      setDeclineReason("");
      refetch();
    } catch (err) {
      console.error('Reject booking error:', err);
      addToast({ message: err?.message || "Failed to decline booking. Please try again.", type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  const viewDetails = (booking) => {
    setSelectedOrder(booking);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₦0";
    return `₦${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Bookings</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={refetch} className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    revenue: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F6]">
      <DashboardHeader title="Manage Bookings" subtitle="View and manage all incoming booking requests" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-5 mb-6 mt-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Confirmed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.confirmed}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">{formatCurrency(stats.revenue)}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ top: `${1 + index * 5}rem` }}>
          <Toast message={toast.message} type={toast.type} duration={toast.duration} onClose={() => removeToast(toast.id)} />
        </div>
      ))}

      <ConfirmDialog
        isOpen={showAcceptConfirm}
        onClose={() => !isProcessing && setShowAcceptConfirm(false)}
        onConfirm={confirmAccept}
        title="Accept Booking"
        message={`Are you sure you want to accept booking ${selectedOrder?.orderId || selectedOrder?.id} from ${selectedOrder?.customer?.name || 'customer'}?`}
        confirmText="Accept"
        cancelText="Cancel"
        type="info"
        isLoading={isProcessing}
      />

      {showDeclineConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md animate-fadeIn">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Decline Booking</h3>
              <p className="text-sm text-gray-600 mb-4">Please provide a reason for declining booking {selectedOrder?.orderId || selectedOrder?.id}</p>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
                placeholder="E.g., Not available on requested date, Service fully booked..."
                disabled={isProcessing}
              />
              <div className="flex gap-3">
                <button onClick={() => !isProcessing && setShowDeclineConfirm(false)} disabled={isProcessing} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50">Cancel</button>
                <button onClick={confirmDecline} disabled={isProcessing} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50">{isProcessing ? "Processing..." : "Decline Booking"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
                <p className="text-sm text-gray-600 mt-1">Order ID: {selectedOrder.orderId || selectedOrder.id}</p>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600 p-2"><XCircle className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${STATUS_CONFIG[selectedOrder.status]?.color || 'bg-gray-100 text-gray-700'}`}>{STATUS_CONFIG[selectedOrder.status]?.label || selectedOrder.status}</span>
                <span className="text-sm text-gray-500">Created: {formatDate(selectedOrder.createdAt)}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><User className="w-5 h-5 text-primary-600" />Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Name:</span><span className="font-medium text-gray-900">{selectedOrder.customer?.name || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Email:</span><span className="font-medium text-gray-900">{selectedOrder.customer?.email || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Phone:</span><span className="font-medium text-gray-900">{selectedOrder.customer?.phone || 'N/A'}</span></div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Package className="w-5 h-5 text-primary-600" />Service Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Service:</span><span className="font-medium text-gray-900">{selectedOrder.listing?.title || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Start Date:</span><span className="font-medium text-gray-900">{formatDate(selectedOrder.startDate)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">End Date:</span><span className="font-medium text-gray-900">{formatDate(selectedOrder.endDate)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Duration:</span><span className="font-medium text-gray-900">{selectedOrder.duration || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Guests:</span><span className="font-medium text-gray-900">{selectedOrder.guests || 'N/A'}</span></div>
                  {selectedOrder.pickupLocation && (
                    <div className="flex justify-between"><span className="text-gray-600">Location:</span><span className="font-medium text-gray-900">{selectedOrder.pickupLocation}</span></div>
                  )}
                </div>
              </div>
              <div className="bg-primary-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2"><DollarSign className="w-5 h-5 text-primary-600" />Payment Details</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedOrder.isPaid 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    <CreditCard className="w-3 h-3 inline mr-1" />
                    {selectedOrder.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Amount</span>
                  <span className="text-2xl font-bold text-primary-600">{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
              </div>
              {selectedOrder.specialRequests && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Special Requests</h4>
                  <p className="text-sm text-gray-700">{selectedOrder.specialRequests}</p>
                </div>
              )}
              {selectedOrder.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button onClick={() => { setShowDetailsModal(false); handleDecline(selectedOrder); }} className="flex-1 px-4 py-3 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors">Decline</button>
                  <button onClick={() => { setShowDetailsModal(false); handleAccept(selectedOrder); }} className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">Accept Booking</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border mx-5 border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by customer name, order ID, or service..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
          </div>
          <FilterTabs
            tabs={[
              { id: "all", label: "All", count: getStatusCount("all") },
              { id: "pending", label: "Pending", count: getStatusCount("pending") },
              { id: "confirmed", label: "Confirmed", count: getStatusCount("confirmed") },
              { id: "cancelled", label: "Cancelled", count: getStatusCount("cancelled") },
              { id: "completed", label: "Completed", count: getStatusCount("completed") },
            ]}
            activeTab={selectedStatus}
            onTabChange={setSelectedStatus}
            layout="wrap"
          />
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 mx-5 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">{searchQuery ? "No bookings match your search criteria" : selectedStatus === "all" ? "You haven't received any bookings yet" : `No ${selectedStatus} bookings`}</p>
        </div>
      ) : (
        <div className="space-y-4 mx-5">
          {filteredBookings.map((booking) => {
            const StatusIcon = STATUS_CONFIG[booking.status]?.icon || Clock;
            return (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-200">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{booking.listing?.title || 'Service'}</h3>
                        <p className="text-sm text-gray-600 mt-1">Order ID: <span className="font-medium">{booking.orderId || booking.id}</span></p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${STATUS_CONFIG[booking.status]?.color || 'bg-gray-100 text-gray-700'}`}><StatusIcon className="w-3 h-3" />{STATUS_CONFIG[booking.status]?.label || booking.status}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4 shrink-0 text-gray-400" />
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Customer</span>
                          <span className="font-medium text-gray-900 truncate">{booking.customer?.name || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 shrink-0 text-gray-400" />
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Start Date</span>
                          <span className="font-medium text-gray-900">{formatDate(booking.startDate)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 shrink-0 text-gray-400" />
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Duration</span>
                          <span className="font-medium text-gray-900">{booking.duration || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4 shrink-0 text-gray-400" />
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Guests</span>
                          <span className="font-medium text-gray-900">{booking.guests || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 shrink-0 text-primary-500" />
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Amount</span>
                          <span className="font-bold text-primary-600">{formatCurrency(booking.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>Created: {formatDate(booking.createdAt)}</span>
                      </div>
                      {booking.isPaid !== undefined && (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          booking.isPaid 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {booking.isPaid ? '✓ Paid' : 'Unpaid'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex lg:flex-col gap-2 lg:min-w-[140px]">
                    <button 
                      onClick={() => viewDetails(booking)} 
                      className="flex-1 lg:flex-none px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all text-sm flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">View Details</span>
                      <span className="sm:hidden">View</span>
                    </button>
                    {booking.status === "pending" && (
                      <>
                        <button 
                          onClick={() => handleAccept(booking)} 
                          className="flex-1 lg:flex-none px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 hover:shadow-md transition-all text-sm flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Accept</span>
                        </button>
                        <button 
                          onClick={() => handleDecline(booking)} 
                          className="flex-1 lg:flex-none px-4 py-2.5 border-2 border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 hover:border-red-400 transition-all text-sm flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Decline</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}