/**
 * Single Source of Truth for Listing Schemas
 * Defines per-category validation rules, enums, and field mappings
 */

// Backend enum values - MUST match backend exactly
export const BACKEND_ENUMS = {
  // Resort enums
  RESORT_TYPE: {
    HOTEL: 'HOTEL',
    VILLA: 'VILLA',
    APARTMENT: 'APARTMENT',
    LODGE: 'LODGE',
    COTTAGE: 'COTTAGE',
    RESORT: 'RESORT',
  },
  PACKAGE_TYPE: {
    FULL_BOARD: 'FULL_BOARD',
    HALF_BOARD: 'HALF_BOARD',
    BED_AND_BREAKFAST: 'BED_AND_BREAKFAST',
    ROOM_ONLY: 'ROOM_ONLY',
    ALL_INCLUSIVE: 'ALL_INCLUSIVE',
  },
  EXPERIENCE_TYPE: {
    BEACH_PARTY_PACKAGE: 'BEACH_PARTY_PACKAGE',
    WATER_SPORTS_PACKAGE: 'WATER_SPORTS_PACKAGE',
    BOAT_CRUISE: 'BOAT_CRUISE',
    RESORT_DAY_PASS: 'RESORT_DAY_PASS',
    WEEKEND_GETAWAY: 'WEEKEND_GETAWAY',
    CUSTOM_PACKAGE: 'CUSTOM_PACKAGE',
  },
  ROOM_TYPE: {
    STANDARD: 'STANDARD',
    DELUXE: 'DELUXE',
    SUITE: 'SUITE',
    VILLA: 'VILLA',
  },
  
  // Car Rental enums
  CAR_TRANSMISSION: {
    AUTOMATIC: 'AUTOMATIC',
    MANUAL: 'MANUAL',
  },
  CAR_FUEL_TYPE: {
    PETROL: 'PETROL',
    DIESEL: 'DIESEL',
    ELECTRIC: 'ELECTRIC',
    HYBRID: 'HYBRID',
  },
  
  // Fine Dining enums
  CUISINE_TYPE: {
    NIGERIAN: 'NIGERIAN',
    CONTINENTAL: 'CONTINENTAL',
    ASIAN: 'ASIAN',
    ITALIAN: 'ITALIAN',
    FRENCH: 'FRENCH',
    MEDITERRANEAN: 'MEDITERRANEAN',
    SEAFOOD: 'SEAFOOD',
    STEAKHOUSE: 'STEAKHOUSE',
    FUSION: 'FUSION',
    VEGAN_VEGETARIAN: 'VEGAN_VEGETARIAN',
  },
  DINING_TYPE: {
    FINE_DINING: 'FINE_DINING',
    CASUAL_DINING: 'CASUAL_DINING',
    FAST_CASUAL: 'FAST_CASUAL',
    BUFFET: 'BUFFET',
    CAFE: 'CAFE',
    BISTRO: 'BISTRO',
  },
  DRESS_CODE: {
    CASUAL: 'CASUAL',
    SMART_CASUAL: 'SMART_CASUAL',
    FORMAL: 'FORMAL',
    BLACK_TIE: 'BLACK_TIE',
  },
  
  // Convenience Service enums
  SERVICE_TYPE: {
    DELIVERY_SERVICE: 'DELIVERY_SERVICE',
    RENT_A_CHEF: 'RENT_A_CHEF',
    PERSONAL_SHOPPING: 'PERSONAL_SHOPPING',
    LAUNDRY_SERVICE: 'LAUNDRY_SERVICE',
    CLEANING_SERVICE: 'CLEANING_SERVICE',
    PET_CARE: 'PET_CARE',
    BABYSITTING: 'BABYSITTING',
    HOME_MAINTENANCE: 'HOME_MAINTENANCE',
    EVENT_PLANNING: 'EVENT_PLANNING',
    OTHER: 'OTHER',
  },
  PRICING_TYPE: {
    FIXED: 'FIXED',
    HOURLY: 'HOURLY',
    PER_UNIT: 'PER_UNIT',
    CUSTOM: 'CUSTOM',
  },
  
  // Status enums
  LISTING_STATUS: {
    DRAFT: 'DRAFT',
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
  },
};

