"use client";

import React, { useState } from 'react';
import { Calendar, MapPin, Users, Car, Shield, Navigation, Clock, Plus, Minus } from 'lucide-react';

const CarRentalBookingForm = ({ onSubmit, serviceData }) => {
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '09:00',
    dropoffDate: '',
    dropoffTime: '09:00',
    duration: 1,
    extras: {
      insurance: false,
      gps: false,
      childSeat: false,
      additionalDriver: false,
    },
  });

  const [errors, setErrors] = useState({});
  const [sameLoctation, setSameLocation] = useState(true);

  const timeSlots = [];
  for (let hour = 6; hour <= 22; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    timeSlots.push(time);
    if (hour < 22) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }

  const calculateDuration = () => {
    if (formData.pickupDate && formData.dropoffDate) {
      const pickup = new Date(formData.pickupDate);
      const dropoff = new Date(formData.dropoffDate);
      const diffTime = Math.abs(dropoff - pickup);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setFormData(prev => ({ ...prev, duration: Math.max(1, diffDays) }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pickupLocation) {
      newErrors.pickupLocation = 'Pickup location is required';
    }

    if (!sameLoctation && !formData.dropoffLocation) {
      newErrors.dropoffLocation = 'Drop-off location is required';
    }

    if (!formData.pickupDate) {
      newErrors.pickupDate = 'Pickup date is required';
    }

    if (!formData.dropoffDate) {
      newErrors.dropoffDate = 'Drop-off date is required';
    }

    if (formData.pickupDate && formData.dropoffDate) {
      const pickup = new Date(formData.pickupDate + ' ' + formData.pickupTime);
      const dropoff = new Date(formData.dropoffDate + ' ' + formData.dropoffTime);
      if (dropoff <= pickup) {
        newErrors.dropoffDate = 'Drop-off must be after pickup';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      dropoffLocation: sameLoctation ? formData.pickupLocation : formData.dropoffLocation,
    };
    if (validateForm()) {
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Pickup Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pickup Location *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            required
            value={formData.pickupLocation}
            onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
            placeholder="Enter pickup address or location"
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>
        {errors.pickupLocation && <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>}
      </div>

      {/* Same Location Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="sameLocation"
          checked={sameLoctation}
          onChange={(e) => setSameLocation(e.target.checked)}
          className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="sameLocation" className="text-sm text-gray-700">
          Return to same location
        </label>
      </div>

      {/* Drop-off Location */}
      {!sameLoctation && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Drop-off Location *
          </label>
          <div className="relative">
            <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              required={!sameLoctation}
              value={formData.dropoffLocation}
              onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
              placeholder="Enter drop-off address or location"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
          {errors.dropoffLocation && <p className="text-red-500 text-sm mt-1">{errors.dropoffLocation}</p>}
        </div>
      )}

      {/* Pickup Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              required
              value={formData.pickupDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setFormData({ ...formData, pickupDate: e.target.value });
                setTimeout(calculateDuration, 100);
              }}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
          {errors.pickupDate && <p className="text-red-500 text-sm mt-1">{errors.pickupDate}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Time *
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <select
              value={formData.pickupTime}
              onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none bg-white"
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Drop-off Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Drop-off Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              required
              value={formData.dropoffDate}
              min={formData.pickupDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setFormData({ ...formData, dropoffDate: e.target.value });
                setTimeout(calculateDuration, 100);
              }}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
          {errors.dropoffDate && <p className="text-red-500 text-sm mt-1">{errors.dropoffDate}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Drop-off Time *
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <select
              value={formData.dropoffTime}
              onChange={(e) => setFormData({ ...formData, dropoffTime: e.target.value })}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none bg-white"
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Duration Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Rental Duration</span>
          <span className="text-lg font-bold text-primary-500">
            {formData.duration} {formData.duration === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>

      {/* Extras */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Add-ons (Optional)
        </label>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-primary-500 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={formData.extras.insurance}
              onChange={(e) => setFormData({
                ...formData,
                extras: { ...formData.extras, insurance: e.target.checked }
              })}
              className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
            />
            <Shield className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <span className="font-medium text-gray-900">Full Insurance Coverage</span>
              <p className="text-xs text-gray-500">Comprehensive protection</p>
            </div>
            <span className="text-sm font-semibold text-gray-700">₦5,000/day</span>
          </label>

          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-primary-500 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={formData.extras.gps}
              onChange={(e) => setFormData({
                ...formData,
                extras: { ...formData.extras, gps: e.target.checked }
              })}
              className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
            />
            <Navigation className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <span className="font-medium text-gray-900">GPS Navigation</span>
              <p className="text-xs text-gray-500">Never get lost</p>
            </div>
            <span className="text-sm font-semibold text-gray-700">₦2,000/day</span>
          </label>

          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-primary-500 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={formData.extras.childSeat}
              onChange={(e) => setFormData({
                ...formData,
                extras: { ...formData.extras, childSeat: e.target.checked }
              })}
              className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
            />
            <Users className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <span className="font-medium text-gray-900">Child Seat</span>
              <p className="text-xs text-gray-500">Safety first</p>
            </div>
            <span className="text-sm font-semibold text-gray-700">₦1,500/day</span>
          </label>

          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-primary-500 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={formData.extras.additionalDriver}
              onChange={(e) => setFormData({
                ...formData,
                extras: { ...formData.extras, additionalDriver: e.target.checked }
              })}
              className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
            />
            <Users className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <span className="font-medium text-gray-900">Additional Driver</span>
              <p className="text-xs text-gray-500">Share the driving</p>
            </div>
            <span className="text-sm font-semibold text-gray-700">₦3,000/day</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full h-14 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        Continue to Checkout
      </button>
    </form>
  );
};

export default CarRentalBookingForm;
