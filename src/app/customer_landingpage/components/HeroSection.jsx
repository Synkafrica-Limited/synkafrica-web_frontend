"use client";

import React, { useState } from "react";
import { Car, Sailboat, Home, Utensils, MoreHorizontal } from "lucide-react";

import CarRentalBookingInputs from "../../../components/booking_inputs/CarRentalBookingInputs";
import ResortHouseBookingInputs from "../../../components/booking_inputs/ResortHouseBookingInputs";
import DiningBookingInputs from "../../../components/booking_inputs/DiningBookingInputs";
import OtherServicesBookingInputs from "../../../components/booking_inputs/OtherServicesBookingInputs";
import WaterRecreationBookingInputs from "../../../components/booking_inputs/WaterRecreationBookingInputs";

// Service-specific content configuration
const serviceContent = {
  car: {
    heading: "Chauffeur-driven\nconvenience - Book now!",
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
    heading: "Find your perfect\nwater adventure - Book today!",
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

export default function HomePageHero() {
  const [activeService, setActiveService] = useState("car");
  const [searchResults, setSearchResults] = useState(null);

  const services = [
    { id: "car", label: "Car rental", icon: Car },
    { id: "dining", label: "Dining", icon: Utensils },
    { id: "resort", label: "Resort house", icon: Home },
    { id: "water", label: "Water recreation", icon: Sailboat },
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
      window.location.href = `/water-recreation/listings?${queryParams}`;
      return;
    }

    // Car Rental
    if (data.service === "car") {
      const queryParams = new URLSearchParams({
        location: data.pickupLocation,
        date: data.pickupDate,
        time: data.pickupTime,
      }).toString();
      window.location.href = `/car-rental/listings?${queryParams}`;
      return;
    }

    // Resort House / Beach House
    if (data.service === "resort") {
      const queryParams = new URLSearchParams({
        destination: data.destination,
        checkin: data.checkInDate,
        time: data.checkInTime,
      }).toString();
      window.location.href = `/resort-house/listings?${queryParams}`;
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
      window.location.href = `/dining/listings?${queryParams}`;
      return;
    }

    setSearchResults(data);
  };

  const content = serviceContent[activeService];

  return (
    <div className="p-4 sm:p-6 md:p-8 mt-[80px]">
      <div className="max-w-6xl mx-auto">
        {/* Service Navigation */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-0 sm:mb-0">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveService(service.id)}
              className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeService === service.id
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <service.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">{service.label}</span>
            </button>
          ))}
        </div>

        {/* Hero Content */}
        <div className="mb-0 sm:mb-0 mt-[40px]">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-0 sm:mb-0 leading-tight whitespace-pre-line">
            {content.heading}
          </h1>

          {/* Features */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            {content.features.map((feature, index) => (
              <div key={index} className="text-gray-600 text-sm sm:text-base">
                {feature}
              </div>
            ))}
          </div>

          {/* Dynamic booking inputs */}
          {activeService === "car" && (
            <CarRentalBookingInputs onSearch={handleSearch} />
          )}
          {activeService === "dining" && (
            <DiningBookingInputs onSearch={handleSearch} />
          )}
          {activeService === "resort" && (
            <ResortHouseBookingInputs onSearch={handleSearch} />
          )}
          {activeService === "water" && (
            <WaterRecreationBookingInputs onSearch={handleSearch} />
          )}
          {activeService === "other" && (
            <OtherServicesBookingInputs onSearch={handleSearch} />
          )}

          {/* Stats Component */}
          <div className="mt-6 sm:mt-8 bg-[#FBFBFB] rounded-2xl border border-[#EAEAEA] p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {content.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
