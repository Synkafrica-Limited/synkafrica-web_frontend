"use client";

import { useEffect, useCallback } from "react";
import { useVendorNotifications } from "@/context/VendorNotificationContext";
import { useToast } from "@/components/ui/ToastProvider";
import { getSocket } from "@/lib/socket";

export const useVendorSocketEvents = () => {
  const { addNotification } = useVendorNotifications();
  const { addToast } = useToast();

  const handleBookingNew = useCallback((data) => {
    addNotification({
      type: "booking_request",
      title: "New Booking Request",
      message: `${data.customerName || "A customer"} requested ${data.listingTitle || "a service"}`,
      data,
      priority: "high",
    });

    addToast({
      message: `New booking request from ${data.customerName || "customer"}`,
      type: "info",
      duration: 5000,
      action: {
        label: "View",
        onClick: () => {
          window.location.href = "/dashboard/business/orders";
        },
      },
    });

    if (typeof window !== "undefined" && window.Audio) {
      try {
        const audio = new Audio("/sounds/notification.mp3");
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch {
        // Ignore audio errors
      }
    }
  }, [addNotification, addToast]);

  const handleBookingExpired = useCallback((data) => {
    addNotification({
      type: "booking_expired",
      title: "Booking Expired",
      message: `Booking request #${data.bookingId || data.id} has expired`,
      data,
      priority: "medium",
    });

    addToast({
      message: `Booking request expired`,
      type: "warning",
      duration: 4000,
    });
  }, [addNotification, addToast]);

  const handleSupportMessage = useCallback((data) => {
    addNotification({
      type: "support_message",
      title: "New Support Message",
      message: data.message || "You have a new support message",
      data,
      priority: "medium",
    });

    addToast({
      message: "New support message received",
      type: "info",
      duration: 3000,
      action: {
        label: "View",
        onClick: () => {
          window.location.href = "/dashboard/business/support";
        },
      },
    });
  }, [addNotification, addToast]);

  const handleVerificationUpdate = useCallback((data) => {
    const statusMessages = {
      APPROVED: "Your business verification has been approved! 🎉",
      REJECTED: "Your business verification was rejected. Please review and resubmit.",
      PENDING_REVIEW: "Your business verification is under review.",
      NOT_SUBMITTED: "Please submit your business verification documents.",
    };

    addNotification({
      type: "verification_update",
      title: "Verification Status Update",
      message: statusMessages[data.status] || `Verification status: ${data.status}`,
      data,
      priority: data.status === "APPROVED" ? "high" : "medium",
    });

    addToast({
      message: statusMessages[data.status] || `Verification status updated`,
      type: data.status === "APPROVED" ? "success" : data.status === "REJECTED" ? "error" : "info",
      duration: 6000,
      action: {
        label: "View Details",
        onClick: () => {
          window.location.href = "/dashboard/business/settings";
        },
      },
    });
  }, [addNotification, addToast]);

  const handleBookingAccepted = useCallback((data) => {
    addNotification({
      type: "booking_accepted",
      title: "Booking Confirmed",
      message: `Booking #${data.bookingId || data.id} has been confirmed`,
      data,
      priority: "medium",
    });

    addToast({
      message: "Booking confirmed successfully",
      type: "success",
      duration: 3000,
    });
  }, [addNotification, addToast]);

  const handleBookingCancelled = useCallback((data) => {
    addNotification({
      type: "booking_cancelled",
      title: "Booking Cancelled",
      message: `Booking #${data.bookingId || data.id} was cancelled`,
      data,
      priority: "medium",
    });

    addToast({
      message: "Booking cancelled",
      type: "warning",
      duration: 3000,
    });
  }, [addNotification, addToast]);

  useEffect(() => {
    const socket = getSocket();

    if (!socket) {
        // Socket might not be available if provider hasn't initialized it yet
        // In a real app we might want to listen to a context or event for "socket ready"
        // But the provider initializes it pretty quickly.
        return; 
    }

    const onBookingNew = (data) => handleBookingNew(data);
    const onBookingExpired = (data) => handleBookingExpired(data);
    const onBookingCancelled = (data) => handleBookingCancelled(data);
    const onSupportMessage = (data) => handleSupportMessage(data);
    const onVerificationUpdate = (data) => handleVerificationUpdate(data);
    const onBookingAccepted = (data) => handleBookingAccepted(data);

    socket.on("booking:new", onBookingNew);
    socket.on("booking:expired", onBookingExpired);
    socket.on("booking:cancelled", onBookingCancelled);
    socket.on("support:message", onSupportMessage);
    socket.on("verification:update", onVerificationUpdate);
    socket.on("booking:accepted", onBookingAccepted);

    return () => {
      socket.off("booking:new", onBookingNew);
      socket.off("booking:expired", onBookingExpired);
      socket.off("booking:cancelled", onBookingCancelled);
      socket.off("support:message", onSupportMessage);
      socket.off("verification:update", onVerificationUpdate);
      socket.off("booking:accepted", onBookingAccepted);
    };
  }, [
    handleBookingNew,
    handleBookingExpired,
    handleBookingCancelled,
    handleSupportMessage,
    handleVerificationUpdate,
    handleBookingAccepted
  ]);
};
