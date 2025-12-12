import React, { useState, useEffect } from "react";
import ProductCard from "@/components/cards/ProductCard";
import { getListings } from "@/services/listings.service";

const DiningService = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("All");
  const [restaurantTypes, setRestaurantTypes] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await getListings({ serviceType: 'FINE_DINING' });
        
        // Handle different response formats
        let apiListings = [];
        if (Array.isArray(response)) {
          apiListings = response;
        } else if (response.data && Array.isArray(response.data)) {
          apiListings = response.data;
        } else if (response.listings && Array.isArray(response.listings)) {
          apiListings = response.listings;
        }

        // Explicitly filter by category to ensure data integrity
        apiListings = apiListings.filter(listing => listing.category === 'FINE_DINING');

        // Transform data
        const transformedRestaurants = apiListings.map(listing => {
          // Image handling
          let imageUrl = 'https://via.placeholder.com/500x300';
          if (listing.images && listing.images.length > 0) {
            const img = listing.images[0];
            if (typeof img === 'string') imageUrl = img;
            else if (typeof img === 'object') imageUrl = img.secure_url || img.url || imageUrl;
          }

          // Location handling
          let locationStr = 'Lagos';
          if (typeof listing.location === 'string') {
            try {
              const loc = JSON.parse(listing.location);
              locationStr = loc.city || listing.location;
            } catch (e) { locationStr = listing.location; }
          } else if (listing.location?.city) {
            locationStr = listing.location.city;
          }

          return {
            id: listing.id || listing._id,
            image: imageUrl,
            name: listing.title || listing.name || 'Fine Dining',
            price: listing.pricing?.basePrice || listing.basePrice || 0,
            location: locationStr,
            type: listing.cuisineType || listing.diningType || 'Fine Dining'
          };
        });

        setRestaurants(transformedRestaurants);

        // Extract unique types
        const types = [...new Set(transformedRestaurants.map(r => r.type))].filter(Boolean).sort();
        setRestaurantTypes(types);

      } catch (err) {
        console.error("Failed to fetch dining listings:", err);
        setError("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Filtered restaurants
  const filteredRestaurants =
    selectedType === "All"
      ? restaurants
      : restaurants.filter((r) => r.type === selectedType);

  if (loading) {
    return <div className="py-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div></div>;
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">Failed to load dining options. Please try again later.</div>;
  }

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
        {restaurantTypes.length > 0 && (
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
        )}

        {/* Restaurant Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.slice(0, 6).map((restaurant) => (
              <ProductCard
                key={restaurant.id}
                type="dining"
                id={restaurant.id}
                image={restaurant.image}
                name={restaurant.name}
                price={restaurant.price}
                location={restaurant.location}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No restaurants found{selectedType !== "All" && <> for <span className="font-semibold">{selectedType}</span></>}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiningService;
