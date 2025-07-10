"use client";
import ImageCarouselCard from "@/components/ui/ImageCarouselCard";
import Link from "next/link";

const BEACHES = [
  {
    id: "landmark-beach",
    name: "Landmark beach",
    location: "Lagos",
    images: [
      "/images/landmark_beach.png",
      "/images/beach1.png",
      "/images/beach2.png"
    ],
    rating: 4.3,
    review: "Very good",
    price: 50,
  },
  {
    id: 'oniru-private-beach',
    name: "Oniru private beach",
    location: "Lagos",
    images: [
      "/images/oniru_beach.png",
      "/images/beach2.png",
      "/images/beach3.png"
    ],
    rating: 4.3,
    review: "Very good",
    price: 50,
  },
  {
    id: "the-good-beach",
    name: "The good beach",
    location: "Lagos",
    images: [
      "/images/the_good_beach.png",
      "/images/beach3.png",
      "/images/beach1.png"
    ],
    rating: 4.3,
    review: "Very good",
    price: 50,
  },
  {
    id: "elegushi-royal-beach",
    name: "Elegushi royal beach",
    location: "Lagos",
    images: [
      "/images/elegushi_beach.png",
      "/images/beach1.png",
      "/images/beach2.png"
    ],
    rating: 4.3,
    review: "Very good",
    price: 50,
  },
];

export default function BeachServicesGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-1">
        Explore beach in Lagos
      </h2>
      <p className="text-gray-600 mb-8">
        Soak up the sun in style with our beach service
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {BEACHES.map((beach) => (
          <Link href={`/beach-resorts/detail/${beach.id}`} key={beach.id}>
            <div className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden">
              <ImageCarouselCard images={beach.images} alt={beach.name} />
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
                  ${beach.price}{" "}
                  <span className="line-through text-xs text-gray-400">
                    ${beach.price + 10}
                  </span>{" "}
                  per day
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
          </Link>
        ))}
      </div>
    </section>
  );
}