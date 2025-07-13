"use client";

import { useRouter } from "next/navigation";

import ServiceDetails from "@/components/service_detail/ServiceDetail";

export default function LaundryServiceDetailPage() {
  const router = useRouter();
  
  // TODO: this data should be fetched from an API or database
  // TODO: Handle loading state and errors
  const laundryServiceDetail = {
    id: "spin-sparkle",
    name: "Spin & Sparkle",
    tagline: "Wash green, wear clean - sustainable laundry made simple",
    rating: 4.9,
    reviewCount: 10,
    location: "Lagos, Nigeria",
    price: 1000,
    currency: "₦",
    mainImage: "/api/placeholder/600/400",
    address: {
      street: "123 Clean Street",
      city: "Lagos",
      state: "Lagos State",
      country: "Nigeria",
      zipCode: "100001",
    },
    workingHours: {
      monday: { open: "9:00 AM", close: "6:00 PM" },
      tuesday: { open: "9:00 AM", close: "6:00 PM" },
      wednesday: { open: "9:00 AM", close: "6:00 PM" },
      thursday: { open: "9:00 AM", close: "6:00 PM" },
      friday: { open: "9:00 AM", close: "6:00 PM" },
      saturday: { open: "10:00 AM", close: "4:00 PM" },
      sunday: { open: "Closed", close: "" },
    },
    services: [
      {
        title: "Wash and Iron",
        description:
          "Lorem ipsum dolor sit amet consectetur. Varius a tempus ut odio. Sagittis in gravida pellentesque scelerisque ut ultrices magna risus fermentum.",
      },
      {
        title: "Wash and Fold",
        description:
          "Lorem ipsum dolor sit amet consectetur. Varius a tempus ut odio. Sagittis in gravida pellentesque scelerisque ut ultrices magna risus fermentum.",
      },
      {
        title: "Packaging",
        description:
          "Lorem ipsum dolor sit amet consectetur. Varius a tempus ut odio. Sagittis in gravida pellentesque scelerisque ut ultrices magna risus fermentum.",
      },
    ],
    portfolio: [
      "/api/placeholder/300/200",
      "/api/placeholder/300/200",
      "/api/placeholder/300/200",
      "/api/placeholder/300/200",
    ],
    reviews: [
      {
        id: 1,
        name: "Temi",
        location: "Lagos, Nigeria",
        rating: 5,
        timeAgo: "2 hours ago",
        comment:
          "Lorem ipsum dolor sit amet consectetur. Nulla sed volutpat nisl faucibus. Consectetur sodales nec libero vitae velit magna suspendisse sed.",
      },
      {
        id: 2,
        name: "Emma",
        location: "Lagos, Nigeria",
        rating: 5,
        timeAgo: "4 hours ago",
        comment:
          "Lorem ipsum dolor sit amet consectetur. Nulla sed volutpat nisl faucibus. Consectetur sodales nec libero vitae velit magna suspendisse sed.",
      },
      {
        id: 3,
        name: "Bola",
        location: "Lagos, Nigeria",
        rating: 4,
        timeAgo: "8 hours ago",
        comment:
          "Lorem ipsum dolor sit amet consectetur. Nulla sed volutpat nisl faucibus. Consectetur sodales nec libero vitae velit magna suspendisse sed.",
      },
      {
        id: 4,
        name: "Dami",
        location: "Lagos, Nigeria",
        rating: 5,
        timeAgo: "6 hours ago",
        comment:
          "Lorem ipsum dolor sit amet consectetur. Nulla sed volutpat nisl faucibus. Consectetur sodales nec libero vitae velit magna suspendisse sed.",
      },
    ],
  };

  const handleReserve = (id) => {
    router.push(`/laundry-service/booking/${id}`);
  };

  return (
    <ServiceDetails
      service={laundryServiceDetail}
      onReserve={() => handleReserve(laundryServiceDetail.id)}
      platformName="Synkafrica"
      platformTheme={{
        primary: "bg-primary-500",
        primaryHover: "bg-primary-600",
      }}
    />
  );
}
