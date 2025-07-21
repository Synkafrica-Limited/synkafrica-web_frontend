"use client";

import React from "react";
import BookingFlow from "@/components/booking_flow/Booking_flow";
import DiningServicesGrid from "@/app/(main)/(services)/dining-reservations/components/DiningBrandsGrid";

const diningServices = [
    {
        id: 1,
        images: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=400&h=300&fit=crop",
        ],
        businessName: "The Gourmet Table",
        location: "Lagos",
        rating: 4.8,
        serviceType: "Fine Dining",
        price: "18,000",
        priceUnit: "table",
        savings: "2,000",
        isPopular: true,
    },
    {
        id: 2,
        images: [
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=400&h=300&fit=crop",
        ],
        businessName: "Urban Bites",
        location: "Lagos",
        rating: 4.9,
        serviceType: "Casual Dining",
        price: "10,000",
        priceUnit: "table",
        savings: "1,500",
    },
    {
        id: 3,
        images: [
            "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
        ],
        businessName: "Seaside Grill",
        location: "Lagos",
        rating: 4.7,
        serviceType: "Seafood Restaurant",
        price: "22,000",
        priceUnit: "table",
    },
    {
        id: 4,
        images: [
            "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
        ],
        businessName: "Sunset Bistro",
        location: "Lagos",
        rating: 4.8,
        serviceType: "Rooftop Dining",
        price: "15,000",
        priceUnit: "table",
        isPopular: true,
    },
    {
        id: 5,
        images: [
            "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
        ],
        businessName: "Lagoon Eats",
        location: "Lagos",
        rating: 4.6,
        serviceType: "Buffet",
        price: "12,000",
        priceUnit: "table",
    },
    {
        id: 6,
        images: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=400&h=300&fit=crop",
        ],
        businessName: "Blue Plate",
        location: "Lagos",
        rating: 4.5,
        serviceType: "Family Restaurant",
        price: "8,000",
        priceUnit: "table",
    },
    {
        id: 7,
        images: [
            "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&h=300&fit=crop",
        ],
        businessName: "Golden Spoon",
        location: "Lagos",
        rating: 4.9,
        serviceType: "Luxury Dining",
        price: "30,000",
        priceUnit: "table",
        savings: "5,000",
    },
    {
        id: 8,
        images: [
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
        ],
        businessName: "Palm Grove",
        location: "Lagos",
        rating: 4.7,
        serviceType: "Outdoor Dining",
        price: "14,000",
        priceUnit: "table",
    },
];


const setUserSearchResultFromBookingFlow = (searchResult) => {
  // Implement logic to handle search result if needed
};

export default function DiningReservationPage() {
  return (
    <main className="min-h-screen">
      <div className="space-y-5">
        {/* NOTE: Booking flow should handle all of its logic wiithin its component(Handling user input, fetching data) - the only stuff it should expose to other component where it'll be called in - 1. return: data gotten from the fetch request sent based on what the user typed in and searched for" */}
        {/* NOTE: Booking flow should be particular to the service page - on switch between services button except it's on the home page(landing page) */}
        <BookingFlow />
        <DiningServicesGrid diningServices={diningServices} />
        <br />
        <br />
      </div>
    </main>
  );
}
