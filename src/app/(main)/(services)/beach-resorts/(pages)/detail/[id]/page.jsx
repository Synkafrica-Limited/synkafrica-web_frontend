"use client";

import { useRouter } from "next/navigation";

import ServiceDetails from "@/components/service_detail/ServiceDetail";


export default function BeachResortDetailPage() {
  const router = useRouter();
  
  // TODO: this data should be fetched from an API or database
  // TODO: Handle loading state and errors
  const beachResortDetail = {
    id: "BeachResort001",
    name: "Paradise Beach Resort",
    tagline: "Experience luxury and tranquility by the sea",
    rating: 4.8,
    reviewCount: 34,
    location: "Lekki, Lag, NG",
    price: 25000,
    currency: "₦",
    mainImage: "/api/placeholder/600/400?beach-resort",
    address: {
      street: "1 Ocean Drive",
      city: "Lekki",
      state: "Lagos State",
      country: "Nigeria",
      zipCode: "105102",
    },
    workingHours: {
      monday: { open: "8:00 AM", close: "10:00 PM" },
      tuesday: { open: "8:00 AM", close: "10:00 PM" },
      wednesday: { open: "8:00 AM", close: "10:00 PM" },
      thursday: { open: "8:00 AM", close: "10:00 PM" },
      friday: { open: "8:00 AM", close: "11:00 PM" },
      saturday: { open: "8:00 AM", close: "11:00 PM" },
      sunday: { open: "8:00 AM", close: "10:00 PM" },
    },
    services: [
      {
        title: "Luxury Accommodation",
        description:
          "Spacious beachfront rooms and suites with stunning ocean views and modern amenities.",
      },
      {
        title: "Private Beach Access",
        description:
          "Enjoy exclusive access to a pristine private beach with sun loungers and cabanas.",
      },
      {
        title: "Water Sports & Activities",
        description:
          "Kayaking, jet skiing, beach volleyball, and more for adventure seekers.",
      },
      {
        title: "Fine Dining",
        description:
          "On-site restaurants serving local and international cuisine with fresh seafood specials.",
      },
      {
        title: "Spa & Wellness",
        description:
          "Relax with massages, facials, and wellness treatments in our oceanfront spa.",
      },
    ],
    portfolio: [
      "/api/placeholder/300/200?beach1",
      "/api/placeholder/300/200?beach2",
      "/api/placeholder/300/200?beach3",
      "/api/placeholder/300/200?beach4",
    ],
    reviews: [
      {
        id: 1,
        name: "Chinedu",
        location: "Abuja, Nigeria",
        rating: 5,
        timeAgo: "1 day ago",
        comment:
          "Absolutely beautiful resort! The staff were friendly and the beach was clean and private.",
      },
      {
        id: 2,
        name: "Aisha",
        location: "Lagos, Nigeria",
        rating: 4.5,
        timeAgo: "3 days ago",
        comment:
          "Loved the food and the spa experience. Will definitely come back for another getaway.",
      },
    ],
  };

  // TODO: Implement reservation logic - go to a booking page or open a modal
  const handleReserve = (id) => {
    router.push(`/laundry-service/booking/${id}`);
  };

  return (
    <ServiceDetails
      service={beachResortDetail}
      onReserve={() => handleReserve(beachResortDetail.id)}
      platformName="Synkafrica"
      platformTheme={{
        primary: "bg-primary-500",
        primaryHover: "bg-primary-600",
      }}
    />
  );
}
