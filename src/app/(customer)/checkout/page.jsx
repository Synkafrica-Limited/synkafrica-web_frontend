"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Shield,
  CheckCircle,
  ArrowLeft,
  Building,
  Crown,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Users,
  Navigation,
  AlertCircle,
  Loader2,
  LogIn,
} from "lucide-react";
import { useToast } from '@/components/ui/ToastProvider';
import { useOrder } from "@/context/OrderContext";
import { createBooking, getBooking } from '@/services/bookings.service';
import { initiateCheckout } from '@/services/payments.service';
import { useSession } from '@/hooks/customer/auth/useSession';



// Customer Information Form Component - Amazon Style
const CustomerInfoForm = ({ customerInfo, setCustomerInfo }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            First Name <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              required
              value={customerInfo.firstName}
              onChange={(e) => setCustomerInfo(prev => ({...prev, firstName: e.target.value}))}
              className="w-full h-9 pl-9 pr-3 rounded border border-gray-400 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] transition-all"
              placeholder="First name"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Last Name <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              required
              value={customerInfo.lastName}
              onChange={(e) => setCustomerInfo(prev => ({...prev, lastName: e.target.value}))}
              className="w-full h-9 pl-9 pr-3 rounded border border-gray-400 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] transition-all"
              placeholder="Last name"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Email Address <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
          <input
            type="email"
            required
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo(prev => ({...prev, email: e.target.value}))}
            className="w-full h-9 pl-9 pr-3 rounded border border-gray-400 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] transition-all"
            placeholder="your.email@example.com"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Phone Number <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
          <input
            type="tel"
            required
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo(prev => ({...prev, phone: e.target.value}))}
            className="w-full h-9 pl-9 pr-3 rounded border border-gray-400 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] transition-all"
            placeholder="+234 800 000 0000"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Special Requests <span className="text-gray-500 font-normal">(Optional)</span>
        </label>
        <textarea
          rows={3}
          value={customerInfo.specialRequests}
          onChange={(e) => setCustomerInfo(prev => ({...prev, specialRequests: e.target.value}))}
          className="w-full px-3 py-2 rounded border border-gray-400 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] transition-all resize-none"
          placeholder="Any additional requirements or notes..."
        />
      </div>
    </div>
  );
};

