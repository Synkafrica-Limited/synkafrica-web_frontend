"use client";

import React from "react";
import ServiceCardsGrid from "../../../../../components/service_card/ServiceCard";
import { useRouter } from "next/navigation";

const LaundryServicesPage = () => {
  const router = useRouter();

  const laundryServices = [
    {
      id: 1,
      images: [
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1567306295914-61743c7cea9d?w=400&h=300&fit=crop",
      ],
      businessName: "Spin & Sparkle",
      location: "Lagos",
      rating: 4.8,
      serviceType: "Premium Package",
      price: "5,500",
      priceUnit: "fabric",
      savings: "500",
      isPopular: true,
    },
    {
      id: 2,
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400&h=300&fit=crop",
      ],
      businessName: "Freshfold Laundry",
      location: "Lagos",
      rating: 4.9,
      serviceType: "Express Service",
      price: "4,800",
      priceUnit: "fabric",
      savings: "700",
    },
    {
      id: 3,
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1567306295914-61743c7cea9d?w=400&h=300&fit=crop",
      ],
      businessName: "Washlab Express",
      location: "Lagos",
      rating: 4.7,
      serviceType: "Standard Service",
      price: "4,200",
      priceUnit: "fabric",
    },
    {
      id: 4,
      images: [
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400&h=300&fit=crop",
      ],
      businessName: "SpinCycle Magic",
      location: "Lagos",
      rating: 4.8,
      serviceType: "Deluxe Package",
      price: "5,800",
      priceUnit: "fabric",
      isPopular: true,
    },
    {
      id: 5,
      images: [
        "https://images.unsplash.com/photo-1567306295914-61743c7cea9d?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      ],
      businessName: "The Wash Concierge",
      location: "Lagos",
      rating: 4.6,
      serviceType: "Premium Service",
      price: "5,200",
      priceUnit: "fabric",
    },
    {
      id: 6,
      images: [
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400&h=300&fit=crop",
      ],
      businessName: "The Avenue Hub",
      location: "Lagos",
      rating: 4.5,
      serviceType: "Quick Wash",
      price: "3,900",
      priceUnit: "fabric",
    },
    {
      id: 7,
      images: [
        "https://images.unsplash.com/photo-1567306295914-61743c7cea9d?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      ],
      businessName: "Crystal White",
      location: "Lagos",
      rating: 4.9,
      serviceType: "Luxury Package",
      price: "6,500",
      priceUnit: "fabric",
      savings: "700",
    },
    {
      id: 8,
      images: [
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400&h=300&fit=crop",
      ],
      businessName: "The Laundry Lounge",
      location: "Lagos",
      rating: 4.7,
      serviceType: "Premium Care",
      price: "5,000",
      priceUnit: "fabric",
    },
  ];

  const handleCardClick = (id) => {
    router.push(`/laundry-service/attendant/${id}`);
  };

  return (
    <ServiceCardsGrid
      services={laundryServices}
      title="Laundry Services"
      subtitle="Drop the mess, we'll handle the rest - Spotless laundry, delivered fresh"
      locationName="Lagos"
      locationColor="orange-500"
      currency="₦"
      routePath="/laundry-service"
      buttonText="Book Now"
      availabilityText="Available now"
      onCardClick={handleCardClick}
    />
  );
};

export default LaundryServicesPage;
