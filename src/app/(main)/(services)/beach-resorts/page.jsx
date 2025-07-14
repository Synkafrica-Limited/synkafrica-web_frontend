"use client";

import BookingFlow from "@/components/booking_flow/Booking_flow";
import BeachServicesGrid from "./components/BeachServicesGrid";

export default function BeachResortsPage() {
  // TODO: Fetch beach services data from an API - Replace with actual data fetching logic
  const beachServices = [
    {
      id: 1,
      images: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop",
      ],
      businessName: "Azure Sands Resort",
      location: "Lagos",
      rating: 4.8,
      serviceType: "Private Cabana",
      price: "25,000",
      priceUnit: "day",
      savings: "5,000",
      isPopular: true,
    },
    {
      id: 2,
      images: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&h=300&fit=crop",
      ],
      businessName: "Palm Breeze Beach",
      location: "Lagos",
      rating: 4.9,
      serviceType: "Beachfront Suite",
      price: "40,000",
      priceUnit: "night",
      savings: "8,000",
    },
    {
      id: 3,
      images: [
        "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
      ],
      businessName: "Coral Cove",
      location: "Lagos",
      rating: 4.7,
      serviceType: "Family Villa",
      price: "60,000",
      priceUnit: "night",
    },
    {
      id: 4,
      images: [
        "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop",
      ],
      businessName: "Sunset Bay Resort",
      location: "Lagos",
      rating: 4.8,
      serviceType: "Romantic Getaway",
      price: "35,000",
      priceUnit: "night",
      isPopular: true,
    },
    {
      id: 5,
      images: [
        "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
      ],
      businessName: "Lagoon Escape",
      location: "Lagos",
      rating: 4.6,
      serviceType: "Day Pass",
      price: "10,000",
      priceUnit: "person",
    },
    {
      id: 6,
      images: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&h=300&fit=crop",
      ],
      businessName: "Blue Wave Beach",
      location: "Lagos",
      rating: 4.5,
      serviceType: "Group Picnic",
      price: "15,000",
      priceUnit: "group",
    },
    {
      id: 7,
      images: [
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=400&h=300&fit=crop",
      ],
      businessName: "Golden Sands",
      location: "Lagos",
      rating: 4.9,
      serviceType: "Luxury Suite",
      price: "55,000",
      priceUnit: "night",
      savings: "10,000",
    },
    {
      id: 8,
      images: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
      ],
      businessName: "Palm Shore Resort",
      location: "Lagos",
      rating: 4.7,
      serviceType: "Couple's Retreat",
      price: "30,000",
      priceUnit: "night",
    },
  ];

  // Function to set user search result from booking flow - This function can be used to update the state or context with the search result
  const setUserSearchResultFromBookingFlow = (searchResult) => {};

  return (
    <main className="min-h-screen">
      <div className="space-y-5">
        {/* NOTE: Booking flow should handle all of its logic wiithin its component(Handling user input, fetching data) - the only stuff it should expose to other component where it'll be called in - 1. return: data gotten from the fetch request sent based on what the user typed in and searched for" */}
        {/* NOTE: Booking flow should be particular to the service page - on switch between services button except it's on the home page(landing page) */}
        <BookingFlow />
        {/* Beach Resorts items */}
        <BeachServicesGrid beachServices={beachServices} />
        <br />
        <br />
      </div>
    </main>
  );
}
