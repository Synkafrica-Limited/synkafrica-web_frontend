import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { QuickListingDto } from './dto/quick-listing.dto';
import { ListingCategory } from 'src/common/enums/listing-category.enum';
import { Currency } from 'src/common/enums/currency.enum';
import { NotificationService } from '../notification/notification.service';
import { BusinessType } from 'src/common/enums/business-type.enum';
import { CategoryValidator } from './validators/category-validator';
import * as cloudinary from 'cloudinary';
// Using any for Multer file type due to @types/multer compatibility issues
type MulterFile = any;

@Injectable()
export class ListingService {
  private readonly logger = new Logger(ListingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Map business type to listing category.
   * All new convenience service types map to CONVENIENCE_SERVICE category.
   */
  private mapBusinessTypeToCategory(businessType: BusinessType): ListingCategory {
    const convenienceTypes = [
      BusinessType.CONVENIENCE_SERVICE,
      BusinessType.MAKEUP_AND_BEAUTY,
      BusinessType.LAUNDRY_AND_DRY_CLEANING,
      BusinessType.PHOTOGRAPHY_AND_VIDEOGRAPHY,
      BusinessType.HOME_AND_OFFICE_CLEANING,
      BusinessType.FASHION_STYLING,
      BusinessType.TAILORING_AND_STITCHING,
      BusinessType.EVENT_SERVICES,
      BusinessType.FITNESS_TRAINING,
      BusinessType.SPA_AND_WELLNESS,
    ];

    if (convenienceTypes.includes(businessType)) {
      return ListingCategory.CONVENIENCE_SERVICE;
    }

    switch (businessType) {
      case BusinessType.CAR_RENTAL:
        return ListingCategory.CAR_RENTAL;
      case BusinessType.RESORT:
        return ListingCategory.RESORT;
      case BusinessType.FINE_DINING:
        return ListingCategory.FINE_DINING;
      default:
        return ListingCategory.CONVENIENCE_SERVICE;
    }
  }

  async createQuickListing(userId: string, quickListingDto: QuickListingDto) {
    const { businessId, ...listingData } = quickListingDto;

    // Verify user owns the business
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    if (business.ownerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to create listings for this business',
      );
    }

    // Create a basic listing with minimal required fields
    const listing = await this.prisma.listing.create({
      data: {
        title: listingData.title,
        description: listingData.description,
        category: listingData.category,
        basePrice: listingData.basePrice,
        currency: listingData.currency || 'NGN',
        images: listingData.images || [],
        businessId,
        vendorId: userId,
        status: 'DRAFT', // Quick listings start as drafts
      },
    });

    // Send notification to vendor
    await this.notificationService.notifyListingCreated(
      userId,
      listing.id,
      listing.title,
    );

    return listing;
  }

  async create(
    userId: string,
    createListingDto: CreateListingDto,
    files?: MulterFile[],
  ) {
    const {
      businessId,
      category,
      carRental,
      resort,
      fineDining,
      convenienceService,
      location,
      ...baseData
    } = createListingDto;

    // Verify user owns the business
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    if (business.ownerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to create listings for this business',
      );
    }

