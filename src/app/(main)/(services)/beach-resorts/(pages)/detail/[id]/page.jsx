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
    serviceType: "beach-resort", 
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
      "/api/placeholder/300/200?beach5",
      "/api/placeholder/300/200?beach6",
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
      {
        id: 3,
        name: "Emeka",
        location: "Port Harcourt, Nigeria",
        rating: 5,
        timeAgo: "1 week ago",
        comment:
          "Perfect weekend getaway! The beach activities were amazing and the accommodation was top-notch.",
      },
      {
        id: 4,
        name: "Fatima",
        location: "Kano, Nigeria",
        rating: 4,
        timeAgo: "2 weeks ago",
        comment:
          "Great resort with excellent amenities. The spa treatments were very relaxing.",
      },
    ],

    activities: [
      {
        name: "Jet Skiing",
        description: "High-speed water adventure with safety equipment included",
        duration: "30 minutes",
        price: 15000,
        priceUnit: "per person"
      },
      {
        name: "Beach Volleyball",
        description: "Join our daily beach volleyball tournaments",
        duration: "1 hour",
        price: 0,
        priceUnit: "free"
      },
      {
        name: "Kayaking",
        description: "Explore the coastline with guided kayak tours",
        duration: "45 minutes",
        price: 8000,
        priceUnit: "per person"
      },
      {
        name: "Sunset Boat Cruise",
        description: "Romantic evening cruise with complimentary drinks",
        duration: "2 hours",
        price: 25000,
        priceUnit: "per couple"
      },
      {
        name: "Snorkeling",
        description: "Discover underwater life with guided snorkeling",
        duration: "1 hour",
        price: 12000,
        priceUnit: "per person"
      },
      {
        name: "Beach Photography",
        description: "Professional photo shoots with ocean backdrop",
        duration: "1 hour",
        price: 20000,
        priceUnit: "per session"
      },
      {
        name: "Fishing Charter",
        description: "Deep sea fishing with experienced guides",
        duration: "4 hours",
        price: 45000,
        priceUnit: "per boat"
      },
      {
        name: "Beach Yoga",
        description: "Morning yoga sessions on the beach",
        duration: "45 minutes",
        price: 5000,
        priceUnit: "per person"
      }
    ],
    amenities: [
      {
        name: "Free WiFi",
        available: true
      },
      {
        name: "Swimming Pool",
        available: true
      },
      {
        name: "Fitness Center",
        available: true
      },
      {
        name: "Spa & Wellness",
        available: true
      },
      {
        name: "Restaurant",
        available: true
      },
      {
        name: "Bar & Lounge",
        available: true
      },
      {
        name: "Beach Bar",
        available: true
      },
      {
        name: "Parking",
        available: true
      },
      {
        name: "24/7 Security",
        available: true
      },
      {
        name: "Concierge",
        available: true
      },
      {
        name: "Laundry Service",
        available: true
      },
      {
        name: "Room Service",
        available: true
      }
    ],
    accommodation: {
      roomType: "Deluxe Ocean View Suite",
      capacity: 4,
      bathrooms: 2,
      features: [
        "Private balcony with ocean view",
        "King-size bed with premium linens",
        "Sitting area with sofa bed",
        "Mini-bar and coffee maker",
        "Air conditioning",
        "Flat-screen TV with cable",
        "Safe deposit box",
        "Complimentary toiletries",
        "Hair dryer",
        "Beach towels provided",
        "Daily housekeeping",
        "Complimentary bottled water"
      ]
    },
    policies: {
      cancellation: "Free cancellation up to 48 hours before check-in. Cancellations within 48 hours are subject to a 50% charge.",
      completion: "Booking confirmation and check-in details will be sent to your email within 30 minutes of reservation."
    },
    qualityBadge: {
      title: "Beach Resorts on Synkafrica",
      subtitle: "are certified for excellence",
      description: "All beach resorts are evaluated for safety standards, service quality, cleanliness, and guest satisfaction to ensure an exceptional experience."
    }
  };

  // TODO: Implement reservation logic - go to a booking page or open a modal
  const handleReserve = (id) => {
    // Update this route to match your actual booking flow
    router.push(`/beach-resorts/booking/${id}`);
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