"use client"

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const LaundryServiceCard = ({ 
  images, 
  businessName, 
  location, 
  rating, 
  serviceType, 
  price, 
  priceUnit, 
  includeTaxes = true 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'bg-green-600';
    if (rating >= 4.0) return 'bg-blue-600';
    if (rating >= 3.5) return 'bg-purple-600';
    return 'bg-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Carousel */}
      <div className="relative h-48 bg-gray-200">
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
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-opacity"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-opacity"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Location */}
        <p className="text-sm text-gray-600 mb-1">{location}</p>
        
        {/* Business Name */}
        <h3 className="font-semibold text-gray-900 mb-2">{businessName}</h3>
        
        {/* Rating and Service Type */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`${getRatingColor(rating)} text-white text-xs px-2 py-1 rounded`}>
              {rating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-600">Very good</span>
          </div>
        </div>
        
        {/* Service Type */}
        <p className="text-sm text-gray-700 mb-3">{serviceType}</p>
        
        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-1">
            <span className="text-lg font-semibold text-gray-900">₦{price}</span>
            <span className="text-sm text-gray-600">/{priceUnit}</span>
          </div>
        </div>
        
        {/* Tax Information */}
        {includeTaxes && (
          <p className="text-xs text-gray-500 mt-1">Include taxes & fees</p>
        )}
      </div>
    </div>
  );
};

const LaundryServicesGrid = () => {
  const laundryServices = [
    {
      images: [
        'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1567306295914-61743c7cea9d?w=400&h=300&fit=crop'
      ],
      businessName: 'Spin & Sparkle',
      location: 'Lagos',
      rating: 5.0,
      serviceType: 'Laundry services',
      price: '5.5',
      priceUnit: 'fabric'
    },
    {
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400&h=300&fit=crop'
      ],
      businessName: 'Freshfold Laundry',
      location: 'Lagos',
      rating: 5.0,
      serviceType: 'Laundry services',
      price: '5.5',
      priceUnit: 'fabric'
    },
    {
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1567306295914-61743c7cea9d?w=400&h=300&fit=crop'
      ],
      businessName: 'Washlab express',
      location: 'Lagos',
      rating: 5.0,
      serviceType: 'Laundry services',
      price: '5.5',
      priceUnit: 'fabric'
    },
    {
      images: [
        'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400&h=300&fit=crop'
      ],
      businessName: 'SpinCycle magic',
      location: 'Lagos',
      rating: 5.0,
      serviceType: 'Laundry services',
      price: '5.5',
      priceUnit: 'fabric'
    },
    {
      images: [
        'https://images.unsplash.com/photo-1567306295914-61743c7cea9d?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
      ],
      businessName: 'The wash concierge',
      location: 'Lagos',
      rating: 5.0,
      serviceType: 'Laundry services',
      price: '5.5',
      priceUnit: 'fabric'
    },
    {
      images: [
        'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400&h=300&fit=crop'
      ],
      businessName: 'The avenue hub',
      location: 'Lagos',
      rating: 5.0,
      serviceType: 'Laundry services',
      price: '5.5',
      priceUnit: 'fabric'
    },
    {
      images: [
        'https://images.unsplash.com/photo-1567306295914-61743c7cea9d?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
      ],
      businessName: 'Crystal white',
      location: 'Lagos',
      rating: 5.0,
      serviceType: 'Laundry services',
      price: '5.5',
      priceUnit: 'fabric'
    },
    {
      images: [
        'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400&h=300&fit=crop'
      ],
      businessName: 'The laundry lounge',
      location: 'Lagos',
      rating: 5.0,
      serviceType: 'Laundry services',
      price: '5.5',
      priceUnit: 'fabric'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Laundry in Lagos</h1>
        <p className="text-gray-600">"Drop the mess we will handle the rest - Spotlesslaundry, delivered fresh"</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {laundryServices.map((service, index) => (
          <LaundryServiceCard
            key={index}
            images={service.images}
            businessName={service.businessName}
            location={service.location}
            rating={service.rating}
            serviceType={service.serviceType}
            price={service.price}
            priceUnit={service.priceUnit}
            includeTaxes={true}
          />
        ))}
      </div>
    </div>
  );
};

export default LaundryServicesGrid;