    // Upload images to Cloudinary if provided
    let imageUrls: string[] = [];
    if (files && files.length > 0) {
      try {
        const uploadPromises = files.map((file) =>
          cloudinary.v2.uploader.upload(
            file.path ||
              `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
            {
              folder: 'synkkafrica/listings',
            },
          ),
        );
        const results = await Promise.all(uploadPromises);
        imageUrls = results.map((result) => result.secure_url);
      } catch (error) {
        console.error('Image upload failed:', error);
        throw new BadRequestException('Failed to upload images');
      }
    }

    // Prepare category-specific data
    const categoryData: any = {};

    // Prepare location data if present
    const locationData: any = {};
    if (location) {
      locationData.address = location.address;
      locationData.city = location.city;
      if (location.state) locationData.state = location.state;
      if (location.country) locationData.country = location.country;
      if (location.lat !== undefined) locationData.lat = location.lat;
      if (location.lng !== undefined) locationData.lng = location.lng;
    }

    // Build category-specific data and validate
    if (category === ListingCategory.CAR_RENTAL && carRental) {
      Object.assign(categoryData, {
        carMake: carRental.carMake,
        carModel: carRental.carModel,
        carYear: carRental.carYear,
        carPlateNumber: carRental.carPlateNumber,
        carSeats: carRental.carSeats,
        carTransmission: carRental.carTransmission,
        carFuelType: carRental.carFuelType,
        carFeatures: carRental.carFeatures || [],
      });
    } else if (category === ListingCategory.RESORT && resort) {
      Object.assign(categoryData, {
        resortType: resort.resortType,
        roomType: resort.roomType,
        capacity: resort.capacity,
        amenities: resort.amenities || [],
        checkInTime: resort.checkInTime,
        checkOutTime: resort.checkOutTime,
      });
    } else if (category === ListingCategory.FINE_DINING && fineDining) {
      Object.assign(categoryData, {
        cuisineType: fineDining.cuisineType,
        menuCategories: fineDining.menuCategories || [],
        menuItems: fineDining.menuItems || [],
        diningType: fineDining.diningType,
      });
    } else if (
      category === ListingCategory.CONVENIENCE_SERVICE &&
      convenienceService
    ) {
      Object.assign(categoryData, {
        serviceType: convenienceService.serviceType,
        serviceDescription: convenienceService.serviceDescription,
        serviceDuration: convenienceService.serviceDuration,
        serviceArea: convenienceService.serviceArea,
      });
    }

    // Validate category-specific fields
    try {
      CategoryValidator.validateOrThrow(category, categoryData);
    } catch (error) {
      this.logger.error('Category validation failed', {
        category,
        providedFields: Object.keys(categoryData),
        error: error.message,
      });
      throw error;
    }

    const created = await this.prisma.listing.create({
      data: {
        ...baseData,
        images: imageUrls,
        ...categoryData,
        location: location ? JSON.stringify(location) : undefined,
        businessId,
        vendorId: userId,
        category,
      },
      include: {
        business: {
          select: {
            id: true,
            businessName: true,
            city: true,
            state: true,
            hasCreatedListing: true,
          },
        },
      },
    });

    // Mark business as having created first listing
    if (!business.hasCreatedListing) {
      await this.prisma.business.update({
        where: { id: businessId },
        data: { hasCreatedListing: true },
      });
    }

    try {
      await this.notificationService.notifyListingCreated(
        userId,
        created.id,
        created.title,
      );
    } catch (err) {
      console.error('Failed to send listing created notification:', err);
    }

    return created;
  }

  // Simple raw form-data handler used by vendors uploading multipart forms with
  // bracketed fields like `location[address]` or JSON strings for nested objects.
  async createListing(body: any, files: any[], userId: string) {
    // Basic validation: ensure business exists and belongs to user
    const business = await this.prisma.business.findUnique({
      where: { id: body.businessId },
    });
    if (!business) {
      throw new NotFoundException('Business not found');
    }
    if (business.ownerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to create listings for this business',
      );
    }

    // Robust parser for bracketed fields like `resort[amenities][0]` or `location[address]`.
    const parseBracketed = (prefix: string) => {
      // If the whole object is provided as JSON string
      if (body[prefix] && typeof body[prefix] === 'string') {
        try {
          return JSON.parse(body[prefix]);
        } catch (e) {
          // ignore and fallthrough
        }
      }

      const result: any = {};
      let found = false;

      const toTyped = (val: any) => {
        if (typeof val !== 'string') return val;
        const s = val.trim();
        if (s === 'true') return true;
        if (s === 'false') return false;
        if (!isNaN(Number(s)) && s !== '') return Number(s);
        if (
          (s.startsWith('{') && s.endsWith('}')) ||
          (s.startsWith('[') && s.endsWith(']'))
        ) {
          try {
            return JSON.parse(s);
          } catch {
            /* ignore */
          }
        }
        return val;
      };

      const setAtPath = (obj: any, parts: string[], value: any) => {
        let cur = obj;
        for (let i = 0; i < parts.length; i++) {
          const p = parts[i];
          const isLast = i === parts.length - 1;
          const nextPart = parts[i + 1];
          const nextIsIndex =
            typeof nextPart !== 'undefined' && /^[0-9]+$/.test(nextPart);

          // decide whether current key should be array or object
          if (/^[0-9]+$/.test(p)) {
            // numeric index on current container
            const idx = parseInt(p, 10);
            if (!Array.isArray(cur)) {
              // convert current into array if empty
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              cur = [];
            }
            if (isLast) {
              cur[idx] = value;
            } else {
              cur[idx] = cur[idx] || (nextIsIndex ? [] : {});
              cur = cur[idx];
            }
          } else {
            if (isLast) {
              cur[p] = value;
            } else {
              if (typeof cur[p] === 'undefined') {
                cur[p] = nextIsIndex ? [] : {};
              }
              cur = cur[p];
            }
          }
        }
      };

      for (const key of Object.keys(body)) {
        if (!key.startsWith(prefix + '[')) continue;
        found = true;
        // extract bracket parts: e.g. "resort[amenities][0]" => ['amenities','0']
        const parts = Array.from(key.matchAll(/\[([^\]]+)\]/g)).map(
          (m) => m[1],
        );
        if (parts.length === 0) continue;

        let rawVal: any = body[key];
        rawVal = toTyped(rawVal);

        setAtPath(result, parts, rawVal);
      }

      return found ? result : undefined;
    };

    const location =
      parseBracketed('location') ??
      (body.location
        ? typeof body.location === 'string'
          ? (() => {
              try {
                return JSON.parse(body.location);
              } catch {
                return body.location;
              }
            })()
          : body.location
        : undefined);
    const resort =
      parseBracketed('resort') ??
      (body.resort
        ? typeof body.resort === 'string'
          ? (() => {
              try {
                return JSON.parse(body.resort);
              } catch {
                return body.resort;
              }
            })()
          : body.resort
        : undefined);
    const carRental =
      parseBracketed('carRental') ??
      (body.carRental
        ? typeof body.carRental === 'string'
          ? (() => {
              try {
                return JSON.parse(body.carRental);
              } catch {
                return body.carRental;
              }
            })()
          : body.carRental
        : undefined);
    const convenience =
      parseBracketed('convenience') ??
      (body.convenience
        ? typeof body.convenience === 'string'
          ? (() => {
              try {
                return JSON.parse(body.convenience);
              } catch {
                return body.convenience;
              }
            })()
          : body.convenience
        : undefined);
    const dining =
      parseBracketed('dining') ??
      (body.dining
        ? typeof body.dining === 'string'
          ? (() => {
              try {
                return JSON.parse(body.dining);
              } catch {
                return body.dining;
              }
            })()
          : body.dining
        : undefined);

    // Upload images to Cloudinary and construct rich image metadata
    const imageObjs: Array<any> = [];
    if (files && files.length > 0) {
      try {
        const uploadPromises = files.map((file) =>
          cloudinary.v2.uploader.upload(
            file.path ||
              `data:${file.mimetype};base64,${file.buffer?.toString ? file.buffer.toString('base64') : ''}`,
            { folder: 'synkkafrica/listings' },
          ),
        );
        const results = await Promise.all(uploadPromises);
        for (let i = 0; i < results.length; i++) {
          const res = results[i];
          const f = files[i];
          imageObjs.push({
            filename: f.originalname || f.filename || null,
            mimetype: f.mimetype || null,
            size: f.size || null,
            secure_url: res.secure_url || null,
            public_id: res.public_id || null,
          });
        }
      } catch (err) {
        console.error('Cloudinary upload failed:', err);
        throw new BadRequestException('Failed to upload images');
      }
    }

    // Category-specific validation (enforce presence of nested metadata)
    const category = body.category as ListingCategory;
    if (category === ListingCategory.RESORT) {
      if (!resort)
        throw new BadRequestException(
          'resort metadata is required for RESORT category',
        );
      // require rooms or capacity
      if (!(resort.rooms || resort.capacity || resort.roomType)) {
        throw new BadRequestException(
          'resort.rooms or resort.capacity or resort.roomType is required',
        );
      }
    }
    if (category === ListingCategory.CAR_RENTAL) {
      if (!carRental)
        throw new BadRequestException(
          'carRental metadata is required for CAR_RENTAL category',
        );
      if (!carRental.carTransmission)
        throw new BadRequestException('carRental.carTransmission is required');
    }
    if (category === ListingCategory.FINE_DINING) {
      if (!dining)
        throw new BadRequestException(
          'dining metadata is required for FINE_DINING category',
        );
      if (!dining.menuItems || dining.menuItems.length === 0)
        throw new BadRequestException(
          'dining.menuItems is required for FINE_DINING category',
        );
      
      // Validate menuItems structure
      const items = Array.isArray(dining.menuItems) 
        ? dining.menuItems 
        : typeof dining.menuItems === 'string'
        ? (() => { try { return JSON.parse(dining.menuItems); } catch { return []; } })()
        : [];
      
      const hasValidItem = items.some((item: any) => 
        item && 
        typeof item === 'object' && 
        item.name && 
        item.price !== undefined
      );
      
      if (!hasValidItem) {
        throw new BadRequestException(
          'dining.menuItems must contain at least one valid item with name and price',
        );
      }
    }

    // Transform nested/category-specific objects into flattened, typed fields
    const resortData = this.transformResortData(resort);
    const carRentalData = this.transformCarRentalData(carRental);
    const convenienceData = this.transformConvenienceData(convenience);
    const diningData = this.transformDiningData(dining);

    const data: any = {
      title: body.title,
      description: body.description,
      category,
      basePrice:
        body.basePrice !== undefined ? Number(body.basePrice) : undefined,
      currency: body.currency || 'NGN',
      businessId: body.businessId,
      vendorId: userId,
      images: imageObjs,
      location: location ?? undefined,
      // Spread transformed (flattened & typed) category fields so they map to Prisma listing columns
      ...(resortData || {}),
      ...(carRentalData || {}),
      ...(convenienceData || {}),
      ...(diningData || {}),
      status: body.status || 'DRAFT',
    };
    return this.prisma.listing.create({ data }).then(async (listing) => {
      try {
        await this.notificationService.notifyListingCreated(
          business.ownerId,
          listing.id,
          listing.title,
        );
      } catch (err) {
        console.error('Failed to send listing created notification:', err);
      }
      return listing;
    });
  }

  async quickSearch(params: {
    q?: string;
    serviceType?: string;
    location?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
    time?: string;
    lat?: number;
    lng?: number;
    radiusKm?: number;
    limit: number;
    skip: number;
  }) {
    const where: any = {
      status: 'ACTIVE',
      business: {
        isActive: true,
        verificationStatus: 'APPROVED',
      },
    };

    // Keyword search (title, description)
    if (params.q) {
      where.OR = [
        { title: { contains: params.q, mode: 'insensitive' } },
        { description: { contains: params.q, mode: 'insensitive' } },
      ];
    }

    // Service type filter (maps to category)
    if (params.serviceType) {
      const typeMap: any = {
        CAR_RENTAL: ListingCategory.CAR_RENTAL,
        RESORT: ListingCategory.RESORT,
        FINE_DINING: ListingCategory.FINE_DINING,
        CONVENIENCE_SERVICE: ListingCategory.CONVENIENCE_SERVICE,
      };
      where.category = typeMap[params.serviceType] || params.serviceType;
    }

    // Location search
    if (params.location) {
      where.business.OR = [
        { city: { contains: params.location, mode: 'insensitive' } },
        { state: { contains: params.location, mode: 'insensitive' } },
        { address: { contains: params.location, mode: 'insensitive' } },
      ];
    }

    const [results, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        select: {
          id: true,
          title: true,
          category: true,
          basePrice: true,
          currency: true,
          images: true,
          serviceType: true,
          business: {
            select: {
              id: true,
              businessName: true,
              city: true,
              state: true,
              country: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: params.limit,
        skip: params.skip,
      }),
      this.prisma.listing.count({ where }),
    ]);

    return {
      results: results.map((listing) => ({
        listingId: listing.id,
        title: listing.title,
        serviceType: listing.category,
        priceFrom: listing.basePrice,
        currency: listing.currency,
        location: `${listing.business.city}, ${listing.business.state || listing.business.country}`,
        thumbnail:
          Array.isArray(listing.images) && listing.images.length > 0
            ? typeof listing.images[0] === 'string'
              ? listing.images[0]
              : (listing.images[0] as any)?.secure_url || null
            : null,
        business: {
          id: listing.business.id,
          name: listing.business.businessName,
        },
      })),
      meta: {
        total,
        limit: params.limit,
        skip: params.skip,
      },
    };
  }

  async findAll(filters?: {
    category?: ListingCategory;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const where: any = {
      status: 'ACTIVE',
    };

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.city) {
      where.business = {
        city: {
          contains: filters.city,
          mode: 'insensitive',
        },
      };
    }

    if (filters?.minPrice || filters?.maxPrice) {
      where.basePrice = {};
      if (filters.minPrice) where.basePrice.gte = filters.minPrice;
      if (filters.maxPrice) where.basePrice.lte = filters.maxPrice;
    }

    return this.prisma.listing.findMany({
      where,
      include: {
        business: {
          select: {
            id: true,
            businessName: true,
            city: true,
            state: true,
            country: true,
          },
        },
        _count: {
          select: {
            reviews: true,
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        business: {
          select: {
            id: true,
            businessName: true,
            businessEmail: true,
            businessPhone: true,
            address: true,
            city: true,
            state: true,
            country: true,
            logo: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return listing;
  }

  async getAnalytics(listingId: string, userId: string) {
    // Verify listing and ownership
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { business: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.business.ownerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view analytics for this listing',
      );
    }

    // Bookings counts
    const totalBookings = await this.prisma.booking.count({
      where: { listingId },
    });
    const completedBookings = await this.prisma.booking.count({
      where: { listingId, status: 'COMPLETED' },
    });
    const pendingBookings = await this.prisma.booking.count({
      where: { listingId, status: { in: ['PENDING', 'CONFIRMED'] } },
    });
    const cancelledBookings = await this.prisma.booking.count({
      where: { listingId, status: 'CANCELLED' },
    });

    // Revenue for this listing
    const revenueAgg = await this.prisma.transaction.aggregate({
      where: { listingId, status: 'COMPLETED' },
      _sum: { amount: true },
    });
    const totalRevenue = revenueAgg._sum.amount || 0;

    // Average rating and review count
    const reviewAgg = await this.prisma.review.aggregate({
      where: { listingId },
      _avg: { rating: true },
      _count: { id: true },
    });
    const averageRating = reviewAgg._avg.rating || 0;
    const reviewCount = reviewAgg._count.id || 0;

    // Recent bookings
    const recentBookings = await this.prisma.booking.findMany({
      where: { listingId },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Revenue by month (last 12 months)
    const now = new Date();
    const monthsToFetch = 12;
    const revenueByMonth: Array<{
      month: string;
      revenue: number;
      bookingCount: number;
    }> = [];

    for (let i = monthsToFetch - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const txAgg = await this.prisma.transaction.aggregate({
        where: {
          listingId,
          status: 'COMPLETED',
          createdAt: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      });

      const bookingCount = await this.prisma.booking.count({
        where: { listingId, createdAt: { gte: monthStart, lte: monthEnd } },
      });

      revenueByMonth.push({
        month: monthStart.toISOString().slice(0, 7),
        revenue: txAgg._sum.amount || 0,
        bookingCount,
      });
    }

    return {
      listingId,
      title: listing.title,
      totalBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenue,
      averageRating,
      reviewCount,
      recentBookings,
      revenueByMonth,
      viewsCount: 0, // placeholder — view tracking not implemented yet
    };
  }

  // Transform stringy form-data for car rental into typed, flattened fields
  private transformCarRentalData(carRental: any) {
    if (!carRental) return undefined;

    const parseIntOrNull = (v: any) => {
      if (v === undefined || v === null || v === '') return null;
      const n = Number(v);
      return Number.isNaN(n) ? null : Math.trunc(n);
    };

    const parseBool = (v: any) => {
      if (v === true || v === 'true') return true;
      if (v === false || v === 'false') return false;
      return undefined;
    };

    const features = (() => {
      if (!carRental.carFeatures) return undefined;
      if (Array.isArray(carRental.carFeatures)) return carRental.carFeatures;
      if (typeof carRental.carFeatures === 'string') {
        try {
          return JSON.parse(carRental.carFeatures);
        } catch {
          return carRental.carFeatures
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean);
        }
      }
      return undefined;
    })();

    return {
      carMake: carRental.carMake || undefined,
      carModel: carRental.carModel || undefined,
      carYear: parseIntOrNull(carRental.carYear),
      carPlateNumber: carRental.carPlateNumber || undefined,
      carSeats: parseIntOrNull(carRental.carSeats),
      carTransmission: carRental.carTransmission || undefined,
      carFuelType: carRental.carFuelType || undefined,
      carFeatures: features ?? undefined,
      chauffeurIncluded: parseBool(carRental.chauffeurIncluded) ?? undefined,
      chauffeurPricePerDay: parseIntOrNull(carRental.chauffeurPricePerDay),
      chauffeurPricePerHour: parseIntOrNull(carRental.chauffeurPricePerHour),
      insuranceCoverage: parseBool(carRental.insuranceCoverage) ?? undefined,
    };
  }

  // Transform resort nested form-data into flattened, typed fields matching Prisma Listing model
  private transformResortData(resort: any) {
    if (!resort) return undefined;

    const parseIntOrNull = (v: any) => {
      if (v === undefined || v === null || v === '') return null;
      const n = Number(v);
      return Number.isNaN(n) ? null : Math.trunc(n);
    };

    const parseArray = (v: any) => {
      if (!v) return undefined;
      if (Array.isArray(v)) return v;
      if (typeof v === 'string') {
        try {
          return JSON.parse(v);
        } catch {
          return v
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean);
        }
      }
      return undefined;
    };

    return {
      resortType: resort.resortType || undefined,
      packageType: resort.packageType || undefined,
      roomType: resort.roomType || undefined,
      capacity: parseIntOrNull(resort.capacity),
      maxCapacity: parseIntOrNull(resort.maxCapacity),
      amenities: parseArray(resort.amenities) ?? undefined,
      activities: parseArray(resort.activities) ?? undefined,
      inclusions: parseArray(resort.inclusions) ?? undefined,
      checkInTime: resort.checkInTime || undefined,
      checkOutTime: resort.checkOutTime || undefined,
      pricePerGroup: parseIntOrNull(resort.pricePerGroup),
      minimumGroupSize: parseIntOrNull(resort.minimumGroupSize),
    };
  }

  // Transform convenience service nested form-data
  private transformConvenienceData(convenience: any) {
    if (!convenience) return undefined;

    const parseIntOrNull = (v: any) => {
      if (v === undefined || v === null || v === '') return null;
      const n = Number(v);
      return Number.isNaN(n) ? null : Math.trunc(n);
    };
    const parseFloatOrNull = (v: any) => {
      if (v === undefined || v === null || v === '') return null;
      const n = Number(v);
      return Number.isNaN(n) ? null : n;
    };
    const parseArray = (v: any) => {
      if (!v) return undefined;
      if (Array.isArray(v)) return v;
      if (typeof v === 'string') {
        try {
          return JSON.parse(v);
        } catch {
          return v
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean);
        }
      }
      return undefined;
    };

    return {
      serviceType: convenience.serviceType || undefined,
      pricingType:
        convenience.priceType || convenience.pricingType || undefined,
      minimumOrder: parseIntOrNull(convenience.minimumOrder),
      deliveryFee: parseIntOrNull(convenience.deliveryFee),
      serviceDuration: parseIntOrNull(convenience.serviceDuration),
      serviceArea: convenience.serviceArea || undefined,
      coverageArea: convenience.coverageArea || undefined,
      hourlyRate: parseIntOrNull(convenience.hourlyRate),
      fixedPrice: parseIntOrNull(convenience.fixedPrice),
      minimumDuration: convenience.minimumDuration || undefined,
      deliveryServiceFee: parseIntOrNull(convenience.deliveryServiceFee),
      serviceFeatures: parseArray(convenience.features) ?? undefined,
      availableDays: parseArray(convenience.availableDays) ?? undefined,
      responseTime: parseIntOrNull(convenience.responseTime),
      advanceBookingRequired:
        convenience.advanceBookingRequired === 'true' ||
        convenience.advanceBookingRequired === true
          ? true
          : undefined,
    };
  }

  // Transform fine dining nested form-data
  private transformDiningData(dining: any) {
    if (!dining) return undefined;

    const parseIntOrNull = (v: any) => {
      if (v === undefined || v === null || v === '') return null;
      const n = Number(v);
      return Number.isNaN(n) ? null : Math.trunc(n);
    };
    const parseArray = (v: any) => {
      if (!v) return undefined;
      if (Array.isArray(v)) return v;
      if (typeof v === 'string') {
        try {
          return JSON.parse(v);
        } catch {
          return v
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean);
        }
      }
      return undefined;
    };

    // Parse and validate menuItems as array of objects
    const parseMenuItems = (items: any) => {
      if (!items) return undefined;
      
      let parsedItems = items;
      
      // If it's a string, try to parse it as JSON
      if (typeof items === 'string') {
        try {
          parsedItems = JSON.parse(items);
        } catch {
          // If parsing fails, return undefined
          return undefined;
        }
      }
      
      // If it's not an array, return undefined
      if (!Array.isArray(parsedItems)) return undefined;
      
      // Validate and transform each menu item
      const validItems = parsedItems
        .filter((item: any) => {
          // Must be an object with at least name and price
          return (
            item &&
            typeof item === 'object' &&
            item.name &&
            typeof item.name === 'string' &&
            item.name.trim() !== '' &&
            item.price !== undefined &&
            item.price !== null &&
            !isNaN(Number(item.price)) &&
            Number(item.price) >= 0
          );
        })
        .map((item: any) => ({
          name: item.name.trim(),
          description: item.description ? String(item.description).trim() : '',
          price: Number(item.price),
        }));
      
      return validItems.length > 0 ? validItems : undefined;
    };

    // Fix: Handle cuisineType as array or string
    const normalizeCuisineType = (value: any): string | undefined => {
      if (!value) return undefined;
      if (Array.isArray(value)) {
        return value.length > 0 ? String(value[0]).trim() : undefined;
      }
      return String(value).trim();
    };

    return {
      cuisineType: normalizeCuisineType(dining.cuisineType),
      cuisineTypes: parseArray(dining.cuisineTypes) ?? undefined,
      menuCategories: parseArray(dining.menuCategories) ?? undefined,
      menuItems: parseMenuItems(dining.menuItems) ?? undefined,
      menuPdfUrl: dining.menuPdfUrl || undefined,
      diningType: dining.diningType || undefined,
      seatingCapacity: parseIntOrNull(dining.seatingCapacity),
      priceRange: dining.priceRange || undefined,
      specialties: parseArray(dining.specialties) ?? undefined,
      diningAmenities: parseArray(dining.diningAmenities) ?? undefined,
      openingHours: dining.openingHours || undefined,
      dressCode: dining.dressCode || undefined,
      reservationRequired:
        dining.reservationRequired === 'true' ||
        dining.reservationRequired === true
          ? true
          : undefined,
    };
  }

  async findByBusiness(businessId: string) {
    return this.prisma.listing.findMany({
      where: { businessId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByVendor(vendorId: string) {
    // Get all businesses owned by this vendor
    const businesses = await this.prisma.business.findMany({
      where: { ownerId: vendorId },
      select: { id: true },
    });

    const businessIds = businesses.map((b) => b.id);

    return this.prisma.listing.findMany({
      where: { businessId: { in: businessIds } },
      include: {
        business: {
          select: {
            id: true,
            businessName: true,
            city: true,
            state: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(
    id: string,
    userId: string,
    updateListingDto: UpdateListingDto,
    files?: MulterFile[],
  ) {
    this.logger.log('Update listing called:', {
      id,
      userId,
      hasFiles: !!files?.length,
    });

    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { business: true },
    });

    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.business.ownerId !== userId)
      throw new ForbiddenException(
        'You do not have permission to update this listing',
      );

    const { carRental, resort, fineDining, convenienceService, ...baseData } =
      updateListingDto;

    // Use transform helpers and spread flattened results (omit if undefined)
    const carRentalData = this.transformCarRentalData(carRental);
    const resortData = this.transformResortData(resort);
    const convData = this.transformConvenienceData(convenienceService);
    const diningData = this.transformDiningData(fineDining);

    // Collect new category data
    const newCategoryData: any = {
      ...(carRentalData || {}),
      ...(resortData || {}),
      ...(convData || {}),
      ...(diningData || {}),
    };

    // Extract existing category data from listing
    const existingCategoryData: any = {};
    const categoryFields = [
      // CAR_RENTAL
      'carMake', 'carModel', 'carYear', 'carPlateNumber', 'carSeats',
      'carTransmission', 'carFuelType', 'carFeatures', 'carColor', 'carMileage',
      // RESORT
      'resortType', 'numberOfRooms', 'checkInTime', 'checkOutTime',
      'packageType', 'amenities', 'roomType', 'capacity',
      // FINE_DINING
      'diningType', 'cuisineType', 'cuisineTypes', 'seatingCapacity',
      'openingHours', 'menuCategories', 'menuItems', 'menuPdfUrl',
      'priceRange', 'specialties', 'diningAmenities', 'dressCode',
      'reservationRequired',
      // CONVENIENCE_SERVICE
      'serviceDescription', 'pricingType', 'serviceArea', 'estimatedDuration',
      'serviceType', 'serviceDuration', 'coverageArea', 'hourlyRate',
      'fixedPrice', 'minimumDuration', 'deliveryServiceFee',
    ];

    for (const field of categoryFields) {
      if (listing[field] !== undefined && listing[field] !== null) {
        existingCategoryData[field] = listing[field];
      }
    }

    // Merge: preserve existing values, only overwrite explicitly provided fields
    const mergedCategoryData = CategoryValidator.mergeForUpdate(
      listing.category as ListingCategory,
      existingCategoryData,
      newCategoryData,
    );

    // Validate the merged data
    try {
      CategoryValidator.validateOrThrow(
        listing.category as ListingCategory,
        mergedCategoryData,
      );
    } catch (error) {
      this.logger.error('Category validation failed on update', {
        listingId: id,
        category: listing.category,
        providedFields: Object.keys(newCategoryData),
        error: error.message,
      });
      throw error;
    }

    // Handle image uploads if provided
    let imageUrls: string[] = [];
    if (files && files.length > 0) {
      try {
        const uploadPromises = files.map((file) =>
          cloudinary.v2.uploader.upload(
            file.path ||
              `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
            { folder: 'synkkafrica/listings' },
          ),
        );
        const results = await Promise.all(uploadPromises);
        imageUrls = results.map((result) => result.secure_url);

        // Append new images to existing ones
        const existingImages = Array.isArray(listing.images)
          ? (listing.images as string[])
          : [];
        imageUrls = [...existingImages, ...imageUrls];
      } catch (error) {
        this.logger.error('Image upload failed during update:', error);
        throw new BadRequestException('Failed to upload images');
      }
    }

