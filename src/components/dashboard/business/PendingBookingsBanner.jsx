"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Check, X, ArrowRight, Loader2, Calendar, User } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { handleApiError } from '@/utils/errorParser';
import logger from '@/utils/logger';
import { getVendorBookings, acceptBooking, rejectBooking } from '@/services/bookings.service';

export default function PendingBookingsBanner({ pendingCount, onActionComplete }) {
    const router = useRouter();
    const { addToast } = useToast();

    // State
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Decline logic
    const [declineMode, setDeclineMode] = useState(false);
    const [declineReason, setDeclineReason] = useState("Unavailable");
    const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);

    // Initial fetch
    useEffect(() => {
        if (pendingCount > 0 && !booking) {
            fetchLatestBooking();
        }
    }, [pendingCount]);

    const fetchLatestBooking = async () => {
        try {
            setLoading(true);
            // Fetch latest pending booking
            const response = await getVendorBookings({
                status: 'pending', // lowercase based on service logic? Backend usually case-insensitive or specific. Service says 'PENDING' in comment but uses query param.
                take: 1
            });

            const bookings = response?.data || response || [];
            const latest = Array.isArray(bookings) ? bookings[0] : null;

            if (latest) {
                setBooking(latest);
            }
        } catch (error) {
            logger.error('Failed to fetch pending booking for banner:', error);
            // Fail silently, just fall back to generic banner
        } finally {
            setLoading(false);
        }
    };

    const handleReview = () => {
        router.push('/dashboard/business/orders?status=pending');
    };

    const handleAccept = async () => {
        if (!booking) return;
        setProcessing(true);
        try {
            await acceptBooking(booking.id);
            addToast({ message: "Booking accepted successfully", type: "success" });
            setBooking(null); // Clear current
            onActionComplete?.(); // Refresh stats
            // Optionally fetch next? The parent might re-render with new count.
            // If count is still > 0, effect will run again.
        } catch (error) {
            handleApiError(error, addToast);
        } finally {
            setProcessing(false);
        }
    };

    const handleDeclineClick = () => {
        setDeclineMode(true);
    };

    const cancelDecline = () => {
        setDeclineMode(false);
        setDeclineReason("Unavailable");
    };

    const confirmDecline = async () => {
        if (!booking) return;
        if (!declineReason.trim()) {
            addToast({ message: "Please provide a reason", type: "error" });
            return;
        }

        setProcessing(true);
        try {
            await rejectBooking(booking.id, { reason: declineReason });
            addToast({ message: "Booking rejected", type: "success" });
            setBooking(null);
            setDeclineMode(false);
            onActionComplete?.();
        } catch (error) {
            handleApiError(error, addToast);
        } finally {
            setProcessing(false);
        }
    };

    if (!pendingCount || pendingCount <= 0) {
        return null;
    }

    // Generic fallback if we couldn't load specific booking details
    if (!booking && !loading) {
        return (
            <div className="bg-orange-50 border-b border-orange-100 animate-in slide-in-from-top duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="p-2 bg-orange-100 rounded-full flex-shrink-0">
                                <AlertCircle className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                                You have {pendingCount} pending booking{pendingCount !== 1 ? 's' : ''} awaiting action
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                            <button
                                onClick={handleReview}
                                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
                            >
                                Review Bookings
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Detailed Banner
    return (
        <div className="bg-orange-50 border-b border-orange-100 animate-in slide-in-from-top duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-6">

                    {/* Booking Info */}
                    <div className="flex items-center gap-3 w-full lg:w-auto overflow-hidden">
                        <div className="p-2 bg-orange-100 rounded-full flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                        </div>
                        {loading ? (
                            <div className="h-5 w-64 bg-orange-200/50 rounded animate-pulse" />
                        ) : booking ? (
                            <div className="text-sm text-gray-900 truncate flex flex-wrap gap-x-1 items-center">
                                <span className="font-semibold">Action Required:</span>
                                <span>Booking for</span>
                                <span className="font-medium">{booking.serviceName || booking.service?.name || 'Service'}</span>
                                <span className="text-gray-500 hidden sm:inline">•</span>
                                <span className="flex items-center gap-1 text-gray-600">
                                    <User className="w-3.5 h-3.5" />
                                    {booking.customerName || booking.user?.name || 'Guest'}
                                </span>
                                <span className="text-gray-500 hidden sm:inline">•</span>
                                <span className="flex items-center gap-1 text-gray-600">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(booking.date || booking.bookingDate || booking.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ) : (
                            <div className="text-sm font-medium text-gray-900">
                                You have {pendingCount} pending booking{pendingCount !== 1 ? 's' : ''} awaiting action
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end flex-wrap sm:flex-nowrap">
                        {declineMode ? (
                            <div className="flex items-center gap-2 w-full sm:w-auto animate-in slide-in-from-right duration-200">
                                <input
                                    type="text"
                                    value={declineReason}
                                    onChange={(e) => setDeclineReason(e.target.value)}
                                    placeholder="Reason for rejection..."
                                    className="h-9 px-3 text-sm rounded-lg border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 min-w-[200px]"
                                    autoFocus
                                />
                                <button
                                    onClick={confirmDecline}
                                    disabled={processing}
                                    className="h-9 px-3 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 shadow-sm transition-colors flex items-center gap-1"
                                >
                                    {processing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                    Confirm
                                </button>
                                <button
                                    onClick={cancelDecline}
                                    disabled={processing}
                                    className="h-9 px-2 text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Quick Actions if booking loaded */}
                                {booking && !loading && (
                                    <>
                                        <button
                                            onClick={handleAccept}
                                            disabled={processing}
                                            className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center gap-1.5 shadow-sm"
                                        >
                                            {processing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                            Accept
                                        </button>

                                        <button
                                            onClick={handleDeclineClick}
                                            disabled={processing}
                                            className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-200 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors flex items-center gap-1.5 shadow-sm"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                            Decline
                                        </button>

                                        <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block"></div>
                                    </>
                                )}

                                <button
                                    onClick={handleReview}
                                    className="px-3 py-1.5 bg-transparent text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors flex items-center gap-1"
                                >
                                    {pendingCount > 1 ? `Review All (${pendingCount})` : 'View Details'}
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
