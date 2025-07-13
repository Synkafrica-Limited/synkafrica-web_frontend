"use client";
import React from 'react';
import ServiceCardsGrid from '../../../../../components/service_card/ServiceCard';
import { useRouter } from 'next/navigation';

const BeachServicesGrid = ({ beachServices }) => {
  const router = useRouter();

  const handleCardClick = (id) => {
    router.push(`/beach-resorts/detail/${id}`);
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
      onCardClick={handleCardClick}
    />
  );
};

export default BeachServicesGrid;