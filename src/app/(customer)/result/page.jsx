"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Car,
  Sailboat,
  Home,
  Utensils,
  MapPin,
  Heart,
  Star,
  ArrowRight,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  Navigation,
  Users,
  Search,
} from "lucide-react";
import { PageLoadingScreen } from "@/components/ui/LoadingScreen";
import { getListings } from "@/services/listings.service";

// No mock data - only real API data is used

const serviceContent = {
  car: {
    heading: "Chauffeur-driven\nconvenience - Book now!",
    resultText: "Premium car rentals found",
    stats: [
      { value: "150+", label: "Vehicles" },
      { value: "4.8★", label: "Avg Rating" },
      { value: "₦75K", label: "Avg Price" },
      { value: "24/7", label: "Support" },
    ],
  },
  water: {
    heading: "Find your perfect\nwater adventure - Book today!",
    resultText: "Water activities available",
    stats: [
      { value: "80+", label: "Activities" },
      { value: "4.9★", label: "Avg Rating" },
      { value: "₦120K", label: "Avg Price" },
      { value: "24/7", label: "Support" },
    ],
  },
  resort: {
    heading: "Your dream resort\nescape starts here",
    resultText: "Properties available",
    stats: [
      { value: "200+", label: "Properties" },
      { value: "4.6★", label: "Avg Rating" },
      { value: "₦74K", label: "Avg Price" },
      { value: "24/7", label: "Support" },
    ],
  },
  dining: {
    heading: "Exquisite dining\nexperiences await!",
    resultText: "Restaurants found",
    stats: [
      { value: "300+", label: "Restaurants" },
      { value: "4.8★", label: "Avg Rating" },
      { value: "₦26K", label: "Avg Price" },
      { value: "24/7", label: "Support" },
    ],
  },
};

// Enhanced booking input components with consistent 44px height and new color scheme
const BookingInputField = ({ icon: Icon, placeholder, type = "text", className = "" }) => (
  <div className="relative flex-1">
    <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 z-10" />
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full h-11 pl-12 pr-4 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/30 transition-all duration-200 font-medium ${className}`}
    />
  </div>
);

const SearchButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="h-11 px-6 rounded-xl font-semibold text-white hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 min-w-[120px]"
    style={{ backgroundColor: "#DF5D3D" }}
  >
    <Search className="w-4 h-4" />
    <span>Search</span>
  </button>
);

const CarRentalBookingInputs = ({ onSearch, isExpanded, onToggle }) => (
  <div className="bg-[#25303] rounded-2xl p-6 border border-gray-300 shadow-lg">
    <div className="flex items-center justify-between mb-4 lg:mb-0 lg:hidden">
      <h3 className="font-bold text-lg text-white">Car Rental Search</h3>
      <button
        onClick={onToggle}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
    </div>
    
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-3 ${isExpanded ? 'block' : 'hidden lg:grid'}`}>
      <BookingInputField icon={Navigation} placeholder="Pickup Location" />
      <BookingInputField icon={Calendar} type="date" />
      <BookingInputField icon={Clock} type="time" />
      <SearchButton onClick={() => onSearch({ service: "car" })} />
    </div>
  </div>
);

const DiningBookingInputs = ({ onSearch, isExpanded, onToggle }) => (
  <div className="bg-[#25303] rounded-2xl p-6 border border-gray-300 shadow-lg">
    <div className="flex items-center justify-between mb-4 lg:mb-0 lg:hidden">
      <h3 className="font-bold text-lg text-white">Dining Search</h3>
      <button
        onClick={onToggle}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
    </div>
    
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-3 ${isExpanded ? 'block' : 'hidden lg:grid'}`}>
      <BookingInputField icon={Utensils} placeholder="Restaurant or Cuisine" />
      <BookingInputField icon={Calendar} type="date" />
      <BookingInputField icon={Clock} type="time" />
      <SearchButton onClick={() => onSearch({ service: "dining" })} />
    </div>
  </div>
);

const ResortHouseBookingInputs = ({ onSearch, isExpanded, onToggle }) => (
  <div className="bg-[#25303] rounded-2xl p-6 border border-gray-300 shadow-lg">
    <div className="flex items-center justify-between mb-4 lg:mb-0 lg:hidden">
      <h3 className="font-bold text-lg text-white">Resort Search</h3>
      <button
        onClick={onToggle}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
    </div>
    
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-3 ${isExpanded ? 'block' : 'hidden lg:grid'}`}>
      <BookingInputField icon={MapPin} placeholder="Destination" />
      <BookingInputField icon={Calendar} type="date" placeholder="Check-in" />
      <BookingInputField icon={Calendar} type="date" placeholder="Check-out" />
      <SearchButton onClick={() => onSearch({ service: "resort" })} />
    </div>
  </div>
);

