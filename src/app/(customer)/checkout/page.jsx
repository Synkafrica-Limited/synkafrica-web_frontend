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
} from "lucide-react";
import { useToast } from '@/components/ui/ToastProvider';

// Order Context (same as in service details page)
const OrderContext = React.createContext();

const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null);

  const createOrder = (orderData) => {
    const order = {
      ...orderData,
      orderId: `TEMP-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentOrder', JSON.stringify(order));
    }
    
    setCurrentOrder(order);
    return order;
  };

  const clearOrder = () => {
    setCurrentOrder(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentOrder');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedOrder = localStorage.getItem('currentOrder');
      if (savedOrder) {
        setCurrentOrder(JSON.parse(savedOrder));
      }
    }
  }, []);

  return (
    <OrderContext.Provider value={{
      currentOrder,
      createOrder,
      clearOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
};

const useOrder = () => {
  const context = React.useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

// Customer Information Form Component
const CustomerInfoForm = ({ customerInfo, setCustomerInfo }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              required
              value={customerInfo.firstName}
              onChange={(e) => setCustomerInfo(prev => ({...prev, firstName: e.target.value}))}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/20 transition-all duration-200"
              placeholder="Enter your first name"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              required
              value={customerInfo.lastName}
              onChange={(e) => setCustomerInfo(prev => ({...prev, lastName: e.target.value}))}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/20 transition-all duration-200"
              placeholder="Enter your last name"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            required
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo(prev => ({...prev, email: e.target.value}))}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/20 transition-all duration-200"
            placeholder="your.email@example.com"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="tel"
            required
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo(prev => ({...prev, phone: e.target.value}))}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/20 transition-all duration-200"
            placeholder="+234 800 000 0000"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests
        </label>
        <textarea
          rows={3}
          value={customerInfo.specialRequests}
          onChange={(e) => setCustomerInfo(prev => ({...prev, specialRequests: e.target.value}))}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/20 transition-all duration-200 resize-none"
          placeholder="Any additional requirements or notes for your booking..."
        />
      </div>
    </div>
  );
};

// Payment Method Component
const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#DF5D3D] transition-colors group">
        <input
          type="radio"
          name="payment"
          value="card"
          checked={paymentMethod === 'card'}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="text-[#DF5D3D] focus:ring-[#DF5D3D]"
        />
        <CreditCard className="w-5 h-5 text-gray-600 group-hover:text-[#DF5D3D] transition-colors" />
        <div className="flex-1">
          <span className="font-medium text-gray-900">Credit/Debit Card</span>
          <p className="text-sm text-gray-500 mt-1">Pay securely with your card</p>
        </div>
        <div className="flex gap-1">
          <div className="w-8 h-5 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
          <div className="w-8 h-5 bg-yellow-500 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
        </div>
      </label>
      
      <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#DF5D3D] transition-colors group">
        <input
          type="radio"
          name="payment"
          value="transfer"
          checked={paymentMethod === 'transfer'}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="text-[#DF5D3D] focus:ring-[#DF5D3D]"
        />
        <Building className="w-5 h-5 text-gray-600 group-hover:text-[#DF5D3D] transition-colors" />
        <div className="flex-1">
          <span className="font-medium text-gray-900">Bank Transfer</span>
          <p className="text-sm text-gray-500 mt-1">Transfer directly to our bank account</p>
        </div>
      </label>
      
      <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#DF5D3D] transition-colors group">
        <input
          type="radio"
          name="payment"
          value="wallet"
          checked={paymentMethod === 'wallet'}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="text-[#DF5D3D] focus:ring-[#DF5D3D]"
        />
        <div className="w-5 h-5 text-gray-600 group-hover:text-[#DF5D3D] transition-colors">💰</div>
        <div className="flex-1">
          <span className="font-medium text-gray-900">Digital Wallet</span>
          <p className="text-sm text-gray-500 mt-1">Pay with PayPal, Apple Pay, or Google Pay</p>
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h2>
      
      {/* Service Details */}
      <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
        <div className="w-12 h-12 bg-gradient-to-br from-[#DF5D3D] to-[#e67a5f] rounded-xl flex items-center justify-center text-white text-lg">
          {getServiceIcon(order.serviceType)}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{order.serviceName}</h3>
          <p className="text-sm text-gray-600 capitalize mt-1">{order.serviceType}</p>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
            <MapPin className="w-4 h-4" />
            <span>{order.serviceLocation}</span>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="py-4 border-b border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Booking Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Date:</span>
            <span className="font-medium text-gray-900">{formatDate(order.bookingDetails.date)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Time:</span>
            <span className="font-medium text-gray-900">{order.bookingDetails.time}</span>
          </div>
          {order.bookingDetails.guests && (
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Guests:</span>
              <span className="font-medium text-gray-900">{order.bookingDetails.guests} {order.bookingDetails.guests > 1 ? 'people' : 'person'}</span>
            </div>
          )}
          {order.bookingDetails.duration && (
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium text-gray-900">{order.bookingDetails.duration} hours</span>
            </div>
          )}
          {order.bookingDetails.pickupLocation && (
            <div className="flex items-center gap-3">
              <Navigation className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Pickup:</span>
              <span className="font-medium text-gray-900">{order.bookingDetails.pickupLocation}</span>
            </div>
          )}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="py-4 border-b border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Price Breakdown</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Base rate</span>
            <span className="text-gray-900">₦{order.pricing.basePrice?.toLocaleString()}</span>
          </div>
          {order.pricing.priceBreakdown?.durationCharge > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Duration charge</span>
              <span className="text-gray-900">₦{order.pricing.priceBreakdown.durationCharge.toLocaleString()}</span>
            </div>
          )}
          {order.pricing.priceBreakdown?.guestCharge > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Guest charge</span>
              <span className="text-gray-900">₦{order.pricing.priceBreakdown.guestCharge.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Service fee</span>
            <span className="text-gray-900">₦{order.pricing.priceBreakdown?.serviceFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-900">₦{order.pricing.priceBreakdown?.tax.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="pt-4">
        <div className="flex justify-between items-center text-lg font-bold">
          <span className="text-gray-900">Total Amount</span>
          <span className="text-2xl text-[#DF5D3D]">₦{order.pricing.calculatedTotal?.toLocaleString()}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Includes all fees and taxes
        </p>
      </div>
    </div>
  );
};

// Security Features Component
const SecurityFeatures = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-6 h-6 text-green-500" />
        <h3 className="font-semibold text-gray-900">Secure Payment</h3>
      </div>
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>SSL Encrypted Connection</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>PCI DSS Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Your data is safe with us</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>No hidden fees</span>
        </div>
      </div>
    </div>
  );
};

// Main Checkout Page Component
const CheckoutPage = () => {
  const router = useRouter();
  const searchParamsString = typeof window !== 'undefined' ? window.location.search : '';
  const { currentOrder, clearOrder } = useOrder();
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

  const orderId = (typeof window !== 'undefined' && new URLSearchParams(searchParamsString).get('orderId')) || null;

  useEffect(() => {
    if (!currentOrder) {
      router.push('/');
    }
  }, [currentOrder, router]);

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

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    
    try {
      // Prepare complete order data for backend
      const completeOrderData = {
        ...currentOrder,
        customerInfo: customerInfo,
        paymentMethod: paymentMethod,
        status: 'confirmed',
        confirmedAt: new Date().toISOString()
      };

      // Simulate API call to backend
      console.log('Submitting order to backend:', completeOrderData);
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate successful payment
      const paymentSuccess = true; // In real app, this would come from payment processor
      
      if (paymentSuccess) {
        // Clear order from context and storage
        clearOrder();
        
        // Redirect to success page
        router.push('/booking-confirmed?orderId=' + orderId);
      } else {
        throw new Error('Payment failed');
      }
      
    } catch (error) {
      console.error('Order submission failed:', error);
      toast?.danger?.('Payment failed. Please try again or use a different payment method.');
    } finally {
      setIsProcessing(false);
    }
  };

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
              <span className="font-bold text-gray-900 text-lg">LuxeBook</span>
            </div>
            
            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-[#DF5D3D] text-white rounded-full">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="w-24 h-1 bg-[#DF5D3D] mx-2"></div>
            <div className="flex items-center justify-center w-8 h-8 bg-[#DF5D3D] text-white rounded-full font-semibold">
              2
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">Enter your details and make payment to confirm your reservation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Your Information</h2>
              <CustomerInfoForm 
                customerInfo={customerInfo} 
                setCustomerInfo={setCustomerInfo}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Payment Method</h2>
              <PaymentMethod 
                paymentMethod={paymentMethod} 
                setPaymentMethod={setPaymentMethod}
              />
              {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            <OrderSummary order={currentOrder} />
            <SecurityFeatures />
            
            {/* Complete Booking Button */}
            <button
              onClick={handleSubmitOrder}
              disabled={isProcessing}
              className={`w-full h-14 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#DF5D3D] text-white hover:bg-[#c54a2a] transform hover:-translate-y-0.5'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay ₦{currentOrder.pricing.calculatedTotal?.toLocaleString()}
                </>
              )}
            </button>
            
            <p className="text-center text-xs text-gray-500">
              By completing this booking, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the checkout page with OrderProvider
const CheckoutPageWithProvider = () => (
  <OrderProvider>
    <CheckoutPage />
  </OrderProvider>
);

export default CheckoutPageWithProvider;