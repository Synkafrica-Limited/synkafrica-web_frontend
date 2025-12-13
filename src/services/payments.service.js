import { api } from '../lib/fetchClient';

/**
 * Payment Service - Core ↔ Payments MS Architecture
 * 
 * This service handles payment operations through Core API.
 * Core internally communicates with the Payments Microservice.
 * Frontend never calls Payments MS directly.
 */

/**
 * Initiate checkout to get clientSecret for Stripe payment
 * Core → Payments MS: Creates PaymentIntent and returns clientSecret
 * 
 * @param {string} bookingId - The booking ID (used as idempotency key)
 * @returns {Promise<{success: boolean, paymentIntentId: string, clientSecret: string, amount: number, currency: string, bookingId: string, orderId: string}>}
 */
export function initiateCheckout(payload) {
  const { bookingId, orderId } = payload;

  // 1. HARD VALIDATION BEFORE CALLING CHECKOUT
  if (!bookingId && !orderId) {
    console.error("[CHECKOUT] Missing booking identifier", { bookingId, orderId });
    // toast.error("Unable to continue — booking reference missing."); // Service shouldn't toast, UI should handle
    throw new Error("MISSING_BOOKING_IDENTIFIER");
  }

  // 5. ENABLE DEV-ONLY DIAGNOSTICS
  if (process.env.NODE_ENV === "development") {
    console.log("[CHECKOUT] bookingId:", bookingId);
    console.log("[CHECKOUT] orderId:", orderId);
  }

  // 2. STRICT PAYLOAD SHAPE FOR BACKEND
  const strictPayload = {
    bookingId: payload.bookingId,
    orderId: payload.orderId,
    amount: payload.amount,
    currency: payload.currency,
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    serviceName: payload.serviceName,
    paymentMethod: "CARD"
  };

  return api.post('/api/payments/checkout', strictPayload, { auth: true });
}

/**
 * Get payment status for a PaymentIntent
 * Used for checking payment status after redirect or for dashboards
 * 
 * @param {string} paymentIntentId - Stripe PaymentIntent ID
 * @returns {Promise<{success: boolean, status: string, paymentIntentId: string}>}
 */
export function getPaymentStatus(paymentIntentId) {
  return api.post('/api/payments/status', { stripePaymentIntentId: paymentIntentId }, { auth: true });
}

/**
 * Request a refund for a payment
 * Core → Payments MS → Stripe
 * 
 * @param {object} params - Refund parameters
 * @param {string} [params.orderId] - Order ID
 * @param {string} [params.bookingId] - Booking ID  
 * @param {string} [params.stripePaymentIntentId] - Stripe PaymentIntent ID
 * @param {number} params.amount - Amount to refund
 * @param {string} params.currency - Currency code
 * @param {string} [params.reason] - Reason for refund
 * @returns {Promise<{success: boolean, refundId: string, status: string}>}
 */
export function requestRefund({ orderId, bookingId, stripePaymentIntentId, amount, currency, reason }) {
  return api.post('/api/payments/refund', {
    orderId,
    bookingId,
    stripePaymentIntentId,
    amount,
    currency,
    reason,
  }, { auth: true });
}

const paymentsService = {
  initiateCheckout,
  getPaymentStatus,
  requestRefund,
};

export default paymentsService;
