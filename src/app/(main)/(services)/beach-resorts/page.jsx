import BeachServicesGrid from "./components/BeachServicesGrid";
import BookingFlow from "@/components/booking_flow/Booking_flow";
import ServiceDetailsPage from "@/components/service_detail/ServiceDetail"; // Adjust path as needed

export default function BeachResortsPage() {
  // Sample beach resort service data
  const beachResortService = {
    id: "paradise-beach-resort",
    name: "Paradise Beach Resort",
    tagline: "Where luxury meets the ocean - unforgettable beach experiences",
    rating: 4.8,
    reviewCount: 156,
    location: "Lagos, Nigeria",
    price: 25000,
    currency: "₦",
    mainImage: "/api/placeholder/600/400",
    address: {
      street: "1 Beach Paradise Drive",
      city: "Victoria Island",
      state: "Lagos State",
      country: "Nigeria",
      zipCode: "101241",
    },
    workingHours: {
      monday: { open: "6:00 AM", close: "10:00 PM" },
      tuesday: { open: "6:00 AM", close: "10:00 PM" },
      wednesday: { open: "6:00 AM", close: "10:00 PM" },
      thursday: { open: "6:00 AM", close: "10:00 PM" },
      friday: { open: "6:00 AM", close: "11:00 PM" },
      saturday: { open: "6:00 AM", close: "11:00 PM" },
      sunday: { open: "6:00 AM", close: "10:00 PM" },
    },
    services: [
      {
        title: "Beach Access & Lounging",
        description: "Premium beach access with comfortable loungers, umbrellas, and stunning ocean views. Perfect for relaxation and sunbathing.",
      },
      {
        title: "Water Sports Activities",
        description: "Exciting water sports including jet skiing, paddle boarding, kayaking, and snorkeling with professional instructors.",
      },
      {
        title: "Beachside Dining",
        description: "Fresh seafood and tropical cocktails served right on the beach with spectacular sunset views.",
      },
      {
        title: "Spa & Wellness",
        description: "Rejuvenating spa treatments with ocean-inspired therapies and beachside massage services.",
      },
    ],
    portfolio: [
      "/api/placeholder/300/200",
      "/api/placeholder/300/200",
      "/api/placeholder/300/200",
      "/api/placeholder/300/200",
      "/api/placeholder/300/200",
      "/api/placeholder/300/200",
    ],
    reviews: [
      {
        id: 1,
        name: "Adebayo",
        location: "Lagos, Nigeria",
        rating: 5,
        timeAgo: "1 day ago",
        comment: "Absolutely amazing experience! The beach is pristine and the service was exceptional. The sunset view from the restaurant is breathtaking.",
      },
      {
        id: 2,
        name: "Kemi",
        location: "Abuja, Nigeria",
        rating: 5,
        timeAgo: "3 days ago",
        comment: "Perfect getaway spot! The water sports were thrilling and the staff was incredibly friendly and helpful throughout our stay.",
      },
      {
        id: 3,
        name: "David",
        location: "Port Harcourt, Nigeria",
        rating: 4,
        timeAgo: "1 week ago",
        comment: "Great beach resort with excellent facilities. The spa treatments were very relaxing and the food was delicious.",
      },
      {
        id: 4,
        name: "Funmi",
        location: "Ibadan, Nigeria",
        rating: 5,
        timeAgo: "2 weeks ago",
        comment: "This place exceeded all expectations! Clean facilities, beautiful beach, and the staff went above and beyond to make our visit memorable.",
      },
    ],
    policies: {
      cancellation: "Cancel at least 24 hours before check-in for a full refund. Weather-related cancellations are fully refundable.",
      completion: "Confirmation email with access details will be sent upon successful booking completion.",
    },
    qualityBadge: {
      title: "Beach resorts on our platform",
      subtitle: "are verified for excellence",
      description: "All beach resorts are thoroughly inspected for safety, cleanliness, and service quality to ensure an exceptional experience.",
    }
  };

  // Handle reservation logic
  const handleReservation = (serviceId, serviceData) => {
    console.log("Booking beach resort:", serviceId);
    console.log("Service data:", serviceData);
    
    // You can implement your booking logic here
    // For example:
    // - Open booking modal
    // - Redirect to payment page
    // - Add to cart
    // - etc.
    
    alert(`Booking ${serviceData.name} for ₦${serviceData.price.toLocaleString()}`);
  };

  return (
    <main className="min-h-screen">
      <div className="space-y-5">
        <BookingFlow />
        
        <br />
        <br />
        
        {/* Beach Resort Service Details */}
        <ServiceDetailsPage 
          service={beachResortService}
          onReserve={handleReservation}
          platformName="BeachHub"
        />
      </div>
    </main>
  );
}