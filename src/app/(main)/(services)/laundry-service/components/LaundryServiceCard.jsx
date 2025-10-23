"use client";

import React from "react";
import ServiceCardsGrid from "../../../../../components/service_card/ServiceCard";
import { useRouter } from "next/navigation";

const LaundryServicesGrid = ({ laundryServices }) => {
  const router = useRouter();

  const handleCardClick = (id) => {
    router.push(`/laundry-service/detail/${id}`);
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

export default LaundryServicesGrid;
