import React, { useState } from "react";
import ProductCard from "@/components/cards/ProductCard";

const DiningService = () => {
  // Restaurant types
  const restaurantTypes = [
    "Premium Dining",
    "Fine Dining",
    "Private Dining",
    "Casual Dining",
    "Group Dining",
    "Rooftop Dining",
    "Event Capacity",
    "Waterfront Dining",
    "Family Dining",
    "Buffet Dining",
  ];

  // Sample restaurant data
  const restaurants = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500&h=300&fit=crop",
      name: "The Sapphire Lounge",
      price: 15000,
      location: "Fine Dining in Lekki, Lagos",
      type: "Fine Dining",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&h=300&fit=crop",
      name: "Harbour View Restaurant",
      price: 12000,
      location: "Waterfront Dining in Lekki, Lagos",
      type: "Waterfront Dining",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500&h=300&fit=crop",
      name: "Skyline Terrace",
      price: 20000,
      location: "Rooftop Dining in Ikoyi, Lagos",
      type: "Rooftop Dining",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1590080875839-74c2b46a9c3f?w=500&h=300&fit=crop",
      name: "The Lounge 99",
      price: 9000,
      location: "Casual Dining in Surulere, Lagos",
      type: "Casual Dining",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=500&h=300&fit=crop",
      name: "The Ember Grill",
      price: 18000,
      location: "Premium Dining in Ajah, Lagos",
      type: "Premium Dining",
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1601924582971-6e94c6a67dbb?w=500&h=300&fit=crop",
      name: "Family Feast Restaurant",
      price: 7000,
      location: "Family Dining in Yaba, Lagos",
      type: "Family Dining",
    },
  ];

  // State for filtering
  const [selectedType, setSelectedType] = useState("All");

  // Filtered restaurants
  const filteredRestaurants =
    selectedType === "All"
      ? restaurants
      : restaurants.filter((r) => r.type === selectedType);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="text-sm text-gray-500 mb-2">
            AVAILABLE LOCATIONS:{" "}
            <span className="font-semibold text-gray-700">
              Lagos • Abuja • Port Harcourt • Ibadan
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 whitespace-pre-line">
                Discover Perfect Dining
              </h1>
              <p className="text-gray-600">
                Explore top-rated restaurants across Nigeria — from luxury
                lounges to family-friendly spots.
              </p>
            </div>
            <button
              onClick={() => setSelectedType("All")}
              className="bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white px-6 py-2 rounded font-medium transition-colors duration-200"
            >
              See All
            </button>
          </div>
        </div>

        {/* Restaurant Type Filter */}
        <div className="flex items-center gap-3 sm:gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedType("All")}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedType === "All"
                ? "bg-primary-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {restaurantTypes.map((type, index) => (
            <button
              key={index}
              onClick={() => setSelectedType(type)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedType === type
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Restaurant Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <ProductCard
                key={restaurant.id}
                type="restaurant"
                image={restaurant.image}
                name={restaurant.name}
                price={restaurant.price}
                location={restaurant.location}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No restaurants found for <span className="font-semibold">{selectedType}</span>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiningService;
