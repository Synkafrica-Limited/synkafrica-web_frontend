"use client";

import { useState } from "react";
import { Users, Settings, Fuel, Clock, Star, MapPin } from "lucide-react";

const fallbackCar = {
  id: "default-id",
  name: "Tesla Model X",
  image:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=500&fit=crop",
  package: "Luxury",
  rating: 4.9,
  price: 90000,
  originalPrice: 120000,
  capacity: 5,
  transmission: "Automatic",
  pickupLocation: "Lekki, Lagos",
  dropoffLocation: "Ikeja, Lagos",
  type: "SUV",
};

const CarDetailsPage = ({ car = fallbackCar, onBack }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [rentalDays, setRentalDays] = useState(1);

  const additionalImages = [
    car.image,
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
          onClick={onBack || (() => history.back())}
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
          {/* Car Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
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

            {/* Info */}
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

              {/* Features */}
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

              {/* Pickup & Dropoff */}
              <div className="border-t border-gray-200 pt-6">
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

          {/* Booking Form */}
          <div className="space-y-6">
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

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select time</option>
                    {[
                      "09:00",
                      "10:00",
                      "11:00",
                      "12:00",
                      "13:00",
                      "14:00",
                      "15:00",
                      "16:00",
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t.slice(0, 2)}:{t.slice(3)}{" "}
                        {parseInt(t) < 12 ? "AM" : "PM"}
                      </option>
                    ))}
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Daily rate × {rentalDays} days</span>
                    <span>₦{(car.price * rentalDays).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Insurance & fees</span>
                    <span>₦5,000</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>
                      ₦{(car.price * rentalDays + 5000).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white py-4 rounded-xl font-semibold transition-transform hover:scale-105 shadow-lg">
                  Book Now - ₦{(car.price * rentalDays + 5000).toLocaleString()}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Free cancellation up to 24 hours before pickup
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
