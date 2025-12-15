/**
 * Listing form validation utilities
 * Validates required fields before API submission
 */

import { getCategoryConfig, LISTING_CATEGORIES } from './listingConfig';

/**
 * Valid status values as per backend
 */
export const VALID_STATUSES = ['DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'INACTIVE', 'SUSPENDED'];

/**
 * Normalize status from various frontend representations to backend enum
 */
export function normalizeStatus(status) {
  const statusMap = {
    'available': 'ACTIVE',
    'unavailable': 'INACTIVE',
    'active': 'ACTIVE',
    'inactive': 'INACTIVE',
    'draft': 'DRAFT',
    'pending': 'PENDING_REVIEW',
    'suspended': 'SUSPENDED',
  };

  if (!status) return 'DRAFT';
  if (typeof status !== 'string') return 'DRAFT';
  
  const normalized = statusMap[status.toLowerCase()] || status.toUpperCase();
  
  return VALID_STATUSES.includes(normalized) ? normalized : 'DRAFT';
}

/**
 * Validate common listing fields
 */
export function validateCommonFields(form) {
  const errors = {};

  if (!form.title?.trim()) {
    errors.title = 'Title is required';
  }

  if (!form.category) {
    errors.category = 'Category is required';
  }

  if (!form.businessId) {
    errors.businessId = 'Business ID is required';
  }

  if (form.basePrice === undefined || form.basePrice === null || form.basePrice === '') {
    errors.basePrice = 'Price is required';
  } else if (Number(form.basePrice) < 0) {
    errors.basePrice = 'Price must be a positive number';
  }

  if (!form.location?.address?.trim()) {
    errors.location = 'Location is required';
  }

  return errors;
}

/**
 * Generic validator against category config
 */
function validateAgainstConfig(category, data) {
  const config = getCategoryConfig(category);
  const errors = {};

  if (!config) return errors;

  // Validate required fields
  if (config.requiredFields) {
    config.requiredFields.forEach(field => {
      const value = data[field];
      if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        errors[field] = `${field.replace(/([A-Z])/g, ' $1').trim()} is required`;
      }
    });
  }

  // Validate enums
  if (config.enums) {
    Object.keys(config.enums).forEach(field => {
      const value = data[field];
      if (value) {
        const allowedValues = Object.values(config.enums[field]);
        if (Array.isArray(value)) {
          // For array fields (e.g. cuisineType)
          const invalid = value.some(v => !allowedValues.includes(v));
          if (invalid) {
             errors[field] = `Invalid value(s) for ${field}`;
          }
        } else {
          if (!allowedValues.includes(value)) {
            errors[field] = `Invalid value for ${field}`;
          }
        }
      }
    });
  }

  return errors;
}

/**
 * Validate CAR_RENTAL specific fields
 */
export function validateCarRentalFields(carRental) {
  const errors = validateAgainstConfig(LISTING_CATEGORIES.CAR_RENTAL, carRental);

  // Additional specific validations
  if (carRental.carYear) {
    const year = Number(carRental.carYear);
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear + 1) {
      errors.carYear = `Year must be between 1900 and ${currentYear + 1}`;
    }
  }

  if (carRental.carSeats) {
    if (Number(carRental.carSeats) < 1 || Number(carRental.carSeats) > 60) {
      errors.carSeats = 'Seats must be between 1 and 60';
    }
  }

  return errors;
}

/**
 * Validate RESORT specific fields
 */
export function validateResortFields(resort) {
  const errors = validateAgainstConfig(LISTING_CATEGORIES.RESORT, resort);

  if (resort.capacity && Number(resort.capacity) < 1) {
    errors.capacity = 'Capacity must be at least 1';
  }

  return errors;
}

/**
 * Validate FINE_DINING specific fields
 */
export function validateFineDiningFields(dining) {
  const errors = validateAgainstConfig(LISTING_CATEGORIES.FINE_DINING, dining);

  if (dining.seatingCapacity && Number(dining.seatingCapacity) < 1) {
    errors.seatingCapacity = 'Capacity must be at least 1';
  }

  // Validate menu items
  if (dining.menuItems) {
    if (!Array.isArray(dining.menuItems) || dining.menuItems.length === 0) {
      errors.menuItems = 'At least one menu item is required';
    } else {
      const invalidItems = dining.menuItems.filter(
        item => !item.name?.trim() || item.price === undefined || item.price === null || Number(item.price) < 0
      );
      if (invalidItems.length > 0) {
        errors.menuItems = 'All menu items must have a name and valid price';
      }
    }
  }

  return errors;
}

/**
 * Validate CONVENIENCE_SERVICE specific fields
 */
export function validateConvenienceFields(convenience) {
  return validateAgainstConfig(LISTING_CATEGORIES.CONVENIENCE_SERVICE, convenience);
}

/**
 * Main validation function - validates entire listing payload
 */
export function validateListingPayload(payload) {
  const errors = {
    common: {},
    category: {},
  };

  // Validate common fields
  errors.common = validateCommonFields(payload);

  // Validate category-specific fields
  switch (payload.category) {
    case 'CAR_RENTAL':
      if (!payload.carRental) {
        errors.category.general = 'Car rental data is required';
      } else {
        errors.category = validateCarRentalFields(payload.carRental);
      }
      break;

    case 'RESORT':
      if (!payload.resort) {
        errors.category.general = 'Resort data is required';
      } else {
        errors.category = validateResortFields(payload.resort);
      }
      break;

    case 'FINE_DINING':
      if (!payload.dining) {
        errors.category.general = 'Dining data is required';
      } else {
        errors.category = validateFineDiningFields(payload.dining);
      }
      break;

    case 'CONVENIENCE_SERVICE':
      if (!payload.convenience) {
        errors.category.general = 'Service data is required';
      } else {
        errors.category = validateConvenienceFields(payload.convenience);
      }
      break;

    default:
      errors.category.general = 'Invalid category';
  }

  // Check if there are any errors
  const hasErrors =
    Object.keys(errors.common).length > 0 || Object.keys(errors.category).length > 0;

  return {
    isValid: !hasErrors,
    errors,
  };
}

/**
 * Validate images before upload
 */
export function validateImages(images) {
  const errors = [];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  images.forEach((img, index) => {
    const file = img?.file || img;
    
    if (!(file instanceof File)) {
      return; // Skip non-file items (existing URLs)
    }

    if (file.size > maxSize) {
      errors.push(`Image ${index + 1}: File size exceeds 5MB`);
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push(`Image ${index + 1}: Invalid file type. Use JPEG, PNG, or WebP`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
