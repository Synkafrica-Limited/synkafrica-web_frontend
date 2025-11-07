"use client";

import React, { useState, useEffect } from "react";
import {
  Car,
  Sailboat,
  Home,
  Utensils,
  MoreHorizontal,
  MapPin,
  Calendar,
  Clock,
  Users,
  Heart,
  Star,
  X,
} from "lucide-react";

import CarRentalBookingInputs from "../../../../components/booking_inputs/CarRentalBookingInputs";
import DiningBookingInputs from "../../../../components/booking_inputs/DiningBookingInputs";
import ResortHouseBookingInputs from "../../../../components/booking_inputs/ResortHouseBookingInputs";
import WaterRecreationBookingInputs from "../../../../components/booking_inputs/WaterRecreationBookingInputs";

const mockListings = {
  car: [
    {
      id: 1,
      name: "Mercedes-Benz S-Class",
      image:
        "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=400&h=300&fit=crop",
      location: "Victoria Island, Lagos",
      price: 75000,
      rating: 4.8,
      reviews: 124,
      features: ["Professional Driver", "AC", "Leather Seats", "WiFi"],
      available: true,
    },
    {
      id: 2,
      name: "Toyota Camry 2023",
      image:
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop",
      location: "Lekki Phase 1, Lagos",
      price: 35000,
      rating: 4.6,
      reviews: 89,
      features: ["Professional Driver", "AC", "GPS", "Bluetooth"],
      available: true,
    },
    {
      id: 3,
      name: "Range Rover Sport",
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
      location: "Ikoyi, Lagos",
      price: 95000,
      rating: 4.9,
      reviews: 156,
      features: [
        "Luxury Interior",
        "Professional Driver",
        "Premium Sound",
        "WiFi",
      ],
      available: true,
    },
  ],
  water: [
    {
      id: 1,
      name: "Luxury Yacht Charter",
      image:
        "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400&h=300&fit=crop",
      location: "Lagos Marina",
      price: 250000,
      rating: 5.0,
      reviews: 67,
      features: [
        "Captain Included",
        "Crew",
        "Catering Available",
        "Sound System",
      ],
      capacity: "20 guests",
      available: true,
    },
    {
      id: 2,
      name: "Jet Ski Adventure",
      image:
        "https://images.unsplash.com/photo-1637005433009-63f2fe0fdd9e?w=400&h=300&fit=crop",
      location: "Elegushi Beach",
      price: 15000,
      rating: 4.7,
      reviews: 203,
      features: [
        "Safety Gear",
        "Instructor",
        "30min Session",
        "Photos Included",
      ],
      capacity: "2 persons",
      available: true,
    },
    {
      id: 3,
      name: "Speed Boat Tour",
      image:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      location: "Ikoyi Marina",
      price: 85000,
      rating: 4.8,
      reviews: 91,
      features: [
        "Professional Guide",
        "Life Jackets",
        "Refreshments",
        "2hr Tour",
      ],
      capacity: "8 guests",
      available: true,
    },
  ],
  resort: [
    {
      id: 1,
      name: "Beach View Shortlet Apartment",
      image:
        "https://images.unsplash.com/photo-1502672260066-6bc335c7e129?w=400&h=300&fit=crop",
      location: "Ajah Lekki, Lagos",
      price: 45000,
      rating: 4.5,
      reviews: 78,
      features: ["Ocean View", "Pool Access", "Free WiFi", "Kitchen"],
      roomType: "2 Bedroom Apartment",
      available: true,
    },
    {
      id: 2,
      name: "Luxury Villa with Private Pool",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
      location: "Lekki Phase 1, Lagos",
      price: 150000,
      rating: 4.9,
      reviews: 134,
      features: ["Private Pool", "Beach Access", "Chef Service", "Security"],
      roomType: "4 Bedroom Villa",
      available: true,
    },
    {
      id: 3,
      name: "Cozy Beachfront Studio",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      location: "Oniru, Lagos",
      price: 28000,
      rating: 4.3,
      reviews: 56,
      features: ["Beach View", "Kitchenette", "AC", "Free Parking"],
      roomType: "Studio Apartment",
      available: true,
    },
  ],
  dining: [
    {
      id: 1,
      name: "Ocean Breeze Restaurant",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
      location: "Victoria Island, Lagos",
      price: 25000,
      rating: 4.7,
      reviews: 289,
      features: ["Seafood Specialty", "Ocean View", "Live Music", "Bar"],
      cuisine: "Continental & Seafood",
      available: true,
    },
    {
      id: 2,
      name: "Afro Fusion Kitchen",
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
      location: "Lekki Phase 1, Lagos",
      price: 18000,
      rating: 4.8,
      reviews: 412,
      features: [
        "Contemporary African",
        "Wine Selection",
        "Outdoor Seating",
        "Private Dining",
      ],
      cuisine: "African Fusion",
      available: true,
    },
    {
      id: 3,
      name: "The Grill House",
      image:
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop",
      location: "Ikoyi, Lagos",
      price: 35000,
      rating: 4.9,
      reviews: 178,
      features: [
        "Premium Steaks",
        "Wine Cellar",
        "Rooftop Dining",
        "Valet Parking",
      ],
      cuisine: "Steakhouse & Grill",
      available: true,
    },
  ],
};

