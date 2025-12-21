/**
 * Category-aware payload builders with proper enum conversion
 * Ensures only relevant data is sent for each category
 */

import { normalizeStatus } from './listingValidation';
import { labelToEnum, LISTING_SCHEMAS } from '../config/listingSchemas';

// ... (previous functions remain the same) ...



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
/**
 * Build CAR_RENTAL payload
 */
export function buildCarRentalPayload(form, businessId, images = []) {
  const hasNewFiles = images.some((i) => i?.file instanceof File || i instanceof File);

  const payload = {
    businessId,
    title: form.title || form.vehicleName,
    description: form.description || '',
    category: 'CAR_RENTAL',
    basePrice: parseInt(form.basePrice || form.pricePerDay, 10) || 0,
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
      carMake: form.carMake || form.brand,
      carModel: form.carModel || form.model,
      carYear: parseInt(form.carYear || form.year, 10) || undefined,
      carPlateNumber: form.carPlateNumber,
      carSeats: parseInt(form.carSeats || form.seats, 10) || undefined,
      carTransmission: labelToEnum('CAR_RENTAL', 'carTransmission', form.carTransmission || form.transmission),
      carFuelType: labelToEnum('CAR_RENTAL', 'carFuelType', form.carFuelType || form.fuelType),
      carFeatures: form.carFeatures || form.features || [],
      chauffeurIncluded: Boolean(form.chauffeurIncluded),
      chauffeurPricePerDay: form.chauffeurIncluded ? parseInt(form.chauffeurPricePerDay || form.chauffeurPrice || 0, 10) : undefined,
      chauffeurPricePerHour: parseInt(form.chauffeurPricePerHour || form.pricePerHour || 0, 10) || undefined,
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
  // Convert packageType UI label to backend enum
  const packageTypeEnum = labelToEnum('RESORT', 'packageType', form.packageType);
  const resortTypeEnum = labelToEnum('RESORT', 'resortType', form.resortType);

  const payload = {
    businessId,
    title: form.title || form.resortName,
    description: form.description || '',
    category: 'RESORT',
    basePrice: parseInt(form.basePrice || form.pricePerPerson, 10) || 0,
    currency: form.currency || 'NGN',
    status: normalizeStatus(form.status || (typeof form.availability === 'string' ? form.availability : 'ACTIVE')),
    ...(!hasNewFiles && images.length > 0 ? { images: images.map((i) => i.preview || i) } : {}),
    location: {
      address: form.location?.address || form.location,
      city: form.location?.city || extractCityFromAddress(form.location?.address || form.location),
      state: form.location?.state || '',
      country: form.location?.country || 'Nigeria',
    },
    pricePerGroup: parseInt(form.pricePerGroup, 10) || undefined,
    advanceBookingRequired: Boolean(form.advanceBookingRequired),
    minimumAdvanceHours: parseInt(form.minimumAdvanceHours, 10) || 0,

    // Duplicate fields to root as backend might expect them there (hybrid schema)
    // based on Listing.json showing them at root
    resortType: resortTypeEnum,
    packageType: packageTypeEnum,
    roomType: labelToEnum('RESORT', 'roomType', form.roomType || 'Standard'),
    checkInTime: form.checkInTime,
    checkOutTime: form.checkOutTime,
    duration: form.duration,
    capacity: parseInt(form.capacity || form.maxOccupancy, 10) || undefined,
    inclusions: form.inclusions || [],
    activities: form.activities || [],
    availableDates: form.availableDates,
    
    resort: {
      resortType: resortTypeEnum, // Strict mapping, no fallback to packageType
      packageType: packageTypeEnum,
      roomType: labelToEnum('RESORT', 'roomType', form.roomType || 'Standard'),
      checkInTime: form.checkInTime,
      checkOutTime: form.checkOutTime,
      duration: form.duration,
      capacity: parseInt(form.capacity || form.maxOccupancy, 10) || undefined,
      inclusions: form.inclusions || [],
      activities: form.activities || [],
      availableDates: form.availableDates,
      pricePerGroup: parseInt(form.pricePerGroup, 10) || undefined,
      advanceBookingRequired: Boolean(form.advanceBookingRequired),
      minimumAdvanceHours: parseInt(form.minimumAdvanceHours, 10) || 0,
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

  // Calculate basePrice: use provided basePrice, or priceRange used as basePrice, or minimum menu item price, or 0
  let basePrice = parseInt(form.basePrice || form.priceRange, 10) || 0;
  
  if (basePrice === 0 && menuItems.length > 0) {
    // Set basePrice to minimum menu item price
    const prices = menuItems.map(item => item.price);
    basePrice = Math.min(...prices);
  }

  const payload = {
    businessId,
    title: form.title || form.restaurantName,
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
      cuisineType: normalizeEnumArray('FINE_DINING', 'cuisineType', form.cuisine || form.cuisineType),
      diningType: labelToEnum('FINE_DINING', 'diningType', form.diningType), // Strict form uses diningType
      seatingCapacity: parseInt(form.capacity || form.seatingCapacity, 10) || undefined,
      diningAmenities: form.features || form.amenities || [], // form.features is consolidated
      specialties: form.specialties || [], // legacy
      features: form.features || [], // new generic field mapped to features often? Backend schema has 'specialties' and 'diningAmenities'.
      // If form.features contains mixed items, we might need to split them or just send as diningAmenities if backend supports it.
      // But listingSchemas says: optionalCategory: [..., 'specialties', 'diningAmenities', ...]
      // It doesn't seem to have 'features' in dining object strictly?
      // Wait, INITIAL_FORM_STATES mapping consolidated them.
      // I should map form.features to one of them or both if I can't distinguish.
      // I will map all to diningAmenities for now as it's safer than specialties which implies specific food.
      // Actually, let's keep it simple: mapped to diningAmenities.
      openingHours: form.openingHours,
      daysOpen: form.daysOpen || [],
      dietaryProvisions: form.dietaryProvisions || [],
      dressCode: labelToEnum('FINE_DINING', 'dressCode', form.dressCode),
      priceRange: form.priceRange, // Legacy field
      reservationRequired: Boolean(form.reservationRequired),
      menuUrl: form.menuUrl,
      menuItems: menuItems.length > 0 ? menuItems : undefined,
    },
  };
   
  // Fix for features mapping: if features exists and diningAmenities is empty, use features
  if (payload.dining.diningAmenities.length === 0 && Array.isArray(form.features)) {
       payload.dining.diningAmenities = form.features;
  }

  return stripEmptyDeep(payload);
}

/**
 * Build CONVENIENCE_SERVICE payload
 */
export function buildConveniencePayload(form, businessId, images = []) {
  const hasNewFiles = images.some((i) => i?.file instanceof File || i instanceof File);
  
  const pricingType = labelToEnum('CONVENIENCE_SERVICE', 'pricingType', form.pricingType || form.priceType) || 'FIXED';
  const basePrice = parseInt(form.basePrice || (pricingType === 'FIXED' ? form.fixedPrice : form.hourlyRate), 10) || 0;

  const payload = {
    businessId,
    title: form.title || form.serviceName,
    description: form.description || '',
    category: 'CONVENIENCE_SERVICE',
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
    convenience: {
      serviceType: labelToEnum('CONVENIENCE_SERVICE', 'serviceType', form.serviceType),
      serviceDescription: form.serviceDescription || form.description || '', // Required by backend category validations often
      pricingType: pricingType, // Strict backend key
      priceType: pricingType, // Legacy compatibility if needed? No, strict schema.
      fixedPrice: pricingType === 'FIXED' ? basePrice : undefined,
      hourlyRate: pricingType === 'HOURLY' ? basePrice : undefined,
      minimumDuration: form.minimumOrder || form.minimumDuration, // Schema uses minimumDuration? form uses minimumOrder
      minimumOrder: form.minimumOrder, // Legacy?
      deliveryServiceFee: parseInt(form.deliveryFee || form.deliveryServiceFee || 0, 10),
      serviceFeatures: form.features || form.serviceFeatures || [],
      availableDays: Array.isArray(form.availability) ? form.availability : (Array.isArray(form.availableDays) ? form.availableDays : []),
      responseTime: parseInt(form.responseTime, 10) || 30,
      advanceBookingRequired: Boolean(form.advanceBooking !== undefined ? form.advanceBooking : form.advanceBookingRequired),
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
/**
 * Deep diff between two objects
 * Returns only fields in 'current' that are different from 'original'
 */
function getChangedFields(original, current) {
  if (current === undefined || current === null) return undefined;
  if (original === undefined || original === null) return current;

  // Handle arrays: strictly different if length or content mismatch
  // For simplicity: if arrays differ, send the whole new array
  if (Array.isArray(current)) {
    if (!Array.isArray(original)) return current;
    if (current.length !== original.length) return current;
    
    // Sort and stringify for comparison to handle order-agnostic arrays (like amenities)
    // simplistic approach: JSON stringify matching
    const copyCurr = [...current].sort();
    const copyOrig = [...original].sort();
    if (JSON.stringify(copyCurr) !== JSON.stringify(copyOrig)) return current;
    
    return undefined; // No change
  }

  // Handle objects
  if (typeof current === 'object') {
    if (typeof original !== 'object') return current;

    const diff = {};
    let hasChanges = false;

    for (const key of Object.keys(current)) {
      const changed = getChangedFields(original[key], current[key]);
      if (changed !== undefined) {
        diff[key] = changed;
        hasChanges = true;
      }
    }

    return hasChanges ? diff : undefined;
  }

  // Handle primitives
  return current !== original ? current : undefined;
}

/**
 * Build STRICT payload for update operation (PATCH)
 * Only includes changed fields, validated against backend schema
 */
export function buildUpdateListingPayload(formState, originalListing) {
  const category = originalListing.category;
  const businessId = originalListing.businessId;
  const images = formState.images || [];
  
  // 1. Build full 'target' payload as if we were creating it
  // This ensures all transformations (enums, numbers) are applied
  const targetPayload = buildListingPayload(category, formState, businessId, images);
  
  // 2. Diff against original listing
  // strict diffing ensures we don't send unchanged fields
  const updates = getChangedFields(originalListing, targetPayload);

  if (process.env.NODE_ENV === 'development') {
    console.log('[PayloadBuilder] Original:', originalListing);
    console.log('[PayloadBuilder] Target:', targetPayload);
    console.log('[PayloadBuilder] Diff/Updates:', updates);
  }

  // 3. Safety checks
  // Always preserve businessId if it somehow got lost or if we just want to be safe (though PATCH usually doesn't need it if auth'd)
  // But strict PATCH might reject extra fields. 
  // If 'updates' is undefined (no changes), return empty object or null?
  if (!updates) return {};

  // 4. Category Object Integrity
  // If the category specific object (e.g. 'resort') has ANY changes (is present in updates),
  // we must replace the partial diff with the FULL target object.
  // This is because backend validation often requires all mandatory fields (like resortType, capacity)
  // to be present if the object key exists, and doesn't verify individual fields in isolation.
  const schema = LISTING_SCHEMAS[category];
  if (schema && schema.categoryObject) {
    const key = schema.categoryObject;
    if (updates[key]) {
      // Revert strict partial diff to full valid object for this key
      if (process.env.NODE_ENV === 'development') {
         console.log(`[PayloadBuilder] Detected change in ${key}, sending full object to satisfy validation.`);
      }
      updates[key] = targetPayload[key];
    }
  }

  return updates;
}
