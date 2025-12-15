"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Car, Sailboat, Home, Utensils, MoreHorizontal, Plane } from "lucide-react";

import CarRentalBookingInputs from "../../components/booking_inputs/CarRentalBookingInputs";
import ResortHouseBookingInputs from "../../components/booking_inputs/ResortHouseBookingInputs";
import DiningBookingInputs from "../../components/booking_inputs/DiningBookingInputs";
import OtherServicesBookingInputs from "../../components/booking_inputs/OtherServicesBookingInputs";
import WaterRecreationBookingInputs from "../../components/booking_inputs/WaterRecreationBookingInputs";
import { useSession } from '@/hooks/customer/auth/useSession';
import { quickSearchListings, getListings } from '@/services/listings.service';
import AboutService from "./components/AboutServiceSection";
import OtherServicesLinks from "./components/OtherServicesLinksSection";
import CarRentalService from "./components/CarRentalServiceSection";
import DiningService from "./components/DiningServiceSection";
import WaterRecreation from "./components/WaterRecreationServiceSection";
import ResortHouseService from "./components/ResortHouseServiceSection";
import OtherServices from "./components/OtherServiceSection";
import FAQComponent from "./components/FaqSection.jsx";
import ExploreOtherServices from "./components/ExploreOtherServicesSection";
import VendorBanner from "./components/BecomeVendorSection";

// Service-specific content configuration
const serviceContent = {
  car: {
    heading: "Chauffeur-driven experience",
    features: [
      "Pickup from anywhere",
      "Professional drivers",
      "Flexible scheduling",
      "Premium vehicles",
    ],
    stats: [
      { value: "24/7", label: "Available" },
      { value: "1k+", label: "Cars" },
      { value: "3", label: "Operational States" },
      { value: "101", label: "Happy Customers" },
      { value: "100%", label: "Customer Support" },
    ],
  },
  water: {
    heading: "Find your perfect\nwater adventure",
    features: [
      "Best price guarantee",
      "Flexible schedules",
      "Certified operators",
      "Easy cancellation",
    ],
    stats: [
      { value: "1,200+", label: "Watercraft" },
      { value: "300+", label: "Locations" },
      { value: "80+", label: "Coastal Destinations" },
      { value: "500k+", label: "Happy Riders" },
      { value: "4.9★", label: "Experience Rating" },
    ],
  },
  resort: {
    heading: "Your dream resort\nescape starts here",
    features: [
      "World-class beachfront stays",
      "Complimentary water activities",
      "Private villas & cabanas",
      "All-inclusive luxury packages",
    ],
    stats: [
      { value: "200+", label: "Resort Partners" },
      { value: "25+", label: "Tropical Destinations" },
      { value: "98%", label: "Oceanfront Access" },
      { value: "75k+", label: "Guests Hosted" },
      { value: "24/7", label: "Concierge Service" },
    ],
  },
  dining: {
    heading: "Exquisite dining\nexperiences await!",
    features: [
      "Top-rated restaurants",
      "Reserve in advance",
      "Special occasions",
      "Chef's selections",
    ],
    stats: [
      { value: "300+", label: "Restaurants" },
      { value: "50+", label: "Cuisines" },
      { value: "5★", label: "Average Rating" },
      { value: "10k+", label: "Reservations" },
      { value: "100%", label: "Satisfaction" },
    ],
  },
  flights: {
    heading: "Flight bookings\ncoming soon!",
    features: [
      "Domestic & international flights",
      "Best price guarantee",
      "Flexible booking options",
      "24/7 customer support",
    ],
    stats: [
      { value: "Soon", label: "Launch Date" },
      { value: "100+", label: "Airlines" },
      { value: "500+", label: "Destinations" },
      { value: "24/7", label: "Support" },
      { value: "Best", label: "Prices" },
    ],
  },
  other: {
    heading: "Discover more\nservices for you!",
    features: [
      "Custom experiences",
      "Local guides",
      "Event planning",
      "Concierge service",
    ],
    stats: [
      { value: "100+", label: "Services" },
      { value: "24/7", label: "Available" },
      { value: "20+", label: "Categories" },
      { value: "5k+", label: "Bookings" },
      { value: "98%", label: "Satisfaction" },
    ],
  },
};