const serviceContent = {
  car: {
    heading: "Chauffeur-driven\nconvenience - Book now!",
    resultText: "Premium car rentals found",
    stats: [
      { value: "24/7", label: "Available" },
      { value: "1k+", label: "Cars" },
      { value: "3", label: "Operational States" },
    ],
  },
  water: {
    heading: "Find your perfect\nwater adventure - Book today!",
    resultText: "Water activities available",
    stats: [
      { value: "1,200+", label: "Watercraft" },
      { value: "80+", label: "Coastal Destinations" },
      { value: "4.9★", label: "Experience Rating" },
    ],
  },
  resort: {
    heading: "Your dream resort\nescape starts here",
    resultText: "Properties available",
    stats: [
      { value: "200+", label: "Resort Partners" },
      { value: "25+", label: "Destinations" },
      { value: "98%", label: "Oceanfront Access" },
    ],
  },
  dining: {
    heading: "Exquisite dining\nexperiences await!",
    resultText: "Restaurants found",
    stats: [
      { value: "300+", label: "Restaurants" },
      { value: "50+", label: "Cuisines" },
      { value: "5★", label: "Average Rating" },
    ],
  },
};

export default function ServiceResult() {
  const [activeService, setActiveService] = useState("car");
  const [priceRange, setPriceRange] = useState([10000, 400000]);
  const [viewMode, setViewMode] = useState("list");
  const [favorites, setFavorites] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const services = [
    { id: "car", label: "Car rental", icon: Car },
    { id: "dining", label: "Dining", icon: Utensils },
    { id: "resort", label: "Resort house", icon: Home },
    { id: "water", label: "Water recreation", icon: Sailboat },
  ];

  const content = serviceContent[activeService];

  // Detect service type from URL parameters
  const detectServiceFromURL = (params) => {
    if (params.has("activity")) return "water";
    if (params.has("location") && params.has("date")) return "car";
    if (params.has("destination") && params.has("checkin")) return "resort";
    if (params.has("restaurant") && params.has("guests")) return "dining";
    return "car"; // default
  };

  // Fetch listings based on service and search parameters
  const fetchListings = async (service, searchParams) => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = "";
      let queryString = "";

      switch (service) {
        case "water":
          endpoint = "/api/water-recreation";
          queryString = new URLSearchParams({
            activity: searchParams.get("activity") || "",
            date: searchParams.get("date") || "",
            time: searchParams.get("time") || "",
          }).toString();
          break;

        case "car":
          endpoint = "/api/car-rental";
          queryString = new URLSearchParams({
            location: searchParams.get("location") || "",
            date: searchParams.get("date") || "",
            time: searchParams.get("time") || "",
          }).toString();
          break;

        case "resort":
          endpoint = "/api/resort-house";
          queryString = new URLSearchParams({
            destination: searchParams.get("destination") || "",
            checkin: searchParams.get("checkin") || "",
            time: searchParams.get("time") || "",
          }).toString();
          break;

        case "dining":
          endpoint = "/api/dining";
          queryString = new URLSearchParams({
            restaurant: searchParams.get("restaurant") || "",
            date: searchParams.get("date") || "",
            time: searchParams.get("time") || "",
            guests: searchParams.get("guests") || "",
          }).toString();
          break;

        default:
          endpoint = "/api/car-rental";
      }

      const response = await fetch(`${endpoint}?${queryString}`);
      if (!response.ok) throw new Error("Failed to fetch listings");

      const data = await response.json();
      setListings(data.listings || []);
    } catch (err) {
      setError(err.message);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.toString()) {
      // Search parameters exist - determine service and fetch
      const detectedService = detectServiceFromURL(urlParams);
      setActiveService(detectedService);
      fetchListings(detectedService, urlParams);
    } else {
      // No search parameters - fetch default listings
      fetchListings(activeService, new URLSearchParams());
    }
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleSearch = async (data) => {
    let queryParams;
    let service;

    // Water Recreation
    if (data.service === "water-recreation") {
      service = "water";
      queryParams = new URLSearchParams({
        activity: data.activity,
        date: data.bookingDate,
        time: data.bookingTime,
      });
    }
    // Car Rental
    else if (data.service === "car") {
      service = "car";
      queryParams = new URLSearchParams({
        location: data.pickupLocation,
        date: data.pickupDate,
        time: data.pickupTime,
      });
    }
    // Resort House
    else if (data.service === "resort") {
      service = "resort";
      queryParams = new URLSearchParams({
        destination: data.destination,
        checkin: data.checkInDate,
        time: data.checkInTime,
      });
    }
    // Dining
    else if (data.service === "dining") {
      service = "dining";
      queryParams = new URLSearchParams({
        restaurant: data.restaurant,
        date: data.bookingDate,
        time: data.bookingTime,
        guests: data.guests,
      });
    }

    // Update URL and fetch new results
    window.history.pushState({}, "", `/result/?${queryParams.toString()}`);
    setActiveService(service);
    await fetchListings(service, queryParams);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gray-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => setActiveService(service.id)}
                    className={`flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      activeService === service.id
                        ? "text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    style={
                      activeService === service.id
                        ? { backgroundColor: "#DF5D3D" }
                        : {}
                    }
                  >
                    <Icon size={18} />
                    <span className="hidden sm:inline text-sm">
                      {service.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic booking inputs */}
          {activeService === "car" && (
            <CarRentalBookingInputs
              onSearch={handleSearch}
              showBorder={false}
            />
          )}
          {activeService === "dining" && (
            <DiningBookingInputs onSearch={handleSearch} />
          )}
          {activeService === "resort" && (
            <ResortHouseBookingInputs onSearch={handleSearch} />
          )}
          {activeService === "water" && (
            <WaterRecreationBookingInputs onSearch={handleSearch} />
          )}
          {activeService === "other" && (
            <OtherServicesBookingInputs onSearch={handleSearch} />
          )}
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span
            className="hover:underline cursor-pointer"
            style={{ color: "#DF5D3D" }}
          >
            Home
          </span>
          <span>›</span>
          <span
            className="hover:underline cursor-pointer"
            style={{ color: "#DF5D3D" }}
          >
            Nigeria
          </span>
          <span>›</span>
          <span
            className="hover:underline cursor-pointer"
            style={{ color: "#DF5D3D" }}
          >
            Lagos
          </span>
          <span>›</span>
          <span className="text-gray-800">Search results</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-lg mb-4">Filter by:</h3>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">
                  Your budget (per{" "}
                  {activeService === "dining" ? "person" : "night"})
                </h4>
                <div className="text-sm text-gray-600 mb-2">
                  NGN {priceRange[0].toLocaleString()} – NGN{" "}
                  {priceRange[1].toLocaleString()}+
                </div>
                <input
                  type="range"
                  min="10000"
                  max="400000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full"
                  style={{ accentColor: "#DF5D3D" }}
                />
              </div>

              {/* Popular Filters */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Popular filters</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded"
                      style={{ accentColor: "#DF5D3D" }}
                    />
                    <span className="text-sm">Free cancellation</span>
                    <span className="text-xs text-gray-500 ml-auto">445</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded"
                      style={{ accentColor: "#DF5D3D" }}
                    />
                    <span className="text-sm">No prepayment</span>
                    <span className="text-xs text-gray-500 ml-auto">463</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded"
                      style={{ accentColor: "#DF5D3D" }}
                    />
                    <span className="text-sm">Highly rated: 4+</span>
                    <span className="text-xs text-gray-500 ml-auto">312</span>
                  </label>
                </div>
              </div>

              {/* Stats */}
              <div className="pt-6 border-t">
                <h4 className="font-semibold mb-3">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-3">
                  {content.stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="text-center p-2 bg-gray-50 rounded"
                    >
                      <div className="font-bold" style={{ color: "#DF5D3D" }}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  <span style={{ color: "#DF5D3D" }}>{listings.length}</span>{" "}
                  {content.resultText} in Lagos
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1 rounded ${
                      viewMode === "list"
                        ? "bg-gray-800 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1 rounded ${
                      viewMode === "grid"
                        ? "bg-gray-800 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Grid
                  </button>
                </div>
              </div>

              {loading ? (
                <div>Loading...</div> 
              ) : error ? (
                <div>Error occurred: {error.message}</div> 
              ) : listings.length === 0 ? (
                <div>No listings found.</div> 
              ) : (
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid" ? "md:grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-orange-800">
                          Experience luxury and convenience with Synk Africa.
                          Our curated selection ensures quality service and
                          memorable experiences across all our offerings.
                        </p>
                      </div>

                      {/* Listings */}
                      <div
                        className={`grid gap-6 ${
                          viewMode === "grid" ? "md:grid-cols-2" : "grid-cols-1"
                        }`}
                      >
                        {listings.map((listing) => (
                          <div
                            key={listing.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                          >
                            <div
                              className={`${
                                viewMode === "list" ? "md:flex" : ""
                              }`}
                            >
                              <div
                                className={`relative ${
                                  viewMode === "list" ? "md:w-80" : "w-full"
                                } h-64`}
                              >
                                <img
                                  src={listing.image}
                                  alt={listing.name}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={() => toggleFavorite(listing.id)}
                                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
                                >
                                  <Heart
                                    size={20}
                                    className={
                                      favorites.includes(listing.id)
                                        ? "fill-red-500 text-red-500"
                                        : "text-gray-600"
                                    }
                                  />
                                </button>
                              </div>

                              <div className="p-4 flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-bold text-lg mb-1">
                                      {listing.name}
                                    </h3>
                                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                                      <MapPin size={14} />
                                      <span>{listing.location}</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center gap-1 mb-1">
                                      <span className="font-bold">
                                        {listing.rating}
                                      </span>
                                      <Star
                                        size={16}
                                        className="fill-yellow-400 text-yellow-400"
                                      />
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {listing.reviews} reviews
                                    </div>
                                  </div>
                                </div>

                                {(listing.roomType ||
                                  listing.capacity ||
                                  listing.cuisine) && (
                                  <div className="text-sm font-semibold text-gray-700 mb-2">
                                    {listing.roomType ||
                                      listing.capacity ||
                                      listing.cuisine}
                                  </div>
                                )}

                                <div className="flex flex-wrap gap-2 mb-3">
                                  {listing.features
                                    .slice(0, 4)
                                    .map((feature, idx) => (
                                      <span
                                        key={idx}
                                        className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded"
                                      >
                                        ✓ {feature}
                                      </span>
                                    ))}
                                </div>

                                <div className="flex items-end justify-between mt-4 pt-4 border-t">
                                  <div>
                                    <div className="text-xs text-gray-500 mb-1">
                                      Starting from
                                    </div>
                                    <div className="text-2xl font-bold">
                                      NGN {listing.price.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Includes taxes and fees
                                    </div>
                                  </div>
                                  <button
                                    className="text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: "#DF5D3D" }}
                                  >
                                    See availability
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