    const updateData: any = {
      ...baseData,
      ...mergedCategoryData,
    };

    // Only include images in update if new images were uploaded
    if (files && files.length > 0) {
      updateData.images = imageUrls;
    }

    const updated = await this.prisma.listing.update({
      where: { id },
      data: updateData,
    });

    this.logger.log('Listing updated successfully:', { id: updated.id });
    return updated;
  }

  async remove(id: string, userId: string) {
    this.logger.log('Remove listing called:', { id, userId });

    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        business: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.business.ownerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this listing',
      );
    }

    // Delete images from Cloudinary before deleting the listing
    if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
      try {
        for (const imageUrl of listing.images as string[]) {
          // Extract public_id from Cloudinary URL
          const urlParts = imageUrl.split('/');
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = `synkkafrica/listings/${publicIdWithExtension.split('.')[0]}`;

          await cloudinary.v2.uploader.destroy(publicId);
        }
        this.logger.log('Deleted listing images from Cloudinary:', { listingId: id, count: listing.images.length });
      } catch (error) {
        this.logger.error('Failed to delete images from Cloudinary:', error);
        // Continue with listing deletion even if Cloudinary deletion fails
      }
    }

    // Hard delete the listing from database
    await this.prisma.listing.delete({
      where: { id },
    });

    this.logger.log('Listing permanently deleted:', { id });
    return { id, message: 'Listing successfully deleted' };
  }

  async removeImages(id: string, userId: string, imageUrlsToRemove: string[]) {
    this.logger.log('Remove images called:', { id, userId, imageUrlsToRemove });

    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        business: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.business.ownerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to modify this listing',
      );
    }

    const existingImages = Array.isArray(listing.images)
      ? (listing.images as string[])
      : [];
    const updatedImages = existingImages.filter(
      (imageUrl: string) => !imageUrlsToRemove.includes(imageUrl),
    );

    // Optionally delete images from Cloudinary
    // Note: This requires extracting public_id from Cloudinary URLs
    try {
      for (const imageUrl of imageUrlsToRemove) {
        // Extract public_id from Cloudinary URL
        const urlParts = imageUrl.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = `synkkafrica/listings/${publicIdWithExtension.split('.')[0]}`;

        await cloudinary.v2.uploader.destroy(publicId);
      }
    } catch (error) {
      console.error('Failed to delete images from Cloudinary:', error);
      // Don't throw error here - images are removed from DB even if Cloudinary deletion fails
    }

    const updated = await this.prisma.listing.update({
      where: { id },
      data: { images: updatedImages },
    });

    console.log('Images removed from listing:', updated);
    return updated;
  }
}
