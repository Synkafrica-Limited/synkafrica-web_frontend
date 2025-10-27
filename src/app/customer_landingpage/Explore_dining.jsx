import React from "react";
import Buttons from "@/components/ui/Buttons"; 
import { ArrowRight,  ChevronLeft, ChevronRight } from "lucide-react";

const diningData = [
  {
    img: "/images/dining1.jpg",
    city: "Lagos",
    name: "See Lagos Restaurants",
    rating: 4.3,
    review: "Very good",
    price: "$50",
    oldPrice: "$40",
    total: "$150",
    offer: "25% off",
    offerColor: "bg-blue-600",
  },
  {
    img: "/images/dining2.jpg",
    city: "Lagos",
    name: "234 Restaurant & Lounge",
    rating: 4.3,
    review: "Very good",
    price: "$50",
    oldPrice: "$40",
    total: "$150",
    offer: "25% off",
    offerColor: "bg-blue-600",
  },
  {
    img: "/images/dining3.png",
    city: "Lagos",
    name: "The Enclave Restaurant",
    rating: 4.3,
    review: "Very good",
    price: "$50",
    oldPrice: "$40",
    total: "$150",
    offer: "Exclusive for member only",
    offerColor: "bg-blue-700",
  },
  {
    img: "/images/dining4.png",
    city: "Lagos",
    name: "Hungry Belly Restaurant & Bar",
    rating: 4.3,
    review: "Very good",
    price: "$50",
    oldPrice: "$40",
    total: "$150",
    offer: "25% off",
    offerColor: "bg-blue-600",
  },
];

function DiningCard({ data }) {
  return (
    <div className="flex flex-col w-full max-w-xs rounded-2xl overflow-hidden">
      <div className="relative">
        <img
          src={data.img}
          alt={data.name}
          className="h-40 w-full object-cover rounded-xl"
        />
        {/* Carousel arrows */}
        <button className="bg-white absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-1 shadow">
          <ChevronLeft />
        </button>
        <button className="bg-white absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 shadow">
          <ChevronRight  />
        </button>
      </div>
      <div className="mt-3">
        <div className="text-xs text-gray-200">{data.city}</div>
        <div className="font-semibold text-lg text-white leading-tight">{data.name}</div>
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-purple-700 text-white text-xs px-2 py-1 rounded-md font-semibold">{data.rating}</span>
          <span className="text-xs text-gray-200">{data.review}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-white text-base font-semibold">{data.price}</span>
          <span className="text-gray-300 line-through text-sm">{data.oldPrice}</span>
        </div>
        <div className="text-xs text-gray-200">per night</div>
        <div className="text-xs text-gray-200">{data.total} total</div>
        <div className="text-xs text-gray-200 mb-2">includes taxes & fees</div>
        <div>
          <span className={`inline-block px-3 py-1 rounded-md text-xs text-white font-semibold ${data.offerColor}`}>
            {data.offer}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ExploreDiningSection() {
  return (
    <section className="relative max-w-7xl mx-auto px-10 py-20">
      {/* Background image and overlay */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <img
          src="\images\dining_bg.png"
          alt="Dining background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-semibold text-white">Explore dinning</h2>
            <p className="text-gray-200 text-lg">
              Savor every moment with our dinning service
            </p>
          </div>
            
            <Buttons
                variant="filled"
                icon={<ArrowRight />}
                size="md"
                className=" mb-4"
              >See all</Buttons>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {diningData.map((item, idx) => (
            <DiningCard key={idx} data={item} />
          ))}
        </div>
      </div>
    </section>
  );
}