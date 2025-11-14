import React from "react";
import { Star, Users, Fuel, Gauge, MapPin } from "lucide-react";

const CarCard = ({
  image,
  name,
  price,
  location,
  seats,
  transmission,
  fuel,
  rating,
  reviews,
  buttonVariant = "outline",
}) => {
  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-gray-900">{rating}</span>
          <span className="text-xs text-gray-500">({reviews})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="w-3.5 h-3.5" />
            <span>{location}</span>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="flex flex-col items-center">
            <Users className="w-4 h-4 text-gray-400 mb-1" />
            <span className="text-xs text-gray-600 font-medium">{seats}</span>
            <span className="text-[10px] text-gray-400">Seats</span>
          </div>
          <div className="flex flex-col items-center">
            <Gauge className="w-4 h-4 text-gray-400 mb-1" />
            <span className="text-xs text-gray-600 font-medium">{transmission}</span>
            <span className="text-[10px] text-gray-400">Trans</span>
          </div>
          <div className="flex flex-col items-center">
            <Fuel className="w-4 h-4 text-gray-400 mb-1" />
            <span className="text-xs text-gray-600 font-medium">{fuel}</span>
            <span className="text-[10px] text-gray-400">Fuel</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              ₦{price.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">per day</div>
          </div>
          <button
            className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              buttonVariant === "filled"
                ? "bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md"
                : "border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
            }`}
          >
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Demo Component
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
      price: 45000,
      location: "Lagos",
      seats: 5,
      transmission: "Auto",
      fuel: "Hybrid",
      rating: 4.8,
      reviews: 124,
      buttonVariant: "filled",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop",
      name: "Jaguar F-Pace",
      price: 52000,
      location: "Lagos",
      seats: 5,
      transmission: "Auto",
      fuel: "Petrol",
      rating: 4.9,
      reviews: 89,
      buttonVariant: "outline",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&h=300&fit=crop",
      name: "Mercedes Benz",
      price: 58000,
      location: "Lagos",
      seats: 5,
      transmission: "Auto",
      fuel: "Petrol",
      rating: 4.7,
      reviews: 156,
      buttonVariant: "outline",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
                  We present popular cars that are rented by customers to
                  maximize your comfort on long trips.
                </p>
              </div>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm">
                See All
              </button>
            </div>
          </div>

          {/* Car Brand Icons */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4">
            {carBrands.map((brand, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:border-gray-400 transition-all cursor-pointer hover:shadow-md"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-10 h-10 object-contain opacity-40 hover:opacity-70 transition-opacity"
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
                seats={car.seats}
                transmission={car.transmission}
                fuel={car.fuel}
                rating={car.rating}
                reviews={car.reviews}
                buttonVariant={car.buttonVariant}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarRentalService;