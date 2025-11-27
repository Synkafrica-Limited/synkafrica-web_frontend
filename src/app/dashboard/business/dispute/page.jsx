"use client";

import { useState } from "react";
import {
  AlertCircle,
  Star,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  Plus,
  User,
  DollarSign,
  Package,
  Flag,
  Calendar,
  ChevronDown,
  Send,
} from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useNotifications";

// Mock disputes data
const MOCK_DISPUTES = [
  {
    id: "DIS-001",
    type: "customer_complaint",
    orderId: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    subject: "Service not as described",
    description:
      "The car provided was not the luxury SUV shown in the listing. It was an older model with visible damage.",
    rating: 2,
    createdAt: "2024-12-14 10:30 AM",
    status: "open",
    priority: "high",
    response: null,
    responseDate: null,
  },
  {
    id: "DIS-002",
    type: "review",
    orderId: "ORD-002",
    customerName: "Sarah Smith",
    customerEmail: "sarah@example.com",
    subject: "Great service!",
    description:
      "Amazing beach resort experience. The staff was friendly and the facilities were top-notch. Highly recommend!",
    rating: 5,
    createdAt: "2024-12-13 02:15 PM",
    status: "resolved",
    priority: "low",
    response:
      "Thank you for your kind words! We're glad you enjoyed your stay.",
    responseDate: "2024-12-13 04:30 PM",
  },
  {
    id: "DIS-003",
    type: "payment_issue",
    orderId: "ORD-003",
    customerName: "Emily Johnson",
    customerEmail: "emily@example.com",
    subject: "Double charged",
    description:
      "I was charged twice for my dining reservation. Please refund one of the charges.",
    rating: null,
    createdAt: "2024-12-12 09:00 AM",
    status: "in_progress",
    priority: "high",
    response: "We're investigating this issue with our payment team.",
    responseDate: "2024-12-12 11:20 AM",
  },
  {
    id: "DIS-004",
    type: "review",
    orderId: "ORD-004",
    customerName: "Michael Brown",
    customerEmail: "michael@example.com",
    subject: "Average experience",
    description:
      "The service was okay but not exceptional. The wait time was longer than expected.",
    rating: 3,
    createdAt: "2024-12-11 05:45 PM",
    status: "open",
    priority: "medium",
    response: null,
    responseDate: null,
  },
];

const DISPUTE_TYPES = {
  customer_complaint: {
    label: "Customer Complaint",
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
  },
  review: {
    label: "Review/Rating",
    color: "bg-blue-100 text-blue-700",
    icon: Star,
  },
  payment_issue: {
    label: "Payment Issue",
    color: "bg-orange-100 text-orange-700",
    icon: DollarSign,
  },
  service_issue: {
    label: "Service Issue",
    color: "bg-purple-100 text-purple-700",
    icon: Package,
  },
};

