/**
 * Category-aware payload builders with proper enum conversion
 * Ensures only relevant data is sent for each category
 */

import { normalizeStatus } from './listingValidation';
import { labelToEnum, getCategorySchema } from '../config/listingSchemas';

/**
 * Strip undefined, null, and empty string values from object recursively
 */
function stripEmptyDeep(obj) {
  if (obj === null || obj === undefined) return undefined;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    const filtered = obj.filter(item => item !== null && item !== undefined && item !== '');
    return filtered.length > 0 ? filtered : undefined;
  }

  const cleaned = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      const nested = stripEmptyDeep(value);
      if (nested && Object.keys(nested).length > 0) {
        cleaned[key] = nested;
      }
    } else if (Array.isArray(value)) {
      const arr = stripEmptyDeep(value);
      if (arr && arr.length > 0) {
        cleaned[key] = arr;
      }
    } else {
      cleaned[key] = value;
    }
  });

  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
}

/**
 * Helper to normalize array of enums
 */
function normalizeEnumArray(category, field, values) {
  if (!Array.isArray(values)) return [];
  return values.map(v => labelToEnum(category, field, v)).filter(Boolean);
}

/**
 * Extract city from address string
 */
function extractCityFromAddress(address) {
  if (!address) return 'Lagos';

  const parts = address.split(',');
  if (parts.length > 1) {
    return parts[0].trim();
  }

  const commonCities = [
    'Lagos',
    'Abuja',
    'Port Harcourt',
    'Ibadan',
    'Kano',
    'Benin',
    'Enugu',
    'Calabar',
    'Kaduna',
    'Owerri',
  ];

  const foundCity = commonCities.find((city) =>
    address.toLowerCase().includes(city.toLowerCase())
  );

  return foundCity || 'Lagos';
}

/**
 * Build CAR_RENTAL payload
 */
export function buildCarRentalPayload(form, businessId, images = []) {
  const hasNewFiles = images.some((i) => i?.file instanceof File || i instanceof File);

  const payload = {
    businessId,
    title: form.vehicleName || form.title,
    description: form.description || '',
    category: 'CAR_RENTAL',
    basePrice: parseInt(form.pricePerDay || form.basePrice, 10) || 0,
    currency: form.currency || 'NGN',
    status: normalizeStatus(form.status || form.availability),
    ...(!hasNewFiles && images.length > 0 ? { images: images.map((i) => i.preview || i) } : {}),
    location: {
      address: form.location?.address || form.location,
      city: form.location?.city || extractCityFromAddress(form.location?.address || form.location),
      state: form.location?.state || '',
      country: form.location?.country || 'Nigeria',
    },
    carRental: {
      carMake: form.brand || form.carMake,
      carModel: form.model || form.carModel,
      carYear: parseInt(form.year || form.carYear, 10) || undefined,
      carPlateNumber: form.carPlateNumber,
      carSeats: parseInt(form.seats || form.carSeats, 10) || undefined,
      carTransmission: labelToEnum('CAR_RENTAL', 'carTransmission', form.transmission || form.carTransmission),
      carFuelType: labelToEnum('CAR_RENTAL', 'carFuelType', form.fuelType || form.carFuelType),
      carFeatures: form.features || form.carFeatures || [],
      chauffeurIncluded: Boolean(form.chauffeurIncluded),
      chauffeurPricePerDay: form.chauffeurIncluded ? parseInt(form.chauffeurPrice || form.chauffeurPricePerDay || 0, 10) : undefined,
      chauffeurPricePerHour: parseInt(form.pricePerHour || form.chauffeurPricePerHour || 0, 10) || undefined,
      insuranceCoverage: Boolean(form.insuranceCoverage !== undefined ? form.insuranceCoverage : true),
    },
  };

  return stripEmptyDeep(payload);
}

/**
 * Build RESORT payload
 */
export function buildResortPayload(form, businessId, images = []) {
  const hasNewFiles = images.some((i) => i?.file instanceof File || i instanceof File);

  // Convert packageType UI label to backend enum
  const packageTypeEnum = labelToEnum('RESORT', 'packageType', form.packageType || form.resortType);

  const payload = {
    businessId,
    title: form.resortName || form.title,
    description: form.description || '',
    category: 'RESORT',
    basePrice: parseInt(form.pricePerPerson || form.basePrice, 10) || 0,
    currency: form.currency || 'NGN',
    status: normalizeStatus(form.status || (typeof form.availability === 'string' ? form.availability : 'ACTIVE')),
    ...(!hasNewFiles && images.length > 0 ? { images: images.map((i) => i.preview || i) } : {}),
    location: {
      address: form.location?.address || form.location,
      city: form.location?.city || extractCityFromAddress(form.location?.address || form.location),
      state: form.location?.state || '',
      country: form.location?.country || 'Nigeria',
    },
    resort: {
      resortType: packageTypeEnum, // Backend expects resortType field
      packageType: packageTypeEnum, // Also include packageType for compatibility
      roomType: labelToEnum('RESORT', 'roomType', form.roomType || 'Standard'),
      duration: form.duration,
      capacity: parseInt(form.capacity || form.maxOccupancy, 10) || undefined,
      inclusions: form.inclusions || form.amenities || [],
      activities: form.attractions || form.activities || [],
      availableDates: form.availableDates,
      pricePerGroup: parseInt(form.pricePerGroup, 10) || undefined,
      bookingAdvanceHours: parseInt(form.bookingAdvance || form.bookingAdvanceHours || 24, 10),
    },
  };

  return stripEmptyDeep(payload);
}

