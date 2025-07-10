"use client";
import { useState } from "react";
import BookingFlow from "@/components/booking_flow/Booking_flow";
import { ArrowRight,  ChevronLeft, ChevronRight } from "lucide-react";
import ImageCarouselCard from "@/components/ui/ImageCarouselCard";



// Dummy data for beaches
const BEACHES = [
    {
        id: 1,
        name: "Landmark beach",
        location: "Lagos",
        image: "/images/landmark_beach.png",
        rating: 4.3,
        review: "Very good",
        price: 50,
    },
    {
        id: 2,
        name: "Oniru private beach",
        location: "Lagos",
        image: "/images/oniru_beach.png",
        rating: 4.3,
        review: "Very good",
        price: 50,
    },
    {
        id: 3,
        name: "The good beach",
        location: "Lagos",
        image: "/images/the_good_beach.png",
        rating: 4.3,
        review: "Very good",
        price: 50,
    },
    {
        id: 4,
        name: "Elegushi royal beach",
        location: "Lagos",
        image: "/images/elegushi_beach.png",
        rating: 4.3,
        review: "Very good",
        price: 50,
    },
];

export default function BeachResortsPage() {
    const [filteredBeaches, setFilteredBeaches] = useState(BEACHES);

    // This handler can be passed to BookingFlow's BeachBookingForm as onSearch
    function handleBeachSearch(params) {
        // Example: filter by location or name
        if (params?.location) {
            setFilteredBeaches(
                BEACHES.filter(
                    (b) =>
                        b.name.toLowerCase().includes(params.location.toLowerCase()) ||
                        b.location.toLowerCase().includes(params.location.toLowerCase())
                )
            );
        } else {
            setFilteredBeaches(BEACHES);
        }
    }

    return (
        <main className="flex-1 w-full">
            {/* Booking Flow at the top */}
            <div className="bg-white pt-6 pb-2 shadow-sm">
                <BookingFlow
                    // Optionally, you can pass a custom onSearch to only filter beaches
                    // For demo, this will filter only when the Beach tab is active and searched
                    onBeachSearch={handleBeachSearch}
                />
            </div>

            {/* Beach Filter Results */}
            <section className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-1">
                    Explore beach in Lagos
                </h2>
                <p className="text-gray-600 mb-8">
                    Soak up the sun in style with our beach service
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {filteredBeaches.map((beach) => (
                        <div
                            key={beach.id}
                            className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                        >
                            <div className="relative">
                                <ImageCarouselCard
                                    images={[
                                        "/images/beach1.png",
                                        "/images/beach2.png",
                                        "/images/beach3.png"
                                    ]}
                                    alt="Beach preview"
                                />
                                {/* Carousel arrows */}
                                <button className="bg-white absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-1 shadow">
                                    <ChevronLeft />
                                </button>
                                <button className="bg-white absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 shadow">
                                    <ChevronRight />
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="text-xs text-gray-500 mb-1">{beach.location}</div>
                                <div className="font-semibold text-lg mb-2">{beach.name}</div>
                                <div className="flex items-center mb-2">
                                    <span className="bg-purple-700 text-white text-xs px-2 py-0.5 rounded mr-2">
                                        {beach.rating}
                                    </span>
                                    <span className="text-xs text-gray-600">{beach.review}</span>
                                </div>
                                <div className="text-sm text-gray-900 font-semibold mb-1">
                                    ${beach.price} <span className="line-through text-xs text-gray-400">${beach.price + 10}</span> per day
                                </div>
                                <div className="text-xs text-gray-500 mb-1">
                                    ${beach.price * 2} total <br />
                                    includes taxes & fees
                                </div>
                                <img
                                    src="/images/brand/synkafrica-logo-single.png"
                                    alt="SynkAfrica"
                                    className="w-6 h-6 mt-2"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}