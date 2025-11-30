"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  Star,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Plus,
  Flag,
  Send,
  Loader2
} from "lucide-react";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/components/ui/ToastProvider";
import { api } from "@/lib/fetchClient";

const DISPUTE_TYPES = {
  CUSTOMER_COMPLAINT: {
    label: "Customer Complaint",
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
  },
  REVIEW_RATING: {
    label: "Review/Rating",
    color: "bg-blue-100 text-blue-700",
    icon: Star,
  },
  PAYMENT_ISSUE: {
    label: "Payment Issue",
    color: "bg-orange-100 text-orange-700",
    icon: AlertCircle,
  },
  SERVICE_ISSUE: {
    label: "Service Issue",
    color: "bg-purple-100 text-purple-700",
    icon: Flag,
  },
  OTHER: {
    label: "Other",
    color: "bg-gray-100 text-gray-700",
    icon: MessageSquare,
  }
};

const STATUS_CONFIG = {
  OPEN: { label: "Open", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-700",
    icon: MessageSquare,
  },
  RESOLVED: {
    label: "Resolved",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  CLOSED: {
    label: "Closed",
    color: "bg-gray-100 text-gray-700",
    icon: XCircle,
  },
};

const PRIORITY_CONFIG = {
  LOW: { label: "Low", color: "text-gray-600" },
  MEDIUM: { label: "Medium", color: "text-yellow-600" },
  HIGH: { label: "High", color: "text-red-600" },
};

export default function DisputePage() {
  const [disputes, setDisputes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    avgRating: "N/A"
  });
  const [isLoading, setIsLoading] = useState(true);
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
    type: "CUSTOMER_COMPLAINT",
    title: "",
    orderId: "",
    customerName: "",
    customerEmail: "",
    description: "",
    priority: "MEDIUM",
  });

  // Response form state
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    fetchDisputes();
    fetchStats();
  }, []);

  const fetchDisputes = async () => {
    try {
      const data = await api.get("/api/disputes");
      if (Array.isArray(data)) {
        setDisputes(data);
      }
    } catch (error) {
      console.error("Failed to fetch disputes:", error);
      // Fallback to empty array if API fails, don't break UI
      setDisputes([]);
      // addToast({ message: "Failed to load disputes", type: "error" }); // Optional: don't spam user on load
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.get("/api/disputes/statistics");
      if (data) {
        setStats({
          total: data.total || 0,
          open: data.byStatus?.OPEN || 0,
          inProgress: data.byStatus?.IN_PROGRESS || 0,
          resolved: data.byStatus?.RESOLVED || 0,
          avgRating: data.averageRating ? Number(data.averageRating).toFixed(1) : "N/A"
        });
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // Filter disputes
  const filteredDisputes = disputes.filter((dispute) => {
    const matchesType = selectedType === "all" || dispute.type === selectedType;
    const matchesStatus = selectedStatus === "all" || dispute.status === selectedStatus;
    const matchesSearch =
      dispute.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  // View details
  const viewDetails = (dispute) => {
    setSelectedDispute(dispute);
    setResponseText("");
    setShowDetailsModal(true);
  };

  // Submit response
  const handleSubmitResponse = async () => {
    if (!responseText.trim()) {
      addToast({ message: "Please enter a response", type: "warning" });
      return;
    }

    setIsProcessing(true);

    try {
      await api.post(`/api/disputes/${selectedDispute.id}/messages`, {
        message: responseText,
        attachments: []
      });

      addToast({ message: "Response submitted successfully", type: "success" });
      setShowDetailsModal(false);
      setResponseText("");
      fetchDisputes(); // Refresh list
    } catch (err) {
      addToast({ message: err.message || "Failed to submit response", type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  // Raise new dispute
  const handleRaiseDispute = async (e) => {
    e.preventDefault();

    if (!newDispute.title || !newDispute.description) {
      addToast({ message: "Please fill in all required fields", type: "warning" });
      return;
    }

    setIsProcessing(true);

    try {
      await api.post("/api/disputes", newDispute);

      addToast({ message: "Dispute raised successfully", type: "success" });
      setShowRaiseDisputeModal(false);
      setNewDispute({
        type: "CUSTOMER_COMPLAINT",
        title: "",
        orderId: "",
        customerName: "",
        customerEmail: "",
        description: "",
        priority: "MEDIUM",
      });
      fetchDisputes();
      fetchStats();
    } catch (err) {
      addToast({ message: err.message || "Failed to raise dispute", type: "error" });
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
            className={`w-4 h-4 ${star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
              }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

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
                  {selectedDispute.title}
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
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${STATUS_CONFIG[selectedDispute.status]?.color || "bg-gray-100"
                    }`}
                >
                  {STATUS_CONFIG[selectedDispute.status]?.label || selectedDispute.status}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${DISPUTE_TYPES[selectedDispute.type]?.color || "bg-gray-100"
                    }`}
                >
                  {DISPUTE_TYPES[selectedDispute.type]?.label || selectedDispute.type}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 ${PRIORITY_CONFIG[selectedDispute.priority]?.color
                    }`}
                >
                  <Flag className="w-3 h-3" />
                  {PRIORITY_CONFIG[selectedDispute.priority]?.label || selectedDispute.priority} Priority
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
                      {selectedDispute.customerName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium text-gray-900">
                      {selectedDispute.customerEmail || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Order ID:</span>
                    <p className="font-medium text-gray-900">
                      {selectedDispute.orderId || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Submitted:</span>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedDispute.createdAt).toLocaleString()}
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

              {/* Messages/History */}
              {selectedDispute.messages && selectedDispute.messages.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">History</h4>
                  {selectedDispute.messages.map((msg, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 mb-2">{msg.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Response Form */}
              {selectedDispute.status !== "RESOLVED" &&
                selectedDispute.status !== "CLOSED" && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Add Response
                    </h4>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Write your response..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      rows="4"
                    />
                  </div>
                )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {selectedDispute.status !== "RESOLVED" &&
                  selectedDispute.status !== "CLOSED" && (
                    <button
                      onClick={handleSubmitResponse}
                      disabled={isProcessing || !responseText.trim()}
                      className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {isProcessing ? "Submitting..." : "Submit Response"}
                    </button>
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
                  <option value="CUSTOMER_COMPLAINT">Customer Complaint</option>
                  <option value="PAYMENT_ISSUE">Payment Issue</option>
                  <option value="SERVICE_ISSUE">Service Issue</option>
                  <option value="REVIEW_RATING">Review/Rating</option>
                  <option value="OTHER">Other</option>
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
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newDispute.title}
                  onChange={(e) =>
                    setNewDispute({ ...newDispute, title: e.target.value })
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
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${selectedType === "all"
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                All
              </button>
              {Object.entries(DISPUTE_TYPES).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedType(key)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${selectedType === key
                      ? config.color
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        {filteredDisputes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No disputes found
            </h3>
            <p className="text-gray-500 mt-1">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          filteredDisputes.map((dispute) => (
            <div
              key={dispute.id}
              onClick={() => viewDetails(dispute)}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-lg ${DISPUTE_TYPES[dispute.type]?.color || "bg-gray-100"
                      }`}
                  >
                    {DISPUTE_TYPES[dispute.type]?.icon ? (
                      <dispute.type.icon className="w-6 h-6" />
                    ) : (
                      <MessageSquare className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {dispute.title}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {dispute.id}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {dispute.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{new Date(dispute.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{dispute.customerName || "Unknown Customer"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[dispute.status]?.color || "bg-gray-100"
                      }`}
                  >
                    {STATUS_CONFIG[dispute.status]?.label || dispute.status}
                  </span>
                  {dispute.rating && renderStars(dispute.rating)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
