"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Calendar, Clock, MapPin, Users, Download, Mail, ArrowRight, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';
import { getBooking } from '@/services/bookings.service';

const BookingConfirmedPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentOrder, clearOrder } = useOrder();
  
  const bookingIdParam = searchParams.get('bookingId');
  const orderId = searchParams.get('orderId');
  const paymentIntentId = searchParams.get('paymentIntentId');
  
  // State for fetched booking data
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingReference, setBookingReference] = useState('');

  // Fetch booking from backend to get actual status (updated by webhook)
  useEffect(() => {
    const fetchBooking = async () => {
      const id = bookingIdParam || orderId;
      
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getBooking(id);
        setBooking(response);
        setBookingReference(response.orderId || response.id || id);
      } catch (err) {
        console.error('Failed to fetch booking:', err);
        setError(err.message);
        // Fall back to order from context if available
        if (currentOrder) {
          setBookingReference(currentOrder.orderId || bookingIdParam || orderId);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingIdParam, orderId, currentOrder]);

  // Clear global order context once booking is confirmed/loaded
  useEffect(() => {
    if (booking || (currentOrder && (bookingIdParam || orderId) && paymentIntentId)) {
      // Small delay to ensure UI doesn't flicker if it was relying on currentOrder during loading
      const timer = setTimeout(() => {
        if (currentOrder) clearOrder();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [booking, currentOrder, bookingIdParam, orderId, paymentIntentId, clearOrder]);

  // Use fallback reference if booking fetch failed
  useEffect(() => {
    if (!bookingReference) {
      const ref = bookingIdParam || orderId || `BK${Date.now().toString().slice(-8)}`;
      setBookingReference(ref);
    }
  }, [bookingIdParam, orderId, bookingReference]);

  const handleViewDashboard = () => {
    router.push('/dashboard/bookings');
  };

  const handleDownloadReceipt = () => {
    // In production, this would generate a PDF receipt
    alert('Receipt download functionality would be implemented here');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#DF5D3D] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  // Error state but payment was likely successful
  if (error && paymentIntentId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Payment Received!
            </h1>
            <p className="text-lg text-gray-600">
              Your payment has been processed successfully
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-gradient-to-r from-[#DF5D3D] to-[#e67a5f] rounded-2xl p-8 mb-8 text-white shadow-xl">
            <p className="text-sm font-medium text-white/80 mb-2">Payment Reference</p>
            <p className="text-2xl font-bold tracking-wider mb-4">{paymentIntentId}</p>
            <p className="text-sm text-white/90">
              Your booking is being confirmed. You will receive an email shortly.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 mb-1">Processing Your Booking</p>
                <p className="text-sm text-gray-600">
                  Your payment was successful but we're still processing your booking details.
                  This usually takes just a few moments. Check your email for confirmation.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 h-14 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={handleViewDashboard}
              className="flex items-center justify-center gap-2 h-14 bg-[#DF5D3D] text-white font-semibold rounded-xl hover:bg-[#c54a2a] transition-colors shadow-lg hover:shadow-xl"
            >
              <span>View Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No booking data at all
  if (!booking && !currentOrder && !bookingIdParam && !orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Booking Found</h2>
          <p className="text-gray-600 mb-4">Your booking has been confirmed. Check your email for details.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#DF5D3D] text-white rounded-xl hover:bg-[#c54a2a] transition-colors font-medium"
          >
            Browse Services
          </button>
        </div>
      </div>
    );
  }

  // Use fetched booking data, fall back to order context
  const order = booking || currentOrder || {};
  const bookingDetails = order.bookingDetails || {};
  const customerInfo = order.customerInfo || {};
  
  // Determine booking status for display
  const bookingStatus = booking?.status || 'CONFIRMED';
  const statusDisplay = {
    'PENDING_PAYMENT': { label: 'Pending Payment', color: 'yellow' },
    'PROCESSING': { label: 'Processing', color: 'blue' },
    'CONFIRMED': { label: 'Confirmed', color: 'green' },
    'COMPLETED': { label: 'Completed', color: 'green' },
    'CANCELLED': { label: 'Cancelled', color: 'red' },
    'PAYMENT_FAILED': { label: 'Payment Failed', color: 'red' },
  };
  const status = statusDisplay[bookingStatus] || statusDisplay['CONFIRMED'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Your booking has been successfully confirmed
          </p>
        </div>

        {/* Booking Reference Card */}
        <div className="bg-gradient-to-r from-[#DF5D3D] to-[#e67a5f] rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-white/80">Booking Reference</p>
            <span className={`px-2 py-1 rounded text-xs font-medium bg-white/20`}>
              {status.label}
            </span>
          </div>
          <p className="text-3xl font-bold tracking-wider mb-4">{bookingReference}</p>
          <p className="text-sm text-white/90">
            {customerInfo?.email ? (
              <>A confirmation email has been sent to <span className="font-semibold">{customerInfo.email}</span></>
            ) : (
              <>Your booking has been confirmed successfully</>
            )}
          </p>
        </div>

        {/* Booking Details Card */}
        {order.serviceName && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>
            
            {/* Service Info */}
            <div className="flex items-start gap-4 pb-6 border-b border-gray-200 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#DF5D3D] to-[#e67a5f] rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                {order.serviceType === 'car' ? '🚗' : 
                 order.serviceType === 'water' ? '⛵' :
                 order.serviceType === 'resort' ? '🏨' :
                 order.serviceType === 'dining' ? '🍽️' : '📅'}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{order.serviceName}</h3>
                <p className="text-gray-600 capitalize mt-1">{order.serviceType} Service</p>
                {order.serviceLocation && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                    <MapPin className="w-4 h-4" />
                    <span>{order.serviceLocation}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookingDetails.date && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(bookingDetails.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {bookingDetails.time && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="text-base font-semibold text-gray-900">{bookingDetails.time}</p>
                  </div>
                </div>
              )}

              {bookingDetails.guests && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Guests</p>
                    <p className="text-base font-semibold text-gray-900">
                      {bookingDetails.guests} {bookingDetails.guests === 1 ? 'person' : 'people'}
                    </p>
                  </div>
                </div>
              )}

              {bookingDetails.duration && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-base font-semibold text-gray-900">
                      {bookingDetails.duration} {bookingDetails.duration === 1 ? 'hour' : 'hours'}
                    </p>
                  </div>
                </div>
              )}

              {bookingDetails.pickupLocation && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pickup Location</p>
                    <p className="text-base font-semibold text-gray-900">{bookingDetails.pickupLocation}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing Summary */}
            {order.pricing && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">₦{order.pricing.subtotal?.toLocaleString() || order.pricing.basePrice?.toLocaleString()}</span>
                  </div>
                  {order.pricing.priceBreakdown?.serviceFee > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Service Fee</span>
                      <span className="font-semibold text-gray-900">₦{order.pricing.priceBreakdown.serviceFee.toLocaleString()}</span>
                    </div>
                  )}
                  {order.pricing.priceBreakdown?.tax > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span className="font-semibold text-gray-900">₦{order.pricing.priceBreakdown.tax.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-lg font-bold text-gray-900">Total Paid</span>
                    <span className="text-xl font-bold text-[#DF5D3D]">₦{order.pricing.calculatedTotal?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Special Requests */}
            {bookingDetails.specialRequests && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Special Requests</p>
                <p className="text-gray-600">{bookingDetails.specialRequests}</p>
              </div>
            )}
          </div>
        )}

        {/* Customer Information */}
        {customerInfo?.firstName && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-base font-semibold text-gray-900">
                  {customerInfo.firstName} {customerInfo.lastName}
                </p>
              </div>
              {customerInfo.email && (
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-base font-semibold text-gray-900">{customerInfo.email}</p>
                </div>
              )}
              {customerInfo.phone && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-base font-semibold text-gray-900">{customerInfo.phone}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleDownloadReceipt}
            className="flex items-center justify-center gap-2 h-14 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Receipt
          </button>
          <button
            onClick={handleViewDashboard}
            className="flex items-center justify-center gap-2 h-14 bg-[#DF5D3D] text-white font-semibold rounded-xl hover:bg-[#c54a2a] transition-colors shadow-lg hover:shadow-xl"
          >
            <span>View Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            What's Next?
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>You'll receive a confirmation email shortly with all booking details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>The service provider will contact you 24 hours before your booking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>You can view and manage your booking from your dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>If you have any questions, our support team is here to help 24/7</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmedPage;
