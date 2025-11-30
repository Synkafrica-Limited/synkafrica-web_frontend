import React, { useState } from "react";
import ProductCard from "@/components/cards/ProductCard";

const CarRentalService = () => {
  // Car brands (text only)
  const carBrands = [
    "BMW",
    "Lexus",
    "Mercedes",
    "Honda",
    "Jaguar",
    "Nissan",
    "Toyota",
    "Kia",
  ];

  // Cars data
  const cars = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop",
      name: "Lexus CT200H",
      price: 120000,
      location: "Lagos",
      brand: "Lexus",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop",
      name: "Jaguar F-Pace",
      price: 250032,
      location: "Lagos",
      brand: "Jaguar",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&h=300&fit=crop",
      name: "Mercedes Benz C-Class",
      price: 80000,
      location: "Lagos",
      brand: "Mercedes",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1619713344303-fd9e1e7cb16f?w=500&h=300&fit=crop",
      name: "Honda Civic",
      price: 60000,
      location: "Lagos",
      brand: "Honda",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1592853625601-4969ef81b1b2?w=500&h=300&fit=crop",
      name: "Toyota Camry",
      price: 55000,
      location: "Lagos",
      brand: "Toyota",
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1589395595558-6562b93b6a49?w=500&h=300&fit=crop",
      name: "Kia Sportage",
      price: 50000,
      location: "Lagos",
      brand: "Kia",
    },
  ];

  // State for filtering
  const [selectedBrand, setSelectedBrand] = useState("All");

  // Filter cars by brand
  const filteredCars =
    selectedBrand === "All"
      ? cars
      : cars.filter((car) => car.brand === selectedBrand);

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

        {/* Car Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <ProductCard
                key={car.id}
                type="car"
                image={car.image}
                name={car.name}
                price={car.price}
                location={car.location}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No cars found for <span className="font-semibold">{selectedBrand}</span>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarRentalService;
