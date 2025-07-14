"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

import ServiceCardsGrid from '../../../../../components/service_card/ServiceCard';


const DiningBrandsGrid = ({ diningServices }) => {
    const router = useRouter();

    const handleCardClick = (id) => {
        router.push(`/dining-reservations/detail/${id}`);
    };

    return (
        <ServiceCardsGrid
            services={diningServices}
            title="Explore Dining"
            subtitle="Discover exquisite dining experiences with our curated brands"
            locationName="Lagos"
            locationColor="red-500"
            currency="₦"
            routePath="/dining-reservations/detail"
            buttonText="Reserve Table"
            availabilityText="Open daily"
            onCardClick={handleCardClick}
        />
    );
};

export default DiningBrandsGrid;