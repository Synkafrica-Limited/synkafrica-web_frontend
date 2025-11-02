"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Filter, X } from "lucide-react";

import CarCard from "./components/CarCard";
import CarRentalBooking from "./components/BookingInput";

const CarRental = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    carType: "",
    capacity: "",
    priceRange: [0, 200],
  });

  const [selectedLocation, setSelectedLocation] = useState("Lagos Marina");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [currentView, setCurrentView] = useState("listing");

  // Sample car data
  const cars = [
    {
      id: 1,
      name: "Cadillac Escalade Platinum",
      type: "SUV",
      image:
        "/images/cars/pngs/cadillac-2.png?w=400&h=250&fit=crop&crop=center",
      rating: 4.8,
      price: 45000,
      originalPrice: 54000,
      capacity: 8,
      transmission: "Automatic",
      fuel: "Petrol",
      package: "Suv Package",
      features: ["A/C", "Unlimited mileage"],
      pickupLocation: "Lagos Marina",
      dropoffLocation: "Ikeja Airport",
    },
    {
      id: 2,
      name: "Range Rover Sport",
      type: "SUV",
      image:
        "/images/cars/pngs/range_rover_sport.png?w=400&h=250&fit=crop&crop=center",
      rating: 4.9,
      price: 45000,
      originalPrice: 58500,
      capacity: 5,
      transmission: "Automatic",
      fuel: "Petrol",
      package: "Luxury Package",
      features: ["A/C", "Unlimited mileage"],
      pickupLocation: "Lagos Marina",
      dropoffLocation: "Parkland Bus",
    },
    {
      id: 3,
      name: "Mercedes Benz GLE Coupe AMG",
      type: "Luxury",
      image:
        "/images/cars/pngs/Mercedes-AMG_GLE.png?w=400&h=250&fit=crop&crop=center",
      rating: 4.7,
      price: 45000,
      originalPrice: 63000,
      capacity: 5,
      transmission: "Automatic",
      fuel: "Petrol",
      package: "Luxury Package",
      features: ["A/C", "Unlimited mileage"],
      pickupLocation: "Lagos Marina",
      dropoffLocation: "Ikeja Airport",
    },
    {
      id: 4,
      name: "Mercedes Benz GLE 450",
      type: "Luxury",
      image:
        "/images/cars/pngs/Mercedes-AMG_GLE.png?w=400&h=250&fit=crop&crop=center",
      rating: 4.6,
      price: 45000,
      originalPrice: 56250,
      capacity: 7,
      transmission: "Automatic",
      fuel: "Petrol",
      package: "Luxury Package",
      features: ["A/C", "Unlimited mileage"],
      pickupLocation: "Lagos Marina",
      dropoffLocation: "Parkland Bus",
    },
    {
      id: 5,
      name: "Infiniti JX 35",
      type: "Economy",
      image:
        "/images/cars/pngs/infiniti_jx.png?w=400&h=250&fit=crop&crop=center",
      rating: 4.3,
      price: 22500,
      originalPrice: 31500,
      capacity: 5,
      transmission: "Automatic",
      fuel: "Petrol",
      package: "Economy Package",
      features: ["A/C", "Unlimited mileage"],
      pickupLocation: "Lagos Marina",
      dropoffLocation: "Ikeja Airport",
    },
    {
      id: 6,
      name: "Toyota Venza",
      type: "Economy",
      image:
        "/images/cars/pngs/toyota_venza.png?w=400&h=250&fit=crop&crop=center",
      rating: 4.4,
      price: 22500,
      originalPrice: 33750,
      capacity: 5,
      transmission: "Automatic",
      fuel: "Petrol",
      package: "Economy Package",
      features: ["A/C", "Unlimited mileage"],
      pickupLocation: "Lagos Marina",
      dropoffLocation: "Parkland Bus",
    },
    {
      id: 7,
      name: "Toyota Prado",
      type: "SUV",
      image:
        "/images/cars/pngs/toyota_prado.png?w=400&h=250&fit=crop&crop=center",
      rating: 4.5,
      price: 40500,
      originalPrice: 49500,
      capacity: 7,
      transmission: "Automatic",
      fuel: "Petrol",
      package: "Suv Package",
      features: ["A/C", "Unlimited mileage"],
      pickupLocation: "Lagos Marina",
      dropoffLocation: "Ikeja Airport",
    },
    {
      id: 8,
      name: "Lexus GX 460",
      type: "Luxury",
      image: "/images/cars/pngs/lexus_gx.png?w=400&h=250&fit=crop&crop=center",
      rating: 4.8,
      price: 40500,
      originalPrice: 54000,
      capacity: 8,
      transmission: "Automatic",
      fuel: "Petrol",
      package: "Luxury Package",
      features: ["A/C", "Unlimited mileage"],
      pickupLocation: "Lagos Marina",
      dropoffLocation: "Parkland Bus",
    },
  ];

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (filters.carType && car.type !== filters.carType) return false;
      if (filters.capacity && car.capacity < parseInt(filters.capacity))
        return false;
      if (
        car.price < filters.priceRange[0] * 450 ||
        car.price > filters.priceRange[1] * 450
      )
        return false;
      return true;
    });
  }, [filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleCarClick = (car) => {
    router.push(`/car-rental/car/${car.id}`);
  };

  const handleBackToListing = () => {
    setCurrentView("listing");
    setSelectedCar(null);
  };

  if (currentView === "details" && selectedCar) {
    return <CarDetailsPage car={selectedCar} onBack={handleBackToListing} />;
  }

  const handleSearch = (data) => {
    console.log("Search data:", data);
    // Handle search logic
  };

  return (
    <div>
      <div className="container mx-auto p-8">
        <CarRentalBooking onSearch={handleSearch} />
      </div>

      <div className="min-h-screen">
        {/* Custom scrollbar styles */}
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                selectedLocation={selectedLocation}
                onLocationChange={setSelectedLocation}
              />
            </div>

            {/* Mobile Filter Overlay */}
            {showFilters && (
              <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
                onClick={() => setShowFilters(false)}
              >
                <div
                  className="absolute inset-y-0 left-0 w-80 bg-white/95 backdrop-blur-md shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
                    <FilterSidebar
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      selectedLocation={selectedLocation}
                      onLocationChange={setSelectedLocation}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Header with Filter Button */}
              <div className="flex items-center justify-between mb-6">
                <div className="hidden lg:block">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {filteredCars.length} cars have been filtered specifically
                    for you
                  </h1>
                  <p className="text-gray-600">Total include taxes</p>
                </div>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors ml-auto"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>

              {/* Scrollable Car Grid */}
              <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-hide">
                <div className="grid gap-4 pr-2">
                  {/* Header that scrolls with content */}
                  <div className="mb-2 lg:hidden">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {filteredCars.length} cars have been filtered specifically
                      for you
                    </h1>
                    <p className="text-gray-600">Total include taxes</p>
                  </div>

                  {filteredCars.map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      onClick={() => handleCarClick(car)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter Sidebar Component
const FilterSidebar = ({
  filters,
  onFilterChange,
  selectedLocation,
  onLocationChange,
}) => {
  return (
    <div className="lg:w-80 bg-white rounded-lg p-6 shadow-sm h-fit">
      {/* Location Map */}
      <div className="mb-6">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=200&fit=crop&crop=center"
          alt="Lagos Marina Map"
          className="w-full h-32 object-cover rounded-lg mb-4"
        />
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>Pick up at Lagos Marina</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>Drop off at Parkland Bus</span>
          </div>
        </div>
      </div>

      {/* Car Type Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Car Type</h3>
        <div className="space-y-2">
          {["Economy", "SUV", "Luxury"].map((type) => (
            <label key={type} className="flex items-center gap-3">
              <input
                type="radio"
                name="carType"
                value={type}
                checked={filters.carType === type}
                onChange={(e) => onFilterChange("carType", e.target.value)}
                className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
              />
              <span className="text-gray-700">{type}</span>
              <span className="ml-auto text-gray-500 text-sm">
                ₦
                {type === "Economy"
                  ? "22,500"
                  : type === "SUV"
                  ? "40,500"
                  : "45,000"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Capacity Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Capacity</h3>
        <div className="space-y-2">
          {["5", "7", "8"].map((capacity) => (
            <label key={capacity} className="flex items-center gap-3">
              <input
                type="radio"
                name="capacity"
                value={capacity}
                checked={filters.capacity === capacity}
                onChange={(e) => onFilterChange("capacity", e.target.value)}
                className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
              />
              <span className="text-gray-700">{capacity} passengers</span>
              <span className="ml-auto text-gray-500 text-sm">₦40,500</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="200"
            value={filters.priceRange[1]}
            onChange={(e) =>
              onFilterChange("priceRange", [0, parseInt(e.target.value)])
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₦0</span>
            <span>₦{(filters.priceRange[1] * 450).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() =>
          onFilterChange("carType", "") ||
          onFilterChange("capacity", "") ||
          onFilterChange("priceRange", [0, 200])
        }
        className="w-full mt-6 px-4 py-2 text-primary-500 border border-primary-500 rounded-lg hover:bg-orange-50 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default CarRental;
