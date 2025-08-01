"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Star, MapPin } from "lucide-react";

const ServiceCard = ({
  id,
  images,
  businessName,
  location,
  rating,
  serviceType,
  price,
  priceUnit,
  isPopular = false,
  savings = null,
  onCardClick,
  currency = "₦",
  buttonText = "Book Now",
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

  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 cursor-pointer overflow-hidden"
      onClick={() => onCardClick(id)}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {/* Popular Badge */}
        {isPopular && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#E05D3D] text-white text-xs font-medium px-2 py-1 rounded-full">
              Popular
            </span>
          </div>
        )}

        <img
          src={images[currentImageIndex]}
          alt={businessName}
          className="w-full h-full object-cover"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 text-gray-700 p-1 rounded-full hover:bg-opacity-100 transition-opacity"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 text-gray-700 p-1 rounded-full hover:bg-opacity-100 transition-opacity"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex
                    ? "bg-[#E05D3D]"
                    : "bg-white bg-opacity-60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Business Name */}
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
          {businessName}
        </h3>

        {/* Location & Service Type */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin size={14} />
            <span className="text-sm">{location}</span>
          </div>
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {serviceType}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          <Star size={14} className="text-[#E05D3D] fill-current" />
          <span className="text-sm font-medium text-gray-900">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-900">
                {currency}
                {price}
              </span>
              <span className="text-sm text-gray-600">/{priceUnit}</span>
            </div>
            {savings && (
              <span className="text-sm text-[#E05D3D] font-medium">
                Save {currency}
                {savings}
              </span>
            )}
          </div>
          <button
            className="bg-[#E05D3D] hover:bg-[#d54f32] text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onCardClick(id);
            }}
          >
            {buttonText}
          </button>
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
  columns = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
  },
  currency = "₦",
  buttonText = "Book Now",
}) => {
  const getGridClasses = () => {
    const { sm, md, lg, xl } = columns;
    return `grid grid-cols-${sm} sm:grid-cols-${md} lg:grid-cols-${lg} xl:grid-cols-${xl} gap-6`;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-left">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {title} in <span>{locationName}</span>
          </h1>
          <p className="text-gray-600 max-w-2xl">{subtitle}</p>
        </div>

        {/* Grid */}
        <div className={getGridClasses()}>
          {services.map((service) => (
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
              isPopular={service.isPopular}
              savings={service.savings}
              currency={currency}
              buttonText={buttonText}
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
