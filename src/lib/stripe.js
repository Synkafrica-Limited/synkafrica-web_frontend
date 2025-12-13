import { loadStripe } from '@stripe/stripe-js';

// Get Stripe publishable key from environment
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Validate that Stripe key is configured
if (!stripePublishableKey || stripePublishableKey.includes('placeholder')) {
  console.warn(
    '⚠️ Stripe publishable key is not configured!\n' +
    'Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your .env.local file.\n' +
    'Get your key from: https://dashboard.stripe.com/apikeys'
  );
}

// Initialize Stripe with publishable key
// Only load Stripe if a valid key is provided
const stripePromise = stripePublishableKey && !stripePublishableKey.includes('placeholder')
  ? loadStripe(stripePublishableKey)
  : null;

export default stripePromise;