// Payment Method Component with Stripe Integration
const PaymentMethod = ({ 
  paymentMethod, 
  setPaymentMethod, 
  order, 
  customerInfo, 
  clientSecret,
  isInitializingPayment,
  paymentError,
  onPaymentSuccess, 
  isProcessing 
}) => {
  const stripePromise = typeof window !== 'undefined' ? require('@/lib/stripe').default : null;
  const stripeKey = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY : null;
  const isStripeConfigured = stripePromise && stripeKey && !stripeKey.includes('placeholder');

  return (
    <div className="space-y-4">
      <label className={`flex items-center gap-3 p-3 border rounded cursor-pointer transition-colors ${
        isStripeConfigured 
          ? 'border-gray-400 hover:border-[#FF9900]' 
          : 'border-gray-300 bg-gray-50 opacity-60 cursor-not-allowed'
      }`}>
        <input
          type="radio"
          name="payment"
          value="card"
          checked={paymentMethod === 'card'}
          onChange={(e) => isStripeConfigured && setPaymentMethod(e.target.value)}
          disabled={!isStripeConfigured}
          className="text-[#FF9900] focus:ring-[#FF9900] disabled:cursor-not-allowed"
        />
        <CreditCard className={`w-4 h-4 ${isStripeConfigured ? 'text-gray-700' : 'text-gray-400'}`} />
        <div className="flex-1">
          <span className="text-sm font-normal text-gray-900">Credit/Debit Card</span>
          <p className="text-xs text-gray-600 mt-0.5">
            {isStripeConfigured ? 'Pay securely with Stripe' : 'Stripe not configured'}
          </p>
        </div>
      </label>
      
      {paymentMethod === 'card' && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-300 rounded">
          {/* Payment initialization state */}
          {isInitializingPayment && (
            <div className="flex items-center justify-center gap-3 p-6">
              <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
              <span className="text-sm text-gray-600">Initializing secure payment...</span>
            </div>
          )}
          
          {/* Payment error state */}
          {paymentError && !isInitializingPayment && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-red-800">Payment Initialization Failed</p>
                <p className="text-xs text-red-700 mt-0.5">{paymentError}</p>
              </div>
            </div>
          )}
          
          {/* Stripe form - only show when clientSecret is available */}
          {!isInitializingPayment && !paymentError && isStripeConfigured && typeof window !== 'undefined' && (
            clientSecret ? (
              React.createElement(
                require('@/components/checkout/StripePaymentForm').default,
                {
                  stripePromise,
                  clientSecret,
                  amount: Math.round((order?.pricing?.calculatedTotal || order?.pricing?.totalAmount || 0) * 100),
                  onSuccess: onPaymentSuccess,
                  onError: (error) => console.error('Payment failed:', error),
                  customerInfo,
                }
              )
            ) : (
              <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg text-center">
                <p className="text-sm text-gray-600">
                  Fill in your details above to continue with payment
                </p>
              </div>
            )
          )}
          
          {!isStripeConfigured && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium mb-2">Stripe Configuration Required</p>
              <p className="text-xs text-yellow-700 mb-3">
                To enable card payments, please configure your Stripe publishable key:
              </p>
              <ol className="text-xs text-yellow-700 list-decimal list-inside space-y-1">
                <li>Create a <code className="bg-yellow-100 px-1 rounded">.env.local</code> file in the project root</li>
                <li>Add: <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here</code></li>
                <li>Get your key from <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="underline">Stripe Dashboard</a></li>
                <li>Restart your development server</li>
              </ol>
            </div>
          )}
        </div>
      )}
      
      <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#DF5D3D] transition-colors opacity-50 cursor-not-allowed">
        <input
          type="radio"
          name="payment"
          value="transfer"
          disabled
          className="text-[#DF5D3D] focus:ring-[#DF5D3D]"
        />
        <Building className="w-5 h-5 text-gray-400" />
        <div className="flex-1">
          <span className="font-medium text-gray-900">Bank Transfer</span>
          <p className="text-sm text-gray-500 mt-1">Coming soon</p>
        </div>
      </label>
    </div>
  );
};

