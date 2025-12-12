"use client";

import { useEffect, useCallback } from "react";
import { useVendorNotifications } from "@/context/VendorNotificationContext";
import { useToast } from "@/components/ui/ToastProvider";
import { vendorSocket, setupVendorSocketListeners, removeVendorSocketListeners } from "@/lib/vendorSocket";

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

  // Removed - not used in current socket event setup
  // const handleBookingAccepted = useCallback((data) => {
  //   addNotification({
  //     type: "booking_accepted",
  //     title: "Booking Confirmed",
  //     message: `Booking #${data.bookingId || data.id} has been confirmed`,
  //     data,
  //     priority: "medium",
  //   });
  //
  //   addToast({
  //     message: "Booking confirmed successfully",
  //     type: "success",
  //     duration: 3000,
  //   });
  // }, [addNotification, addToast]);

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
    if (!vendorSocket) {
      console.warn("[useVendorSocketEvents] Socket not available");
      return;
    }

    const handlers = {
      onBookingNew: handleBookingNew,
      onBookingExpired: handleBookingExpired,
      onBookingCancelled: handleBookingCancelled,
      onSupportMessage: handleSupportMessage,
      onVerificationUpdate: handleVerificationUpdate,
    };

    setupVendorSocketListeners(handlers);

    return () => {
      removeVendorSocketListeners(handlers);
    };
  }, [
    handleBookingNew,
    handleBookingExpired,
    handleBookingCancelled,
    handleSupportMessage,
    handleVerificationUpdate,
  ]);
};
