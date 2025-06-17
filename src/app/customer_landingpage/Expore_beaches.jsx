import React from "react";
import Button from "../../components/ui/buttons"; // Adjust the import path as needed

const beaches = [
  {
    name: "Landmark beach",
    price: "$60",
    rating: 4.4,
    review: "Very good",
    image: "/images/beach1.png",
  },
  {
    name: "Oniru private beach",
    price: "$60",
    rating: 4.3,
    review: "Very good",
    image: "/images/beach2.png",
  },
  {
    name: "The good beach",
    price: "$60",
    rating: 4.2,
    review: "Very good",
    image: "/images/beach3.png",
  },
  {
    name: "Elegushi royal beach",
    price: "$60",
    rating: 4.1,
    review: "Very good",
    image: "/images/beach4.png",
  },
];

function BeachCard({ name, price, rating, review, image }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden w-full max-w-xs">
      <div className="p-4 pb-2 flex-1">
        <div className="font-semibold text-base mb-1">{name}</div>
        <div className="text-gray-600 text-sm">{price}</div>
        <div className="text-xs text-gray-500 mb-2">daily price</div>
        <div className="flex items-center gap-2">
          <span className="bg-purple-700 text-white text-xs px-2 py-1 rounded-md font-semibold">{rating}</span>
          <span className="text-xs text-gray-600">{review}</span>
        </div>
      </div>
      <img
        src={image}
        alt={name}
        className="h-32 w-full object-cover rounded-b-2xl"
      />
    </div>
  );
}

export default function ExploreBeachSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-1">
        <div>
          <h2 className="text-2xl font-semibold">Explore beach in Lagos</h2>
          <p className="text-gray-500 text-sm">
            Soak up the sun in style with our beach service
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border border-primary-500 text-primary-500 px-6 py-2 rounded-md font-medium text-base hover:bg-primary-50 transition"
        >
          See all
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-4">
        {beaches.map((beach, idx) => (
          <BeachCard key={idx} {...beach} />
        ))}
      </div>
    </section>
  );
}