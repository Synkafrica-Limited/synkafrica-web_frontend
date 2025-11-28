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
  Navigation,
  Building,
  Crown,
  Sparkles,
  BadgeCheck,
  TrendingUp,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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

// Order Context
const OrderContext = React.createContext();

const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null);

  const createOrder = (orderData) => {
    const order = {
      ...orderData,
      orderId: `TEMP-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    setCurrentOrder(order);
    return order;
  };

  const clearOrder = () => {
    setCurrentOrder(null);
  };

  return (
    <OrderContext.Provider value={{ currentOrder, createOrder, clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

const useOrder = () => {
  const context = React.useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

// Modern Booking Widget
const BookingWidget = ({ service, serviceType }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [duration, setDuration] = useState(1);
  const [pickupLocation, setPickupLocation] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createOrder } = useOrder();
  const router = useRouter();

  const getBookingFields = () => {
    return (
      <div className="space-y-4">
        {serviceType === 'car' && (
          <div className="group">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Pickup Location</label>
            <div className="relative">
              <Navigation className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#DF5D3D] transition-colors" />
              <input
                type="text"
                placeholder="Enter pickup location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-gray-200 focus:border-[#DF5D3D] focus:ring-4 focus:ring-[#DF5D3D]/10 transition-all duration-200 text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="group">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {serviceType === 'resort' ? 'Check-in' : 'Date'}
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#DF5D3D] transition-colors" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-gray-200 focus:border-[#DF5D3D] focus:ring-4 focus:ring-[#DF5D3D]/10 transition-all duration-200 text-gray-900"
              />
            </div>
          </div>
          <div className="group">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Time</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#DF5D3D] transition-colors" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-gray-200 focus:border-[#DF5D3D] focus:ring-4 focus:ring-[#DF5D3D]/10 transition-all duration-200 text-gray-900"
              />
            </div>
          </div>
        </div>

        {(serviceType === 'water' || serviceType === 'dining' || serviceType === 'resort') && (
          <div className="group">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Guests</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#DF5D3D] transition-colors" />
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-gray-200 focus:border-[#DF5D3D] focus:ring-4 focus:ring-[#DF5D3D]/10 transition-all duration-200 text-gray-900 appearance-none bg-white cursor-pointer"
              >
                {Array.from({length: serviceType === 'resort' ? 8 : serviceType === 'dining' ? 12 : 20}, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {(serviceType === 'car' || serviceType === 'water') && (
          <div className="group">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Duration</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#DF5D3D] transition-colors" />
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-gray-200 focus:border-[#DF5D3D] focus:ring-4 focus:ring-[#DF5D3D]/10 transition-all duration-200 text-gray-900 appearance-none bg-white cursor-pointer"
              >
                {(serviceType === 'car' ? [1,2,3,4,5,6,7,8,9,10,11,12] : [2,3,4,5,6,7,8]).map(hour => (
                  <option key={hour} value={hour}>{hour} hour{hour > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="group">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Special Requests <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Any preferences or special requirements..."
            rows={4}
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#DF5D3D] focus:ring-4 focus:ring-[#DF5D3D]/10 transition-all duration-200 resize-none text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>
    );
  };

  const calculateTotal = () => {
    let basePrice = service.price;
    let multiplier = 1;
    
    switch (serviceType) {
      case 'car':
      case 'water':
        multiplier = duration;
        break;
      case 'dining':
        multiplier = guests;
        break;
      default:
        multiplier = 1;
    }
    
    return basePrice * multiplier;
  };

  const isFormValid = () => {
    if (serviceType === 'car') {
      return date && time && duration > 0 && pickupLocation.trim();
    }
    return date && time;
  };

  const handleBookNow = () => {
    if (!isFormValid()) return;
    setIsLoading(true);
    
    setTimeout(() => {
      const orderData = {
        serviceId: service.id,
        serviceType: serviceType,
        serviceName: service.name,
        date, time, guests, duration, pickupLocation, specialRequests,
        pricing: { totalAmount: calculateTotal() * 1.175 }
      };
      
      const order = createOrder(orderData);
      router.push(`/checkout?orderId=${order.orderId}`);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sticky top-6 backdrop-blur-sm bg-white/95">
      <div className="mb-8">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-4xl font-bold bg-gradient-to-r from-[#DF5D3D] to-[#e67a5f] bg-clip-text text-transparent">
            ₦{service.price?.toLocaleString()}
          </span>
          <span className="text-gray-500 font-medium">
            / {serviceType === 'dining' ? 'person' : serviceType === 'resort' ? 'night' : 'hour'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-full">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span className="font-bold text-gray-900">{service.rating}</span>
            <span className="text-gray-600 text-sm">({service.reviews})</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full">
            <BadgeCheck className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-gray-900">Verified</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {getBookingFields()}
        
        <div className="space-y-4 pt-6 border-t-2 border-gray-100">
          <div className="flex justify-between items-center text-gray-600">
            <span className="font-medium">Subtotal</span>
            <span className="text-xl font-bold text-gray-900">₦{calculateTotal().toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Service fee & tax</span>
            <span className="font-semibold text-gray-700">₦{(calculateTotal() * 0.175).toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-3xl font-bold bg-gradient-to-r from-[#DF5D3D] to-[#e67a5f] bg-clip-text text-transparent">
              ₦{(calculateTotal() * 1.175).toLocaleString()}
            </span>
          </div>
          
          <button
            onClick={handleBookNow}
            disabled={!isFormValid() || isLoading}
            className={`group relative w-full h-14 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl overflow-hidden ${
              isFormValid() && !isLoading
                ? 'bg-gradient-to-r from-[#DF5D3D] to-[#e67a5f] text-white hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  Book Now
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </span>
            {isFormValid() && !isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#c54a2a] to-[#d16a4e] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>
          
          <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" />
            Secure payment • No hidden fees
          </p>
        </div>
      </div>
    </div>
  );
};

// Image Gallery
const ImageGallery = ({ images, name }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 group">
        <img
          src={images[selectedImage]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative h-24 rounded-2xl overflow-hidden transition-all duration-300 ${
              selectedImage === index 
                ? 'ring-4 ring-[#DF5D3D] ring-offset-2 scale-105 shadow-xl' 
                : 'opacity-60 hover:opacity-100 hover:scale-105 hover:shadow-lg'
            }`}
          >
            <img src={image} alt={`${name} ${index + 1}`} className="w-full h-full object-cover" />
            {selectedImage === index && (
              <div className="absolute inset-0 bg-gradient-to-t from-[#DF5D3D]/20 to-transparent"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// Specification Card Component
const SpecCard = ({ icon, label, value }) => (
  <div className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-[#DF5D3D] hover:shadow-lg transition-all duration-300 text-center">
    <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <div className="font-bold text-gray-900 text-lg mb-1">{value}</div>
    <div className="text-sm text-gray-500 font-medium">{label}</div>
  </div>
);

// Main Service Detail Component
const ServiceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);

  const serviceType = params.serviceType || 'car';

  useEffect(() => {
    const fetchServiceDetail = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setService(serviceDetailsData[serviceType]);
      setLoading(false);
    };

    if (serviceDetailsData[serviceType]) {
      fetchServiceDetail();
    }
  }, [serviceType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#DF5D3D]"></div>
          <p className="mt-4 text-gray-600 font-semibold text-lg">Loading luxury experience...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">😕</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Service Not Found</h2>
          <p className="text-gray-600 mb-6">The luxury experience you're seeking doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="px-8 py-4 bg-gradient-to-r from-[#DF5D3D] to-[#e67a5f] text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-all duration-200 font-semibold group"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="hidden sm:block">Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#DF5D3D] to-[#e67a5f] rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-xl hidden sm:block">LuxeBook</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-10 h-10 hover:bg-gray-100 rounded-xl transition-all duration-200 flex items-center justify-center group"
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-300 ${
                    isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400 group-hover:text-red-500 group-hover:scale-110'
                  }`}
                />
              </button>
              <button className="w-10 h-10 hover:bg-gray-100 rounded-xl transition-all duration-200 flex items-center justify-center group">
                <Share2 className="w-5 h-5 text-gray-400 group-hover:text-[#DF5D3D] transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 hover:text-[#DF5D3D] cursor-pointer transition-colors font-medium">Home</span>
              <span className="text-gray-300">›</span>
              <span className="text-gray-500 hover:text-[#DF5D3D] cursor-pointer transition-colors font-medium capitalize">{serviceType}</span>
              <span className="text-gray-300">›</span>
              <span className="text-gray-900 font-semibold">{service.name}</span>
            </div>

            {/* Service Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">{service.name}</h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-full">
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      <span className="font-bold text-gray-900">{service.rating}</span>
                      <span className="text-gray-600">({service.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                      <MapPin className="w-5 h-5 text-[#DF5D3D]" />
                      <span>{service.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#DF5D3D] to-[#e67a5f] text-white px-5 py-2.5 rounded-full font-bold shadow-lg">
                <Sparkles className="w-4 h-4" />
                {service.category}
              </div>
            </div>

            {/* Image Gallery */}
            <ImageGallery images={service.gallery} name={service.name} />

            {/* Modern Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
              <nav className="flex gap-2">
                {['overview', 'features', 'reviews', 'location'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm capitalize transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-[#DF5D3D] to-[#e67a5f] text-white shadow-lg scale-105'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#DF5D3D] to-[#e67a5f] rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">About this Experience</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">{service.description}</p>
                  </div>
                  
                  {/* Specifications */}
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                      <TrendingUp className="w-7 h-7 text-[#DF5D3D]" />
                      Specifications
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {serviceType === 'car' && (
                        <>
                          <SpecCard icon="🪑" label="Seats" value={service.specifications.seats} />
                          <SpecCard icon="⚙️" label="Transmission" value={service.specifications.transmission} />
                          <SpecCard icon="⛽" label="Fuel Type" value={service.specifications.fuel} />
                          <SpecCard icon="🧳" label="Luggage" value={service.specifications.luggage} />
                        </>
                      )}
                      {serviceType === 'water' && (
                        <>
                          <SpecCard icon="👥" label="Capacity" value={service.specifications.capacity} />
                          <SpecCard icon="📏" label="Length" value={service.specifications.length} />
                          <SpecCard icon="🚪" label="Cabins" value={service.specifications.cabins} />
                          <SpecCard icon="⚓" label="Crew" value={service.specifications.crew} />
                        </>
                      )}
                      {serviceType === 'resort' && (
                        <>
                          <SpecCard icon="🛏️" label="Bedrooms" value={service.specifications.bedrooms} />
                          <SpecCard icon="🚿" label="Bathrooms" value={service.specifications.bathrooms} />
                          <SpecCard icon="👥" label="Max Guests" value={service.specifications.guests} />
                          <SpecCard icon="🕐" label="Check-in" value={service.specifications.checkIn} />
                        </>
                      )}
                      {serviceType === 'dining' && (
                        <>
                          <SpecCard icon="🍽️" label="Cuisine" value={service.specifications.cuisine} />
                          <SpecCard icon="👔" label="Dress Code" value={service.specifications.dressCode} />
                          <SpecCard icon="🕐" label="Hours" value={service.specifications.hours} />
                          <SpecCard icon="👥" label="Capacity" value={service.specifications.capacity} />
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-100">
                      <h4 className="font-bold mb-6 flex items-center gap-3 text-gray-900 text-xl">
                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        What's Included
                      </h4>
                      <ul className="space-y-3">
                        {service.included.map((item, index) => (
                          <li key={index} className="flex items-start gap-3 text-gray-700 font-medium">
                            <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-100">
                      <h4 className="font-bold mb-6 flex items-center gap-3 text-gray-900 text-xl">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        Requirements
                      </h4>
                      <ul className="space-y-3">
                        {service.requirements.map((item, index) => (
                          <li key={index} className="flex items-start gap-3 text-gray-700 font-medium">
                            <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Shield className="w-4 h-4 text-white" />
                            </div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Premium Features & Amenities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 rounded-2xl transition-all duration-300 group border-2 border-transparent hover:border-[#DF5D3D]/20">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#DF5D3D] to-[#e67a5f] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-gray-700 font-semibold text-lg">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-10 h-10 fill-yellow-500 text-yellow-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-500 text-lg mb-4">Be the first to share your experience</p>
                    <button className="px-6 py-3 bg-gradient-to-r from-[#DF5D3D] to-[#e67a5f] text-white rounded-2xl font-bold hover:shadow-lg transition-all duration-300">
                      Write a Review
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'location' && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Location</h3>
                  <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border-2 border-[#DF5D3D]/20">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#DF5D3D] to-[#e67a5f] rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-gray-700 font-bold text-lg">{service.location}</span>
                  </div>
                  <div className="h-80 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 font-bold text-xl">Interactive Map</p>
                      <p className="text-gray-400 mt-2">{service.location}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Widget Sidebar */}
          <div className="lg:col-span-1">
            <BookingWidget service={service} serviceType={serviceType} />
            
            {/* Host Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-100 p-8 mt-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#DF5D3D] to-[#e67a5f] rounded-2xl flex items-center justify-center shadow-lg">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{service.host.name}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold text-gray-900">{service.host.rating}</span>
                    <BadgeCheck className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600 font-medium">Verified</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 px-4 bg-white rounded-xl border border-gray-100">
                  <span className="text-gray-600 font-medium">Member since</span>
                  <span className="font-bold text-gray-900">{service.host.joined}</span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-2 border-[#DF5D3D]/20">
                  <span className="text-gray-600 font-medium">Platform</span>
                  <span className="font-bold bg-gradient-to-r from-[#DF5D3D] to-[#e67a5f] bg-clip-text text-transparent">LuxeBook</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export with Provider
const ServiceDetailPageWithProvider = () => (
  <OrderProvider>
    <ServiceDetailPage />
  </OrderProvider>
);

export default ServiceDetailPageWithProvider;