// UI Label to Backend Enum mappings
export const ENUM_MAPPINGS = {
  RESORT: {
    packageType: {
      'Full Board': 'FULL_BOARD',
      'Half Board': 'HALF_BOARD',
      'Bed and Breakfast': 'BED_AND_BREAKFAST',
      'Room Only': 'ROOM_ONLY',
      'All Inclusive': 'ALL_INCLUSIVE',
    },
    experienceType: {
      'Beach Party Package': 'BEACH_PARTY_PACKAGE',
      'Water Sports Package': 'WATER_SPORTS_PACKAGE',
      'Boat Cruise': 'BOAT_CRUISE',
      'Resort Day Pass': 'RESORT_DAY_PASS',
      'Weekend Getaway': 'WEEKEND_GETAWAY',
      'Custom Package': 'CUSTOM_PACKAGE',
    },
    roomType: {
      'Standard': 'STANDARD',
      'Deluxe': 'DELUXE',
      'Suite': 'SUITE',
      'Villa': 'VILLA',
    },
  },
  CAR_RENTAL: {
    carTransmission: {
      'Automatic': 'AUTOMATIC',
      'Manual': 'MANUAL',
    },
    carFuelType: {
      'Petrol': 'PETROL',
      'Diesel': 'DIESEL',
      'Electric': 'ELECTRIC',
      'Hybrid': 'HYBRID',
    },
  },
  FINE_DINING: {
    cuisineType: {
      'Nigerian': 'NIGERIAN',
      'Continental': 'CONTINENTAL',
      'Asian': 'ASIAN',
      'Italian': 'ITALIAN',
      'French': 'FRENCH',
      'Mediterranean': 'MEDITERRANEAN',
      'Seafood': 'SEAFOOD',
      'Steakhouse': 'STEAKHOUSE',
      'Fusion': 'FUSION',
      'Vegan/Vegetarian': 'VEGAN_VEGETARIAN',
    },
    diningType: {
      'Fine Dining': 'FINE_DINING',
      'Casual Dining': 'CASUAL_DINING',
      'Fast Casual': 'FAST_CASUAL',
      'Buffet': 'BUFFET',
      'Cafe': 'CAFE',
      'Bistro': 'BISTRO',
    },
    dressCode: {
      'Casual': 'CASUAL',
      'Smart Casual': 'SMART_CASUAL',
      'Formal': 'FORMAL',
      'Black Tie': 'BLACK_TIE',
    },
  },
  CONVENIENCE_SERVICE: {
    serviceType: {
      'Delivery Service': 'DELIVERY_SERVICE',
      'Rent a Chef': 'RENT_A_CHEF',
      'Personal Shopping': 'PERSONAL_SHOPPING',
      'Laundry Service': 'LAUNDRY_SERVICE',
      'Cleaning Service': 'CLEANING_SERVICE',
      'Pet Care': 'PET_CARE',
      'Babysitting': 'BABYSITTING',
      'Home Maintenance': 'HOME_MAINTENANCE',
      'Event Planning': 'EVENT_PLANNING',
      'Other': 'OTHER',
    },
    priceType: {
      'Fixed Price': 'FIXED',
      'Hourly Rate': 'HOURLY',
    },
  },
};

