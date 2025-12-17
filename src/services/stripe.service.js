import { api } from '../lib/fetchClient';

/**
 * Create a payment intent for a booking
 * @param {number} amount - Amount in smallest currency unit (kobo for NGN)
 * @param {object} bookingData - Booking details
 * @returns {Promise} Payment intent response
 */
export function createPaymentIntent(amount, bookingData) {
  return api.post('/api/payments/create-intent', {
    amount,
    currency: 'ngn',
    bookingData,
  }, { auth: true });
}

/**
 * Confirm a payment intent
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @param {string} paymentMethodId - Stripe payment method ID
 * @returns {Promise} Confirmation response
 */
export function confirmPayment(paymentIntentId, paymentMethodId) {
  return api.post('/api/payments/confirm', {
    paymentIntentId,
    paymentMethodId,
  }, { auth: true });
}

/**
 * Retrieve payment intent status
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @returns {Promise} Payment intent details
 */
export function retrievePaymentIntent(paymentIntentId) {
  return api.get(`/api/payments/intent/${paymentIntentId}`, { auth: true });
}

/**
 * Create a booking after successful payment
 * @param {object} bookingData - Complete booking data
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @returns {Promise} Booking creation response
 */
export function createBookingWithPayment(bookingData, paymentIntentId) {
  return api.post('/api/bookings', {
    ...bookingData,
    paymentIntentId,
    paymentStatus: 'paid',
  }, { auth: true });
}

const stripeService = {
  createPaymentIntent,
  confirmPayment,
  retrievePaymentIntent,
  createBookingWithPayment,
};

export default stripeService;
