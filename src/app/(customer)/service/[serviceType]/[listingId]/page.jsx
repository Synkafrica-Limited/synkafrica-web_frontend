"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Car,
  Sailboat,
  Home,
  Utensils,
  MapPin,
  Heart,
  Star,
  ArrowLeft,
  Share2,
  Calendar,
  Clock,
  Users,
  Shield,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  Navigation,
  Phone,
  MessageCircle,
} from "lucide-react";

// Mock data for each service type
const serviceDetailsData = {
  car: {
    id: 1,
    name: "Mercedes-Benz S-Class 2023",
    category: "Luxury Sedan",
    image: "https://images.unsplash.com/photo-1610099610040-ab19f3a5ec35?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1064",
    gallery: [
      "https://images.unsplash.com/photo-1610099610040-ab19f3a5ec35?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1064",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop"
    ],
    location: "Victoria Island, Lagos",
    price: 75000,
    rating: 4.8,
    reviews: 124,
    features: [
      "Professional Driver",
      "Air Conditioning",
      "Leather Seats",
      "WiFi",
      "GPS Navigation",
      "Premium Sound System",
      "Sunroof",
      "Bluetooth"
    ],
    specifications: {
      seats: "5",
      transmission: "Automatic",
      fuel: "Petrol",
      luggage: "3 bags",
      year: "2023"
    },
    host: {
      name: "Elite Car Rentals",
      rating: 4.9,
      joined: "2022",
      verified: true,
      responseRate: "98%",
      responseTime: "< 1 hour"
    },
    description: "Experience luxury and comfort with our Mercedes-Benz S-Class. Perfect for business meetings, special occasions, or exploring Lagos in style. Comes with a professional driver and premium amenities.",
    included: [
      "Professional driver",
      "Fuel",
      "Insurance",
      "Bottled water",
      "Phone chargers"
    ],
    requirements: [
      "Valid ID card",
      "Security deposit: ₦50,000",
      "Minimum age: 25 years"
    ]
  },
  water: {
    id: 1,
    name: "Luxury Yacht Charter",
    category: "Premium Yacht",
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503315082041-4c67bfc5c4f9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504307651154-4b4b0e3d8614?w=800&h=600&fit=crop"
    ],
    location: "Lagos Marina",
    price: 250000,
    rating: 5.0,
    reviews: 67,
    features: [
      "Captain Included",
      "Professional Crew",
      "Catering Available",
      "Premium Sound System",
      "Fishing Equipment",
      "Snorkeling Gear",
      "Sun Deck",
      "Air Conditioning"
    ],
    specifications: {
      capacity: "20 guests",
      length: "45 feet",
      cabins: "3",
      bathrooms: "2",
      crew: "3 members"
    },
    host: {
      name: "Marine Adventures NG",
      rating: 4.9,
      joined: "2021",
      verified: true,
      responseRate: "95%",
      responseTime: "< 2 hours"
    },
    description: "Enjoy a luxurious yacht experience along the beautiful Lagos coastline. Perfect for corporate events, birthday celebrations, or romantic getaways. Fully equipped with modern amenities and professional crew.",
    included: [
      "Professional captain",
      "Fuel",
      "Safety equipment",
      "Refreshments",
      "Fishing gear"
    ],
    requirements: [
      "Security deposit: ₦100,000",
      "Minimum booking: 4 hours",
      "Advance notice: 48 hours"
    ]
  },
  resort: {
    id: 1,
    name: "Beach View Luxury Villa",
    category: "4-Bedroom Villa",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
    ],
    location: "Lekki Phase 1, Lagos",
    price: 150000,
    rating: 4.9,
    reviews: 134,
    features: [
      "Private Pool",
      "Beach Access",
      "Chef Service",
      "24/7 Security",
      "Free WiFi",
      "Air Conditioning",
      "Smart TV",
      "BBQ Facilities"
    ],
    specifications: {
      bedrooms: "4",
      bathrooms: "4",
      guests: "8",
      checkIn: "3:00 PM",
      checkOut: "11:00 AM"
    },
    host: {
      name: "Premium Stays Lagos",
      rating: 4.8,
      joined: "2020",
      verified: true,
      responseRate: "99%",
      responseTime: "< 30 minutes"
    },
    description: "Stunning beachfront villa with panoramic ocean views. Features a private infinity pool, modern amenities, and direct beach access. Perfect for family vacations or group getaways.",
    included: [
      "Housekeeping",
      "Security",
      "Utilities",
      "Beach towels",
      "Kitchen essentials"
    ],
    requirements: [
      "Security deposit: ₦200,000",
      "Minimum stay: 2 nights",
      "ID verification required"
    ]
  },
  dining: {
    id: 1,
    name: "Ocean Breeze Restaurant",
    category: "Fine Dining",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop"
    ],
    location: "Victoria Island, Lagos",
    price: 25000,
    rating: 4.7,
    reviews: 289,
    features: [
      "Ocean View",
      "Live Music",
      "Premium Bar",
      "Private Dining",
      "Valet Parking",
      "Outdoor Seating",
      "Wine Cellar",
      "Chef's Table"
    ],
    specifications: {
      cuisine: "Continental & Seafood",
      dressCode: "Smart Casual",
      hours: "6:00 PM - 11:00 PM",
      capacity: "120 guests"
    },
    host: {
      name: "Ocean Breeze Group",
      rating: 4.7,
      joined: "2019",
      verified: true,
      responseRate: "96%",
      responseTime: "< 1 hour"
    },
    description: "Experience exquisite dining with breathtaking ocean views. Our award-winning chefs create culinary masterpieces using the freshest local ingredients. Perfect for romantic dinners and special celebrations.",
    included: [
      "Complimentary valet",
      "Welcome drink",
      "Bread service",
      "Professional service"
    ],
    requirements: [
      "Reservation required",
      "Smart casual attire",
      "Credit card guarantee"
    ]
  }
};

