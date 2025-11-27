/**
 * Micro-Interactions Usage Examples
 *
 * This file demonstrates how to use the notification components
 * throughout the application.
 */

// ============================================
// 1. TOAST NOTIFICATIONS
// ============================================

import { useToast } from "@/hooks/useNotifications";
import { Toast } from "@/components/ui/Toast";

function ExampleComponent() {
  const { toasts, addToast, removeToast } = useToast();

  const handleSuccess = () => {
    addToast("Operation completed successfully!", "success", 3000);
  };

  const handleError = () => {
    addToast("Something went wrong. Please try again.", "error", 5000);
  };

  const handleWarning = () => {
    addToast("This action requires your attention.", "warning", 4000);
  };

  const handleInfo = () => {
    addToast("New feature available!", "info", 3000);
  };

  return (
    <>
      {/* Render toasts */}
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

      {/* Your component content */}
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleWarning}>Show Warning</button>
      <button onClick={handleInfo}>Show Info</button>
    </>
  );
}

// ============================================
// 2. CONFIRMATION DIALOG
// ============================================

import { useState } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

function DeleteExample() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    // Perform delete operation
    await fetch("/api/delete", { method: "DELETE" });

    setIsDeleting(false);
    setShowConfirm(false);
  };

  return (
    <>
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger" // danger, warning, or info
        isLoading={isDeleting}
      />

      <button onClick={() => setShowConfirm(true)}>Delete Item</button>
    </>
  );
}

// ============================================
// 3. BOOKING NOTIFICATION
// ============================================

import { useState } from "react";
import { BookingNotification } from "@/components/ui/Notifications";
import { useRouter } from "next/navigation";

function BookingExample() {
  const [showBooking, setShowBooking] = useState(false);
  const router = useRouter();

  // Simulate receiving a new booking (e.g., from WebSocket)
  const handleNewBooking = () => {
    setShowBooking(true);
  };

  const bookingData = {
    customerName: "John Doe",
    serviceName: "Luxury SUV with Driver",
    price: "₦25,000",
    date: "Dec 15, 2024",
  };

  return (
    <>
      {showBooking && (
        <BookingNotification
          booking={bookingData}
          onClose={() => setShowBooking(false)}
          onView={() => {
            setShowBooking(false);
            router.push("/dashboard/business/orders");
          }}
        />
      )}

      <button onClick={handleNewBooking}>Simulate New Booking</button>
    </>
  );
}

// ============================================
// 4. NOTIFICATION BADGE & POPUP
// ============================================

import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import {
  NotificationBadge,
  NotificationPopup,
} from "@/components/ui/Notifications";

function HeaderExample() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, unreadCount, addNotification, markAsRead } =
    useNotifications();

  // Example: Add notification when booking is received
  const handleNewBooking = () => {
    addNotification({
      type: "booking",
      title: "New Booking Order",
      message: "John Doe booked your Luxury SUV service",
    });
  };

  return (
    <header>
      <NotificationBadge
        count={unreadCount}
        onClick={() => setShowNotifications(true)}
      />

      {showNotifications && (
        <NotificationPopup
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAsRead={markAsRead}
        />
      )}

      {/* Simulate new booking */}
      <button onClick={handleNewBooking}>Test Notification</button>
    </header>
  );
}

// ============================================
// 5. COMPLETE EXAMPLE - LISTINGS PAGE
// ============================================

function CompleteListingsExample() {
  const { toasts, addToast, removeToast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteListing = (listing) => {
    setListingToDelete(listing);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);

    try {
      await fetch(`/api/listings/${listingToDelete.id}`, { method: "DELETE" });

      // Show success toast
      addToast(
        `"${listingToDelete.title}" has been deleted successfully`,
        "success"
      );

      // Refresh listings
      // ... refresh logic
    } catch {
      addToast("Failed to delete listing. Please try again.", "error");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setListingToDelete(null);
    }
  };

  return (
    <div>
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => !isDeleting && setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Listing"
        message={`Are you sure you want to delete "${listingToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Your listings content */}
      <button
        onClick={() => handleDeleteListing({ id: 1, title: "Test Listing" })}
      >
        Delete Listing
      </button>
    </div>
  );
}

// ============================================
// 6. WEBSOCKET INTEGRATION EXAMPLE
// ============================================

import { useEffect } from "react";

function WebSocketBookingNotifications() {
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket("wss://your-api.com/notifications");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "new_booking") {
        // Show booking notification popup
        setBookingData({
          customerName: data.customer_name,
          serviceName: data.service_name,
          price: data.price,
          date: data.booking_date,
        });
        setShowBooking(true);

        // Also add to notification list
        addNotification({
          type: "booking",
          title: "New Booking Order",
          message: `${data.customer_name} booked ${data.service_name}`,
        });
      }
    };

    return () => ws.close();
  }, [addNotification]);

  return (
    <>
      {showBooking && bookingData && (
        <BookingNotification
          booking={bookingData}
          onClose={() => setShowBooking(false)}
          onView={() => {
            setShowBooking(false);
            // Navigate to order details
          }}
        />
      )}
    </>
  );
}

export {
  ExampleComponent,
  DeleteExample,
  BookingExample,
  HeaderExample,
  CompleteListingsExample,
  WebSocketBookingNotifications,
};
