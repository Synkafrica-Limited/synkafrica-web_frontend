"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, Search, Info, Plus, X, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { api } from "@/lib/fetchClient";
import DashboardHeader from "@/components/layout/DashboardHeader";

const TICKET_TYPES = [
    { value: "CUSTOMER_COMPLAINT", label: "Customer Complaint" },
    { value: "BUSINESS_COMPLAINT", label: "Business Complaint" },
    { value: "GENERAL_INQUIRY", label: "General Inquiry" },
    { value: "TECHNICAL_ISSUE", label: "Technical Issue" },
    { value: "REFUND_REQUEST", label: "Refund Request" },
    { value: "BOOKING_ISSUE", label: "Booking Issue" },
    { value: "PAYMENT_ISSUE", label: "Payment Issue" },
    { value: "ACCOUNT_ISSUE", label: "Account Issue" },
];

const TICKET_CATEGORIES = [
    { value: "PAYMENT", label: "Payment" },
    { value: "BOOKING", label: "Booking" },
    { value: "ACCOUNT", label: "Account" },
    { value: "TECHNICAL", label: "Technical" },
    { value: "BILLING", label: "Billing" },
    { value: "GENERAL", label: "General" },
    { value: "REFUND", label: "Refund" },
    { value: "VENDOR", label: "Vendor" },
];

const PRIORITY_LEVELS = [
    { value: "LOW", label: "Low", color: "text-gray-600" },
    { value: "MEDIUM", label: "Medium", color: "text-yellow-600" },
    { value: "HIGH", label: "High", color: "text-orange-600" },
    { value: "URGENT", label: "Urgent", color: "text-red-600" },
];

