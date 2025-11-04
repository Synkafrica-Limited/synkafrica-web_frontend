"use client";

import { useState } from "react";
import { Calendar, MapPin, User, Clock, ChevronDown } from "lucide-react";

/**
 * @typedef {Object} BookingData
 * @property {string} pickupLocation
 * @property {string} dropoffLocation
 * @property {string} date
 * @property {string} pickupTime
 * @property {string} dropoffTime
 */

/**
 * @typedef {Object} CarRentalBookingProps
 * @property {(data: BookingData) => void} [onSearch]
 * @property {string} [className]
 */

export default function CarRentalBooking({
  onSearch,
  className = "",
}) {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [date, setDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const popularLocations = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Miami, FL",
    "San Francisco, CA",
  ];

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        pickupLocation,
        dropoffLocation,
        date,
        pickupTime,
        dropoffTime,
      });
    }
    console.log("Search:", {
      pickupLocation,
      dropoffLocation,
      date,
      pickupTime,
      dropoffTime,
    });
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Pick up */}
      <div className="relative flex-1">
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors cursor-pointer">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-700 mb-1">
                Pick up
              </div>
              <input
                type="text"
                placeholder="Select location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                onFocus={() => setShowPickupDropdown(true)}
                onBlur={() =>
                  setTimeout(() => setShowPickupDropdown(false), 200)
                }
                className="w-full text-gray-900 placeholder-gray-400 outline-none text-base"
              />
            </div>
          </div>
        </div>
        {showPickupDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-60 overflow-auto">
            {popularLocations.map((location) => (
              <div
                key={location}
                onClick={() => {
                  setPickupLocation(location);
                  setShowPickupDropdown(false);
                }}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{location}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drop-off */}
      <div className="relative flex-1">
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors cursor-pointer">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-700 mb-1">
                Drop-off
              </div>
              <input
                type="text"
                placeholder="Select location"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                onFocus={() => setShowDropoffDropdown(true)}
                onBlur={() =>
                  setTimeout(() => setShowDropoffDropdown(false), 200)
                }
                className="w-full text-gray-900 placeholder-gray-400 outline-none text-base"
              />
            </div>
          </div>
        </div>
        {showDropoffDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-60 overflow-auto">
            {popularLocations.map((location) => (
              <div
                key={location}
                onClick={() => {
                  setDropoffLocation(location);
                  setShowDropoffDropdown(false);
                }}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{location}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Date */}
      <div className="flex-1">
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors cursor-pointer">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-700 mb-1">Date</div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-gray-900 placeholder-gray-400 outline-none text-base cursor-pointer"
                placeholder="Select"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pick-up / Drop-off Times */}
      <div className="relative flex-1">
        <div
          className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors cursor-pointer"
          onClick={() => setShowTimeDropdown(!showTimeDropdown)}
        >
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-700 mb-1">
                Pick-up / Drop-off
              </div>
              <div className="text-gray-900 text-base">
                {pickupTime && dropoffTime
                  ? `${pickupTime} / ${dropoffTime}`
                  : "--:-- / --:--"}
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
          </div>
        </div>
        {showTimeDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pick-up time
                </label>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Drop-off time
                </label>
                <input
                  type="time"
                  value={dropoffTime}
                  onChange={(e) => setDropoffTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-orange-500"
                />
              </div>
              <button
                onClick={() => setShowTimeDropdown(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
      >
        Search
        <span className="text-xl">→</span>
      </button>
    </div>
  );
}
