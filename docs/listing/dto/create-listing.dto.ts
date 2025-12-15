import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  IsInt,
  IsBoolean,
  Min,
  ValidateNested,
  IsLatitude,
  IsLongitude,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ListingCategory } from 'src/common/enums/listing-category.enum';
import { Currency } from 'src/common/enums/currency.enum';
import {
  CarTransmission,
  CarFuelType,
  ResortType,
  PackageType,
  DiningType,
  PricingType,
  ServiceArea,
} from 'src/common/enums/listing-fields.enum';

class LocationDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsLatitude()
  @IsOptional()
  lat?: number;

  @IsLongitude()
  @IsOptional()
  lng?: number;
}

class CarRentalDetails {
  @IsString()
  @IsNotEmpty()
  carMake: string;

  @IsString()
  @IsNotEmpty()
  carModel: string;

  @IsInt()
  @IsNotEmpty()
  carYear: number;

  @IsString()
  @IsNotEmpty()
  carPlateNumber: string;

  @IsInt()
  @Min(1)
  carSeats: number;

  @IsEnum(CarTransmission, { message: 'carTransmission must be one of: AUTOMATIC, MANUAL' })
  carTransmission: CarTransmission;

  @IsEnum(CarFuelType, { message: 'carFuelType must be one of: PETROL, DIESEL, ELECTRIC, HYBRID' })
  carFuelType: CarFuelType;

  @IsArray()
  @IsOptional()
  carFeatures?: string[];

  @IsBoolean()
  @IsOptional()
  chauffeurIncluded?: boolean;

  @IsInt()
  @IsOptional()
  chauffeurPricePerDay?: number;

  @IsInt()
  @IsOptional()
  chauffeurPricePerHour?: number;

  @IsBoolean()
  @IsOptional()
  insuranceCoverage?: boolean;

  @IsInt()
  @IsOptional()
  deliveryFee?: number;
}

class ResortDetails {
  @IsEnum(ResortType, { message: 'resortType must be one of: HOTEL, VILLA, APARTMENT, LODGE, COTTAGE, RESORT' })
  resortType: ResortType;

  @IsEnum(PackageType, { message: 'packageType must be one of: FULL_BOARD, HALF_BOARD, BED_AND_BREAKFAST, ROOM_ONLY, ALL_INCLUSIVE' })
  @IsOptional()
  packageType?: PackageType;

  @IsString()
  @IsNotEmpty()
  roomType: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsInt()
  @IsOptional()
  maxCapacity?: number;

  @IsArray()
  @IsOptional()
  amenities?: string[];

  @IsArray()
  @IsOptional()
  activities?: string[];

  @IsArray()
  @IsOptional()
  inclusions?: string[];

  @IsString()
  @IsOptional()
  checkInTime?: string;

  @IsString()
  @IsOptional()
  checkOutTime?: string;

  @IsInt()
  @IsOptional()
  pricePerGroup?: number;

  @IsInt()
  @IsOptional()
  minimumGroupSize?: number;
}

class FineDiningDetails {
  @IsEnum(DiningType, { message: 'diningType must be one of: FINE_DINING, CASUAL, FAST_FOOD, CAFE, BUFFET, FOOD_TRUCK' })
  @IsNotEmpty()
  diningType: DiningType;

  @IsString()
  @IsOptional()
  cuisineType?: string;

  @IsArray()
  @IsOptional()
  cuisineTypes?: string[];

  @IsArray()
  @IsOptional()
  menuCategories?: string[];

  @IsArray()
  @IsOptional()
  menuItems?: any[];

  @IsString()
  @IsOptional()
  menuPdfUrl?: string;

  @IsInt()
  @IsOptional()
  seatingCapacity?: number;

  @IsString()
  @IsOptional()
  priceRange?: string;

  @IsArray()
  @IsOptional()
  specialties?: string[];

  @IsArray()
  @IsOptional()
  diningAmenities?: string[];

  @IsString()
  @IsOptional()
  openingHours?: string;

  @IsString()
  @IsOptional()
  dressCode?: string;

  @IsBoolean()
  @IsOptional()
  reservationRequired?: boolean;
}

class ConvenienceServiceDetails {
  @IsString()
  @IsNotEmpty()
  serviceType: string;

  @IsString()
  @IsNotEmpty()
  serviceDescription: string;

  @IsInt()
  @IsOptional()
  serviceDuration?: number;

  @IsEnum(ServiceArea, { message: 'serviceArea must be one of: LOCAL, REGIONAL, NATIONAL' })
  @IsOptional()
  serviceArea?: ServiceArea;

  @IsString()
  @IsOptional()
  coverageArea?: string;

  @IsEnum(PricingType, { message: 'pricingType must be one of: HOURLY, FIXED, PER_UNIT, CUSTOM' })
  @IsOptional()
  pricingType?: PricingType;

  @IsInt()
  @IsOptional()
  hourlyRate?: number;

  @IsInt()
  @IsOptional()
  fixedPrice?: number;

  @IsString()
  @IsOptional()
  minimumDuration?: string;

  @IsInt()
  @IsOptional()
  deliveryServiceFee?: number;

  @IsArray()
  @IsOptional()
  serviceFeatures?: string[];

  @IsArray()
  @IsOptional()
  availableDays?: string[];

  @IsInt()
  @IsOptional()
  responseTime?: number;

  @IsBoolean()
  @IsOptional()
  advanceBookingRequired?: boolean;
}

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @IsEnum(ListingCategory)
  @IsNotEmpty()
  category: ListingCategory;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(0)
  basePrice: number;

  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @IsArray()
  @IsNotEmpty()
  images: string[];

  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  // Category-specific details
  @ValidateNested()
  @Type(() => CarRentalDetails)
  @IsOptional()
  carRental?: CarRentalDetails;

  @ValidateNested()
  @Type(() => ResortDetails)
  @IsOptional()
  resort?: ResortDetails;

  @ValidateNested()
  @Type(() => FineDiningDetails)
  @IsOptional()
  fineDining?: FineDiningDetails;

  @ValidateNested()
  @Type(() => ConvenienceServiceDetails)
  @IsOptional()
  convenienceService?: ConvenienceServiceDetails;

  @IsOptional()
  availabilityCalendar?: any;

  @IsString()
  @IsOptional()
  cancellationPolicy?: string;

  @IsString()
  @IsOptional()
  termsAndConditions?: string;
}