// Order Summary Component
const OrderSummary = ({ order }) => {
  if (!order) return null;

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'car': return '🚗';
      case 'water': return '⛵';
      case 'resort': return '🏨';
      case 'dining': return '🍽️';
      default: return '📅';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-gray-300 rounded-md p-5">
      <h2 className="text-lg font-normal text-gray-900 mb-4 pb-3 border-b border-gray-200">Order Summary</h2>
      
      {/* Service Details */}
      <div className="flex items-start gap-3 pb-4 mb-4 border-b border-gray-200">
        <div className="w-14 h-14 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-lg flex-shrink-0">
          {getServiceIcon(order.serviceType)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-normal text-gray-900 leading-snug mb-1">{order.serviceName}</h3>
          <p className="text-xs text-gray-600 capitalize mb-1">{order.serviceType} service</p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{order.serviceLocation}</span>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="pb-4 mb-4 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2.5">Booking Details</h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-start gap-2">
            <Calendar className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-gray-600">Date: </span>
              <span className="text-gray-900">{formatDate(order.bookingDetails.date)}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-gray-600">Time: </span>
              <span className="text-gray-900">{order.bookingDetails.time}</span>
            </div>
          </div>
          {order.bookingDetails.guests && (
            <div className="flex items-start gap-2">
              <Users className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-gray-600">Guests: </span>
                <span className="text-gray-900">{order.bookingDetails.guests} {order.bookingDetails.guests > 1 ? 'people' : 'person'}</span>
              </div>
            </div>
          )}
          {order.bookingDetails.duration && (
            <div className="flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-gray-600">Duration: </span>
                <span className="text-gray-900">{order.bookingDetails.duration} hours</span>
              </div>
            </div>
          )}
          {order.bookingDetails.pickupLocation && (
            <div className="flex items-start gap-2">
              <Navigation className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-gray-600">Pickup: </span>
                <span className="text-gray-900">{order.bookingDetails.pickupLocation}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Price Breakdown - Amazon Style */}
      <div className="pb-4 mb-4 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2.5">Price Breakdown</h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-700">Subtotal:</span>
            <span className="text-gray-900">₦{order.pricing.subtotal?.toLocaleString() || order.pricing.basePrice?.toLocaleString()}</span>
          </div>
          {order.pricing.priceBreakdown?.durationCharge > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-700">Duration charge:</span>
              <span className="text-gray-900">₦{order.pricing.priceBreakdown.durationCharge.toLocaleString()}</span>
            </div>
          )}
          {order.pricing.priceBreakdown?.guestCharge > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-700">Guest charge:</span>
              <span className="text-gray-900">₦{order.pricing.priceBreakdown.guestCharge.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-700">Service fee:</span>
            <span className="text-gray-900">₦{order.pricing.priceBreakdown?.serviceFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Tax:</span>
            <span className="text-gray-900">₦{order.pricing.priceBreakdown?.tax.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Total - Amazon Style */}
      <div className="pt-2">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-base font-medium text-gray-900">Order Total:</span>
          <span className="text-xl font-normal text-gray-900">₦{order.pricing.calculatedTotal?.toLocaleString()}</span>
        </div>
        <p className="text-xs text-gray-500">
          Includes all fees and taxes
        </p>
      </div>
    </div>
  );
};

// Security Features Component - Amazon Style
const SecurityFeatures = () => {
  return (
    <div className="bg-white border border-gray-300 rounded-md p-4 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-green-700" />
        <h3 className="text-sm font-medium text-gray-900">Secure Payment</h3>
      </div>
      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3 h-3 text-green-700" />
          <span>SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3 h-3 text-green-700" />
          <span>PCI DSS Compliant</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3 h-3 text-green-700" />
          <span>No hidden fees</span>
        </div>
      </div>
    </div>
  );
};

// Main Checkout Page Component
const CheckoutPage = () => {
  const router = useRouter();
  const { currentOrder, updateOrder, clearOrder, isLoading } = useOrder();
  const { isLoggedIn, loading: isAuthLoading, user } = useSession();
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  
  // New state for payment flow
  const [bookingId, setBookingId] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // Redirect home if no order
  useEffect(() => {
    if (!isLoading && !currentOrder) {
      router.push('/');
    }
  }, [currentOrder, isLoading, router]);

  const [isWaitingForVendor, setIsWaitingForVendor] = useState(false);
  const [vendorResponseTime, setVendorResponseTime] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(false); // Added this state
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes for payment
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);

  // Polling logic for vendor acceptance
  useEffect(() => {
    let pollTimer;
    if (isWaitingForVendor && bookingId) {
      pollTimer = setInterval(async () => {
        try {
          const response = await getBooking(bookingId);
          const booking = response.data || response; // Handle different response structures
          
          if (booking.status === 'ACCEPTED' || booking.status === 'PENDING_PAYMENT' || booking.status === 'CONFIRMED') {
            setIsWaitingForVendor(false);
            setBookingSuccess(true);
            clearInterval(pollTimer);
            
            toast.addToast({
              message: 'Vendor accepted! Please proceed to payment.',
              type: 'success'
            });
          } else if (booking.status === 'REJECTED') {
            setIsWaitingForVendor(false);
            setPaymentError('Booking was rejected by the vendor. Please try another time or service.');
            clearInterval(pollTimer);
          } else if (booking.status === 'EXPIRED') {
            setIsWaitingForVendor(false);
            setPaymentError('Booking request expired. Please try again.');
            clearInterval(pollTimer);
          }
          
          // Update waiting time for UI
          setVendorResponseTime(prev => prev + 1);
          
        } catch (error) {
          console.error('Error polling booking status:', error);
        }
      }, 3000); // Poll every 3 seconds
    }
    return () => clearInterval(pollTimer);
  }, [isWaitingForVendor, bookingId, toast]); // Added toast to dependency array

  // Timer logic
  useEffect(() => {
    let timer;
    if (bookingSuccess && timeLeft > 0 && !clientSecret) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [bookingSuccess, timeLeft, clientSecret]);

  // Pre-fill customer info from user profile if available
  useEffect(() => {
    if (user && isLoggedIn) {
      setCustomerInfo(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || user.phoneNumber || prev.phone,
      }));
    }
  }, [user, isLoggedIn]);

  // Handle login redirect
  const handleLoginRedirect = () => {
    // Save current URL to redirect back after login
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectAfterLogin', window.location.href);
    }
    router.push('/login');
  };

  // Handle signup redirect
  const handleSignupRedirect = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectAfterLogin', window.location.href);
    }
    router.push('/signup');
  };


  const validateForm = () => {
    const newErrors = {};
    
    if (!customerInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!customerInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Step 1: Create Booking
   * Validates form, creates booking with PENDING_PAYMENT status
   */
  const handleCreateBooking = async () => {
    if (!validateForm()) {
      return;
    }

    setIsCreatingBooking(true);
    setPaymentError(null);

    try {
      // Transform order data to match backend API expectations
      const bookingDetails = currentOrder.bookingDetails || {};
      const duration = parseInt(bookingDetails.duration) || 1;
      const guests = parseInt(bookingDetails.guests) || 1;
      
      // Create ISO 8601 date strings from date and time
      const dateStr = bookingDetails.date; // Format: YYYY-MM-DD
      const timeStr = bookingDetails.time || '00:00'; // Format: HH:MM
      
      // Create startDate as ISO 8601
      const startDate = dateStr ? new Date(`${dateStr}T${timeStr}:00`).toISOString() : new Date().toISOString();
      
      // Calculate endDate based on duration (add hours or days depending on service type)
      const startDateTime = new Date(startDate);
      let endDateTime;
      if (currentOrder.serviceType === 'resort') {
        // For resorts, duration is in nights
        endDateTime = new Date(startDateTime.getTime() + duration * 24 * 60 * 60 * 1000);
      } else {
        // For cars, water, dining - duration is in hours
        endDateTime = new Date(startDateTime.getTime() + duration * 60 * 60 * 1000);
      }
      const endDate = endDateTime.toISOString();

      // Validate required fields
      if (!currentOrder.listingId) {
        setPaymentError('Missing listing information. Please restart the booking process from the service page.');
        toast.addToast({
          message: 'Please restart booking from the service page - your order data is outdated.',
          type: 'error'
        });
        setIsCreatingBooking(false);
        return;
      }

      // Map service type to backend enum
      const serviceTypeMap = {
        'car': 'CAR_RENTAL',
        'water': 'WATER_RECREATION', 
        'resort': 'RESORT_STAY',
        'dining': 'DINING'
      };
      const backendServiceType = serviceTypeMap[currentOrder.serviceType] || currentOrder.serviceType.toUpperCase();

      // Step 1: Create booking with PENDING_PAYMENT status
      const bookingData = {
        listingId: currentOrder.listingId,
        vendorId: currentOrder.vendorId,
        businessId: currentOrder.businessId,
        startDate: startDate,
        endDate: endDate,
        guests: guests,
        serviceType: backendServiceType,
        specialRequests: customerInfo.specialRequests || bookingDetails.specialRequests || '',
        pickupLocation: bookingDetails.pickupLocation || '',
        customerInfo: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
        },
        pricing: {
          amount: Math.round(currentOrder.pricing?.calculatedTotal || 0),
          currency: 'NGN',
        },
      };

      console.log('Creating booking...');
      const bookingResponse = await createBooking(bookingData);
      console.log('Booking created:', bookingResponse);

      const createdBookingId = bookingResponse.id || bookingResponse.bookingId;
      setBookingId(createdBookingId);
      
      // Update context with backend data if available
      if (bookingResponse.orderId) {
        updateOrder({ orderId: bookingResponse.orderId });
      }
      
      // Trigger waiting for vendor state instead of immediate success
      setIsWaitingForVendor(true);
      
      toast.addToast({
        message: 'Booking request sent! Waiting for vendor confirmation...',
        type: 'info'
      });

    } catch (error) {
      console.error('Booking creation failed:', error);
      if (error.response) {
        console.error('Error response:', JSON.stringify(error.response, null, 2));
      }
      setPaymentError(error.message || 'Failed to create booking. Please try again.');
      toast.addToast({
        message: error.message || 'Failed to create booking. Please try again.',
        type: 'error'
      });
    } finally {
      setIsCreatingBooking(false);
    }
  };

  /**
   * Step 2: Initiate Payment
   * Calls checkout endpoint to get clientSecret
   */
  const handleInitiatePayment = async () => {
    // 3. SAFE BOOKING OBJECT ACCESS
    if (!bookingId) {
      toast.addToast({
        message: "Booking information unavailable. Please refresh and try again.",
        type: 'error'
      });
      return;
    }

    setIsInitializingPayment(true);
    setPaymentError(null);

    try {
      console.log('Initializing checkout for booking:', bookingId);
      
      // Calculate amount from order
      const amount = Math.round(currentOrder.pricing?.calculatedTotal || 0);
      const currency = 'NGN';
      
      // 7. PATCH ALL CALL SITES
      await initiateCheckout({
        bookingId: bookingId,
        orderId: currentOrder.orderId, // Optional, pass if available
        amount: amount,
        currency: currency,
        customerEmail: customerInfo.email,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        serviceName: currentOrder.serviceName,
        paymentMethod: "CARD"
      })
      .then(checkoutResponse => {
        console.log('Checkout initialized:', checkoutResponse);
        setClientSecret(checkoutResponse.clientSecret);
        setPaymentIntentId(checkoutResponse.paymentIntentId);
      });

    } catch (error) {
      console.error('Payment initialization failed:', error);
      
      let errorMessage = error.message || 'Failed to initialize payment. Please try again.';
      let shouldRetry = false;
      let retryDelay = 3000;

      if (error.response) {
        console.error('FULL ERROR RESPONSE:', JSON.stringify(error.response, null, 2));
        
        // Check for rate limiting (429) or explicit RATE_LIMITED status
        if (
          (error.response.message && error.response.message.includes('429')) ||
          error.response.status === 'RATE_LIMITED' ||
          error.response.statusCode === 429
        ) {
          errorMessage = "Payment system is busy. Retrying automatically...";
          shouldRetry = true;
          
          // Use backend provided retry delay if available
          if (error.response.retryAfter) {
             // If wait time is too long (> 10s), don't auto-retry, just tell user
             if (error.response.retryAfter > 10) {
               errorMessage = `System busy. Please wait ${error.response.retryAfter} seconds before trying again.`;
               shouldRetry = false;
             } else {
               retryDelay = Math.min(error.response.retryAfter * 1000, 5000);
             }
          }
        }
      }

      // 8. ADD FRONTEND-SAFE ERROR HANDLING
      if (errorMessage === "MISSING_BOOKING_IDENTIFIER") {
        errorMessage = "Unable to continue — booking reference missing.";
      }

      setPaymentError(errorMessage);
      toast.addToast({
        message: errorMessage,
        type: shouldRetry ? 'info' : 'error'
      });

      // Retry once if it's a rate limit error
      if (shouldRetry) {
        setTimeout(async () => {
          try {
            console.log('Retrying payment initialization...');
            const retryResponse = await initiateCheckout({
              bookingId: bookingId,
              orderId: currentOrder.orderId,
              amount: amount,
              currency: currency,
              customerEmail: customerInfo.email,
              customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
              serviceName: currentOrder.serviceName,
              paymentMethod: "CARD"
            });
            console.log('Retry successful:', retryResponse);
            setClientSecret(retryResponse.clientSecret);
            setPaymentIntentId(retryResponse.paymentIntentId);
            setPaymentError(null);
          } catch (retryError) {
            console.error('Retry failed:', retryError);
            setPaymentError("Payment system is currently unavailable. Please try again later.");
            toast.addToast({
              message: "Payment system is currently unavailable. Please try again later.",
              type: 'error'
            });
          } finally {
            setIsInitializingPayment(false);
          }
        }, retryDelay); 
        return; // Exit function to keep loading state true
      }
      
      // Only turn off loading if we are NOT retrying
      setIsInitializingPayment(false);

    }
  };

  /**
   * Handle successful payment from Stripe
   * Note: We don't trust this fully - Core will update via webhook
   * We just redirect to confirmation page
   */
  const handlePaymentSuccess = async (paymentResult) => {
    console.log('Payment confirmed by Stripe:', paymentResult);
    
    // Clear order from context and storage
    clearOrder();
    
    // Redirect to confirmation page
    // Core will update booking status via webhook from Payments MS
    router.push(`/booking-confirmed?bookingId=${bookingId}&paymentIntentId=${paymentResult.id}`);
  };

  // Helper to format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (isLoading || isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DF5D3D] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-[#DF5D3D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-8 h-8 text-[#DF5D3D]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-600 mb-6">
              Please log in or create an account to complete your booking. Your order will be saved.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleLoginRedirect}
                className="w-full py-3 bg-[#DF5D3D] text-white rounded-lg font-semibold hover:bg-[#c54a2a] transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Log In
              </button>
              <button
                onClick={handleSignupRedirect}
                className="w-full py-3 bg-white text-[#DF5D3D] border-2 border-[#DF5D3D] rounded-lg font-semibold hover:bg-[#DF5D3D]/5 transition-colors"
              >
                Create Account
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => router.back()}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to booking
              </button>
            </div>
          </div>
          
          {/* Order summary preview */}
          {currentOrder && (
            <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-2">Your order:</p>
              <p className="font-medium text-gray-900">{currentOrder.serviceName}</p>
              <p className="text-sm text-gray-600">₦{currentOrder.pricing?.calculatedTotal?.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Order</h2>
          <p className="text-gray-600 mb-4">Please complete a booking first.</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            {/* Brand Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#DF5D3D] rounded-lg flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900 text-lg">SynkAfrica</span>
            </div>
            
            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header - Amazon Style */}
        <div className="mb-6">
          <h1 className="text-2xl font-normal text-gray-900 mb-1">Checkout</h1>
          <p className="text-sm text-gray-600">Review your order and complete payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information - Amazon Style */}
            <div className="bg-white border border-gray-300 rounded-md p-5 mb-4">
              <h2 className="text-lg font-normal text-gray-900 mb-4 pb-3 border-b border-gray-200">Your Information</h2>
              <CustomerInfoForm 
                customerInfo={customerInfo} 
                setCustomerInfo={setCustomerInfo}
              />
              {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
              {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
              {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
              
              {/* Create Booking Button */}
              {!bookingSuccess && !isWaitingForVendor && (
                <button
                  onClick={handleCreateBooking}
                  disabled={isCreatingBooking}
                  className="mt-4 w-full h-10 bg-[#DF5D3D] text-white rounded font-medium text-sm hover:bg-[#c54a2a] transition-colors flex items-center justify-center gap-2"
                >
                  {isCreatingBooking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Booking...
                    </>
                  ) : (
                    'Create Booking'
                  )}
                </button>
              )}
            </div>

            {/* Waiting for Vendor UI */}
            {isWaitingForVendor && (
              <div className="bg-white border border-gray-300 rounded-md p-8 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Waiting for Confirmation</h3>
                <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
                  We've sent your request to the vendor. Please wait while they confirm availability. This usually takes less than a minute.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>Time elapsed: {vendorResponseTime}s</span>
                </div>
              </div>
            )}

            {/* Payment Method - Amazon Style */}
            {bookingSuccess && (
              <div className="bg-white border border-gray-300 rounded-md p-5">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                  <h2 className="text-lg font-normal text-gray-900">Payment Method</h2>
                  {/* Timer Display */}
                  {!clientSecret && timeLeft > 0 && (
                    <div className="flex items-center gap-2 text-[#DF5D3D] font-medium bg-red-50 px-3 py-1 rounded-full text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Expires in {formatTime(timeLeft)}</span>
                    </div>
                  )}
                </div>
                {!clientSecret && (
                  <button
                    onClick={handleInitiatePayment}
                    disabled={isInitializingPayment || !bookingId}
                    className={`mt-4 w-full h-10 text-white rounded font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                      isInitializingPayment || !bookingId 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-[#DF5D3D] hover:bg-[#c54a2a]'
                    }`}
                  >
                    {isInitializingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Initializing Payment...
                      </>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </button>
                )}
                {clientSecret && (
                  <PaymentMethod 
                    paymentMethod={paymentMethod} 
                    setPaymentMethod={setPaymentMethod}
                    order={currentOrder}
                    customerInfo={customerInfo}
                    clientSecret={clientSecret}
                    isInitializingPayment={isInitializingPayment}
                    paymentError={paymentError}
                    onPaymentSuccess={handlePaymentSuccess}
                    // isProcessing={isProcessing} // Assuming isProcessing is defined elsewhere if needed
                  />
                )}
                {paymentError && <p className="text-red-500 text-sm mt-1">{paymentError}</p>}
                {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
              </div>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            <OrderSummary order={currentOrder} />
            <SecurityFeatures />
            
            <p className="text-center text-xs text-gray-500">
              By completing this booking, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;