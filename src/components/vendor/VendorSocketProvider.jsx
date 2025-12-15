"use client";

import { useEffect, useState } from "react";
import { useVendorSocketEvents } from "@/hooks/useVendorSocketEvents";
import { useVendorNotifications } from "@/context/VendorNotificationContext";
import BookingRequestModal from "./BookingRequestModal";
import { authServiceWrapper } from "@/services/auth";
import { initializeSocket, disconnectSocket } from "@/lib/socket";
import { useAuth } from "@/hooks/useAuth";

export default function VendorSocketProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const { notifications } = useVendorNotifications();
    const [activeBookingRequest, setActiveBookingRequest] = useState(null);

    // Initialize socket connection
    useEffect(() => {
        const connectSocket = async () => {
            if (isAuthenticated) {
                const token = authServiceWrapper.getStoredToken();
                if (token) {
                    initializeSocket(token);
                }
            }
        };

        connectSocket();

        return () => {
            disconnectSocket();
        };
    }, [isAuthenticated]);

    // Setup event listeners
    useVendorSocketEvents();

    useEffect(() => {
        const latestBookingRequest = notifications.find(
            (n) => n.type === "booking_request" && !n.read && !n.modalShown
        );

        if (latestBookingRequest) {
            setActiveBookingRequest(latestBookingRequest.data);
            latestBookingRequest.modalShown = true;
        }
    }, [notifications]);

    return (
        <>
            {children}
            {activeBookingRequest && (
                <BookingRequestModal
                    booking={activeBookingRequest}
                    onClose={() => setActiveBookingRequest(null)}
                />
            )}
        </>
    );
}
