/**
 * Initial Form States for Listing Categories
 * Enforces strict typing matches with backend expectations.
 * 
 * Rules:
 * - Arrays must be initialized as []
 * - Strings must be ""
 * - Numbers must be "" (for UI inputs) or 0, but strictly converted before submit
 * - Enums must use valid backend values or allowed UI defaults
 */

import { BACKEND_ENUMS } from '@/config/listingSchemas';

// Helper to get initial state for common fields
const baseFormState = {
  title: "",
  description: "",
  basePrice: "", // UI handles as string, converted to number
  currency: "NGN",
  location: {
    address: "",
    city: "",
    state: "Lagos", // Default
    country: "Nigeria",
  },
  status: BACKEND_ENUMS.LISTING_STATUS.ACTIVE,
  images: [], // Array of { file, preview } objects
};

export const INITIAL_FORM_STATES = {
  CAR_RENTAL: {
    ...baseFormState,
    // Required Category Fields
    carMake: "",
    carModel: "",
    carYear: "", // number
    carSeats: "", // number
    carTransmission: "", // enum
    carFuelType: "", // enum
    carPlateNumber: "",
    
    // Optional
    carFeatures: [],
    chauffeurIncluded: false,
    chauffeurPricePerDay: "",
    chauffeurPricePerHour: "",
    insuranceCoverage: true,
  },

  RESORT: {
    ...baseFormState,
    // Required Category Fields
    resortType: "", // enum (backend)
    roomType: "", // enum
    capacity: "", // number
    
    // Frontend logic / Optional
    packageType: "", // enum (Accommodation)
    experienceType: "", // enum (Experience)
    duration: "",
    pricePerGroup: "",
    activities: [], // replaces attractions
    inclusions: [],
    availableDates: "",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    advanceBookingRequired: false,
    minimumAdvanceHours: 0,
    amenities: [],
  },

  FINE_DINING: {
    ...baseFormState,
    // Required
    diningType: "", // enum
    
    // Optional
    cuisineType: [], // enum array
    capacity: "", // seatingCapacity
    openingHours: "",
    menuItems: [], // { name, price, description }
    priceRange: "", // basePrice often derived from this
    specialties: [],
    amenities: [], // diningAmenities
    dressCode: "", // enum
    reservationRequired: false,
  },

  CONVENIENCE_SERVICE: {
    ...baseFormState,
    // Required
    serviceType: "", // enum
    serviceDescription: "", // maps to description or specific field if needed
    
    // Optional
    pricingType: "FIXED", // enum (FIXED | HOURLY)
    fixedPrice: "",
    hourlyRate: "",
    minimumOrder: "",
    deliveryFee: "",
    features: [], // serviceFeatures
    availability: [], // availableDays
    responseTime: "30", // minutes
    advanceBooking: false,
  },
};

/**
 * Validates and sanitizes numeric input
 * @param {string} value 
 * @returns {string} Only numeric chars
 */
export const sanitizeNumber = (value) => {
  return value.replace(/[^0-9]/g, '');
};

/**
 * Safely parses a number from string, returning undefined if invalid
 * @param {string|number} value 
 * @returns {number|undefined}
 */
export const safeParseInt = (value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? undefined : parsed;
};
