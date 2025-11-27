"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  User,
  Package,
  Phone,
  MapPin,
  DollarSign,
} from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useNotifications";

// Mock orders/bookings data
const MOCK_ORDERS = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    customerPhone: "+234 801 234 5678",
    customerEmail: "john.doe@example.com",
    serviceName: "Luxury SUV with Driver",
    serviceType: "Car Rental",
    bookingDate: "2024-12-20",
    bookingTime: "10:00 AM",
    duration: "Full Day",
    guests: 4,
    price: "₦25,000",
    location: "Lagos, Victoria Island",
    status: "pending",
    createdAt: "2024-12-15 09:30 AM",
    specialRequests: "Need child seats for 2 kids",
  },
  {
    id: "ORD-002",
    customerName: "Sarah Smith",
    customerPhone: "+234 802 345 6789",
    customerEmail: "sarah.smith@example.com",
    serviceName: "Beach Resort Package",
    serviceType: "Resort",
    bookingDate: "2024-12-22",
    bookingTime: "2:00 PM",
    duration: "4 Hours",
    guests: 10,
    price: "₦50,000",
    location: "Lekki Beach, Lagos",
    status: "accepted",
    createdAt: "2024-12-14 02:15 PM",
    specialRequests: "Birthday celebration, need decoration",
  },
  {
    id: "ORD-003",
    customerName: "Michael Brown",
    customerPhone: "+234 803 456 7890",
    customerEmail: "michael.brown@example.com",
    serviceName: "Private Chef Service",
    serviceType: "Convenience",
    bookingDate: "2024-12-18",
    bookingTime: "6:00 PM",
    duration: "3 Hours",
    guests: 8,
    price: "₦30,000",
    location: "Ikoyi, Lagos",
    status: "declined",
    createdAt: "2024-12-13 11:45 AM",
    specialRequests: "Vegetarian menu preferred",
    declineReason: "Not available on requested date",
  },
  {
    id: "ORD-004",
    customerName: "Emily Johnson",
    customerPhone: "+234 804 567 8901",
    customerEmail: "emily.johnson@example.com",
    serviceName: "Fine Dining Experience",
    serviceType: "Fine Dining",
    bookingDate: "2024-12-25",
    bookingTime: "7:00 PM",
    duration: "2 Hours",
    guests: 6,
    price: "₦45,000",
    location: "Victoria Island, Lagos",
    status: "completed",
    createdAt: "2024-12-10 03:20 PM",
    specialRequests: "Anniversary dinner, need private table",
  },
  {
    id: "ORD-005",
    customerName: "David Wilson",
    customerPhone: "+234 805 678 9012",
    customerEmail: "david.wilson@example.com",
    serviceName: "Boat Cruise Package",
    serviceType: "Resort",
    bookingDate: "2024-12-21",
    bookingTime: "12:00 PM",
    duration: "6 Hours",
    guests: 15,
    price: "₦75,000",
    location: "Lagos Marina",
    status: "pending",
    createdAt: "2024-12-15 10:00 AM",
    specialRequests: "Corporate team building event",
  },
];

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  accepted: {
    label: "Accepted",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  declined: {
    label: "Declined",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
  completed: {
    label: "Completed",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle,
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const { toasts, addToast, removeToast } = useToast();

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Get status counts
  const getStatusCount = (status) => {
    if (status === "all") return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  // Handle accept booking
  const handleAccept = (order) => {
    setSelectedOrder(order);
    setShowAcceptConfirm(true);
  };

  const confirmAccept = async () => {
    setIsProcessing(true);

    try {
      // TODO: API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: "accepted" } : o
        )
      );

      addToast(`Booking ${selectedOrder.id} accepted successfully!`, "success");
      setShowAcceptConfirm(false);
      setSelectedOrder(null);
    } catch {
      addToast("Failed to accept booking. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle decline booking
  const handleDecline = (order) => {
    setSelectedOrder(order);
    setDeclineReason("");
    setShowDeclineConfirm(true);
  };

  const confirmDecline = async () => {
    if (!declineReason.trim()) {
      addToast("Please provide a reason for declining", "warning");
      return;
    }

    setIsProcessing(true);

    try {
      // TODO: API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? { ...o, status: "declined", declineReason }
            : o
        )
      );

      addToast(`Booking ${selectedOrder.id} declined`, "info");
      setShowDeclineConfirm(false);
      setSelectedOrder(null);
      setDeclineReason("");
    } catch {
      addToast("Failed to decline booking. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // View order details
  const viewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

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

      {/* Accept Confirmation */}
      <ConfirmDialog
        isOpen={showAcceptConfirm}
        onClose={() => !isProcessing && setShowAcceptConfirm(false)}
        onConfirm={confirmAccept}
        title="Accept Booking"
        message={`Are you sure you want to accept booking ${selectedOrder?.id} from ${selectedOrder?.customerName}?`}
        confirmText="Accept"
        cancelText="Cancel"
        type="info"
        isLoading={isProcessing}
      />

      {/* Decline Confirmation */}
      {showDeclineConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Decline Booking
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Please provide a reason for declining booking{" "}
                {selectedOrder?.id}
              </p>

              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
                placeholder="E.g., Not available on requested date, Service fully booked..."
                disabled={isProcessing}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => !isProcessing && setShowDeclineConfirm(false)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDecline}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Decline Booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Booking Details
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Order ID: {selectedOrder.id}
                </p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    STATUS_CONFIG[selectedOrder.status].color
                  }`}
                >
                  {STATUS_CONFIG[selectedOrder.status].label}
                </span>
                <span className="text-sm text-gray-500">
                  Received: {selectedOrder.createdAt}
                </span>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-600" />
                  Customer Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.customerPhone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.customerEmail}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary-600" />
                  Service Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.serviceName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.serviceType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.bookingDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.bookingTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.duration}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.guests} people
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-primary-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary-600" />
                    Total Amount
                  </h4>
                  <span className="text-2xl font-bold text-primary-600">
                    {selectedOrder.price}
                  </span>
                </div>
              </div>

              {/* Special Requests */}
              {selectedOrder.specialRequests && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Special Requests
                  </h4>
                  <p className="text-sm text-gray-700">
                    {selectedOrder.specialRequests}
                  </p>
                </div>
              )}

              {/* Decline Reason */}
              {selectedOrder.status === "declined" &&
                selectedOrder.declineReason && (
                  <div className="bg-red-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Decline Reason
                    </h4>
                    <p className="text-sm text-gray-700">
                      {selectedOrder.declineReason}
                    </p>
                  </div>
                )}

              {/* Actions */}
              {selectedOrder.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleDecline(selectedOrder);
                    }}
                    className="flex-1 px-4 py-3 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleAccept(selectedOrder);
                    }}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Accept Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
        <p className="text-gray-600 mt-1">
          View and manage all incoming booking requests
        </p>
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
                placeholder="Search by customer name, order ID, or service..."
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
              onClick={() => setSelectedStatus("accepted")}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                selectedStatus === "accepted"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Accepted ({getStatusCount("accepted")})
            </button>
            <button
              onClick={() => setSelectedStatus("declined")}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                selectedStatus === "declined"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Declined ({getStatusCount("declined")})
            </button>
            <button
              onClick={() => setSelectedStatus("completed")}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                selectedStatus === "completed"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Completed ({getStatusCount("completed")})
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No bookings found
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? "No bookings match your search criteria"
              : selectedStatus === "all"
              ? "You haven't received any bookings yet"
              : `No ${selectedStatus} bookings`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const StatusIcon = STATUS_CONFIG[order.status].icon;

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Order Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {order.serviceName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Order ID:{" "}
                          <span className="font-medium">{order.id}</span>
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          STATUS_CONFIG[order.status].color
                        }`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {STATUS_CONFIG[order.status].label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4 shrink-0" />
                        <span className="truncate">{order.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>{order.bookingDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>{order.bookingTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-primary-600 font-semibold">
                        <DollarSign className="w-4 h-4 shrink-0" />
                        <span>{order.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      Received: {order.createdAt}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <button
                      onClick={() => viewDetails(order)}
                      className="flex-1 lg:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>

                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAccept(order)}
                          className="flex-1 lg:flex-none px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleDecline(order)}
                          className="flex-1 lg:flex-none px-4 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Decline
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
