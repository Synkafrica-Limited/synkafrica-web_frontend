"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const router = useRouter();
  const [bookingState, setBookingState] = useState({
    service: null,
    preferences: null,
    customerInfo: null,
    paymentIntent: null,
  });

  // Load booking state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBooking = localStorage.getItem('currentBooking');
      if (savedBooking) {
        try {
          setBookingState(JSON.parse(savedBooking));
        } catch (error) {
          console.error('Failed to parse saved booking:', error);
          localStorage.removeItem('currentBooking');
        }
      }
    }
  }, []);

  // Save booking state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && bookingState.service) {
      localStorage.setItem('currentBooking', JSON.stringify(bookingState));
    }
  }, [bookingState]);

  const startBooking = (service) => {
    setBookingState({
      ...bookingState,
      service,
      preferences: null,
      customerInfo: null,
      paymentIntent: null,
    });
  };

  const updatePreferences = (preferences) => {
    setBookingState({
      ...bookingState,
      preferences,
    });
  };

  const updateCustomerInfo = (customerInfo) => {
    setBookingState({
      ...bookingState,
      customerInfo,
    });
  };

  const setPaymentIntent = (paymentIntent) => {
    setBookingState({
      ...bookingState,
      paymentIntent,
    });
  };

  const proceedToCheckout = () => {
    if (!bookingState.service || !bookingState.preferences) {
      console.error('Cannot proceed to checkout without service and preferences');
      return;
    }
    router.push('/checkout');
  };

  const clearBooking = () => {
    setBookingState({
      service: null,
      preferences: null,
      customerInfo: null,
      paymentIntent: null,
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentBooking');
    }
  };

  const calculateTotalPrice = () => {
    if (!bookingState.service || !bookingState.preferences) {
      return 0;
    }

    const { service, preferences } = bookingState;
    let basePrice = service.price || 0;
    let total = basePrice;

    // Service-specific pricing calculations
    switch (service.serviceType) {
      case 'car':
        // Calculate based on duration if applicable
        if (preferences.duration) {
          total = basePrice * preferences.duration;
        }
        // Add extras
        if (preferences.extras) {
          Object.values(preferences.extras).forEach(extra => {
            if (extra.selected && extra.price) {
              total += extra.price;
            }
          });
        }
        break;

      case 'dining':
        // Multiply by number of guests if price is per person
        if (preferences.guests && service.pricePerPerson) {
          total = basePrice * preferences.guests;
        }
        break;

      case 'resort':
        // Calculate based on nights and rooms
        if (preferences.nights && preferences.rooms) {
          total = basePrice * preferences.nights * preferences.rooms;
        }
        // Add meal plan if selected
        if (preferences.mealPlan && preferences.mealPlan.price) {
          total += preferences.mealPlan.price * preferences.nights;
        }
        break;

      case 'water':
        // Calculate based on participants
        if (preferences.participants) {
          total = basePrice * preferences.participants;
        }
        // Add equipment rental
        if (preferences.equipment) {
          Object.values(preferences.equipment).forEach(item => {
            if (item.selected && item.price) {
              total += item.price;
            }
          });
        }
        break;

      default:
        total = basePrice;
    }

    // Add service fee (10%)
    const serviceFee = total * 0.1;
    // Add tax (7.5% VAT in Nigeria)
    const tax = total * 0.075;

    return {
      basePrice: total,
      serviceFee,
      tax,
      total: total + serviceFee + tax,
    };
  };

  const value = {
    bookingState,
    startBooking,
    updatePreferences,
    updateCustomerInfo,
    setPaymentIntent,
    proceedToCheckout,
    clearBooking,
    calculateTotalPrice,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;
