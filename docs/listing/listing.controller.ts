import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { QuickListingDto } from './dto/quick-listing.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { ListingCategory } from 'src/common/enums/listing-category.enum';
// Using any for Multer file type due to @types/multer compatibility issues
type MulterFile = any;

@Controller('api/listings')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post()
  @Roles(UserRole.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @UploadedFiles() files: any[],
    @Body() body: any,
    @Request() req,
  ) {
    // Accepts multipart/form-data with bracketed keys (e.g. location[address])
    return this.listingService.createListing(body, files, req.user.id);
  }

  @Post('quick')
  @Roles(UserRole.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  quickCreate(@Request() req, @Body() quickListingDto: QuickListingDto) {
    return this.listingService.createQuickListing(req.user.id, quickListingDto);
  }

  // PUBLIC endpoint for homepage quick-search bars (restaurants, activities, destinations, cars)
  // No auth required - read-only listing search
  @Get('quick-search')
  async quickSearch(
    @Query('q') q?: string,
    @Query('serviceType') serviceType?: string,
    @Query('location') location?: string,
    @Query('date') date?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('time') time?: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('radiusKm') radiusKm?: string,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ) {
    return this.listingService.quickSearch({
      q,
      serviceType,
      location,
      date,
      startDate,
      endDate,
      time,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      radiusKm: radiusKm ? parseFloat(radiusKm) : undefined,
      limit: limit ? Math.min(parseInt(limit), 50) : 20,
      skip: skip ? parseInt(skip) : 0,
    });
  }

  @Get()
  findAll(
    @Query('category') category?: ListingCategory,
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.listingService.findAll({
      category,
      city,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    });
  }

  @Get('business/:businessId')
  findByBusiness(@Param('businessId') businessId: string) {
    return this.listingService.findByBusiness(businessId);
  }

  @Get('vendor/me')
  @Roles(UserRole.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getMyListings(@Request() req) {
    return this.listingService.findByVendor(req.user.id);
  }

  @Get(':id/analytics')
  @Roles(UserRole.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getAnalytics(@Param('id') id: string, @Request() req) {
    return this.listingService.getAnalytics(id, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateListingDto: UpdateListingDto,
    @UploadedFiles() files?: MulterFile[],
  ) {
    return this.listingService.update(id, req.user.id, updateListingDto, files);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.listingService.remove(id, req.user.id);
  }

  @Delete(':id/images')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  removeImages(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { imageUrls: string[] },
  ) {
    return this.listingService.removeImages(id, req.user.id, body.imageUrls);
  }
}
