"use client";

import React, { useState } from "react";
import { Car, Sailboat, Home, Utensils, MoreHorizontal } from "lucide-react";

import CarRentalBookingInputs from "../../components/booking_inputs/CarRentalBookingInputs";
import ResortHouseBookingInputs from "../../components/booking_inputs/ResortHouseBookingInputs";
import DiningBookingInputs from "../../components/booking_inputs/DiningBookingInputs";
import OtherServicesBookingInputs from "../../components/booking_inputs/OtherServicesBookingInputs";
import WaterRecreationBookingInputs from "../../components/booking_inputs/WaterRecreationBookingInputs";
import { useSession } from '@/hooks/customer/auth/useSession';
import { quickSearchListings } from '@/services/listings.service';
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
  other: {
    about: <AboutService service="other" />,
    main: <OtherServices />,
  },
};

export default function HomePage() {
  const [activeService, setActiveService] = useState("car");
  const [searchResults, setSearchResults] = useState(null);

  const services = [
    { id: "car", label: "Car rental", icon: Car },
    { id: "dining", label: "Dining", icon: Utensils },
    { id: "resort", label: "Resorts", icon: Home },
    { id: "water", label: "Recreation", icon: Sailboat },
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
      
      // Adapt params for backend
      // Backend expects: q, location, serviceType, etc.
      const searchParams = {
        location: params.location,
        serviceType: params.service === 'car' ? 'CAR_RENTAL' 
          : params.service === 'water' ? 'WATER_RECREATION' 
          : params.service === 'dining' ? 'DINING'
          : params.service === 'resort' ? 'RESORT_STAY' : undefined,
        limit: 5 // Limit specifically for homepage quick view
      };
      
      if (params.date) searchParams.date = params.date;
      if (params.q) searchParams.q = params.q;

      const response = await quickSearchListings(searchParams);
      
      // Response format: { results: [...], meta: {...} }
      setQuickSearchResults(response.results || []);
      
    } catch (err) {
      console.error('Quick search failed:', err);
      setQuickSearchError('Unable to fetch listings');
      setQuickSearchResults([]);
    } finally {
      setIsQuickSearching(false);
    }
  };

  const content = serviceContent[activeService];
  const currentServiceComponents = serviceComponents[activeService];

  return (
    <main className="min-h-screen">
      <div className="space-y-5">
        {/* Hero Section */}
        <div className="bg-[#E05D3D] pt-8 pb-16 sm:pb-24 px-4 sm:px-6 md:px-8 -mt-5">
          <div className="max-w-6xl mx-auto">
            
            {/* Hero Content */}
            <div className="mb-8 sm:mb-10 text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight whitespace-pre-line">
                {content.heading}
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl">
                 Search low prices on hotels, homes and much more...
              </p>

              {/* Service Navigation */}
              <div className="flex flex-wrap gap-2 mb-6">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setActiveService(service.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                      activeService === service.id
                        ? "bg-white text-primary-600 shadow-sm"
                        : "bg-primary-600/30 text-white hover:bg-primary-600/50 backdrop-blur-sm"
                    }`}
                  >
                    <service.icon className="w-4 h-4" />
                    <span className="whitespace-nowrap">{service.label}</span>
                  </button>
                ))}
              </div>

              {/* Features */}
              <div className="relative mt-4 hidden sm:block">
                <div className="flex flex-wrap gap-x-8 gap-y-2">
                  {content.features.map((feature, index) => (
                    <div
                      key={index}
                      className="text-white/90 text-sm flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic booking inputs */}
              <div className="mt-8 relative z-50">
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

                {/* Quick Search Results Dropdown */}
                {(quickSearchResults || isQuickSearching) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 max-h-96 overflow-y-auto z-50 p-4">
                    {/* Loading State */}
                    {isQuickSearching && !quickSearchResults && (
                      <div className="flex items-center justify-center py-8 text-gray-500">
                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mr-2"></div>
                         Searching available listings...
                      </div>
                    )}

                    {/* Error State */}
                    {quickSearchError && (
                      <div className="bg-red-50 text-red-600 p-4 rounded-md text-center">
                        {quickSearchError}
                      </div>
                    )}

                    {/* Results List */}
                    {quickSearchResults && quickSearchResults.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-2 px-2">
                          <span>{quickSearchResults.length} results found</span>
                          <button 
                            onClick={() => setQuickSearchResults(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            Close
                          </button>
                        </div>
                        {quickSearchResults.map((result) => (
                           <a 
                             key={result.listingId || result.id} 
                             href={`/listing/${result.listingId || result.id}`}
                             className="block bg-white border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow hover:border-primary-200"
                           >
                              <div className="flex gap-4">
                                {/* Thumbnail */}
                                <div className="w-20 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                                  {result.thumbnail ? (
                                    <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 truncate">{result.title}</h4>
                                  <p className="text-sm text-gray-500 truncate">{result.location}</p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-primary-600 font-medium bg-primary-50 px-2 py-0.5 rounded-full capitalize">
                                      {result.serviceType?.toLowerCase().replace('_', ' ')}
                                    </span>
                                    <span className="font-bold text-gray-900">
                                      {result.currency} {result.priceFrom?.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                           </a>
                        ))}
                         <div className="pt-2 text-center">
                            <a 
                              href={`/result`} 
                              className="text-sm text-primary-600 font-medium hover:underline"
                            >
                              View all results
                            </a>
                        </div>
                      </div>
                    )}
                    
                    {/* Empty State */}
                    {quickSearchResults && quickSearchResults.length === 0 && !isQuickSearching && !quickSearchError && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No listings available for your search.</p>
                        <button 
                          onClick={() => setQuickSearchResults(null)}
                          className="mt-2 text-primary-600 text-sm hover:underline"
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

        {/* Dynamic Service-Specific Components */}
        {currentServiceComponents.about}
        {currentServiceComponents.main}

        {/* Common Components (shown for all services) */}
        <OtherServicesLinks />
        {/* <ExploreOtherServices /> */}
        <VendorBanner />
        <FAQComponent />
      </div>
    </main>
  );
}
