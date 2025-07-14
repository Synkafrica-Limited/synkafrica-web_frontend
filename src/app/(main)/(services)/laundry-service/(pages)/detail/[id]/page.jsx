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
    mainImage: "/api/placeholder/600/400?laundry",
    serviceType: "laundry", 
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
          "Professional washing and ironing service for all your garments. We use eco-friendly detergents and ensure your clothes are cleaned to perfection and pressed to a crisp finish.",
      },
      {
        title: "Wash and Fold",
        description:
          "Convenient wash and fold service perfect for everyday items. Your clothes are carefully sorted, washed with premium detergents, and neatly folded for easy storage.",
      },
      {
        title: "Dry Cleaning",
        description:
          "Expert dry cleaning for delicate fabrics and special garments. Our advanced cleaning process preserves fabric quality while removing tough stains and odors.",
      },
      {
        title: "Pickup & Delivery",
        description:
          "Convenient pickup and delivery service right to your doorstep. Schedule online and we'll handle the rest, saving you time and effort.",
      },
    ],
    portfolio: [
      "/api/placeholder/300/200?laundry1",
      "/api/placeholder/300/200?laundry2",
      "/api/placeholder/300/200?laundry3",
      "/api/placeholder/300/200?laundry4",
      "/api/placeholder/300/200?laundry5",
      "/api/placeholder/300/200?laundry6",
    ],
    reviews: [
      {
        id: 1,
        name: "Temi",
        location: "Lagos, Nigeria",
        rating: 5,
        timeAgo: "2 hours ago",
        comment:
          "Excellent service! My clothes came back perfectly clean and pressed. The pickup and delivery was so convenient. Highly recommend!",
      },
      {
        id: 2,
        name: "Emma",
        location: "Lagos, Nigeria",
        rating: 5,
        timeAgo: "4 hours ago",
        comment:
          "Spin & Sparkle saved my favorite shirt! They removed a stubborn stain I thought was permanent. Professional and reliable service.",
      },
      {
        id: 3,
        name: "Bola",
        location: "Lagos, Nigeria",
        rating: 4,
        timeAgo: "8 hours ago",
        comment:
          "Good quality washing and folding. My clothes smell fresh and are neatly organized. The pricing is fair and the staff is friendly.",
      },
      {
        id: 4,
        name: "Dami",
        location: "Lagos, Nigeria",
        rating: 5,
        timeAgo: "6 hours ago",
        comment:
          "Love their eco-friendly approach! My clothes are clean and I feel good about supporting sustainable practices. Will definitely use again.",
      },
    ],

    laundryServices: [
      {
        name: "Regular Wash & Iron",
        description: "Standard washing and pressing for everyday clothing items",
        price: 800,
        turnaround: "2-3 days"
      },
      {
        name: "Express Wash & Iron",
        description: "Fast turnaround washing and ironing for urgent items",
        price: 1200,
        turnaround: "Same day"
      },
      {
        name: "Wash & Fold",
        description: "Washing and neat folding service for casual wear",
        price: 600,
        turnaround: "2-3 days"
      },
      {
        name: "Dry Cleaning",
        description: "Professional dry cleaning for delicate and special garments",
        price: 1500,
        turnaround: "3-5 days"
      },
      {
        name: "Bedding & Linens",
        description: "Washing and pressing service for bed sheets, pillowcases, and towels",
        price: 1000,
        turnaround: "2-3 days"
      },
      {
        name: "Curtains & Drapes",
        description: "Specialized cleaning for curtains and heavy drapes",
        price: 2000,
        turnaround: "5-7 days"
      },
      {
        name: "Stain Removal",
        description: "Specialized treatment for tough stains and spots",
        price: 500,
        turnaround: "1-2 days"
      },
      {
        name: "Shoe Cleaning",
        description: "Professional cleaning and conditioning for leather and fabric shoes",
        price: 1000,
        turnaround: "2-3 days"
      },
      {
        name: "Pickup & Delivery",
        description: "Convenient doorstep pickup and delivery service",
        price: 200,
        turnaround: "On schedule"
      },
      {
        name: "Garment Repair",
        description: "Minor repairs like button replacement and hem adjustments",
        price: 300,
        turnaround: "3-5 days"
      }
    ],
    policies: {
      cancellation: "Orders can be cancelled up to 2 hours after pickup for a full refund. Items already in process are subject to a 50% charge.",
      completion: "SMS and email notifications will be sent when your laundry is ready for pickup or delivery. Payment is due upon completion."
    },
    qualityBadge: {
      title: "Laundry Services on Synkafrica",
      subtitle: "are certified for quality and safety",
      description: "All laundry service providers are verified for professional equipment, eco-friendly practices, and customer satisfaction standards."
    }
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