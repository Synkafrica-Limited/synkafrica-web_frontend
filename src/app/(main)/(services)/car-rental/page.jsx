"use client";

import React, { useState, useMemo } from "react";
import {
  MapPin,
  Users,
  Fuel,
  Settings,
  Star,
  Clock,
  Filter,
  X,
} from "lucide-react";

const CarRental = () => {
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
      image: "/images/cars/pngs/cadillac-2.png?w=400&h=250&fit=crop&crop=center",
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
      image:
        "/images/cars/pngs/lexus_gx.png?w=400&h=250&fit=crop&crop=center",
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
    setSelectedCar(car);
    setCurrentView("details");
  };

  const handleBackToListing = () => {
    setCurrentView("listing");
    setSelectedCar(null);
  };

  if (currentView === "details" && selectedCar) {
    return <CarDetailsPage car={selectedCar} onBack={handleBackToListing} />;
  }

  return (
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
                  {filteredCars.length} cars have been filtered specifically for
                  you
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

// Car Card Component
const CarCard = ({ car, onClick }) => {
  return (
    <div
      className="group bg-white rounded-2xl border border-gray-50 hover:border-gray-100 transition-all duration-300 hover:shadow-lg overflow-hidden cursor-pointer"
      style={{ boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.04)" }}
      onClick={onClick}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Car Image */}
        <div className="lg:w-80 h-48 relative overflow-hidden flex-shrink-0">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
              Great Deal
            </span>
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-sm">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-gray-800">
                {car.rating}
              </span>
            </div>
          </div>
          <img
            src={car.image}
            alt={car.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>

        {/* Car Details */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {car.package}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {car.name}
                </h3>

                {/* Car Features */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{car.capacity} seats</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{car.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <Fuel className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">A/C</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Unlimited</span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="text-right lg:ml-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">
                    Starting from
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    ₦{car.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 line-through">
                    ₦{car.originalPrice.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-600 font-semibold mt-1">
                    Save ₦{(car.originalPrice - car.price).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">
                Free cancellation
              </span>{" "}
              • Available now
            </div>
            <button className="bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Reserve Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Car Details Page Component
const CarDetailsPage = ({ car, onBack }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [rentalDays, setRentalDays] = useState(1);

  const additionalImages = [
    car.image,
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1494976688153-c12b0c2e4c92?w=400&h=250&fit=crop",
  ];

  const features = [
    {
      icon: Users,
      label: `${car.capacity} Passengers`,
      description: "Comfortable seating for everyone",
    },
    {
      icon: Settings,
      label: car.transmission,
      description: "Smooth driving experience",
    },
    {
      icon: Fuel,
      label: "Air Conditioning",
      description: "Climate control included",
    },
    {
      icon: Clock,
      label: "Unlimited Mileage",
      description: "Drive as far as you want",
    },
    {
      icon: Star,
      label: "Premium Sound",
      description: "High-quality audio system",
    },
    {
      icon: MapPin,
      label: "GPS Navigation",
      description: "Built-in navigation system",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Cars
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Car Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Images */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-2 gap-2 p-4">
                {additionalImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${car.name} view ${index + 1}`}
                    className={`rounded-xl object-cover transition-all duration-300 hover:scale-105 ${
                      index === 0 ? "col-span-2 h-64" : "h-32"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Car Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {car.package}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{car.rating}</span>
                  <span className="text-gray-500 text-sm">(124 reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {car.name}
              </h1>
              <p className="text-gray-600 mb-6">
                Experience luxury and comfort with this premium{" "}
                {car.type.toLowerCase()} vehicle. Perfect for both business and
                leisure travel, featuring advanced safety technology and
                exceptional performance.
              </p>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                  >
                    <feature.icon className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {feature.label}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pickup/Dropoff Info */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Pickup & Drop-off
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Pickup Location
                      </p>
                      <p className="text-sm text-gray-600">
                        {car.pickupLocation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Drop-off Location
                      </p>
                      <p className="text-sm text-gray-600">
                        {car.dropoffLocation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ₦{car.price.toLocaleString()}
                </div>
                <div className="text-lg text-gray-500 line-through mb-1">
                  ₦{car.originalPrice.toLocaleString()}
                </div>
                <div className="text-green-600 font-semibold">
                  Save ₦{(car.originalPrice - car.price).toLocaleString()}
                </div>
                <p className="text-sm text-gray-500 mt-2">per day</p>
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rental Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={rentalDays}
                    onChange={(e) => setRentalDays(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Total Calculation */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Daily rate × {rentalDays} days</span>
                    <span>₦{(car.price * rentalDays).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Insurance & fees</span>
                    <span>₦5,000</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>
                      ₦{(car.price * rentalDays + 5000).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Book Now - ₦{(car.price * rentalDays + 5000).toLocaleString()}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Free cancellation up to 24 hours before pickup
                </p>
              </div>
            </div>

            {/* Additional Info */}
            {/* <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">
                What's Included
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Comprehensive insurance
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  24/7 roadside assistance
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Free cancellation
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Unlimited mileage
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarRental;
