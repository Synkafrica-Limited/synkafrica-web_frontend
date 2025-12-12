"use client";

import React, { useState } from "react";
import { Car, Sailboat, Home, Utensils, MoreHorizontal } from "lucide-react";

import CarRentalBookingInputs from "../../components/booking_inputs/CarRentalBookingInputs";
import ResortHouseBookingInputs from "../../components/booking_inputs/ResortHouseBookingInputs";
import DiningBookingInputs from "../../components/booking_inputs/DiningBookingInputs";
import OtherServicesBookingInputs from "../../components/booking_inputs/OtherServicesBookingInputs";
import WaterRecreationBookingInputs from "../../components/booking_inputs/WaterRecreationBookingInputs";
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
              <div className="mt-8">
                {activeService === "car" && (
                  <CarRentalBookingInputs onSearch={handleSearch} showBorder={false} />
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
