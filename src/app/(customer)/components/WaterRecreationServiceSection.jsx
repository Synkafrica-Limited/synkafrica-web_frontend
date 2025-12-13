import React, { useState, useEffect } from "react";
import ProductCard from "@/components/cards/ProductCard";
import { getListings } from "@/services/listings.service";

const WaterRecreation = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activityCategories, setActivityCategories] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await getListings({ serviceType: 'WATER_RECREATION' });
        
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
        apiListings = apiListings.filter(listing => listing.category === 'WATER_RECREATION');

        // Transform data
        const transformedActivities = apiListings.map(listing => {
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
            name: listing.title || listing.name || 'Water Adventure',
            price: listing.pricing?.basePrice || listing.basePrice || 0,
            location: locationStr,
            category: listing.category || 'Adventure'
          };
        });

        setActivities(transformedActivities);

        // Extract unique categories
        const categories = [...new Set(transformedActivities.map(a => a.category))].filter(Boolean).sort();
        setActivityCategories(categories);

      } catch (err) {
        console.error("Failed to fetch water activities:", err);
        setError("Failed to load activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const filteredActivities =
    activeCategory === "All"
      ? activities
      : activities.filter((act) => act.category === activeCategory);

  if (loading) {
    return <div className="py-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div></div>;
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">Failed to load water activities. Please try again later.</div>;
  }

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
        {activityCategories.length > 0 && (
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
        )}

        {/* Activity Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.length > 0 ? (
            filteredActivities.slice(0, 6).map((activity) => (
              <ProductCard
                key={activity.id}
                type="recreation"
                id={activity.id}
                image={activity.image}
                name={activity.name}
                price={activity.price}
                location={activity.location}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No activities found{activeCategory !== "All" && <> for <span className="font-semibold">{activeCategory}</span></>}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaterRecreation;
