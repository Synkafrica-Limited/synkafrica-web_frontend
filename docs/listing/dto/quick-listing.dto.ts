import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ListingCategory } from 'src/common/enums/listing-category.enum';
import { Currency } from 'src/common/enums/currency.enum';

export class QuickListingDto {
  @IsString()
  @IsNotEmpty()
  businessId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ListingCategory)
  @IsNotEmpty()
  category: ListingCategory;

  @IsNumber()
  @IsNotEmpty()
  basePrice: number;

  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  location?: string;
}
