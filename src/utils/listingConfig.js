/**
 * Centralized configuration for Listing Categories
 * Defines enums, mappings, and validation rules per category.
 */

export const LISTING_CATEGORIES = {
  RESORT: 'RESORT',
  FINE_DINING: 'FINE_DINING',
  CAR_RENTAL: 'CAR_RENTAL',
  CONVENIENCE_SERVICE: 'CONVENIENCE_SERVICE',
};

export const ListingCategoryConfig = {
  [LISTING_CATEGORIES.RESORT]: {
    enums: {
      packageType: {
        "Beach Party Package": "BEACH_PARTY_PACKAGE",
        "Water Sports Package": "WATER_SPORTS_PACKAGE",
        "Boat Cruise": "BOAT_CRUISE",
        "Resort Day Pass": "RESORT_DAY_PASS",
        "Weekend Getaway": "WEEKEND_GETAWAY",
        "Custom Package": "CUSTOM_PACKAGE",
      },
      roomType: {
        "Standard": "STANDARD",
        "Deluxe": "DELUXE",
        "Suite": "SUITE",
        "Villa": "VILLA",
      }
    },
    requiredFields: ['packageType', 'duration', 'capacity', 'pricePerPerson'],
    optionalFields: ['roomType', 'inclusions', 'activities', 'availableDates', 'pricePerGroup', 'bookingAdvanceHours'],
  },
  [LISTING_CATEGORIES.FINE_DINING]: {
    enums: {
      cuisineType: {
        // Multi-select, so we map individual items
        "Nigerian": "NIGERIAN",
        "Continental": "CONTINENTAL",
        "Asian": "ASIAN",
        "Italian": "ITALIAN",
        "French": "FRENCH",
        "Mediterranean": "MEDITERRANEAN",
        "Seafood": "SEAFOOD",
        "Steakhouse": "STEAKHOUSE",
        "Fusion": "FUSION",
        "Vegan/Vegetarian": "VEGAN_VEGETARIAN",
      },
      diningType: {
        "Fine Dining": "FINE_DINING",
        "Casual Dining": "CASUAL_DINING",
        "Fast Casual": "FAST_CASUAL",
        "Buffet": "BUFFET",
        "Cafe": "CAFE",
        "Bistro": "BISTRO",
      },
      dressCode: {
        "Casual": "CASUAL",
        "Smart Casual": "SMART_CASUAL",
        "Formal": "FORMAL",
        "Black Tie": "BLACK_TIE",
      }
    },
    requiredFields: ['cuisineType', 'diningType', 'seatingCapacity', 'priceRange'],
    optionalFields: ['diningAmenities', 'specialties', 'openingHours', 'dressCode', 'reservationRequired', 'menuItems'],
  },
  [LISTING_CATEGORIES.CAR_RENTAL]: {
    enums: {
      carTransmission: {
        "Automatic": "AUTOMATIC",
        "Manual": "MANUAL",
      },
      carFuelType: {
        "Petrol": "PETROL",
        "Diesel": "DIESEL",
        "Electric": "ELECTRIC",
        "Hybrid": "HYBRID",
      }
    },
    requiredFields: ['carMake', 'carModel', 'carYear', 'carPlateNumber', 'carSeats', 'carTransmission', 'carFuelType'],
    optionalFields: ['carFeatures', 'chauffeurIncluded', 'chauffeurPricePerDay', 'chauffeurPricePerHour', 'insuranceCoverage'],
  },
  [LISTING_CATEGORIES.CONVENIENCE_SERVICE]: {
    enums: {
      serviceType: {
        "Delivery Service": "DELIVERY_SERVICE",
        "Rent a Chef": "RENT_A_CHEF",
        "Personal Shopping": "PERSONAL_SHOPPING",
        "Laundry Service": "LAUNDRY_SERVICE",
        "Cleaning Service": "CLEANING_SERVICE",
        "Pet Care": "PET_CARE",
        "Babysitting": "BABYSITTING",
        "Home Maintenance": "HOME_MAINTENANCE",
        "Event Planning": "EVENT_PLANNING",
        "Other": "OTHER",
      },
      priceType: {
        "Fixed Price": "FIXED",
        "Hourly Rate": "HOURLY",
      }
    },
    requiredFields: ['serviceType', 'priceType', 'responseTime'],
    optionalFields: ['fixedPrice', 'hourlyRate', 'minimumOrder', 'deliveryFee', 'serviceFeatures', 'availableDays', 'advanceBooking'],
  },
};

/**
 * Normalize a value to its backend enum representation.
 * @param {string} category - The listing category.
 * @param {string} field - The field name (e.g., 'packageType').
 * @param {string} value - The UI value to normalize.
 * @returns {string} - The normalized backend enum value.
 */
export function normalizeEnum(category, field, value) {
  if (!value) return undefined;
  
  const config = ListingCategoryConfig[category];
  if (!config || !config.enums || !config.enums[field]) {
    // Fallback: Uppercase and replace spaces with underscores
    return typeof value === 'string' ? value.toUpperCase().replace(/\s+/g, '_') : value;
  }

  const map = config.enums[field];
  // Check if value is already a valid enum key (backend value)
  const backendValues = Object.values(map);
  if (backendValues.includes(value)) return value;

  // Check if value matches a key (UI label)
  if (map[value]) return map[value];

  // Case-insensitive check
  const lowerValue = value.toLowerCase();
  const foundKey = Object.keys(map).find(k => k.toLowerCase() === lowerValue);
  if (foundKey) return map[foundKey];

  // Fallback
  return value.toUpperCase().replace(/\s+/g, '_');
}

/**
 * Denormalize a backend enum value to its UI label.
 * @param {string} category - The listing category.
 * @param {string} field - The field name.
 * @param {string} value - The backend enum value.
 * @returns {string} - The UI label.
 */
export function denormalizeEnum(category, field, value) {
  if (!value) return '';

  const config = ListingCategoryConfig[category];
  if (!config || !config.enums || !config.enums[field]) {
    // Fallback: Title Case
    return value.replace(/_/g, ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  }

  const map = config.enums[field];
  // Find key by value
  const entry = Object.entries(map).find(([k, v]) => v === value);
  return entry ? entry[0] : value;
}

/**
 * Get configuration for a specific category
 */
export function getCategoryConfig(category) {
  return ListingCategoryConfig[category] || {};
}