const WaterRecreationBookingInputs = ({ onSearch, isExpanded, onToggle }) => (
  <div className="bg-[#25303] rounded-2xl p-6 border border-gray-300 shadow-lg">
    <div className="flex items-center justify-between mb-4 lg:mb-0 lg:hidden">
      <h3 className="font-bold text-lg text-white">Water Activities</h3>
      <button
        onClick={onToggle}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
    </div>
    
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-3 ${isExpanded ? 'block' : 'hidden lg:grid'}`}>
      <BookingInputField icon={Sailboat} placeholder="Activity Type" />
      <BookingInputField icon={Calendar} type="date" />
      <BookingInputField icon={Clock} type="time" />
      <SearchButton onClick={() => onSearch({ service: "water" })} />
    </div>
  </div>
);

export default function ServiceResult() {
  const router = useRouter();
  const [activeService, setActiveService] = useState("car");
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState("recommended");
  const [favorites, setFavorites] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([10000, 400000]);
  const [isPriceExpanded, setIsPriceExpanded] = useState(true);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);
  const [isBookingExpanded, setIsBookingExpanded] = useState(false);
  const [filters, setFilters] = useState({
    freeCancellation: false,
    noPrepayment: false,
    highlyRated: false,
  });

  const services = [
    { id: "resort", label: "All stays", icon: Home },
    { id: "car", label: "Car rental", icon: Car },
    { id: "dining", label: "Dining", icon: Utensils },
    { id: "water", label: "Activities", icon: Sailboat },
  ];

  const content = serviceContent[activeService];

  // Fetch listings from API
  const fetchListings = async (
    service,
    searchParams = new URLSearchParams()
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Build API query params
      const apiParams = {
        serviceType: service,
        // Add search params from URL
        ...(searchParams.get('location') && { location: searchParams.get('location') }),
        ...(searchParams.get('minPrice') && { minPrice: priceRange[0] }),
        ...(searchParams.get('maxPrice') && { maxPrice: priceRange[1] }),
        ...(filters.highlyRated && { minRating: 4.0 }),
      };

      // Fetch real listings from API
      const response = await getListings(apiParams);
      console.log('Fetched listings:', response);

      // Handle different response formats
      let apiListings = [];
      if (Array.isArray(response)) {
        apiListings = response;
      } else if (response.data && Array.isArray(response.data)) {
        apiListings = response.data;
      } else if (response.listings && Array.isArray(response.listings)) {
        apiListings = response.listings;
      }

      // Transform API response to match component expectations
      const transformedListings = apiListings.map(listing => {
        // Handle images - can be array of strings or array of objects
        let imageUrl = 'https://via.placeholder.com/400x300';
        if (listing.images && listing.images.length > 0) {
          const firstImage = listing.images[0];
          if (typeof firstImage === 'string') {
            imageUrl = firstImage;
          } else if (typeof firstImage === 'object' && firstImage.secure_url) {
            imageUrl = firstImage.secure_url;
          } else if (typeof firstImage === 'object' && firstImage.url) {
            imageUrl = firstImage.url;
          }
        }

        // Handle location - can be object or JSON string
        let locationStr = '';
        if (typeof listing.location === 'string') {
          try {
            const locObj = JSON.parse(listing.location);
            locationStr = locObj.address || locObj.city || listing.location;
          } catch (e) {
            locationStr = listing.location;
          }
        } else if (typeof listing.location === 'object' && listing.location !== null) {
          locationStr = listing.location.address || listing.location.city || '';
        }

        return {
          id: listing.id || listing._id,
          name: listing.title || listing.name || 'Service',
          image: imageUrl,
          location: locationStr,
          price: listing.pricing?.basePrice || listing.basePrice || listing.price || 0,
          rating: listing.rating || 4.5,
          reviews: listing.reviewCount || listing.reviews || 0,
          features: listing.amenities || listing.features || listing.carFeatures || [],
          available: listing.isAvailable !== false,
          // Service-specific fields
          capacity: listing.capacity,
          roomType: listing.roomType,
          cuisine: listing.cuisine,
          // Keep original data for reference
          vendorId: listing.vendorId,
          businessId: listing.businessId,
        };
      });

      // Apply client-side price filter
      let filteredListings = transformedListings.filter(
        (listing) =>
          listing.price >= priceRange[0] && listing.price <= priceRange[1]
      );

      // Apply other filters
      if (filters.freeCancellation) {
        filteredListings = filteredListings.filter((listing) =>
          listing.features.some(
            (feature) =>
              feature.toLowerCase().includes("free cancellation") ||
              feature.toLowerCase().includes("cancellation")
          )
        );
      }

      if (filters.highlyRated) {
        filteredListings = filteredListings.filter(
          (listing) => listing.rating >= 4.0
        );
      }

      setListings(filteredListings);
    } catch (err) {
      console.error("Failed to load listings from API:", err);
      setError("Failed to load listings. Please try again.");
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize
  useEffect(() => {
    setIsClient(true);
    const params = new URLSearchParams(window.location.search);
    fetchListings(activeService, params);
  }, []);

  // Fetch when service changes
  useEffect(() => {
    if (isClient) {
      fetchListings(activeService);
      setIsBookingExpanded(false); // Collapse booking on service change for mobile
    }
  }, [activeService, isClient]);

  // Fetch when filters change
  useEffect(() => {
    if (isClient && !loading) {
      fetchListings(activeService);
    }
  }, [priceRange, filters, isClient]);

  const toggleFavorite = (id, e) => {
    if (e) e.stopPropagation();
    if (!isClient) return;

    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleCardClick = (listingId) => {
    if (!isClient) return;
    // Find the clicked listing (support id or _id)
    const clickedListing = listings.find(
      (listing) => listing.id === listingId || listing._id === listingId
    );

    if (clickedListing) {
      router.push(`/service/${activeService}/${listingId}`);
    }
  };

  const handleSearch = async (data) => {
    if (!isClient) return;
    await fetchListings(data.service || activeService);
  };

  const handleServiceChange = (serviceId) => {
    if (!isClient) return;
    setActiveService(serviceId);
  };

  const handleFilterChange = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);
  };

  const clearAllFilters = () => {
    setPriceRange([10000, 400000]);
    setFilters({
      freeCancellation: false,
      noPrepayment: false,
      highlyRated: false,
    });
  };

  // Filter counts
  const filterCounts = {
    freeCancellation: Math.floor(listings.length * 0.7),
    noPrepayment: Math.floor(listings.length * 0.8),
    highlyRated: Math.floor(listings.length * 0.6),
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  // Calculate slider progress for dynamic styling
  const sliderProgress = ((priceRange[1] - 10000) / 390000) * 100;

  const FilterContent = () => (
    <>
      {/* Header - Mobile Only */}
      <div className="lg:hidden flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" style={{ color: "#DF5D3D" }} />
          <h3 className="font-bold text-lg">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-[#DF5D3D] text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsFilterOpen(false)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" style={{ color: "#DF5D3D" }} />
          <h3 className="font-bold text-lg">Filter by</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-[#DF5D3D] text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-600 hover:text-[#DF5D3D] underline transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Price Range Section */}
      <div className="mb-6">
        <button
          onClick={() => setIsPriceExpanded(!isPriceExpanded)}
          className="w-full flex items-center justify-between mb-3 hover:opacity-70 transition-opacity"
        >
          <h4 className="font-semibold text-gray-900">
            Budget per {activeService === "dining" ? "person" : "night"}
          </h4>
          {isPriceExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {isPriceExpanded && (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100 shadow-sm">
              <div className="text-sm font-medium text-gray-700 mb-1">
                Selected Range
              </div>
              <div className="text-lg font-bold" style={{ color: "#DF5D3D" }}>
                ₦{(priceRange[0] / 1000).toFixed(0)}K – ₦
                {(priceRange[1] / 1000).toFixed(0)}K
                {priceRange[1] === 400000 ? "+" : ""}
              </div>
            </div>

            <div className="px-1">
              <input
                type="range"
                min="10000"
                max="400000"
                step="10000"
                value={priceRange[1]}
                onChange={(e) =>
                  handlePriceRangeChange([
                    priceRange[0],
                    parseInt(e.target.value),
                  ])
                }
                className="w-full h-2 rounded-lg appearance-none cursor-pointer custom-slider"
                style={{
                  background: `linear-gradient(to right, #DF5D3D 0%, #DF5D3D ${sliderProgress}%, #e5e7eb ${sliderProgress}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span className="font-medium">₦10K</span>
                <span className="font-medium">₦400K+</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* Search by Property Name */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-gray-900">Search by property name</h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="e.g. Marriott"
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 focus:border-[#E05D3D] focus:ring-2 focus:ring-[#E05D3D]/20 transition-all text-sm"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* Popular Filters Section */}
      <div className="mb-6">
        <button
          onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          className="w-full flex items-center justify-between mb-3 hover:opacity-70 transition-opacity"
        >
          <h4 className="font-semibold text-gray-900">Popular filters</h4>
          {isFiltersExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {isFiltersExpanded && (
          <div className="space-y-2">
            {[
              { key: "freeCancellation", label: "Free cancellation" },
              { key: "noPrepayment", label: "No prepayment" },
              { key: "highlyRated", label: "Highly rated: 4+" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={filters[key]}
                    onChange={() => handleFilterChange(key)}
                    className="w-5 h-5 rounded border-2 border-gray-300 text-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D] focus:ring-offset-0 cursor-pointer custom-checkbox transition-colors"
                  />
                </div>
                <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {label}
                </span>
                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-full min-w-[32px] text-center">
                  {filterCounts[key]}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* Quick Stats */}
      <div>
        <h4 className="font-semibold mb-4 text-gray-900">Quick Stats</h4>
        <div className="grid grid-cols-2 gap-3">
          {content.stats?.map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100 hover:shadow-md transition-shadow"
            >
              <div
                className="text-xl font-bold mb-1"
                style={{ color: "#DF5D3D" }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Apply Button */}
      <div className="lg:hidden mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={() => setIsFilterOpen(false)}
          className="w-full h-11 rounded-xl font-semibold text-white transition-all hover:shadow-lg transform hover:-translate-y-0.5"
          style={{ backgroundColor: "#DF5D3D" }}
        >
          Apply Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </button>
      </div>
    </>
  );

  const gridClass = isClient
    ? viewMode === "grid"
      ? "md:grid-cols-2 lg:grid-cols-2"
      : "grid-cols-1"
    : "grid-cols-1";

  const imageContainerClass =
    isClient && viewMode === "list" ? "md:w-80" : "w-full";
  const layoutClass = isClient && viewMode === "list" ? "md:flex" : "";

  const BookingInputs = {
    car: CarRentalBookingInputs,
    dining: DiningBookingInputs,
    resort: ResortHouseBookingInputs,
    water: WaterRecreationBookingInputs,
  };

  const CurrentBookingInput = BookingInputs[activeService];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add global styles for the slider and checkbox */}
      <style jsx global>{`
        .custom-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #DF5D3D;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(223, 93, 61, 0.3);
          transition: all 0.2s;
          border: 2px solid white;
        }

        .custom-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(223, 93, 61, 0.4);
        }

        .custom-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #DF5D3D;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(223, 93, 61, 0.3);
          transition: all 0.2s;
        }

        .custom-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(223, 93, 61, 0.4);
        }

        .custom-checkbox:checked {
          background-color: #DF5D3D;
          border-color: #DF5D3D;
        }

        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(0.5);
          cursor: pointer;
        }
      `}</style>

      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => handleServiceChange(service.id)}
                    className={`flex items-center gap-2 px-4 pb-3 text-sm font-medium transition-colors border-b-2 ${
                      activeService === service.id
                        ? "border-[#0071C2] text-[#0071C2]"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                    style={{}}
                  >
                    <Icon size={18} />
                    <span>{service.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <CurrentBookingInput 
            onSearch={handleSearch} 
            isExpanded={isBookingExpanded}
            onToggle={() => setIsBookingExpanded(!isBookingExpanded)}
          />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span
            className="hover:underline cursor-pointer transition-colors"
            style={{ color: "#DF5D3D" }}
          >
            Home
          </span>
          <span>›</span>
          <span
            className="hover:underline cursor-pointer transition-colors"
            style={{ color: "#DF5D3D" }}
          >
            Nigeria
          </span>
          <span>›</span>
          <span
            className="hover:underline cursor-pointer transition-colors"
            style={{ color: "#DF5D3D" }}
          >
            Lagos
          </span>
          <span>›</span>
          <span className="text-gray-800 font-medium">Search results</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-6 py-3 rounded-xl shadow-xl font-semibold text-white transition-all hover:shadow-2xl transform hover:-translate-y-0.5 active:scale-95"
            style={{ 
              backgroundColor: "#DF5D3D",
              boxShadow: "0 4px 12px rgba(223, 93, 61, 0.4)"
            }}
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-white text-[#DF5D3D] text-xs px-2 py-1 rounded-full font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Mobile Overlay */}
          {isFilterOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity backdrop-blur-sm"
              onClick={() => setIsFilterOpen(false)}
            />
          )}

          {/* Filter Panel */}
          <div className="lg:col-span-1">
            <div
              className={`
                lg:bg-white lg:rounded-2xl lg:shadow-lg lg:border lg:border-gray-100 lg:p-6 lg:sticky lg:top-4
                fixed lg:relative inset-y-0 right-0 z-50 w-full max-w-sm bg-white
                transform transition-transform duration-300 ease-in-out
                lg:transform-none lg:transition-none
                ${isFilterOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
                overflow-y-auto
                p-6
              `}
            >
              <FilterContent />
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  <span style={{ color: "#DF5D3D" }}>{listings.length}</span>{" "}
                  {content.resultText} in Lagos
                </h2>
                {isClient && (
                  <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-4 h-10 rounded-lg text-sm font-medium transition-all ${
                        viewMode === "list"
                          ? "bg-gray-800 text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      List
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-4 h-10 rounded-lg text-sm font-medium transition-all ${
                        viewMode === "grid"
                          ? "bg-gray-800 text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Grid
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-5 mb-6 shadow-sm">
                <p className="text-sm text-orange-800 font-medium">
                  Experience luxury and convenience with Synk Africa. Our
                  curated selection ensures quality service and memorable
                  experiences across all our offerings.
                </p>
              </div>

              {loading ? (
                <PageLoadingScreen message="Loading listings..." />
              ) : error ? (
                <div className="text-center py-12 text-red-500">
                  <p className="font-medium">{error}</p>
                  <button
                    onClick={() => fetchListings(activeService)}
                    className="mt-3 px-6 py-3 h-11 bg-[#DF5D3D] text-white rounded-xl hover:bg-[#c54a2a] transition-colors font-medium"
                  >
                    Try Again
                  </button>
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 font-medium">
                    No listings found matching your criteria.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-3 px-6 py-3 h-11 bg-[#DF5D3D] text-white rounded-xl hover:bg-[#c54a2a] transition-colors font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className={`grid gap-6 ${gridClass}`}>
                  {listings.map((listing) => {
                    const listingId = listing.id || listing._id;
                    return (
                      <div
                        key={listingId}
                        onClick={() => handleCardClick(listingId)}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer group"
                      >
                        <div className={layoutClass}>
                          <div
                            className={`relative ${imageContainerClass} h-64 bg-gray-100 overflow-hidden`}
                          >
                            <img
                              src={listing.image || '/images/vendor/vendor-profile.jpg'}
                              alt={listing.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {isClient && (
                              <button
                                onClick={(e) => toggleFavorite(listingId, e)}
                                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:scale-110 hover:bg-white transition-all z-10"
                              >
                                <Heart
                                  size={20}
                                  className={
                                    favorites.includes(listingId)
                                      ? "fill-red-500 text-red-500"
                                      : "text-gray-600"
                                  }
                                />
                              </button>
                            )}
                            {listing.available && (
                              <div className="absolute bottom-4 left-4 bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                                Available Now
                              </div>
                            )}
                          </div>

                          <div className="p-6 flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1 pr-4">
                                <h3 className="font-bold text-xl mb-2 text-gray-900 line-clamp-1 group-hover:text-[#DF5D3D] transition-colors">
                                  {listing.name}
                                </h3>
                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                  <MapPin
                                    size={16}
                                    className="text-gray-400 shrink-0"
                                  />
                                  <span className="line-clamp-1">
                                    {listing.location}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="flex items-center gap-1.5 mb-1 bg-green-700 px-3 py-1.5 rounded">
                                  <span className="font-bold text-white text-sm">
                                    {listing.rating.toFixed(1)}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 font-medium">
                                  {listing.reviews} reviews
                                </div>
                              </div>
                            </div>

                            {(listing.roomType ||
                              listing.capacity ||
                              listing.cuisine) && (
                              <div className="text-sm font-semibold text-gray-800 mb-4 bg-gray-50 inline-block px-3 py-2 rounded-lg border border-gray-200">
                                {listing.roomType ||
                                  listing.capacity ||
                                  listing.cuisine}
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2 mb-5">
                              {listing.features
                                ?.slice(0, 4)
                                .map((feature, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-medium border border-green-100 shadow-sm"
                                  >
                                    ✓ {feature}
                                  </span>
                                ))}
                            </div>

                            <div className="flex items-end justify-between pt-5 border-t border-gray-100">
                              <div>
                                <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                                  Starting from
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                  ₦{listing.price?.toLocaleString() || "0"}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  Includes taxes and fees
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCardClick(listingId);
                                }}
                                className="flex items-center gap-2 text-white font-semibold py-3 px-6 h-11 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group-hover:gap-3"
                                style={{ 
                                  backgroundColor: "#DF5D3D",
                                  boxShadow: "0 4px 12px rgba(223, 93, 61, 0.3)"
                                }}
                              >
                                <span>View Details</span>
                                <ArrowRight
                                  size={18}
                                  className="transition-transform group-hover:translate-x-0.5"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}