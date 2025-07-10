"use client";
import { useParams } from "next/navigation";
import ImageCarouselCard from "@/components/ui/ImageCarouselCard";
import ServiceFeatureCard from "../../components/ServiceFeatureCard";
import PortfolioGrid from "../../components/PortfolioGrid";
import ReviewCard from "../../components/ReviewCard";
import BookingFlow from "@/components/booking_flow/Booking_flow";

// Dummy data (replace with API or DB fetch)
const BEACHES = [
  {
    id: "oniru-private-beach",
    name: "Oniru private beach",
    images: ["/images/beach1.png", "/images/beach2.png", "/images/beach3.png"],
    logo: "/images/brand/synkafrica-logo-single.png",
    description: "Indulge in beachfront elegance - private cabanas, gourmet delights, and five-star service where the ocean kisses sophistication.",
    features: [
      { title: "Private Cabanas", description: "Unwind in exclusive comfort—our private cabanas offer luxury, privacy, and front-row views to the ocean’s serenity." },
      { title: "Gourmet delights", description: "Savor the extraordinary—exquisite gourmet creations served fresh by the sea, crafted to elevate every bite into a moment of indulgence." },
      { title: "Five-star service", description: "Experience the art of hospitality—where every detail is curated with care, and five-star service turns moments into memories." }
    ],
    portfolio: ["/images/beach1.png", "/images/beach2.png", "/images/beach3.png", "/images/beach4.png"],
    reviews: [
      { user: { name: "Temi", avatar: "/images/user1.png", location: "Lagos, Nigeria" }, rating: 5, date: "2 hours ago", text: "Lorem ipsum dolor sit amet consectetur..." },
      { user: { name: "Emma", avatar: "/images/user2.png", location: "Lagos, Nigeria" }, rating: 5, date: "4 hours ago", text: "Lorem ipsum dolor sit amet consectetur..." },
    ],
    price: 50,
    rating: 5.0,
    reviewCount: 10,
    location: "Lagos",
    thingsToKnow: [
      { icon: "📅", title: "Cancellation policy", text: "Cancel at least 1 day before the pick up date for a full refund" },
      { icon: "📧", title: "Booking completion", text: "An email will be sent to your registered email upon booking completion" }
    ]
  },
  // ...other beaches
];

export default function BeachResortDetailPage() {
  const { id } = useParams();
  const beach = BEACHES.find(b => b.id === id);

  if (!beach) return <div className="p-8">Beach not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Booking Flow */}
      <BookingFlow defaultLocation={beach.name} />

      {/* Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2">
          <ImageCarouselCard images={beach.images} alt={beach.name} />
          <div className="flex items-center mt-4">
            <img src={beach.logo} alt="logo" className="w-16 h-16" />
            <div className="ml-4">
              <h1 className="text-2xl font-bold">{beach.name}</h1>
              <div className="text-gray-500">{beach.description}</div>
              <div className="text-orange-600 font-semibold mt-2">
                ★ {beach.rating} - {beach.reviewCount} reviews - Beach in {beach.location}
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {beach.features.map((f, i) => (
              <ServiceFeatureCard key={i} title={f.title} description={f.description} />
            ))}
          </div>
        </div>
        {/* Portfolio, Reviews, Things to know */}
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="font-bold mb-2">Our portfolio</h3>
            <PortfolioGrid images={beach.portfolio} />
          </div>
          <div>
            <h3 className="font-bold mb-2">★ {beach.rating} - {beach.reviewCount} reviews</h3>
            {beach.reviews.map((r, i) => <ReviewCard key={i} {...r} />)}
          </div>
          <div>
            <h3 className="font-bold mb-2">Things to know</h3>
            {beach.thingsToKnow.map((t, i) => (
              <div key={i} className="mb-2 flex items-start gap-2">
                <span className="text-xl">{t.icon}</span>
                <div>
                  <div className="font-semibold">{t.title}</div>
                  <div className="text-gray-500 text-sm">{t.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 rounded-xl p-6 text-center mt-4">
            <div className="text-xl font-bold mb-2">🏅 Beach companies on Synkafrica are vetted for quality</div>
            <div className="text-gray-500 text-sm">
              Beach companies are evaluated for their professional experience, portfolio of strong work, and reputation for excellence.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}