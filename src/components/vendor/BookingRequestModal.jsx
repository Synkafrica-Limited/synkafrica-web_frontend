"use client";

import { useEffect, useState } from "react";
import { X, Calendar, User, MapPin, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BookingRequestModal({ booking, onClose }) {
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleViewBooking = () => {
        router.push("/dashboard/business/orders");
        handleClose();
    };

    if (!booking) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
                }`}
            onClick={handleClose}
        >
            <div
                className={`bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🔔</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">New Booking Request</h3>
                            <p className="text-sm text-gray-500">Just now</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">
                            {booking.listingTitle || "Service Booking"}
                        </h4>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <User className="w-4 h-4 text-primary-600" />
                                <span className="font-medium">Customer:</span>
                                <span>{booking.customerName || "N/A"}</span>
                            </div>

                            {booking.startDate && (
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Calendar className="w-4 h-4 text-primary-600" />
                                    <span className="font-medium">Date:</span>
                                    <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                                </div>
                            )}

                            {booking.location && (
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <MapPin className="w-4 h-4 text-primary-600" />
                                    <span className="font-medium">Location:</span>
                                    <span className="truncate">{booking.location}</span>
                                </div>
                            )}

                            {booking.totalAmount && (
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <DollarSign className="w-4 h-4 text-primary-600" />
                                    <span className="font-medium">Amount:</span>
                                    <span className="font-bold text-primary-600">
                                        ₦{booking.totalAmount.toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                            ⏰ Please respond to this booking request within 24 hours
                        </p>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex gap-3">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Later
                    </button>
                    <button
                        onClick={handleViewBooking}
                        className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                    >
                        View Booking
                    </button>
                </div>
            </div>
        </div>
    );
}
