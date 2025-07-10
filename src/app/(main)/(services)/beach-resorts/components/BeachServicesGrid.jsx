"use client";
import React from 'react';
import ServiceCardsGrid from '../../../../../components/service_card/ServiceCard';

const BeachServicesPage = () => {
  const beachServices = [
    {
      id: "landmark-beach",
      images: [
        "/images/landmark_beach.png",
        "/images/beach1.png",
        "/images/beach2.png"
      ],
      businessName: "Landmark beach",
      location: "Lagos",
      rating: 4.3,
      serviceType: "Beach Resort",
      price: "50",
      priceUnit: "day",
      savings: "10",
      isPopular: false,
    },
    {
      id: 'oniru-private-beach',
      images: [
        "/images/oniru_beach.png",
        "/images/beach2.png",
        "/images/beach3.png"
      ],
      businessName: "Oniru private beach",
      location: "Lagos",
      rating: 4.3,
      serviceType: "Private Beach",
      price: "50",
      priceUnit: "day",
      savings: "10",
      isPopular: false,
    },
    {
      id: "the-good-beach",
      images: [
        "/images/the_good_beach.png",
        "/images/beach3.png",
        "/images/beach1.png"
      ],
      businessName: "The good beach",
      location: "Lagos",
      rating: 4.3,
      serviceType: "Beach Resort",
      price: "50",
      priceUnit: "day",
      savings: "10",
      isPopular: false,
    },
    {
      id: "elegushi-royal-beach",
      images: [
        "/images/elegushi_beach.png",
        "/images/beach1.png",
        "/images/beach2.png"
      ],
      businessName: "Elegushi royal beach",
      location: "Lagos",
      rating: 4.3,
      serviceType: "Royal Beach",
      price: "50",
      priceUnit: "day",
      savings: "10",
      isPopular: true,
    },
  ];

  const handleCardClick = (id) => {
    console.log('Beach service clicked:', id);
  };

  return (
    <ServiceCardsGrid
      services={beachServices}
      title="Explore beach"
      subtitle="Soak up the sun in style with our beach service"
      locationName="Lagos"
      locationColor="blue-500"
      currency="$"
      routePath="/beach-resorts/detail"
      buttonText="Book Beach"
      availabilityText="Open daily"
      columns={{ sm: 1, md: 2, lg: 4, xl: 4 }}
      onCardClick={handleCardClick}
    />
  );
};

export default BeachServicesPage;