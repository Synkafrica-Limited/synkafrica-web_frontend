// Category validation strategy
import { BadRequestException } from '@nestjs/common';
import { ListingCategory } from '@prisma/client';

export interface CategoryValidationResult {
  valid: boolean;
  errors: Array<{ field: string; message: string }>;
}

export interface CategoryRequirements {
  requiredFields: string[];
  optionalFields: string[];
  forbiddenFields: string[];
}

export class CategoryValidator {
  private static readonly requirements: Record<ListingCategory, CategoryRequirements> = {
    [ListingCategory.CAR_RENTAL]: {
      requiredFields: ['carMake', 'carModel', 'carYear', 'carSeats', 'carTransmission', 'carFuelType', 'carPlateNumber'],
      optionalFields: ['carColor', 'carMileage', 'carFeatures'],
      forbiddenFields: ['resortType', 'numberOfRooms', 'cuisineType', 'serviceDescription', 'diningType'],
    },
    [ListingCategory.RESORT]: {
      requiredFields: ['resortType', 'roomType', 'capacity'],
      optionalFields: ['checkInTime', 'checkOutTime', 'packageType', 'amenities', 'maxCapacity', 'activities', 'inclusions', 'pricePerGroup', 'minimumGroupSize'],
      forbiddenFields: ['carMake', 'carModel', 'cuisineType', 'serviceDescription', 'pricingType', 'diningType'],
    },
    [ListingCategory.FINE_DINING]: {
      requiredFields: ['diningType'],
      optionalFields: ['cuisineType', 'cuisineTypes', 'seatingCapacity', 'openingHours', 'menuCategories', 'menuItems', 'menuPdfUrl', 'priceRange', 'specialties', 'diningAmenities', 'dressCode', 'reservationRequired'],
      forbiddenFields: ['carMake', 'resortType', 'numberOfRooms', 'pricingType', 'serviceDescription'],
    },
    [ListingCategory.CONVENIENCE_SERVICE]: {
      requiredFields: ['serviceType', 'serviceDescription'],
      optionalFields: ['pricingType', 'serviceArea', 'estimatedDuration', 'serviceDuration', 'coverageArea', 'hourlyRate', 'fixedPrice', 'minimumDuration', 'deliveryServiceFee'],
      forbiddenFields: ['carMake', 'resortType', 'cuisineType', 'numberOfRooms', 'diningType'],
    },
  };

  /**
   * Validate that the provided fields match the category requirements
   */
  static validate(category: ListingCategory, fields: Record<string, any>): CategoryValidationResult {
    const requirements = this.requirements[category];
    if (!requirements) {
      return { valid: false, errors: [{ field: 'category', message: 'Invalid category' }] };
    }

    const errors: Array<{ field: string; message: string }> = [];

    // Check required fields
    for (const field of requirements.requiredFields) {
      if (!fields[field] || (typeof fields[field] === 'string' && fields[field].trim() === '')) {
        errors.push({ field, message: `${field} is required for ${category} listings` });
      }
    }

    // Check forbidden fields
    for (const field of requirements.forbiddenFields) {
      if (fields[field] !== undefined && fields[field] !== null) {
        errors.push({ field, message: `${field} is not allowed for ${category} listings` });
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Throw a structured exception if validation fails
   */
  static validateOrThrow(category: ListingCategory, fields: Record<string, any>): void {
    const result = this.validate(category, fields);
    if (!result.valid) {
      throw new BadRequestException({
        message: 'Category validation failed',
        category,
        errors: result.errors,
      });
    }
  }

  /**
   * Extract only allowed fields for the category
   */
  static extractAllowedFields(category: ListingCategory, fields: Record<string, any>): Record<string, any> {
    const requirements = this.requirements[category];
    if (!requirements) return {};

    const allowedFields = [...requirements.requiredFields, ...requirements.optionalFields];
    const result: Record<string, any> = {};

    for (const field of allowedFields) {
      if (fields[field] !== undefined) {
        result[field] = fields[field];
      }
    }

    return result;
  }

  /**
   * For updates: merge existing data with new data without null overwrites
   */
  static mergeForUpdate(
    category: ListingCategory,
    existingData: Record<string, any>,
    updateData: Record<string, any>,
  ): Record<string, any> {
    const allowedUpdate = this.extractAllowedFields(category, updateData);
    const result = { ...existingData };

    // Only update fields that are explicitly provided (not undefined)
    // Keep existing value if new value is explicitly null (user wants to clear)
    for (const [key, value] of Object.entries(allowedUpdate)) {
      if (value !== undefined) {
        result[key] = value;
      }
    }

    return result;
  }
}
