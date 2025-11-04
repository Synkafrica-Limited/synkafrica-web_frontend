import React from "react";
import CarCard from "@/components/cards/CarCard";

const CarRentalService = () => {
  const carBrands = [
    { name: "BMW", logo: "https://cdn.worldvectorlogo.com/logos/bmw.svg" },
    {
      name: "Lexus",
      logo: "https://cdn.worldvectorlogo.com/logos/lexus-1.svg",
    },
    {
      name: "Mercedes",
      logo: "https://cdn.worldvectorlogo.com/logos/mercedes-benz-9.svg",
    },
    {
      name: "Honda",
      logo: "https://cdn.worldvectorlogo.com/logos/honda-2.svg",
    },
    {
      name: "Jaguar",
      logo: "https://cdn.worldvectorlogo.com/logos/jaguar.svg",
    },
    {
      name: "Nissan",
      logo: "https://cdn.worldvectorlogo.com/logos/nissan-6.svg",
    },
    {
      name: "Toyota",
      logo: "https://cdn.worldvectorlogo.com/logos/toyota-1.svg",
    },
    { name: "Kia", logo: "https://cdn.worldvectorlogo.com/logos/kia-1.svg" },
  ];

  const cars = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop",
      name: "Lexus CT200H",
      price: 120,
      location: "Lagos",
      buttonVariant: "filled",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop",
      name: "Jaguar F-Pace",
      price: 132,
      location: "Lagos",
      buttonVariant: "outline",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&h=300&fit=crop",
      name: "Mercedes Benz",
      price: 132,
      location: "Lagos",
      buttonVariant: "outline",
    },
  ];

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
                We present popular cars that are rented by customers to maximize
                your comfort on long trips.
              </p>
            </div>
            <button className="bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white px-6 py-2 rounded font-medium transition-colors duration-200">
              See All
            </button>
          </div>
        </div>

        {/* Car Brand Icons */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4">
          {carBrands.map((brand, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-10 h-10 object-contain opacity-40 hover:opacity-60 transition-opacity"
              />
            </div>
          ))}
        </div>

        {/* Car Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard
              key={car.id}
              image={car.image}
              name={car.name}
              price={car.price}
              location={car.location}
              buttonVariant={car.buttonVariant}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarRentalService;
