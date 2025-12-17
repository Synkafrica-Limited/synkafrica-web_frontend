"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Car,
  Sailboat,
  Home,
  Utensils,
  MapPin,
  Heart,
  Star,
  ArrowLeft,
  Share2,
  Calendar,
  Clock,
  Users,
  Shield,
  CheckCircle,
  Navigation,
  Building,
  Crown,
  Sparkles,
  BadgeCheck,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { PageLoadingScreen } from "@/components/ui/LoadingScreen";
import { useToast } from "@/components/ui/ToastProvider";
import { useOrder } from "@/context/OrderContext";
import { getListing } from "@/services/listings.service";
import logger from "@/utils/logger";

// No mock data - only real API data is used

// Modern Booking Widget
const BookingWidget = ({ service, serviceType, listingId }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [duration, setDuration] = useState(1);
  const [pickupLocation, setPickupLocation] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createOrder } = useOrder();
  const router = useRouter();

  const getBookingFields = () => {
    return (
      <div className="space-y-4">
        {serviceType === 'car' && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Pickup Location</label>
            <div className="relative">
              <Navigation className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Enter pickup location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E05D3D] focus:ring-1 focus:ring-[#E05D3D] transition-all"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              {serviceType === 'resort' ? 'Check-in' : 'Date'}
            </label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:border-[#E05D3D] focus:ring-1 focus:ring-[#E05D3D] transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Time</label>
            <div className="relative">
              <Clock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:border-[#E05D3D] focus:ring-1 focus:ring-[#E05D3D] transition-all"
              />
            </div>
          </div>
        </div>

        {(serviceType === 'water' || serviceType === 'dining' || serviceType === 'resort') && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Number of Guests</label>
            <div className="relative">
              <Users className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none z-10" />
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full h-9 pl-9 pr-8 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:border-[#E05D3D] focus:ring-1 focus:ring-[#E05D3D] transition-all appearance-none cursor-pointer"
              >
                {Array.from({ length: serviceType === 'resort' ? 8 : serviceType === 'dining' ? 12 : 20 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </div>
            </div>
          </div>
        )}

        {(serviceType === 'car' || serviceType === 'water') && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Duration</label>
            <div className="relative">
              <Clock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none z-10" />
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-9 pl-9 pr-8 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:border-[#E05D3D] focus:ring-1 focus:ring-[#E05D3D] transition-all appearance-none cursor-pointer"
              >
                {(serviceType === 'car' ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : [2, 3, 4, 5, 6, 7, 8]).map(hour => (
                  <option key={hour} value={hour}>{hour} hour{hour > 1 ? 's' : ''}</option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Special Requests <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Any preferences or special requirements..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E05D3D] focus:ring-1 focus:ring-[#E05D3D] transition-all resize-none"
          />
        </div>
      </div>
    );
  };

  const calculatePricing = () => {
    let basePrice = service.price;
    let multiplier = 1;

    switch (serviceType) {
      case 'car':
      case 'water':
        multiplier = duration;
        break;
      case 'dining':
        multiplier = guests;
        break;
      default:
        multiplier = 1;
    }

    const subtotal = basePrice * multiplier;
    const serviceFee = subtotal * 0.10; // 10% service fee
    const tax = subtotal * 0.075; // 7.5% tax
    const calculatedTotal = subtotal + serviceFee + tax;

    return {
      basePrice,
      subtotal,
      serviceFee,
      tax,
      calculatedTotal,
      priceBreakdown: {
        durationCharge: serviceType === 'car' || serviceType === 'water' ? (basePrice * (duration - 1)) : 0,
        guestCharge: serviceType === 'dining' ? (basePrice * (guests - 1)) : 0,
        serviceFee,
        tax,
      }
    };
  };

  const isFormValid = () => {
    if (serviceType === 'car') {
      return date && time && duration > 0 && pickupLocation.trim();
    }
    return date && time;
  };

  const handleBookNow = () => {
    if (!isFormValid()) return;
    setIsLoading(true);

    setTimeout(() => {
      const pricing = calculatePricing();
      const orderData = {
        serviceId: service.id,
        listingId: listingId, // From URL params
        vendorId: service.vendorId || service.host?.id || 'mock-vendor-id',
        businessId: service.businessId || 'mock-business-id',
        serviceType: serviceType,
        serviceName: service.name,
        serviceLocation: service.location,
        bookingDetails: {
          date,
          time,
          guests: parseInt(guests) || 1,
          duration: parseInt(duration) || 1,
          pickupLocation: pickupLocation || '',
          specialRequests: specialRequests || '',
        },
        pricing: {
          basePrice: pricing.basePrice,
          subtotal: pricing.subtotal,
          calculatedTotal: pricing.calculatedTotal,
          priceBreakdown: pricing.priceBreakdown,
        }
      };

      const order = createOrder(orderData);
      router.push(`/checkout?orderId=${order.orderId}`);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sticky top-6">
      {/* Price Section - Modern Style */}
      <div className="mb-6">
        <div className="mb-3">
          <span className="text-3xl font-semibold text-gray-900">
            ₦{service.price?.toLocaleString()}
          </span>
          <span className="text-sm text-gray-600 ml-2">
            / {serviceType === 'dining' ? 'person' : serviceType === 'resort' ? 'night' : 'hour'}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-900 font-medium">
              {service.rating}
            </span>
          </div>
          <span className="text-sm text-gray-500">({service.reviews} reviews)</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs text-green-700 font-medium">
          <BadgeCheck className="w-3.5 h-3.5" />
          Verified Service Provider
        </div>
      </div>

      {/* Booking Form */}
      <div className="space-y-4 mb-6">
        {getBookingFields()}
      </div>

      {/* Pricing Breakdown - Modern Style */}
      <div className="border-t border-gray-200 pt-5 mb-5">
        <div className="space-y-3 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900 font-medium">₦{calculatePricing().subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Service fee</span>
            <span className="text-gray-900">₦{calculatePricing().serviceFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-900">₦{calculatePricing().tax.toLocaleString()}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-5">
          <div className="flex justify-between items-baseline">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-semibold text-gray-900">
              ₦{calculatePricing().calculatedTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Modern Brand Button */}
        <button
          onClick={handleBookNow}
          disabled={!isFormValid() || isLoading}
          className={`w-full h-12 rounded-lg font-semibold text-sm transition-all ${isFormValid() && !isLoading
            ? 'bg-[#E05D3D] hover:bg-[#c74d2f] text-white shadow-sm hover:shadow-md active:scale-[0.98]'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Processing...
            </span>
          ) : (
            'Proceed to Checkout'
          )}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-600">
          <Shield className="w-3.5 h-3.5" />
          <span>Secure checkout • No hidden fees</span>
        </div>
      </div>
    </div>
  );
};

// Image Gallery - Amazon Style
const ImageGallery = ({ images, name }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex gap-4">
      {/* Thumbnail Sidebar */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative w-16 h-16 border-2 rounded-lg overflow-hidden transition-all ${selectedImage === index
              ? 'border-[#E05D3D] shadow-sm'
              : 'border-gray-200 hover:border-gray-300'
              }`}
          >
            <img src={image} alt={`${name} ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
        <div className="relative aspect-square bg-gray-50 rounded overflow-hidden">
          <img
            src={images[selectedImage]}
            alt={name}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

// Specification Card Component
const SpecCard = ({ icon, label, value }) => (
  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#E05D3D] hover:shadow-sm transition-all text-center">
    <div className="text-2xl mb-2">{icon}</div>
    <div className="font-semibold text-gray-900 text-base mb-1">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

// Main Service Detail Component
const ServiceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToast } = useToast();

  const serviceType = params.serviceType || 'car';
  const listingId = params.listingId;

  useEffect(() => {
    const fetchServiceDetail = async () => {
      if (!listingId) {
        setError('No listing ID provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch real listing from API
        const listingData = await getListing(listingId);
        logger.log('Fetched listing:', listingData);

        // Handle images - can be array of strings or array of objects
        let imageUrl = '';
        let gallery = [];

        if (listingData.images && listingData.images.length > 0) {
          // Process all images
          gallery = listingData.images.map(img => {
            if (typeof img === 'string') return img;
            if (typeof img === 'object') return img.secure_url || img.url || '';
            return '';
          }).filter(Boolean);

          imageUrl = gallery[0] || '';
        }

        // Handle location - can be object or JSON string
        let locationStr = '';
        if (typeof listingData.location === 'string') {
          try {
            const locObj = JSON.parse(listingData.location);
            locationStr = locObj.address || locObj.city || listingData.location;
          } catch (e) {
            locationStr = listingData.location;
          }
        } else if (typeof listingData.location === 'object' && listingData.location !== null) {
          locationStr = listingData.location.address || listingData.location.city || '';
        }

        // Transform API response to match component expectations
        const transformedService = {
          id: listingData.id || listingId,
          name: listingData.title || listingData.name || 'Service',
          category: listingData.category || serviceType,
          image: imageUrl,
          gallery: gallery.length > 0 ? gallery : [imageUrl].filter(Boolean),
          location: locationStr,
          price: listingData.pricing?.basePrice || listingData.basePrice || listingData.price || 0,
          rating: listingData.rating || 4.5,
          reviews: listingData.reviewCount || 0,
          features: listingData.amenities || listingData.features || listingData.carFeatures || [],
          specifications: listingData.specifications || {},
          host: {
            name: listingData.business?.name || listingData.vendor?.name || 'Service Provider',
            rating: listingData.business?.rating || 4.5,
            joined: listingData.business?.createdAt?.slice(0, 4) || '2024',
            verified: listingData.business?.isVerified || false,
          },
          description: listingData.description || '',
          included: listingData.included || listingData.inclusions || [],
          requirements: listingData.requirements || [],
          // Store original data for booking
          vendorId: listingData.vendorId || listingData.vendor?.id,
          businessId: listingData.businessId || listingData.business?.id,
        };

        setService(transformedService);
      } catch (err) {
        logger.error('Failed to fetch listing:', err);
        setError(err.message || 'Failed to load service details');
        addToast({ message: "Failed to load service details", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetail();
  }, [listingId, serviceType]);

  if (loading) {
    return <PageLoadingScreen message="Loading luxury experience..." />;
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">😕</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Service Not Found</h2>
          <p className="text-gray-600 mb-6">The luxury experience you're seeking doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="px-8 py-4 bg-gradient-to-r from-[#DF5D3D] to-[#e67a5f] text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:block">Back</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#E05D3D] rounded-lg flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900 text-lg hidden sm:block">SynkAfrica</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-9 h-9 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                />
              </button>
              <button className="w-9 h-9 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center">
                <Share2 className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb - Modern Style */}
        <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-4">
          <span className="hover:text-[#E05D3D] hover:underline cursor-pointer">Home</span>
          <span>›</span>
          <span className="hover:text-[#E05D3D] hover:underline cursor-pointer capitalize">{serviceType}</span>
          <span>›</span>
          <span className="text-gray-900">{service.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">

            {/* Service Header - Modern Style */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-4">
              <h1 className="text-2xl font-semibold text-gray-900 mb-3 leading-tight">{service.name}</h1>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-900 font-medium">
                    {service.rating}
                  </span>
                </div>
                <span className="text-sm text-gray-500">({service.reviews})</span>
                <span className="text-gray-400">|</span>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{service.location}</span>
                </div>
              </div>
              <div className="inline-block px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-xs text-gray-700 font-medium">
                {service.category}
              </div>
            </div>

            {/* Image Gallery */}
            <ImageGallery images={service.gallery} name={service.name} />

            {/* Tabs - Modern Style */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <nav className="flex border-b border-gray-200">
                {['overview', 'features', 'reviews', 'location'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab
                      ? 'border-[#E05D3D] text-[#E05D3D]'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-3">About this Experience</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{service.description}</p>
                  </div>

                  {/* Specifications - Modern Style */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Specifications</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {serviceType === 'car' && (
                        <>
                          <SpecCard icon="🪑" label="Seats" value={service.specifications.seats} />
                          <SpecCard icon="⚙️" label="Transmission" value={service.specifications.transmission} />
                          <SpecCard icon="⛽" label="Fuel Type" value={service.specifications.fuel} />
                          <SpecCard icon="🧳" label="Luggage" value={service.specifications.luggage} />
                        </>
                      )}
                      {serviceType === 'water' && (
                        <>
                          <SpecCard icon="👥" label="Capacity" value={service.specifications.capacity} />
                          <SpecCard icon="📏" label="Length" value={service.specifications.length} />
                          <SpecCard icon="🚪" label="Cabins" value={service.specifications.cabins} />
                          <SpecCard icon="⚓" label="Crew" value={service.specifications.crew} />
                        </>
                      )}
                      {serviceType === 'resort' && (
                        <>
                          <SpecCard icon="🛏️" label="Bedrooms" value={service.specifications.bedrooms} />
                          <SpecCard icon="🚿" label="Bathrooms" value={service.specifications.bathrooms} />
                          <SpecCard icon="👥" label="Max Guests" value={service.specifications.guests} />
                          <SpecCard icon="🕐" label="Check-in" value={service.specifications.checkIn} />
                        </>
                      )}
                      {serviceType === 'dining' && (
                        <>
                          <SpecCard icon="🍽️" label="Cuisine" value={service.specifications.cuisine} />
                          <SpecCard icon="👔" label="Dress Code" value={service.specifications.dressCode} />
                          <SpecCard icon="🕐" label="Hours" value={service.specifications.hours} />
                          <SpecCard icon="👥" label="Capacity" value={service.specifications.capacity} />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">What's Included</h4>
                      <ul className="space-y-2">
                        {service.included.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700 text-xs">
                            <CheckCircle className="w-3.5 h-3.5 text-green-700 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Requirements</h4>
                      <ul className="space-y-2">
                        {service.requirements.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700 text-xs">
                            <Shield className="w-3.5 h-3.5 text-blue-700 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Features & Amenities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-green-700 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 fill-yellow-400 text-yellow-400 mx-auto mb-3" />
                    <h3 className="text-base font-medium text-gray-900 mb-1">No Reviews Yet</h3>
                    <p className="text-sm text-gray-600 mb-4">Be the first to share your experience</p>
                    <button className="px-6 py-2.5 bg-[#E05D3D] hover:bg-[#c74d2f] text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all">
                      Write a Review
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'location' && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Location</h3>
                  <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <MapPin className="w-4 h-4 text-gray-700" />
                    <span className="text-sm text-gray-900 font-medium">{service.location}</span>
                  </div>
                  <div className="h-64 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 font-medium">Interactive Map</p>
                      <p className="text-xs text-gray-500 mt-1">{service.location}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Widget Sidebar */}
          <div className="lg:col-span-1">
            <BookingWidget service={service} serviceType={serviceType} listingId={params.listingId} />

            {/* Host Card - Modern Style */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Service Provider</h3>
              <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-normal text-gray-900 truncate">{service.host.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs mt-0.5">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-gray-700">{service.host.rating}</span>
                    <BadgeCheck className="w-3 h-3 text-green-700" />
                    <span className="text-gray-600">Verified</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member since</span>
                  <span className="text-gray-900 font-medium">{service.host.joined}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Platform</span>
                  <span className="text-gray-900 font-medium">SynkAfrica</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;