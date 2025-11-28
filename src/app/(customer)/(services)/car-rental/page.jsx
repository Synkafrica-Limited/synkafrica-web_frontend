"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CarCard from "@/components/cards/ProductCard";

function CarRentalContent() {
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [carType, setCarType] = useState("");
  const [displayedCars, setDisplayedCars] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef(null); 
  const CARS_PER_PAGE = 6;

  // Mock database of cars
  const allCars = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop",
      name: "Lexus CT200H",
      price: 120,
      location: "Lagos",
      type: "luxury",
      buttonVariant: "filled",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop",
      name: "Jaguar F-Pace",
      price: 132,
      location: "Lagos",
      type: "suv",
      buttonVariant: "outline",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&h=300&fit=crop",
      name: "Mercedes Benz",
      price: 132,
      location: "Lagos",
      type: "luxury",
      buttonVariant: "outline",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=300&fit=crop",
      name: "Tesla Model 3",
      price: 150,
      location: "Abuja",
      type: "electric",
      buttonVariant: "outline",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop",
      name: "BMW 3 Series",
      price: 140,
      location: "Lagos",
      type: "sedan",
      buttonVariant: "outline",
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=500&h=300&fit=crop",
      name: "Audi Q5",
      price: 145,
      location: "Port Harcourt",
      type: "suv",
      buttonVariant: "outline",
    },
    {
      id: 7,
      image:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&h=300&fit=crop",
      name: "Toyota Camry",
      price: 80,
      location: "Lagos",
      type: "sedan",
      buttonVariant: "outline",
    },
    {
      id: 8,
      image:
        "https://images.unsplash.com/photo-1542362567-b07e54358753?w=500&h=300&fit=crop",
      name: "Range Rover Sport",
      price: 200,
      location: "Abuja",
      type: "luxury",
      buttonVariant: "outline",
    },
    {
      id: 9,
      image:
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500&h=300&fit=crop",
      name: "Honda Accord",
      price: 75,
      location: "Lagos",
      type: "sedan",
      buttonVariant: "outline",
    },
    {
      id: 10,
      image:
        "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=500&h=300&fit=crop",
      name: "Nissan Rogue",
      price: 90,
      location: "Port Harcourt",
      type: "suv",
      buttonVariant: "outline",
    },
  ];

  // Filter cars based on query params and filters
  const getFilteredCars = useCallback(() => {
    let filtered = [...allCars];

    // Check for query parameters
    const queryLocation = searchParams.get("location");
    const queryType = searchParams.get("type");
    const queryMaxPrice = searchParams.get("maxPrice");

    // Apply URL query filters
    if (queryLocation) {
      filtered = filtered.filter(
        (car) => car.location.toLowerCase() === queryLocation.toLowerCase()
      );
    }

    if (queryType) {
      filtered = filtered.filter(
        (car) => car.type.toLowerCase() === queryType.toLowerCase()
      );
    }

    if (queryMaxPrice) {
      filtered = filtered.filter((car) => car.price <= parseInt(queryMaxPrice));
    }

    // Apply sidebar filters
    if (selectedLocation) {
      filtered = filtered.filter(
        (car) => car.location.toLowerCase() === selectedLocation.toLowerCase()
      );
    }

    if (carType) {
      filtered = filtered.filter(
        (car) => car.type.toLowerCase() === carType.toLowerCase()
      );
    }

    filtered = filtered.filter((car) => car.price <= priceRange[1]);

    return filtered;
  }, [searchParams, selectedLocation, carType, priceRange]);

  // Load more cars
  const loadMoreCars = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const filtered = getFilteredCars();
      const startIndex = (page - 1) * CARS_PER_PAGE;
      const endIndex = startIndex + CARS_PER_PAGE;
      const newCars = filtered.slice(startIndex, endIndex);

      if (newCars.length > 0) {
        setDisplayedCars((prev) => [...prev, ...newCars]);
        setPage((prev) => prev + 1);
        setHasMore(endIndex < filtered.length);
      } else {
        setHasMore(false);
      }

      setIsLoading(false);
    }, 500);
  }, [page, isLoading, getFilteredCars]);

  // Initialize filters from URL params
  useEffect(() => {
    const queryLocation = searchParams.get("location");
    const queryType = searchParams.get("type");
    const queryMaxPrice = searchParams.get("maxPrice");

    if (queryLocation) setSelectedLocation(queryLocation.toLowerCase());
    if (queryType) setCarType(queryType.toLowerCase());
    if (queryMaxPrice) setPriceRange([0, parseInt(queryMaxPrice)]);
  }, [searchParams]);

  // Reset and reload when filters change
  useEffect(() => {
    setDisplayedCars([]);
    setPage(1);
    setHasMore(true);
    loadMoreCars();
  }, [selectedLocation, carType, priceRange[1], searchParams]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreCars();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, loadMoreCars]);

  const totalFilteredCars = getFilteredCars().length;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Filters</h2>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">
                  Price Range
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([0, parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Locations</option>
                  <option value="lagos">Lagos</option>
                  <option value="abuja">Abuja</option>
                  <option value="port harcourt">Port Harcourt</option>
                </select>
              </div>

              {/* Car Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">
                  Car Type
                </label>
                <div className="space-y-2">
                  {["Sedan", "SUV", "Luxury", "Electric"].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="carType"
                        value={type.toLowerCase()}
                        checked={carType === type.toLowerCase()}
                        onChange={(e) => setCarType(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reset Filters Button */}
              <button
                onClick={() => {
                  setPriceRange([0, 500]);
                  setSelectedLocation("");
                  setCarType("");
                }}
                className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Right Content - Car Listings */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Available Cars</h1>
              <p className="text-gray-600">
                Showing {displayedCars.length} of {totalFilteredCars} car
                {totalFilteredCars !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Car Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayedCars.map((car) => (
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

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Intersection Observer Target */}
            <div ref={observerTarget} className="h-10" />

            {/* No More Results */}
            {!hasMore && displayedCars.length > 0 && (
              <p className="text-center text-gray-500 py-8">
                No more cars to load
              </p>
            )}

            {/* No Results Found */}
            {displayedCars.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No cars found matching your criteria
                </p>
                <button
                  onClick={() => {
                    setPriceRange([0, 500]);
                    setSelectedLocation("");
                    setCarType("");
                  }}
                  className="mt-4 px-6 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
export default function CarRentalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <CarRentalContent />
    </Suspense>
  );
}
