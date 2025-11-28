import React, { useState } from "react";
import ProductCard from "@/components/cards/ProductCard";

const WaterRecreation = () => {
  const activityCategories = [
    "Jet Ski",
    "Boat Ride",
    "Yacht",
    "Cruise",
    "Boat Party",
    "Kayaking",
    "Banana Ride",
    "Fishing Tour",
  ];

  const activities = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1600431521340-491eca880813?w=500&h=300&fit=crop",
      name: "Jet Ski Adventure",
      price: 75000,
      location: "Lekki, Lagos",
      category: "Jet Ski",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1570284613060-766c3508f6a2?w=500&h=300&fit=crop",
      name: "Luxury Yacht Experience",
      price: 320000,
      location: "Victoria Island, Lagos",
      category: "Yacht",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1590080875831-f8a2d3d6b6d8?w=500&h=300&fit=crop",
      name: "Sunset Boat Cruise",
      price: 150000,
      location: "Ikoyi, Lagos",
      category: "Cruise",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1590080875831-f8a2d3d6b6d8?w=500&h=300&fit=crop",
      name: "Private Boat Party",
      price: 270000,
      location: "Banana Island, Lagos",
      category: "Boat Party",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1561473880-3b1e04b9e28a?w=500&h=300&fit=crop",
      name: "Kayaking Experience",
      price: 50000,
      location: "Tarkwa Bay, Lagos",
      category: "Kayaking",
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=500&h=300&fit=crop",
      name: "Deep Sea Fishing Tour",
      price: 180000,
      location: "Port Harcourt, Rivers",
      category: "Fishing Tour",
    },
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredActivities =
    activeCategory === "All"
      ? activities
      : activities.filter((act) => act.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="text-sm text-gray-500 mb-2">
            AVAILABLE LOCATION:{" "}
            <span className="font-semibold text-gray-700">LAGOS</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 whitespace-pre-line">
                Explore Water Recreation Adventures
              </h1>
              <p className="text-gray-600">
                From thrilling jet skis to luxurious cruises — experience the
                best of Lagos waters.
              </p>
            </div>
            <button className="bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white px-6 py-2 rounded font-medium transition-colors duration-200">
              See All
            </button>
          </div>
        </div>

        {/* Activity Filters */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-3">
          {["All", ...activityCategories].map((category, index) => (
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

        {/* Activity Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <ProductCard
              key={activity.id}
              type="recreation"
              image={activity.image}
              name={activity.name}
              price={activity.price}
              location={activity.location}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaterRecreation;
