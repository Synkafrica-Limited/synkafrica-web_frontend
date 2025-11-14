import React, { useState } from "react";
import ProductCard from "@/components/cards/ProductCard";

const ResortHouseService = () => {
  const resortCategories = [
    "Luxury",
    "Beachfront",
    "Mountain View",
    "Private Villa",
    "Family Resort",
    "Romantic Escape",
    "Eco Resort",
    "City Retreat",
  ];

  const resorts = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=500&h=300&fit=crop",
      name: "Emerald Coast Resort",
      price: 350000,
      location: "Lekki, Lagos",
      category: "Beachfront",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1505691723518-36a1f0fe4f61?w=500&h=300&fit=crop",
      name: "Highland View Retreat",
      price: 280000,
      location: "Obudu, Cross River",
      category: "Mountain View",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop",
      name: "Sunset Palm Villa",
      price: 420000,
      location: "Victoria Island, Lagos",
      category: "Luxury",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1590073242678-6c74e7a5f80c?w=500&h=300&fit=crop",
      name: "Green Haven Eco Resort",
      price: 190000,
      location: "Epe, Lagos",
      category: "Eco Resort",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&h=300&fit=crop",
      name: "Ocean Breeze Family Resort",
      price: 230000,
      location: "Ibom, Akwa Ibom",
      category: "Family Resort",
    },
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredResorts =
    activeCategory === "All"
      ? resorts
      : resorts.filter((resort) => resort.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="text-sm text-gray-500 mb-2">
            AVAILABLE LOCATION:{" "}
            <span className="font-semibold text-gray-700">NIGERIA</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 whitespace-pre-line">
                Find Your Perfect Resort Stay
              </h1>
              <p className="text-gray-600">
                Browse luxurious and comfortable resort homes for your next
                getaway.
              </p>
            </div>
            <button className="bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white px-6 py-2 rounded font-medium transition-colors duration-200">
              See All
            </button>
          </div>
        </div>

        {/* Resort Category Filters */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-3">
          {["All", ...resortCategories].map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(category)}
              className={`flex-shrink-0 px-5 py-2 rounded-full border text-sm font-medium transition-colors duration-200 ${
                activeCategory === category
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Resort Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResorts.map((resort) => (
            <ProductCard
              key={resort.id}
              type="resort"
              image={resort.image}
              name={resort.name}
              price={resort.price}
              location={resort.location}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResortHouseService;
