import { PartialType } from '@nestjs/mapped-types';
import { CreateListingDto } from './create-listing.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ListingStatus } from 'src/common/enums/listing-status.enum';

export class UpdateListingDto extends PartialType(CreateListingDto) {
  @IsEnum(ListingStatus)
  @IsOptional()
  status?: ListingStatus;
}