export function buildFineDiningPayload(form, businessId, images = []) {
  const hasNewFiles = images.some((i) => i?.file instanceof File || i instanceof File);

  // Validate and clean menu items
  const menuItems = (form.menuItems || [])
    .filter((item) => item.name?.trim() && item.price !== undefined && item.price !== null)
    .map((item) => ({
      name: item.name.trim(),
      description: item.description?.trim() || '',
      price: parseInt(item.price, 10),
    }));

  // Calculate basePrice: use provided value, or minimum menu item price, or 0
  let basePrice = parseInt(form.priceRange || form.basePrice, 10) || 0;
  
  if (basePrice === 0 && menuItems.length > 0) {
    // Set basePrice to minimum menu item price
    const prices = menuItems.map(item => item.price);
    basePrice = Math.min(...prices);
  }

  const payload = {
    businessId,
    title: form.restaurantName || form.title,
    description: form.description || '',
    category: 'FINE_DINING',
    basePrice: basePrice,
    currency: form.currency || 'NGN',
    status: normalizeStatus(form.status || (typeof form.availability === 'string' ? form.availability : 'ACTIVE')),
    ...(!hasNewFiles && images.length > 0 ? { images: images.map((i) => i.preview || i) } : {}),
    location: {
      address: form.location?.address || form.location,
      city: form.location?.city || extractCityFromAddress(form.location?.address || form.location),
      state: form.location?.state || '',
      country: form.location?.country || 'Nigeria',
    },
    dining: {
      cuisineType: normalizeEnumArray('FINE_DINING', 'cuisineType', form.cuisineType),
      diningType: labelToEnum('FINE_DINING', 'diningType', form.diningType),
      seatingCapacity: parseInt(form.capacity, 10) || undefined,
      diningAmenities: form.amenities || [],
      specialties: form.specialties || [],
      openingHours: form.openingHours,
      dressCode: labelToEnum('FINE_DINING', 'dressCode', form.dressCode),
      priceRange: form.priceRange,
      reservationRequired: form.reservationRequired,
      menuItems: menuItems.length > 0 ? menuItems : undefined,
    },
  };

  return stripEmptyDeep(payload);
}

/**
 * Build CONVENIENCE_SERVICE payload
 */
export function buildConveniencePayload(form, businessId, images = []) {
  const hasNewFiles = images.some((i) => i?.file instanceof File || i instanceof File);

  const payload = {
    businessId,
    title: form.serviceName || form.title,
    description: form.description || '',
    category: 'CONVENIENCE_SERVICE',
    basePrice: parseInt(form.priceType === 'fixed' ? form.fixedPrice : form.hourlyRate, 10) || 0,
    currency: form.currency || 'NGN',
    status: normalizeStatus(form.status || (typeof form.availability === 'string' ? form.availability : 'ACTIVE')),
    ...(!hasNewFiles && images.length > 0 ? { images: images.map((i) => i.preview || i) } : {}),
    location: {
      address: form.location?.address || form.location,
      city: form.location?.city || extractCityFromAddress(form.location?.address || form.location),
      state: form.location?.state || '',
      country: form.location?.country || 'Nigeria',
    },
    convenience: {
      serviceType: labelToEnum('CONVENIENCE_SERVICE', 'serviceType', form.serviceType),
      serviceDescription: form.description || form.serviceDescription || '', // Required by backend
      priceType: labelToEnum('CONVENIENCE_SERVICE', 'priceType', form.priceType),
      fixedPrice: form.priceType === 'fixed' ? parseInt(form.fixedPrice, 10) : undefined,
      hourlyRate: form.priceType === 'hourly' ? parseInt(form.hourlyRate, 10) : undefined,
      minimumOrder: form.minimumOrder,
      deliveryFee: parseInt(form.deliveryFee || 0, 10),
      serviceFeatures: form.features || [],
      availableDays: Array.isArray(form.availability) ? form.availability : [],
      responseTime: parseInt(form.responseTime, 10) || 30,
      advanceBooking: Boolean(form.advanceBooking),
    },
  };

  return stripEmptyDeep(payload);
}

/**
 * Main payload builder - routes to appropriate category builder
 */
export function buildListingPayload(category, form, businessId, images = []) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[PayloadBuilder] Building payload for ${category}`, { form, businessId });
  }

  let payload;
  switch (category) {
    case 'CAR_RENTAL':
      payload = buildCarRentalPayload(form, businessId, images);
      break;
    case 'RESORT':
      payload = buildResortPayload(form, businessId, images);
      break;
    case 'FINE_DINING':
      payload = buildFineDiningPayload(form, businessId, images);
      break;
    case 'CONVENIENCE_SERVICE':
      payload = buildConveniencePayload(form, businessId, images);
      break;
    default:
      throw new Error(`Unsupported category: ${category}`);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[PayloadBuilder] Final payload:`, payload);
  }

  return payload;
}

/**
 * Build payload for create operation
 */
export function buildCreateListingPayload(formState) {
  const category = formState.category;
  const businessId = formState.businessId;
  const images = formState.images || [];
  
  return buildListingPayload(category, formState, businessId, images);
}

/**
 * Build payload for update operation
 * Only includes changed fields, preserves original values
 */
export function buildUpdateListingPayload(formState, originalListing) {
  const category = originalListing.category;
  const businessId = originalListing.businessId;
  const images = formState.images || [];
  
  // Build full payload
  const fullPayload = buildListingPayload(category, formState, businessId, images);
  
  // For updates, we send the full payload but backend will merge
  // The stripEmptyDeep already removed null/undefined values
  return fullPayload;
}