export default function SupportPage() {
    const [tickets, setTickets] = useState([]);
    const [activeTicket, setActiveTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const messagesEndRef = useRef(null);
    const { addToast } = useToast();

    // New ticket form state
    const [newTicket, setNewTicket] = useState({
        type: "GENERAL_INQUIRY",
        category: "GENERAL",
        subject: "",
        description: "",
        priority: "MEDIUM",
    });

    // Fetch tickets on mount
    useEffect(() => {
        fetchTickets();
    }, []);

    // Fetch messages when active ticket changes
    useEffect(() => {
        if (activeTicket) {
            fetchMessages(activeTicket.id);
        }
    }, [activeTicket]);

    // Auto-refresh messages every 10 seconds for active ticket
    useEffect(() => {
        if (!activeTicket) return;

        const interval = setInterval(() => {
            fetchMessages(activeTicket.id);
        }, 10000); // Poll every 10 seconds

        return () => clearInterval(interval);
    }, [activeTicket]);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            const res = await api.get("/support/tickets", { auth: true });
            // Handle response structure: { tickets: [...], pagination: {...} }
            if (res && Array.isArray(res.tickets)) {
                setTickets(res.tickets);
                if (res.tickets.length > 0 && !activeTicket) {
                    setActiveTicket(res.tickets[0]);
                }
            } else if (Array.isArray(res)) {
                // Fallback for direct array response
                setTickets(res);
                if (res.length > 0 && !activeTicket) {
                    setActiveTicket(res[0]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
            setTickets([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMessages = async (ticketId) => {
        try {
            // Fetch ticket details which includes messages
            const res = await api.get(`/support/tickets/${ticketId}`, { auth: true });
            if (res && Array.isArray(res.messages)) {
                setMessages(res.messages);
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            setMessages([]);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeTicket) return;

        setIsSending(true);
        try {
            await api.post(`/support/tickets/${activeTicket.id}/messages`, {
                message: newMessage
            }, { auth: true });

            // Optimistic update
            const newMsg = {
                id: Date.now(),
                sender: "user",
                message: newMessage,
                createdAt: new Date().toISOString(),
            };
            setMessages([...messages, newMsg]);
            setNewMessage("");

            // Refresh tickets to update last message
            fetchTickets();
        } catch (error) {
            console.error("Failed to send message:", error);
            addToast({ message: "Failed to send message", type: "error" });
        } finally {
            setIsSending(false);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();

        if (!newTicket.subject.trim() || !newTicket.description.trim()) {
            addToast({ message: "Please fill in all required fields", type: "warning" });
            return;
        }

        setIsCreating(true);
        try {
            const response = await api.post("/support/tickets", newTicket, { auth: true });

            addToast({ message: "Support ticket created successfully", type: "success" });
            setShowCreateModal(false);
            setNewTicket({
                type: "GENERAL_INQUIRY",
                category: "GENERAL",
                subject: "",
                description: "",
                priority: "MEDIUM",
            });

            // Refresh tickets and select the new one
            await fetchTickets();
            // Handle response structure: { success: true, message: "...", ticket: {...} }
            if (response && response.ticket) {
                setActiveTicket(response.ticket);
            }
        } catch (error) {
            console.error("Failed to create ticket:", error);
            addToast({ message: error.message || "Failed to create ticket", type: "error" });
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col bg-[#FAF8F6]">
            <DashboardHeader
                title="Support & Help"
                subtitle="Get assistance and manage your support tickets"
            />

            <div className="flex-1 flex overflow-hidden p-4 sm:p-6 gap-6">
                {/* Tickets List - Sidebar */}
                <div className="w-full sm:w-80 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-100 space-y-3">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="w-full px-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Ticket
                        </button>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-8">
                                <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                    <Info className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-600 mb-1">No tickets yet</p>
                                <p className="text-xs text-gray-400">Create your first support ticket</p>
                            </div>
                        ) : (
                            tickets.map(ticket => (
                                <div
                                    key={ticket.id}
                                    onClick={() => setActiveTicket(ticket)}
                                    className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${activeTicket?.id === ticket.id ? "bg-primary-50/30 border-l-4 border-l-primary-500" : "border-l-4 border-l-transparent"
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium text-gray-900 truncate pr-2">{ticket.subject}</span>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                            {new Date(ticket.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate mb-2">{ticket.description}</p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${ticket.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                                            ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                ticket.status === 'RESOLVED' ? 'bg-gray-100 text-gray-600' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {ticket.status}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${PRIORITY_LEVELS.find(p => p.value === ticket.priority)?.color || 'text-gray-600'
                                            }`}>
                                            {ticket.priority}
                                        </span>
                                        <span className="text-[10px] text-gray-400">{ticket.ticketNumber || ticket.id}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                    {activeTicket ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h2 className="font-semibold text-gray-900">{activeTicket.subject}</h2>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span>Ticket #{activeTicket.ticketNumber || activeTicket.id}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <div className={`w-2 h-2 rounded-full ${activeTicket.status === 'OPEN' ? 'bg-green-500' :
                                                activeTicket.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                                                    'bg-gray-400'
                                                }`} />
                                            {activeTicket.status}
                                        </span>
                                        <span>•</span>
                                        <span className={PRIORITY_LEVELS.find(p => p.value === activeTicket.priority)?.color}>
                                            {activeTicket.priority} Priority
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#E5DDD5] dark:bg-[#0B141A] relative">
                                {/* WhatsApp-style background pattern */}
                                <div className="absolute inset-0 opacity-[0.06]" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                                }} />
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <Info className="w-12 h-12 mb-2" />
                                        <p className="text-sm">No messages yet. Start the conversation!</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const isVendor = msg.sender === 'user' || msg.senderType === 'BUSINESS';
                                        const isAdmin = msg.sender === 'admin' || msg.senderType === 'ADMIN' || msg.senderType === 'SUPPORT';
                                        const showSender = index === 0 || messages[index - 1]?.senderType !== msg.senderType;

                                        return (
                                            <div key={msg.id} className="relative">
                                                {/* Sender label */}
                                                {showSender && (
                                                    <div className={`flex items-center gap-2 mb-1 ${isVendor ? 'justify-end' : 'justify-start'}`}>
                                                        {!isVendor && (
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xs font-semibold">
                                                                    A
                                                                </div>
                                                                <span className="text-xs font-medium text-gray-600">Support Team</span>
                                                            </div>
                                                        )}
                                                        {isVendor && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-medium text-gray-600">You</span>
                                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-xs font-semibold">
                                                                    V
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Message bubble */}
                                                <div className={`flex ${isVendor ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-sm relative ${isVendor
                                                        ? 'bg-[#DCF8C6] dark:bg-[#005C4B] text-gray-900 dark:text-white rounded-tr-sm'
                                                        : 'bg-white dark:bg-[#202C33] text-gray-900 dark:text-white rounded-tl-sm'
                                                        }`}>
                                                        {/* Message tail */}
                                                        <div className={`absolute top-0 ${isVendor ? 'right-0 -mr-2' : 'left-0 -ml-2'}`}>
                                                            <svg width="8" height="13" viewBox="0 0 8 13" className={isVendor ? 'text-[#DCF8C6] dark:text-[#005C4B]' : 'text-white dark:text-[#202C33]'}>
                                                                <path d={isVendor ? "M1.533,3.568 L8.000,0.000 L8.000,13.000 L1.533,3.568 Z" : "M6.467,3.568 L0.000,0.000 L0.000,13.000 L6.467,3.568 Z"} fill="currentColor" />
                                                            </svg>
                                                        </div>

                                                        <p className="text-sm leading-relaxed break-words">{msg.message || msg.content}</p>
                                                        <div className="flex items-center justify-end gap-1 mt-1">
                                                            <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                            {isVendor && (
                                                                <svg width="16" height="11" viewBox="0 0 16 11" className="text-blue-500">
                                                                    <path d="M11.071,0.5 L5.5,6.071 L2.929,3.5 L1.5,4.929 L5.5,8.929 L12.5,1.929 L11.071,0.5 Z M13.929,0.5 L12.5,1.929 L15.5,4.929 L13.929,6.5 L15.357,7.929 L18.357,4.929 L13.929,0.5 Z" fill="currentColor" transform="translate(-1 -0.5)" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t border-gray-100">
                                <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                                    <button
                                        type="button"
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                                    >
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
                                        <textarea
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            className="w-full bg-transparent border-none focus:ring-0 p-3 max-h-32 resize-none text-sm"
                                            rows="1"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage(e);
                                                }
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() || isSending}
                                        className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Info className="w-8 h-8" />
                            </div>
                            <p className="text-lg font-medium text-gray-900">Select a ticket</p>
                            <p className="text-sm">Choose a ticket from the list to view conversation</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Ticket Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Create Support Ticket</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Describe your issue and we'll help you resolve it
                                </p>
                            </div>
                            <button
                                onClick={() => !isCreating && setShowCreateModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={newTicket.type}
                                    onChange={(e) => setNewTicket({ ...newTicket, type: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                >
                                    {TICKET_TYPES.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={newTicket.category}
                                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                >
                                    {TICKET_CATEGORIES.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={newTicket.priority}
                                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                >
                                    {PRIORITY_LEVELS.map(priority => (
                                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newTicket.subject}
                                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                    placeholder="Brief description of your issue"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={newTicket.description}
                                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                    placeholder="Provide detailed information about your issue..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                    rows="5"
                                    required
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => !isCreating && setShowCreateModal(false)}
                                    disabled={isCreating}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Ticket"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
