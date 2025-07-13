"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  Shield,
} from "lucide-react";

const ServiceCard = ({
  id,
  images,
  businessName,
  location,
  rating,
  serviceType,
  price,
  priceUnit,
  includeTaxes = true,
  isPopular = false,
  savings = null,
  onCardClick,
  currency = "₦",
  availabilityText = "Available now",
  buttonText = "Book Now",
  routePath = "/service",
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.8) return "bg-green-500";
    if (rating >= 4.5) return "bg-blue-500";
    if (rating >= 4.0) return "bg-purple-500";
    return "bg-gray-500";
  };

  const getRatingText = (rating) => {
    if (rating >= 4.8) return "Excellent";
    if (rating >= 4.5) return "Very good";
    if (rating >= 4.0) return "Good";
    return "Fair";
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 cursor-pointer"
      onClick={() => onCardClick(id)}
    >
      {/* Image Carousel */}
      <div className="relative h-48 sm:h-56 bg-gray-100 overflow-hidden">
        {/* Popular Badge */}
        {isPopular && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <Star size={12} fill="currentColor" />
              Great Deal
            </span>
          </div>
        )}

        {/* Service Type Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
            {serviceType}
          </span>
        </div>

        <img
          src={images[currentImageIndex]}
          alt={businessName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition-all duration-200 shadow-lg"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition-all duration-200 shadow-lg"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex
                    ? "bg-white scale-125"
                    : "bg-white bg-opacity-60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-5">
        {/* Location */}
        <div className="flex items-center gap-1 mb-2">
          <MapPin size={12} className="sm:w-4 sm:h-4 text-gray-500" />
          <span className="text-xs sm:text-sm text-gray-600 font-medium">
            {location}
          </span>
        </div>

        {/* Business Name */}
        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 leading-tight">
          {businessName}
        </h3>

        {/* Rating and Features */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star
                size={12}
                className="sm:w-4 sm:h-4 text-yellow-400 fill-current"
              />
              <span
                className={`${getRatingColor(
                  rating
                )} text-white text-xs sm:text-sm font-semibold px-2 py-1 rounded-lg`}
              >
                {rating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs sm:text-sm text-gray-600 font-medium">
              {getRatingText(rating)}
            </span>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  {currency}
                  {price}
                </span>
                <span className="text-sm text-gray-600 font-medium">
                  /{priceUnit}
                </span>
              </div>
              {savings && (
                <span className="text-sm text-green-600 font-semibold">
                  Save {currency}
                  {savings}
                </span>
              )}
            </div>
            <button
              className="bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white shadow-sm font-semibold px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 shadow-lg flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                // Handle book now logic here
              }}
            >
              {buttonText}
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            {includeTaxes && (
              <span className="flex items-center gap-1">
                <Shield size={12} />
                Include taxes & fees
              </span>
            )}
            <span className="text-green-600 font-medium">
              • {availabilityText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceCardsGrid = ({
  services = [],
  onCardClick,
  title = "Services",
  subtitle = "Find the best services near you",
  locationName = "Your Area",
  locationColor = "orange-500",
  columns = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
  },
  currency = "₦",
  routePath = "/service",
  buttonText = "Book Now",
  availabilityText = "Available now",
}) => {

  const getGridClasses = () => {
    const { sm, md, lg, xl } = columns;
    return `grid grid-cols-${sm} sm:grid-cols-${md} lg:grid-cols-${lg} xl:grid-cols-${xl} gap-4 sm:gap-6`;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <br />
        <br />
        <br />
        {/* Header */}
        <div className="mb-8 sm:mb-10 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            {title} in{" "}
            <span className={`text-${locationColor}`}>{locationName}</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            {subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className={getGridClasses()}>
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              images={service.images}
              businessName={service.businessName}
              location={service.location}
              rating={service.rating}
              serviceType={service.serviceType}
              price={service.price}
              priceUnit={service.priceUnit}
              includeTaxes={service.includeTaxes ?? true}
              isPopular={service.isPopular}
              savings={service.savings}
              currency={currency}
              routePath={routePath}
              buttonText={buttonText}
              availabilityText={availabilityText}
              onCardClick={onCardClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { ServiceCard, ServiceCardsGrid };
export default ServiceCardsGrid;