// Common Booking Component
const BookingWidget = ({ service, serviceType, onBook }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [duration, setDuration] = useState(1);

  const getBookingFields = () => {
    switch (serviceType) {
      case 'car':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter pickup location"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/20 transition-all duration-200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/20 transition-all duration-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/20 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rental Duration (Hours)</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/20 transition-all duration-200"
                >
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(hour => (
                    <option key={hour} value={hour}>{hour} hour{hour > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        );
      
      case 'water':
        return (
          <>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Activity Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/20 transition-all duration-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/20 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/20 transition-all duration-200"
                  >
                    {Array.from({length: 20}, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Hours)</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/20 transition-all duration-200"
                  >
                    {[2,3,4,5,6,7,8].map(hour => (
                      <option key={hour} value={hour}>{hour} hour{hour > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'resort':
        return (
          <>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/20 transition-all duration-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/20 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/20 transition-all duration-200"
                >
                  {Array.from({length: 8}, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        );
      
      case 'dining':
        return (
          <>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reservation Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/20 transition-all duration-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/20 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:border-[#DF5D3D] focus:ring-2 focus:ring-[#DF5D3D]/20 transition-all duration-200"
                >
                  {Array.from({length: 12}, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  const calculateTotal = () => {
    let basePrice = service.price;
    let multiplier = 1;
    
    switch (serviceType) {
      case 'car':
        multiplier = duration;
        break;
      case 'water':
        multiplier = duration;
        break;
      case 'resort':
        // For resort, we'd need check-in/check-out dates to calculate nights
        multiplier = 1; // Default to 1 night
        break;
      case 'dining':
        multiplier = guests;
        break;
      default:
        multiplier = 1;
    }
    
    return basePrice * multiplier;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-gray-900">₦{service.price?.toLocaleString()}</span>
          <span className="text-gray-500">
            {serviceType === 'dining' ? 'per person' : 
             serviceType === 'resort' ? 'per night' :
             serviceType === 'car' ? 'per hour' : 'per session'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{service.rating}</span>
          <span>({service.reviews} reviews)</span>
        </div>
      </div>

      <div className="space-y-6">
        {getBookingFields()}
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Total</span>
            <span className="text-2xl font-bold text-gray-900">₦{calculateTotal().toLocaleString()}</span>
          </div>
          
          <button
            onClick={() => onBook(service)}
            className="w-full h-12 bg-[#DF5D3D] text-white rounded-xl font-semibold hover:bg-[#c54a2a] transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          >
            Book Now
          </button>
          
          <p className="text-center text-xs text-gray-500 mt-3">
            No payment required until confirmation
          </p>
        </div>
      </div>
    </div>
  );
};

// Service-Specific Components
const CarDetails = ({ service }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Vehicle Specifications</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <div className="font-semibold text-gray-900">{service.specifications.seats} Seats</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 mx-auto mb-2 text-gray-600">⚙️</div>
              <div className="font-semibold text-gray-900">{service.specifications.transmission}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 mx-auto mb-2 text-gray-600">⛽</div>
              <div className="font-semibold text-gray-900">{service.specifications.fuel}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 mx-auto mb-2 text-gray-600">🧳</div>
              <div className="font-semibold text-gray-900">{service.specifications.luggage}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const WaterDetails = ({ service }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Boat Specifications</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <div className="font-semibold text-gray-900">{service.specifications.capacity}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 mx-auto mb-2 text-gray-600">📏</div>
              <div className="font-semibold text-gray-900">{service.specifications.length}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 mx-auto mb-2 text-gray-600">🚪</div>
              <div className="font-semibold text-gray-900">{service.specifications.cabins} Cabins</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 mx-auto mb-2 text-gray-600">👥</div>
              <div className="font-semibold text-gray-900">{service.specifications.crew}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ResortDetails = ({ service }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Property Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 mx-auto mb-2 text-gray-600">🛏️</div>
              <div className="font-semibold text-gray-900">{service.specifications.bedrooms} Bedrooms</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 mx-auto mb-2 text-gray-600">🚿</div>
              <div className="font-semibold text-gray-900">{service.specifications.bathrooms} Bathrooms</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <div className="font-semibold text-gray-900">{service.specifications.guests} Guests</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Clock className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <div className="font-semibold text-gray-900">{service.specifications.checkIn}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DiningDetails = ({ service }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Restaurant Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 mx-auto mb-2 text-gray-600">🍽️</div>
              <div className="font-semibold text-gray-900">{service.specifications.cuisine}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 mx-auto mb-2 text-gray-600">👔</div>
              <div className="font-semibold text-gray-900">{service.specifications.dressCode}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Clock className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <div className="font-semibold text-gray-900">{service.specifications.hours}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <div className="font-semibold text-gray-900">{service.specifications.capacity}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Image Gallery Component
const ImageGallery = ({ images, name }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
        <img
          src={images[selectedImage]}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative h-20 rounded-xl overflow-hidden transition-all ${
              selectedImage === index ? 'ring-2 ring-[#DF5D3D]' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={image}
              alt={`${name} ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// Main Service Detail Component
const ServiceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);

  const serviceType = params.serviceType; // car, water, resort, dining
  const serviceId = params.id;

  useEffect(() => {
    // Simulate API call
    const fetchServiceDetail = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const serviceData = serviceDetailsData[serviceType];
        setService(serviceData);
      } catch (error) {
        console.error('Error fetching service details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (serviceType && serviceDetailsData[serviceType]) {
      fetchServiceDetail();
    }
  }, [serviceType, serviceId]);

  const handleBook = (service) => {
    alert(`Booking ${service.name} - Coming soon!`);
  };

  const renderServiceDetails = () => {
    if (!service) return null;

    switch (serviceType) {
      case 'car':
        return <CarDetails service={service} />;
      case 'water':
        return <WaterDetails service={service} />;
      case 'resort':
        return <ResortDetails service={service} />;
      case 'dining':
        return <DiningDetails service={service} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#DF5D3D]"></div>
          <p className="mt-3 text-gray-600 font-medium">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
          <p className="text-gray-600 mb-4">The service you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#DF5D3D] text-white rounded-xl hover:bg-[#c54a2a] transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  }`}
                />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <span className="hover:text-[#DF5D3D] cursor-pointer">Home</span>
              <span>›</span>
              <span className="hover:text-[#DF5D3D] cursor-pointer capitalize">{serviceType}</span>
              <span>›</span>
              <span className="text-gray-900 font-medium">{service.name}</span>
            </div>

            {/* Service Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{service.rating}</span>
                  <span className="text-gray-500">({service.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{service.location}</span>
                </div>
              </div>
              <div className="inline-block bg-[#DF5D3D] text-white px-3 py-1 rounded-full text-sm font-medium">
                {service.category}
              </div>
            </div>

            {/* Image Gallery */}
            <div className="mb-8">
              <ImageGallery images={service.gallery} name={service.name} />
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {['overview', 'features', 'reviews', 'location'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-[#DF5D3D] text-[#DF5D3D]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4">About this {serviceType}</h3>
                    <p className="text-gray-700 leading-relaxed">{service.description}</p>
                  </div>
                  
                  {renderServiceDetails()}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h4 className="font-bold mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        What's Included
                      </h4>
                      <ul className="space-y-2">
                        {service.included.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-700">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h4 className="font-bold mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-500" />
                        Requirements
                      </h4>
                      <ul className="space-y-2">
                        {service.requirements.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-700">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold mb-6">Features & Amenities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>
                  <div className="text-center py-8">
                    <p className="text-gray-500">Reviews will be displayed here</p>
                  </div>
                </div>
              )}

              {activeTab === 'location' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold mb-4">Location</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{service.location}</span>
                  </div>
                  <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Map would be displayed here</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Widget Sidebar */}
          <div className="lg:col-span-1">
            <BookingWidget 
              service={service} 
              serviceType={serviceType}
              onBook={handleBook}
            />
            
            {/* Host Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-6">
              <h3 className="font-bold mb-4">Hosted by {service.host.name}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response rate</span>
                  <span className="font-semibold">{service.host.responseRate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response time</span>
                  <span className="font-semibold">{service.host.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Joined</span>
                  <span className="font-semibold">{service.host.joined}</span>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button className="flex-1 h-11 flex items-center justify-center gap-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Message
                </button>
                <button className="flex-1 h-11 flex items-center justify-center gap-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                  <Phone className="w-4 h-4" />
                  Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;