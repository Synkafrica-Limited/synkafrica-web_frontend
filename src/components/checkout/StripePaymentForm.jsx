"use client";

import React, { useState } from 'react';
import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#1f2937',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#9ca3af',
      },
      padding: '12px',
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: false,
};

/**
 * StripePaymentFormContent - Handles card input and payment confirmation
 * 
 * Architecture note: This component receives clientSecret from the parent.
 * The clientSecret was obtained from Core → Payments MS → Stripe.
 * We only confirm the payment here using Stripe.js.
 * 
 * @param {string} clientSecret - Stripe PaymentIntent clientSecret (from Core checkout endpoint)
 * @param {number} amount - Amount in smallest currency unit (kobo for NGN)
 * @param {function} onSuccess - Callback on successful payment
 * @param {function} onError - Callback on payment error
 * @param {object} customerInfo - Customer billing details
 */
const StripePaymentFormContent = ({ clientSecret, amount, onSuccess, onError, customerInfo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cardComplete, setCardComplete] = useState(false);

  // Check if Stripe is properly initialized
  if (!stripe) {
    return (
      <div className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800 mb-1">Stripe Not Configured</p>
            <p className="text-sm text-yellow-700">
              Please configure your Stripe publishable key in the environment variables.
              Set <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> in your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file.
            </p>
            <p className="text-xs text-yellow-600 mt-2">
              Get your key from: <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="underline">Stripe Dashboard</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if clientSecret is provided
  if (!clientSecret) {
    return (
      <div className="p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800 mb-1">Payment Not Initialized</p>
            <p className="text-sm text-yellow-700">
              Waiting for payment to be initialized. Please try again in a moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setErrorMessage('Card element not found');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Step 1: Create payment method with card details
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: customerInfo ? `${customerInfo.firstName} ${customerInfo.lastName}` : undefined,
          email: customerInfo?.email,
          phone: customerInfo?.phone,
        },
      });

      if (paymentMethodError) {
        setErrorMessage(paymentMethodError.message);
        if (onError) {
          onError(paymentMethodError);
        }
        setIsProcessing(false);
        return;
      }

      // Step 2: Confirm payment with the clientSecret from Core
      // The PaymentIntent was already created by Core → Payments MS
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setErrorMessage(confirmError.message);
        if (onError) {
          onError(confirmError);
        }
        setIsProcessing(false);
        return;
      }

      // Step 3: Handle payment result
      if (paymentIntent.status === 'succeeded') {
        // Payment successful - Core will be notified via webhook
        // We just redirect/callback here - don't trust this for final status
        if (onSuccess) {
          onSuccess({
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount,
            paymentMethod: paymentMethod.id,
          });
        }
      } else if (paymentIntent.status === 'requires_action') {
        // Handle 3D Secure or other actions
        const { error: actionError } = await stripe.handleCardAction(clientSecret);
        
        if (actionError) {
          setErrorMessage(actionError.message);
          if (onError) {
            onError(actionError);
          }
          setIsProcessing(false);
          return;
        }

        // Retry confirmation after action
        const { error: retryError, paymentIntent: retryPaymentIntent } = await stripe.confirmCardPayment(clientSecret);
        
        if (retryError) {
          setErrorMessage(retryError.message);
          if (onError) {
            onError(retryError);
          }
          setIsProcessing(false);
          return;
        }

        if (retryPaymentIntent.status === 'succeeded' && onSuccess) {
          onSuccess({
            id: retryPaymentIntent.id,
            status: retryPaymentIntent.status,
            amount: retryPaymentIntent.amount,
            paymentMethod: paymentMethod.id,
          });
        }
      } else if (paymentIntent.status === 'processing') {
        // Payment is processing - redirect and let webhook handle final status
        if (onSuccess) {
          onSuccess({
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount,
            paymentMethod: paymentMethod.id,
          });
        }
      } else {
        throw new Error(`Unexpected payment status: ${paymentIntent.status}`);
      }

    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
      if (onError) {
        onError(error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Card Input - Amazon Style */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Card Information
        </label>
        <div className="relative">
          <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
            <CreditCard className="w-4 h-4 text-gray-500" />
          </div>
          <div className="pl-9 pr-3 py-2.5 rounded border border-gray-400 focus-within:border-[#FF9900] focus-within:ring-1 focus-within:ring-[#FF9900] transition-all bg-white">
            <CardElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={(e) => {
                setCardComplete(e.complete);
                if (e.error) {
                  setErrorMessage(e.error.message);
                } else {
                  setErrorMessage('');
                }
              }}
            />
          </div>
        </div>
        
        {/* Test Card Info - Amazon Style */}
        <div className="mt-2 p-2.5 bg-blue-50 border border-blue-200 rounded text-xs">
          <p className="text-blue-800 font-medium mb-1">Test Mode - Use test card:</p>
          <p className="text-blue-700 font-mono">4242 4242 4242 4242</p>
          <p className="text-blue-600 mt-0.5">Any future date, any 3-digit CVC</p>
        </div>
      </div>

      {/* Error Message - Amazon Style */}
      {errorMessage && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-red-800">Payment Error</p>
            <p className="text-xs text-red-700 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Security Badge - Amazon Style */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-600 pt-2 border-t border-gray-200">
        <Lock className="w-3 h-3" />
        <span>Secured by Stripe • PCI DSS Compliant</span>
      </div>

      {/* Submit Button - Amazon Style */}
      <button
        type="submit"
        disabled={!stripe || !cardComplete || isProcessing || !clientSecret}
        className={`w-full h-10 rounded border font-medium text-sm transition-all flex items-center justify-center gap-2 ${
          !stripe || !cardComplete || isProcessing || !clientSecret
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
            : 'bg-[#FFD814] hover:bg-[#FCD200] text-gray-900 border-[#D5D9D9] shadow-sm hover:shadow-md active:shadow-sm'
        }`}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent"></div>
            Processing...
          </>
        ) : (
          <>
            <Lock className="w-3.5 h-3.5" />
            Pay ₦{(amount / 100).toLocaleString()}
          </>
        )}
      </button>
    </form>
  );
};

/**
 * StripePaymentForm - Wrapper component with Stripe Elements provider
 * 
 * @param {Promise} stripePromise - Stripe.js promise from loadStripe
 * @param {string} clientSecret - PaymentIntent clientSecret from Core checkout
 * @param {number} amount - Amount in smallest currency unit
 * @param {function} onSuccess - Success callback
 * @param {function} onError - Error callback
 * @param {object} customerInfo - Customer billing info
 */
const StripePaymentForm = ({ stripePromise, clientSecret, amount, onSuccess, onError, customerInfo }) => {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentFormContent
        clientSecret={clientSecret}
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
        customerInfo={customerInfo}
      />
    </Elements>
  );
};

export default StripePaymentForm;
