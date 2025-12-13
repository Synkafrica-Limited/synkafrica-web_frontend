import React, { useState, useEffect } from "react";
import ProductCard from "@/components/cards/ProductCard";
import { getListings } from "@/services/listings.service";
import { PageLoadingScreen } from "@/components/ui/LoadingScreen";

const CarRentalService = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [carBrands, setCarBrands] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await getListings({ serviceType: 'CAR_RENTAL' });
        
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
        apiListings = apiListings.filter(listing => listing.category === 'CAR_RENTAL');

        // Transform data
        const transformedCars = apiListings.map(listing => {
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
            name: listing.title || listing.name || 'Luxury Car',
            price: listing.pricing?.basePrice || listing.basePrice || 0,
            location: locationStr,
            brand: listing.carMake || 'Other'
          };
        });

        setCars(transformedCars);

        // Extract unique brands
        const brands = [...new Set(transformedCars.map(car => car.brand))].filter(Boolean).sort();
        setCarBrands(brands);

      } catch (err) {
        console.error("Failed to fetch car listings:", err);
        setError("Failed to load cars");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Filter cars by brand
  const filteredCars =
    selectedBrand === "All"
      ? cars
      : cars.filter((car) => car.brand === selectedBrand);

  if (loading) {
    return <div className="py-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div></div>;
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">Failed to load car listings. Please try again later.</div>;
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
                Choose Your Suitable Car
              </h1>
              <p className="text-gray-600">
                Browse from a wide range of vehicles — from affordable rides to
                luxury models, tailored for comfort and class.
              </p>
            </div>
            <button
              onClick={() => setSelectedBrand("All")}
              className="bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white px-6 py-2 rounded font-medium transition-colors duration-200"
            >
              See All
            </button>
          </div>
        </div>

        {/* Car Brand Filter */}
        {carBrands.length > 0 && (
          <div className="flex items-center gap-3 sm:gap-4 mb-8 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedBrand("All")}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedBrand === "All"
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {carBrands.map((brand, index) => (
              <button
                key={index}
                onClick={() => setSelectedBrand(brand)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedBrand === brand
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        )}

        {/* Car Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.length > 0 ? (
            filteredCars.slice(0, 6).map((car) => (
              <ProductCard
                key={car.id}
                type="car"
                id={car.id}
                image={car.image}
                name={car.name}
                price={car.price}
                location={car.location}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No cars found{selectedBrand !== "All" && <> for <span className="font-semibold">{selectedBrand}</span></>}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarRentalService;
