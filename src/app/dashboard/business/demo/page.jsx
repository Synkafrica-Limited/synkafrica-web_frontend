"use client";

import { useState } from "react";
import { useToast, useNotifications } from "@/hooks/useNotifications";
import { Toast } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { NotificationBadge, NotificationPopup, BookingNotification } from "@/components/ui/Notifications";
import { useRouter } from "next/navigation";

/**
 * Demo page showcasing all micro-interaction components
 * This page can be accessed at /dashboard/business/demo
 */
export default function MicroInteractionsDemo() {
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();
  const { notifications, unreadCount, addNotification, markAsRead } = useNotifications();

  // Confirm Dialog State
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification Popup State
  const [showNotifications, setShowNotifications] = useState(false);

  // Booking Notification State
  const [showBooking, setShowBooking] = useState(false);

  // Sample booking data
  const bookingData = {
    customerName: "John Doe",
    serviceName: "Luxury SUV with Driver",
    price: "₦25,000",
    date: "Dec 15, 2024"
  };

  // Handlers
  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDeleting(false);
    setShowConfirm(false);
    addToast("Item deleted successfully!", "success");
  };

  const handleAddNotification = () => {
    addNotification({
      type: 'booking',
      title: 'New Booking Order',
      message: 'Sarah Smith booked your Beach Resort Package for 5 guests',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
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

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => !isDeleting && setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Notification Popup */}
      {showNotifications && (
        <NotificationPopup
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAsRead={markAsRead}
        />
      )}

      {/* Booking Notification */}
      {showBooking && (
        <BookingNotification
          booking={bookingData}
          onClose={() => setShowBooking(false)}
          onView={() => {
            setShowBooking(false);
            router.push('/dashboard/business/orders');
          }}
        />
      )}

      {/* Demo Content */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Micro-Interactions Demo</h1>
              <p className="text-gray-600 mt-2">Test all notification and dialog components</p>
            </div>
            <NotificationBadge
              count={unreadCount}
              onClick={() => setShowNotifications(true)}
            />
          </div>

          {/* Toast Demonstrations */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Toast Notifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => addToast("Operation completed successfully!", "success")}
                className="px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Success Toast
              </button>
              <button
                onClick={() => addToast("Something went wrong. Please try again.", "error")}
                className="px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Error Toast
              </button>
              <button
                onClick={() => addToast("This action requires your attention.", "warning")}
                className="px-4 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors"
              >
                Warning Toast
              </button>
              <button
                onClick={() => addToast("New feature available! Check it out.", "info")}
                className="px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Info Toast
              </button>
            </div>
          </section>

          {/* Confirmation Dialog */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirmation Dialog</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Delete Confirmation
              </button>
              <button
                onClick={() => {
                  // You can create different confirm dialogs with different types
                  addToast("Check the Delete Confirmation button", "info");
                }}
                className="px-4 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors"
              >
                Warning Dialog
              </button>
              <button
                onClick={() => {
                  addToast("Check the Delete Confirmation button", "info");
                }}
                className="px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Info Dialog
              </button>
            </div>
          </section>

          {/* Notifications */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification System</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddNotification}
                className="px-4 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
              >
                Add Notification
              </button>
              <button
                onClick={() => setShowNotifications(true)}
                className="px-4 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
              >
                View Notifications ({unreadCount})
              </button>
            </div>
          </section>

          {/* Booking Notification */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Notification</h2>
            <button
              onClick={() => setShowBooking(true)}
              className="px-6 py-3 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg"
            >
              🎉 Simulate New Booking Order
            </button>
          </section>
        </div>

        {/* Code Examples */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Usage Examples</h2>
          <div className="space-y-6">
            {/* Toast Example */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Toast Notification</h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`const { toasts, addToast, removeToast } = useToast();

addToast('Success message!', 'success', 3000);`}
              </pre>
            </div>

            {/* Confirm Dialog Example */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirmation Dialog</h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`<ConfirmDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Delete Item"
  message="Are you sure?"
  type="danger"
  isLoading={isDeleting}
/>`}
              </pre>
            </div>

            {/* Notification Example */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Add Notification</h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`addNotification({
  type: 'booking',
  title: 'New Booking Order',
  message: 'Customer booked your service',
});`}
              </pre>
            </div>

            {/* Booking Notification Example */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Booking Notification</h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`<BookingNotification
  booking={{
    customerName: "John Doe",
    serviceName: "Service Name",
    price: "₦25,000",
    date: "Dec 15, 2024"
  }}
  onClose={() => setShowBooking(false)}
  onView={() => router.push('/orders')}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
