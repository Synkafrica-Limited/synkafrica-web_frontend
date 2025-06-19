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
    <div className="bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden w-full max-w-xs mx-auto sm:mx-0">
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
    <section className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">Explore beaches in Lagos</h2>
          <p className="text-gray-500 text-sm">
            Soak up the sun in style with our beach service
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border border-primary-500 text-primary-500 px-6 py-2 rounded-md font-medium text-base hover:bg-primary-50 transition mt-2 sm:mt-0"
        >
          See all
        </Button>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 mt-4">
        {beaches.map((beach, idx) => (
          <BeachCard key={idx} {...beach} />
        ))}
      </div>
    </section>
  );
}