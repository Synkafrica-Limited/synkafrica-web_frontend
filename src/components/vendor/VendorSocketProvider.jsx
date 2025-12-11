"use client";

import { useEffect, useState } from "react";
import { useVendorSocketEvents } from "@/hooks/useVendorSocketEvents";
import { useVendorNotifications } from "@/context/VendorNotificationContext";
import BookingRequestModal from "./BookingRequestModal";

export default function VendorSocketProvider({ children }) {
    useVendorSocketEvents();
    const { notifications } = useVendorNotifications();
    const [activeBookingRequest, setActiveBookingRequest] = useState(null);

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