// Service-specific components configuration
const serviceComponents = {
  car: {
    about: <AboutService service="car" />,
    main: <CarRentalService />,
  },
  water: {
    about: <AboutService service="water" />,
    main: <WaterRecreation />,
  },
  resort: {
    about: <AboutService service="resort" />,
    main: <ResortHouseService />,
  },
  dining: {
    about: <AboutService service="dining" />,
    main: <DiningService />,
  },
  flights: {
    about: (
      <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
          <Plane className="w-6 h-6 text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
        <p className="text-sm text-gray-600 max-w-sm mx-auto">
          Flight booking will be available soon
        </p>
      </div>
    ),
    main: null,
  },
  other: {
    about: <AboutService service="other" />,
    main: <OtherServices />,
  },
};

export default function HomePage() {
  const [activeService, setActiveService] = useState("car");
  const [listingFilter, setListingFilter] = useState("car"); // For listing section filter
  const [searchResults, setSearchResults] = useState(null);
  const [hideFirstHero, setHideFirstHero] = useState(false);
  
  // API Listings State
  const [apiListings, setApiListings] = useState([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [listingsError, setListingsError] = useState(null);

  // Quick hide first hero on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Hide first hero after scrolling just 100px
      if (window.scrollY > 100 && !hideFirstHero) {
        setHideFirstHero(true);
      } else if (window.scrollY <= 100 && hideFirstHero) {
        setHideFirstHero(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hideFirstHero]);

  // Fetch listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoadingListings(true);
        setListingsError(null);
        
        console.log('Fetching listings from API...');
        const response = await getListings();
        console.log('API Response:', response);
        
        // Transform API response to match UI format
        const transformedListings = (response?.data || []).map(listing => {
          console.log('Transforming listing:', listing.id, listing.title, listing.category);
          
          // Extract image URL (handle both object and string formats)
          let imageUrl = '';
          if (listing.images && listing.images.length > 0) {
            const firstImage = listing.images[0];
            imageUrl = typeof firstImage === 'string' 
              ? firstImage 
              : firstImage?.secure_url || '';
          }
          
          // Determine service type for filtering
          let serviceType = 'other';
          if (listing.category === 'CAR_RENTAL') {
            serviceType = 'car';
          } else if (listing.category === 'FINE_DINING') {
            serviceType = 'dining';
          } else if (listing.category === 'RESORT_STAY' || listing.category === 'WATER_RECREATION') {
            serviceType = 'resort';
          } else if (listing.category === 'CONVENIENCE_SERVICE') {
            serviceType = 'other';
          }
          
          // Format price
          const formattedPrice = listing.currency === 'NGN' 
            ? `₦${listing.basePrice?.toLocaleString() || '0'}`
            : `${listing.currency} ${listing.basePrice?.toLocaleString() || '0'}`;
          
          // Build location string
          const locationParts = [];
          if (listing.location?.address) locationParts.push(listing.location.address);
          if (listing.location?.city) locationParts.push(listing.location.city);
          const locationString = locationParts.join(', ') || 'Location not specified';
          
          return {
            id: listing.id,
            type: serviceType,
            serviceType: serviceType,
            category: listing.category,
            title: listing.title,
            image: imageUrl,
            price: formattedPrice,
            period: 'Per Day',
            location: locationString,
            // Car-specific fields
            make: listing.carMake,
            model: listing.carModel,
            year: listing.carYear,
            transmission: listing.carTransmission,
            seats: listing.carSeats,
            // Resort-specific fields
            beds: listing.capacity,
            baths: listing.maxCapacity,
            propertyType: listing.resortType || listing.roomType,
            // Dining-specific fields
            cuisine: listing.cuisineType,
            capacity: listing.seatingCapacity,
            rating: 4.5, // Default rating since not in API
            // Water activity fields
            activity: listing.serviceType,
            duration: listing.serviceDuration,
            difficulty: 'Beginner'
          };
        });
        
        console.log('Transformed listings:', transformedListings.length, 'items');
        setApiListings(transformedListings);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
        setListingsError('Unable to load listings. Please try again later.');
      } finally {
        setIsLoadingListings(false);
      }
    };
    
    fetchListings();
  }, []);

  const services = [
    { id: "car", label: "Car rental", icon: Car },
    { id: "dining", label: "Dining", icon: Utensils },
    { id: "resort", label: "Resorts & Recreation", icon: Home },
    { id: "flights", label: "Flights", icon: Plane },
    { id: "other", label: "Other services", icon: MoreHorizontal },
  ];

  // Handle search action from booking components
  const handleSearch = (data) => {
    // Water Recreation (Jet Ski, Boat Rental, Experiences)
    if (data.service === "water-recreation") {
      const queryParams = new URLSearchParams({
        activity: data.activity,
        date: data.bookingDate,
        time: data.bookingTime,
      }).toString();
      window.location.href = `/result/?${queryParams}`;
      return;
    }

    // Car Rental
    if (data.service === "car") {
      const queryParams = new URLSearchParams({
        location: data.pickupLocation,
        date: data.pickupDate,
        time: data.pickupTime,
      }).toString();
      window.location.href = `/result/?${queryParams}`;
      return;
    }

    // Resort House / Beach House
    if (data.service === "resort") {
      const queryParams = new URLSearchParams({
        destination: data.destination,
        checkin: data.checkInDate,
        time: data.checkInTime,
      }).toString();
      window.location.href = `/result/?${queryParams}`;
      return;
    }

    // Dining / Restaurant Booking
    if (data.service === "dining") {
      const queryParams = new URLSearchParams({
        restaurant: data.restaurant,
        date: data.bookingDate,
        time: data.bookingTime,
        guests: data.guests,
      }).toString();
      window.location.href = `/result/?${queryParams}`;
      return;
    }

    setSearchResults(data);
  };
  
  // Quick Search State
  const [quickSearchResults, setQuickSearchResults] = useState(null);
  const [isQuickSearching, setIsQuickSearching] = useState(false);
  const [quickSearchError, setQuickSearchError] = useState(null);

  const handleQuickSearch = async (params) => {
    // Basic validation to prevent unnecessary calls
    if (!params.location || params.location.length < 3) {
      setQuickSearchResults(null);
      return;
    }

    try {
      setIsQuickSearching(true);
      setQuickSearchError(null);
      
      // Map frontend service types to backend enum values
      const serviceTypeMap = {
        'car': 'CAR_RENTAL',
        'water': 'WATER_RECREATION',
        'dining': 'DINING',
        'resort': 'RESORT_STAY'
      };
      
      // Build search params according to backend spec
      const searchParams = {
        location: params.location,
        limit: 10 // Limit for homepage quick view
      };
      
      // Add service type if provided
      if (params.service && serviceTypeMap[params.service]) {
        searchParams.serviceType = serviceTypeMap[params.service];
      }
      
      // Add optional parameters
      if (params.date) searchParams.date = params.date;
      if (params.time) searchParams.time = params.time;
      if (params.q) searchParams.q = params.q;
      if (params.startDate) searchParams.startDate = params.startDate;
      if (params.endDate) searchParams.endDate = params.endDate;

      const response = await quickSearchListings(searchParams);
      
      // Backend returns: { results: [...], meta: {...} }
      setQuickSearchResults(response.results || []);
      
    } catch (err) {
      console.error('Quick search failed:', err);
      
      // Handle different error types per spec
      if (err.status === 400) {
        setQuickSearchError('Invalid search filters. Please check your inputs.');
      } else if (err.status === 500) {
        setQuickSearchError('Unable to fetch listings. Please try again.');
      } else {
        setQuickSearchError('Unable to fetch listings');
      }
      
      setQuickSearchResults([]);
    } finally {
      setIsQuickSearching(false);
    }
  };

  // Handle View All Listings navigation
  const handleViewAllListings = () => {
    // Map filter state to service type for URL
    const serviceTypeMap = {
      'all': '',
      'car': 'CAR_RENTAL',
      'resort': 'RESORT_STAY',
      'dining': 'DINING',
      'water': 'WATER_RECREATION',
      'other': 'OTHER'
    };

    const serviceType = serviceTypeMap[listingFilter] || '';
    
    // Build query parameters
    const params = new URLSearchParams();
    if (serviceType) {
      params.append('serviceType', serviceType);
    }
    
    // Navigate to result page
    window.location.href = `/result${params.toString() ? '?' + params.toString() : ''}`;
  };

  const content = serviceContent[activeService];
  const currentServiceComponents = serviceComponents[activeService];

  // Filter listings based on selected category using API data
  const filteredListings = listingFilter === 'resort'
    ? apiListings.filter(listing => listing.type === 'resort' || listing.type === 'water')
    : apiListings.filter(listing => listing.type === listingFilter);

  return (
    <main className="min-h-screen bg-white">
      <div className="space-y-0">
        {/* Hero Section - Expedia Style */}
        <div className="relative min-h-[450px] flex items-center"> {/* Added relative and min-h to the container */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1601461265802-1a7b89edf876?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            }}
          ></div>
          <div className="absolute inset-0 bg-black opacity-30"></div> {/* Added overlay for text readability */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-16 w-full relative z-10"> {/* Added relative z-10 for content to be above overlay */}
            {/* Hero Content */}
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-4 leading-tight tracking-tight">
                Made for the journey
              </h1>
              <p className="text-lg sm:text-xl text-white/95 mb-6 max-w-2xl font-light">
                Curating journeys connecting cultures
              </p>
            </div>

            {/* Search Card with Integrated Service Tabs */}
            <div className="bg-white rounded-lg shadow-2xl overflow-visible">
              {/* Service Tabs - Horizontal */}
              <div className="border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {services.map((service, index) => (
                    <button
                      key={service.id}
                      onClick={() => setActiveService(service.id)}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
                        index === 0 ? 'rounded-tl-lg' : ''
                      } ${
                        index === services.length - 1 ? 'rounded-tr-lg' : ''
                      } ${
                        activeService === service.id
                          ? "border-[#E05D3D] text-[#E05D3D] bg-white"
                          : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <service.icon className="w-5 h-5" />
                      <span>{service.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Inputs */}
              <div className="p-6 relative rounded-b-lg">
                {activeService === "flights" && currentServiceComponents.about}
                {activeService !== "flights" && (
                  <>
                    {activeService === "car" && (
                  <CarRentalBookingInputs 
                    onSearch={handleSearch} 
                    onQuickSearch={handleQuickSearch}
                    showBorder={false} 
                  />
                )}
                {activeService === "dining" && (
                  <DiningBookingInputs onSearch={handleSearch} showBorder={false} />
                )}
                {activeService === "resort" && (
                  <ResortHouseBookingInputs onSearch={handleSearch} showBorder={false} />
                )}
                {activeService === "water" && (
                  <WaterRecreationBookingInputs onSearch={handleSearch} showBorder={false} />
                )}
                {activeService === "other" && (
                  <OtherServicesBookingInputs onSearch={handleSearch} showBorder={false} />
                )}
                  </>
                )}

                {/* Quick Search Results Dropdown */}
                {(quickSearchResults || isQuickSearching) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 max-h-96 overflow-y-auto z-50">
                    {/* Loading State */}
                    {isQuickSearching && !quickSearchResults && (
                      <div className="flex items-center justify-center py-8 text-gray-500">
                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mr-2"></div>
                         Searching available listings...
                      </div>
                    )}

                    {/* Error State */}
                    {quickSearchError && (
                      <div className="bg-red-50 text-red-600 p-4 rounded-md text-center m-4">
                        {quickSearchError}
                      </div>
                    )}

                    {/* Results List */}
                    {quickSearchResults && quickSearchResults.length > 0 && (
                      <div className="p-4">
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-3 px-2">
                          <span className="font-medium">{quickSearchResults.length} properties found</span>
                          <button 
                            onClick={() => setQuickSearchResults(null)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            ✕ Close
                          </button>
                        </div>
                        <div className="space-y-2">
                          {quickSearchResults.map((result) => (
                             <a 
                               key={result.listingId || result.id} 
                               href={`/listing/${result.listingId || result.id}`}
                               className="block bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-primary-300 transition-all group"
                             >
                                <div className="flex gap-3">
                                  {/* Thumbnail */}
                                  <div className="w-24 h-20 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                                    {result.thumbnail ? (
                                      <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 truncate text-sm group-hover:text-primary-600 transition-colors">{result.title}</h4>
                                    <p className="text-xs text-gray-500 truncate mt-0.5">{result.location}</p>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="text-xs text-primary-600 font-medium bg-primary-50 px-2 py-0.5 rounded-full capitalize">
                                        {result.serviceType?.toLowerCase().replace('_', ' ')}
                                      </span>
                                      <div className="text-right">
                                        <span className="font-bold text-gray-900 text-sm">
                                          {result.currency} {result.priceFrom?.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-gray-500 block">per day</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                             </a>
                          ))}
                        </div>
                        <div className="pt-3 text-center border-t border-gray-100 mt-3">
                            <a 
                              href={`/result`} 
                              className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors inline-flex items-center gap-1"
                            >
                              View all results
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </a>
                        </div>
                      </div>
                    )}
                    
                    {/* Empty State */}
                    {quickSearchResults && quickSearchResults.length === 0 && !isQuickSearching && !quickSearchError && (
                      <div className="text-center py-8 px-4 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="font-medium mb-1">No listings found</p>
                        <p className="text-sm">Try adjusting your search criteria</p>
                        <button 
                          onClick={() => setQuickSearchResults(null)}
                          className="mt-3 text-primary-600 text-sm hover:underline font-medium"
                        >
                          Clear search
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Promotional Banner - No spacing */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-3">
            <div className="flex items-center justify-center gap-3 text-sm">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <p className="text-gray-700">
                <span className="font-semibold text-gray-900">Your gateway to African experiences</span>
                <span className="hidden sm:inline"> – Save on travel across Nigeria and beyond.</span>
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline whitespace-nowrap">
                See all deals
              </a>
            </div>
          </div>
        </div>

        {/* Trust Indicators Section */}
        <div className="bg-white py-12 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Bundle & Save */}
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bundle & Save</h3>
                <p className="text-sm text-gray-600">Save more when you book together</p>
              </div>

              {/* More Flexibility */}
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">More flexibility</h3>
                <p className="text-sm text-gray-600">Free cancellation on most bookings</p>
              </div>

              {/* Upfront Pricing */}
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upfront pricing</h3>
                <p className="text-sm text-gray-600">No hidden fees or surprise charges</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Listing Cards Section */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
            {/* Header with Category Tabs */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Listings for every travel style
              </h2>
              <p className="text-sm text-gray-600 mb-6">Browse our curated selection</p>
              
              {/* Category Filter Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex gap-6 overflow-x-auto scrollbar-hide">
                  <button
                    onClick={() => setListingFilter('car')}
                    className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      listingFilter === 'car'
                        ? 'border-[#E05D3D] text-[#E05D3D]'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Car Rentals
                  </button>
                  <button
                    onClick={() => setListingFilter('dining')}
                    className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      listingFilter === 'dining'
                        ? 'border-[#E05D3D] text-[#E05D3D]'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Dining
                  </button>
                  <button
                    onClick={() => setListingFilter('resort')}
                    className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      listingFilter === 'resort'
                        ? 'border-[#E05D3D] text-[#E05D3D]'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Resorts & Recreation
                  </button>
                  <button
                    onClick={() => setListingFilter('other')}
                    className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      listingFilter === 'other'
                        ? 'border-[#E05D3D] text-[#E05D3D]'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Other services
                  </button>
                </div>
              </div>
            </div>

            {/* Horizontal Scrolling Listing Cards */}
            <div className="relative">
              {/* Loading State */}
              {isLoadingListings && (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E05D3D] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading listings...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {listingsError && !isLoadingListings && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                  <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-600 font-medium mb-2">Failed to load listings</p>
                  <p className="text-red-500 text-sm">{listingsError}</p>
                </div>
              )}

              {/* Empty State */}
              {!isLoadingListings && !listingsError && filteredListings.length === 0 && (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-gray-500 text-lg font-medium mb-1">No listings found</p>
                  <p className="text-gray-400 text-sm">Try selecting a different category</p>
                </div>
              )}

              {/* Listings Grid */}
              {!isLoadingListings && !listingsError && filteredListings.length > 0 && (
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                  {filteredListings.map((listing) => (
                  <div 
                    key={listing.id} 
                    onClick={() => window.location.href = `/service/${listing.serviceType}/${listing.id}`}
                    className="flex-none w-[300px] bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 group cursor-pointer snap-start"
                  >
                    <div className="relative h-56 bg-gray-200 overflow-hidden">
                      <img 
                        src={listing.image} 
                        alt={listing.type} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle favorite toggle
                        }}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="mb-3">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {listing.price} <span className="text-sm font-normal text-gray-500">{listing.period}</span>
                        </div>
                        <div className="flex items-start gap-1 text-sm text-gray-600">
                          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{listing.location}</span>
                        </div>
                      </div>

                      {/* Resort-specific details */}
                      {listing.type === 'resort' && (
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              <span>{listing.beds} Beds</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{listing.baths} Baths</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-900 font-medium">
                            {listing.propertyType}
                          </div>
                        </div>
                      )}

                      {/* Car-specific details */}
                      {listing.type === 'car' && (
                        <div className="space-y-2 mb-3">
                          <div className="text-sm text-gray-900 font-medium">
                            {listing.make} {listing.model} {listing.year}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{listing.transmission}</span>
                            <span>•</span>
                            <span>{listing.seats} Seats</span>
                          </div>
                        </div>
                      )}

                      {/* Dining-specific details */}
                      {listing.type === 'dining' && (
                        <div className="space-y-2 mb-3">
                          <div className="text-sm text-gray-900 font-medium">
                            {listing.cuisine} Cuisine
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Capacity: {listing.capacity} guests</span>
                          </div>
                          {listing.rating && (
                            <div className="flex items-center gap-1 text-sm">
                              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-gray-700 font-medium">{listing.rating}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Water activity-specific details */}
                      {listing.type === 'water' && (
                        <div className="space-y-2 mb-3">
                          <div className="text-sm text-gray-900 font-medium">
                            {listing.activity}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{listing.duration}</span>
                            <span>•</span>
                            <span>{listing.difficulty}</span>
                          </div>
                        </div>
                      )}

                       <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">Availability</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>

            {/* View All Link - Only show if there are listings */}
            {filteredListings.length > 0 && (
              <div className="mt-6">
                <button 
                  onClick={handleViewAllListings}
                  className="text-[14px] text-gray-700 hover:text-gray-900 underline cursor-pointer bg-transparent border-none p-0"
                >
                  View all listings
                </button>
              </div>
            )}
          </div>
        </div>



        {/* Common Components (shown for all services) */}
        {/* <VendorBanner /> */}
        <FAQComponent />
      </div>
      
      {/* Smooth scrolling styles */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