// Category-specific schemas
export const LISTING_SCHEMAS = {
  RESORT: {
    requiredBase: ['title', 'description', 'basePrice', 'currency', 'images', 'businessId', 'status'],
    requiredCategory: ['resortType', 'roomType', 'capacity'],
    optionalCategory: ['packageType', 'experienceType', 'checkInTime', 'checkOutTime', 'amenities', 'maxCapacity', 'activities', 'inclusions', 'pricePerGroup', 'minimumGroupSize', 'duration', 'availableDates', 'advanceBookingRequired', 'minimumAdvanceHours'],
    enums: {
      resortType: BACKEND_ENUMS.RESORT_TYPE,
      packageType: BACKEND_ENUMS.PACKAGE_TYPE,
      experienceType: BACKEND_ENUMS.EXPERIENCE_TYPE,
      roomType: BACKEND_ENUMS.ROOM_TYPE,
    },
    categoryObject: 'resort',
  },
  CAR_RENTAL: {
    requiredBase: ['title', 'description', 'basePrice', 'currency', 'images', 'businessId', 'status'],
    requiredCategory: ['carMake', 'carModel', 'carYear', 'carSeats', 'carTransmission', 'carFuelType', 'carPlateNumber'],
    optionalCategory: ['carFeatures', 'chauffeurIncluded', 'chauffeurPricePerDay', 'chauffeurPricePerHour', 'insuranceCoverage', 'deliveryFee'],
    enums: {
      carTransmission: BACKEND_ENUMS.CAR_TRANSMISSION,
      carFuelType: BACKEND_ENUMS.CAR_FUEL_TYPE,
    },
    categoryObject: 'carRental',
  },
  FINE_DINING: {
    requiredBase: ['title', 'description', 'basePrice', 'currency', 'images', 'businessId', 'status'],
    requiredCategory: ['diningType'],
    optionalCategory: ['cuisineType', 'cuisineTypes', 'seatingCapacity', 'openingHours', 'menuCategories', 'menuItems', 'menuPdfUrl', 'priceRange', 'specialties', 'diningAmenities', 'dressCode', 'reservationRequired'],
    enums: {
      cuisineType: BACKEND_ENUMS.CUISINE_TYPE,
      diningType: BACKEND_ENUMS.DINING_TYPE,
      dressCode: BACKEND_ENUMS.DRESS_CODE,
    },
    categoryObject: 'dining',
  },
  CONVENIENCE_SERVICE: {
    requiredBase: ['title', 'description', 'basePrice', 'currency', 'images', 'businessId', 'status'],
    requiredCategory: ['serviceType', 'serviceDescription'],
    optionalCategory: ['pricingType', 'serviceArea', 'estimatedDuration', 'serviceDuration', 'coverageArea', 'hourlyRate', 'fixedPrice', 'minimumDuration', 'deliveryServiceFee', 'serviceFeatures', 'availableDays', 'responseTime', 'advanceBookingRequired'],
    enums: {
      serviceType: BACKEND_ENUMS.SERVICE_TYPE,
      pricingType: BACKEND_ENUMS.PRICING_TYPE,
    },
    categoryObject: 'convenience',
  },
};

/**
 * Convert UI label to backend enum value
 */
export function labelToEnum(category, field, label) {
  if (!label) return undefined;
  
  const mapping = ENUM_MAPPINGS[category]?.[field];
  if (!mapping) {
    // If no mapping, check if it's already a valid backend enum
    const schema = LISTING_SCHEMAS[category];
    const enumValues = schema?.enums?.[field];
    if (enumValues && Object.values(enumValues).includes(label)) {
      return label;
    }
    // Fallback: uppercase and replace spaces
    return typeof label === 'string' ? label.toUpperCase().replace(/\s+/g, '_').replace(/\//g, '_') : label;
  }
  
  // Check if already backend value
  if (Object.values(mapping).includes(label)) {
    return label;
  }
  
  // Convert label to enum
  const enumValue = mapping[label];
  if (enumValue) return enumValue;
  
  // Case-insensitive fallback
  const lowerLabel = label.toLowerCase();
  const foundKey = Object.keys(mapping).find(k => k.toLowerCase() === lowerLabel);
  if (foundKey) return mapping[foundKey];
  
  // Last resort
  return label.toUpperCase().replace(/\s+/g, '_').replace(/\//g, '_');
}

/**
 * Convert backend enum value to UI label
 */
export function enumToLabel(category, field, enumValue) {
  if (!enumValue) return '';
  
  const mapping = ENUM_MAPPINGS[category]?.[field];
  if (!mapping) {
    // Fallback: Title Case
    return enumValue.replace(/_/g, ' ').replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
  }
  
  // Find label by enum value
  const entry = Object.entries(mapping).find(([, v]) => v === enumValue);
  return entry ? entry[0] : enumValue.replace(/_/g, ' ').replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
}

/**
 * Validate enum value for a field
 */
export function validateEnum(category, field, value) {
  const schema = LISTING_SCHEMAS[category];
  if (!schema || !schema.enums || !schema.enums[field]) {
    return { valid: true };
  }
  
  const validValues = Object.values(schema.enums[field]);
  if (!validValues.includes(value)) {
    return {
      valid: false,
      error: `${field} must be one of: ${validValues.join(', ')}`,
    };
  }
  
  return { valid: true };
}

/**
 * Get schema for a category
 */
export function getCategorySchema(category) {
  return LISTING_SCHEMAS[category] || null;
}
