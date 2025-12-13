"use client";

import React, { useState } from 'react';
import { Calendar, Users, Bed, Home, UtensilsCrossed, Plus, Minus } from 'lucide-react';

const ResortBookingForm = ({ onSubmit, serviceData }) => {
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    nights: 1,
    rooms: 1,
    guests: 2,
    roomType: 'standard',
    mealPlan: 'none',
    specialRequests: '',
  });

  const [errors, setErrors] = useState({});

  const roomTypes = [
    { value: 'standard', label: 'Standard Room', price: 0 },
    { value: 'deluxe', label: 'Deluxe Room', price: 15000 },
    { value: 'suite', label: 'Suite', price: 30000 },
    { value: 'villa', label: 'Private Villa', price: 75000 },
  ];

  const mealPlans = [
    { value: 'none', label: 'No Meals', price: 0 },
    { value: 'breakfast', label: 'Breakfast Only', price: 5000 },
    { value: 'half-board', label: 'Half Board (Breakfast & Dinner)', price: 12000 },
    { value: 'full-board', label: 'Full Board (All Meals)', price: 18000 },
    { value: 'all-inclusive', label: 'All Inclusive', price: 25000 },
  ];

  const calculateNights = () => {
    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setFormData(prev => ({ ...prev, nights: Math.max(1, diffDays) }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.checkInDate) {
      newErrors.checkInDate = 'Check-in date is required';
    }

    if (!formData.checkOutDate) {
      newErrors.checkOutDate = 'Check-out date is required';
    }

    if (formData.checkInDate && formData.checkOutDate) {
      const checkIn = new Date(formData.checkInDate);
      const checkOut = new Date(formData.checkOutDate);
      if (checkOut <= checkIn) {
        newErrors.checkOutDate = 'Check-out must be after check-in';
      }
    }

    if (formData.guests < 1) {
      newErrors.guests = 'At least 1 guest is required';
    }

    if (formData.rooms < 1) {
      newErrors.rooms = 'At least 1 room is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const selectedRoomType = roomTypes.find(rt => rt.value === formData.roomType);
      const selectedMealPlan = mealPlans.find(mp => mp.value === formData.mealPlan);
      
      onSubmit({
        ...formData,
        roomTypeDetails: selectedRoomType,
        mealPlanDetails: selectedMealPlan,
      });
    }
  };

  const adjustValue = (field, delta, min = 1, max = 10) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(min, Math.min(max, prev[field] + delta))
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Check-in Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Check-in Date *
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="date"
            required
            value={formData.checkInDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => {
              setFormData({ ...formData, checkInDate: e.target.value });
              setTimeout(calculateNights, 100);
            }}
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>
        {errors.checkInDate && <p className="text-red-500 text-sm mt-1">{errors.checkInDate}</p>}
      </div>

      {/* Check-out Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Check-out Date *
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="date"
            required
            value={formData.checkOutDate}
            min={formData.checkInDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => {
              setFormData({ ...formData, checkOutDate: e.target.value });
              setTimeout(calculateNights, 100);
            }}
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>
        {errors.checkOutDate && <p className="text-red-500 text-sm mt-1">{errors.checkOutDate}</p>}
      </div>

      {/* Nights Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Number of Nights</span>
          <span className="text-lg font-bold text-primary-500">
            {formData.nights} {formData.nights === 1 ? 'night' : 'nights'}
          </span>
        </div>
      </div>

      {/* Rooms and Guests */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rooms *
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => adjustValue('rooms', -1, 1, 5)}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-500 hover:text-primary-500 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex-1 relative">
              <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                min="1"
                max="5"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: parseInt(e.target.value) || 1 })}
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-center"
              />
            </div>
            <button
              type="button"
              onClick={() => adjustValue('rooms', 1, 1, 5)}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-500 hover:text-primary-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Guests *
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => adjustValue('guests', -1, 1, 20)}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-500 hover:text-primary-500 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="flex-1 relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                min="1"
                max="20"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) || 1 })}
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-center"
              />
            </div>
            <button
              type="button"
              onClick={() => adjustValue('guests', 1, 1, 20)}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-500 hover:text-primary-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Room Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Room Type *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {roomTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData({ ...formData, roomType: type.value })}
              className={`p-4 rounded-xl text-left transition-all border-2 ${
                formData.roomType === type.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Home className={`w-5 h-5 mb-2 ${formData.roomType === type.value ? 'text-primary-500' : 'text-gray-400'}`} />
              <div className="font-medium text-gray-900 text-sm">{type.label}</div>
              {type.price > 0 && (
                <div className="text-xs text-gray-600 mt-1">+₦{type.price.toLocaleString()}/night</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Meal Plan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meal Plan (Optional)
        </label>
        <div className="space-y-2">
          {mealPlans.map((plan) => (
            <label
              key={plan.value}
              className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                formData.mealPlan === plan.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="mealPlan"
                value={plan.value}
                checked={formData.mealPlan === plan.value}
                onChange={(e) => setFormData({ ...formData, mealPlan: e.target.value })}
                className="text-primary-500 focus:ring-primary-500"
              />
              <UtensilsCrossed className={`w-5 h-5 ${formData.mealPlan === plan.value ? 'text-primary-500' : 'text-gray-400'}`} />
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{plan.label}</div>
              </div>
              {plan.price > 0 && (
                <span className="text-sm font-semibold text-gray-700">
                  ₦{plan.price.toLocaleString()}/night
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests (Optional)
        </label>
        <textarea
          value={formData.specialRequests}
          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
          rows={4}
          placeholder="Early check-in, late check-out, room preferences, celebration setup, etc."
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
        />
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

export default ResortBookingForm;