const STATUS_CONFIG = {
  open: { label: "Open", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-700",
    icon: MessageSquare,
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  closed: {
    label: "Closed",
    color: "bg-gray-100 text-gray-700",
    icon: XCircle,
  },
};

const PRIORITY_CONFIG = {
  low: { label: "Low", color: "text-gray-600" },
  medium: { label: "Medium", color: "text-yellow-600" },
  high: { label: "High", color: "text-red-600" },
};

export default function DisputePage() {
  const [disputes, setDisputes] = useState(MOCK_DISPUTES);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRaiseDisputeModal, setShowRaiseDisputeModal] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  // Raise dispute form state
  const [newDispute, setNewDispute] = useState({
    type: "customer_complaint",
    subject: "",
    orderId: "",
    customerName: "",
    customerEmail: "",
    description: "",
    priority: "medium",
  });

  // Response form state
  const [responseText, setResponseText] = useState("");

  // Filter disputes
  const filteredDisputes = disputes.filter((dispute) => {
    const matchesType = selectedType === "all" || dispute.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || dispute.status === selectedStatus;
    const matchesSearch =
      dispute.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  // Get counts
  const getTypeCount = (type) => {
    if (type === "all") return disputes.length;
    return disputes.filter((d) => d.type === type).length;
  };

  const getStatusCount = (status) => {
    if (status === "all") return disputes.length;
    return disputes.filter((d) => d.status === status).length;
  };

  // Calculate stats
  const stats = {
    total: disputes.length,
    open: disputes.filter((d) => d.status === "open").length,
    inProgress: disputes.filter((d) => d.status === "in_progress").length,
    resolved: disputes.filter((d) => d.status === "resolved").length,
    avgRating:
      disputes.filter((d) => d.rating).length > 0
        ? (
            disputes
              .filter((d) => d.rating)
              .reduce((sum, d) => sum + d.rating, 0) /
            disputes.filter((d) => d.rating).length
          ).toFixed(1)
        : "N/A",
  };

  // View details
  const viewDetails = (dispute) => {
    setSelectedDispute(dispute);
    setResponseText(dispute.response || "");
    setShowDetailsModal(true);
  };

  // Submit response
  const handleSubmitResponse = async () => {
    if (!responseText.trim()) {
      addToast("Please enter a response", "warning");
      return;
    }

    setIsProcessing(true);

    try {
      // TODO: API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setDisputes((prev) =>
        prev.map((d) =>
          d.id === selectedDispute.id
            ? {
                ...d,
                response: responseText,
                responseDate: new Date().toLocaleString(),
                status: "in_progress",
              }
            : d
        )
      );

      addToast("Response submitted successfully", "success");
      setShowDetailsModal(false);
      setResponseText("");
    } catch {
      addToast("Failed to submit response. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Resolve dispute
  const handleResolveDispute = async (disputeId) => {
    setIsProcessing(true);

    try {
      // TODO: API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDisputes((prev) =>
        prev.map((d) => (d.id === disputeId ? { ...d, status: "resolved" } : d))
      );

      addToast("Dispute marked as resolved", "success");
      setShowDetailsModal(false);
    } catch {
      addToast("Failed to resolve dispute. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Raise new dispute
  const handleRaiseDispute = async (e) => {
    e.preventDefault();

    if (!newDispute.subject || !newDispute.description) {
      addToast("Please fill in all required fields", "warning");
      return;
    }

    setIsProcessing(true);

    try {
      // TODO: API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const dispute = {
        id: `DIS-${String(disputes.length + 1).padStart(3, "0")}`,
        ...newDispute,
        rating: null,
        createdAt: new Date().toLocaleString(),
        status: "open",
        response: null,
        responseDate: null,
      };

      setDisputes((prev) => [dispute, ...prev]);

      addToast("Dispute raised successfully", "success");
      setShowRaiseDisputeModal(false);
      setNewDispute({
        type: "customer_complaint",
        subject: "",
        orderId: "",
        customerName: "",
        customerEmail: "",
        description: "",
        priority: "medium",
      });
    } catch {
      addToast("Failed to raise dispute. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Render stars
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
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

      {/* Details Modal */}
      {showDetailsModal && selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedDispute.id}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedDispute.subject}
                </p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status and Type */}
              <div className="flex flex-wrap gap-3">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    STATUS_CONFIG[selectedDispute.status].color
                  }`}
                >
                  {STATUS_CONFIG[selectedDispute.status].label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    DISPUTE_TYPES[selectedDispute.type].color
                  }`}
                >
                  {DISPUTE_TYPES[selectedDispute.type].label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 ${
                    PRIORITY_CONFIG[selectedDispute.priority].color
                  }`}
                >
                  <Flag className="w-3 h-3" />
                  {PRIORITY_CONFIG[selectedDispute.priority].label} Priority
                </span>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-medium text-gray-900">
                      {selectedDispute.customerName}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium text-gray-900">
                      {selectedDispute.customerEmail}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Order ID:</span>
                    <p className="font-medium text-gray-900">
                      {selectedDispute.orderId}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Submitted:</span>
                    <p className="font-medium text-gray-900">
                      {selectedDispute.createdAt}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              {selectedDispute.rating && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Rating</h4>
                  <div className="flex items-center gap-2">
                    {renderStars(selectedDispute.rating)}
                    <span className="text-sm text-gray-600">
                      {selectedDispute.rating} out of 5
                    </span>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Description
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedDispute.description}
                </p>
              </div>

              {/* Previous Response */}
              {selectedDispute.response && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Your Response
                  </h4>
                  <p className="text-gray-700 mb-2">
                    {selectedDispute.response}
                  </p>
                  <p className="text-xs text-gray-500">
                    Responded on {selectedDispute.responseDate}
                  </p>
                </div>
              )}

              {/* Response Form */}
              {selectedDispute.status !== "resolved" &&
                selectedDispute.status !== "closed" && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {selectedDispute.response
                        ? "Update Response"
                        : "Add Response"}
                    </h4>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Write your response to the customer..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      rows="4"
                    />
                  </div>
                )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {selectedDispute.status !== "resolved" &&
                  selectedDispute.status !== "closed" && (
                    <>
                      <button
                        onClick={handleSubmitResponse}
                        disabled={isProcessing || !responseText.trim()}
                        className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {isProcessing ? "Submitting..." : "Submit Response"}
                      </button>
                      <button
                        onClick={() => handleResolveDispute(selectedDispute.id)}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {isProcessing ? "Processing..." : "Mark as Resolved"}
                      </button>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Raise Dispute Modal */}
      {showRaiseDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Raise a Dispute
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Submit a complaint or issue
                </p>
              </div>
              <button
                onClick={() => !isProcessing && setShowRaiseDisputeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleRaiseDispute} className="p-6 space-y-4">
              {/* Dispute Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dispute Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={newDispute.type}
                  onChange={(e) =>
                    setNewDispute({ ...newDispute, type: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="customer_complaint">Customer Complaint</option>
                  <option value="payment_issue">Payment Issue</option>
                  <option value="service_issue">Service Issue</option>
                  <option value="review">Other</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  value={newDispute.priority}
                  onChange={(e) =>
                    setNewDispute({ ...newDispute, priority: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newDispute.subject}
                  onChange={(e) =>
                    setNewDispute({ ...newDispute, subject: e.target.value })
                  }
                  placeholder="Brief description of the issue"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Order ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID (Optional)
                </label>
                <input
                  type="text"
                  value={newDispute.orderId}
                  onChange={(e) =>
                    setNewDispute({ ...newDispute, orderId: e.target.value })
                  }
                  placeholder="ORD-001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name (Optional)
                </label>
                <input
                  type="text"
                  value={newDispute.customerName}
                  onChange={(e) =>
                    setNewDispute({
                      ...newDispute,
                      customerName: e.target.value,
                    })
                  }
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Customer Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Email (Optional)
                </label>
                <input
                  type="email"
                  value={newDispute.customerEmail}
                  onChange={(e) =>
                    setNewDispute({
                      ...newDispute,
                      customerEmail: e.target.value,
                    })
                  }
                  placeholder="customer@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newDispute.description}
                  onChange={(e) =>
                    setNewDispute({
                      ...newDispute,
                      description: e.target.value,
                    })
                  }
                  placeholder="Provide detailed information about the dispute..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows="5"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    !isProcessing && setShowRaiseDisputeModal(false)
                  }
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? "Submitting..." : "Raise Dispute"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Disputes & Reviews</h1>
        <p className="text-gray-600 mt-1">
          Manage customer disputes, complaints, and reviews
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Disputes</span>
            <MessageSquare className="w-5 h-5 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Open</span>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{stats.open}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">In Progress</span>
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Resolved</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Avg Rating</span>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <button
            onClick={() => setShowRaiseDisputeModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Raise Dispute
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search disputes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="space-y-4">
          {/* Type Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType("all")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedType === "all"
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({getTypeCount("all")})
              </button>
              {Object.entries(DISPUTE_TYPES).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedType(key)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedType === key
                      ? config.color
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {config.label} ({getTypeCount(key)})
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedStatus("all")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedStatus === "all"
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({getStatusCount("all")})
              </button>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedStatus(key)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedStatus === key
                      ? config.color
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {config.label} ({getStatusCount(key)})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disputes List */}
      {filteredDisputes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No disputes found
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? "No disputes match your search criteria"
              : selectedType === "all" && selectedStatus === "all"
              ? "You have no disputes yet"
              : "No disputes match your filters"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredDisputes.map((dispute) => {
            const TypeIcon = DISPUTE_TYPES[dispute.type].icon;
            const StatusIcon = STATUS_CONFIG[dispute.status].icon;

            return (
              <div
                key={dispute.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Main Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                          {dispute.subject}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{dispute.id}</span>
                          <span>•</span>
                          <span>Order: {dispute.orderId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          DISPUTE_TYPES[dispute.type].color
                        }`}
                      >
                        <TypeIcon className="w-3 h-3" />
                        {DISPUTE_TYPES[dispute.type].label}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          STATUS_CONFIG[dispute.status].color
                        }`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {STATUS_CONFIG[dispute.status].label}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 ${
                          PRIORITY_CONFIG[dispute.priority].color
                        }`}
                      >
                        <Flag className="w-3 h-3" />
                        {PRIORITY_CONFIG[dispute.priority].label}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-2">
                      {dispute.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {dispute.customerName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {dispute.createdAt}
                      </div>
                      {dispute.rating && (
                        <div className="flex items-center gap-1">
                          {renderStars(dispute.rating)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <button
                      onClick={() => viewDetails(dispute)}
                      className="flex-1 lg:flex-none px-4 py-2 border border-primary-300 text-primary-700 rounded-lg font-medium hover:bg-primary-50 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    {dispute.status !== "resolved" &&
                      dispute.status !== "closed" && (
                        <button
                          onClick={() => handleResolveDispute(dispute.id)}
                          className="flex-1 lg:flex-none px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Resolve
                        </button>
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
