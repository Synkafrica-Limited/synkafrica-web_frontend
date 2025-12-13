"use client";

import React, { useState } from 'react';
import { Calendar, Clock, Users, MessageSquare, Plus, Minus } from 'lucide-react';

const DiningBookingForm = ({ onSubmit, serviceData }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: 2,
    occasion: '',
    dietaryRestrictions: '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState({});

  const occasions = [
    'Birthday',
    'Anniversary',
    'Business Meeting',
    'Romantic Dinner',
    'Family Gathering',
    'Other',
  ];

  const timeSlots = [
    '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM',
    '6:00 PM', '6:30 PM',
    '7:00 PM', '7:30 PM',
    '8:00 PM', '8:30 PM',
    '9:00 PM', '9:30 PM',
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Please select a future date';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Please select a time';
    }

    if (formData.guests < 1) {
      newErrors.guests = 'At least 1 guest is required';
    }

    if (formData.guests > 20) {
      newErrors.guests = 'Maximum 20 guests allowed. For larger parties, please contact us directly.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const adjustGuests = (delta) => {
    setFormData(prev => ({
      ...prev,
      guests: Math.max(1, Math.min(20, prev.guests + delta))
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reservation Date *
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="date"
            required
            value={formData.date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
      </div>

      {/* Time Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Time *
        </label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
          <select
            required
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none bg-white"
          >
            <option value="">Select a time</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>
        {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
      </div>

      {/* Number of Guests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Guests *
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => adjustGuests(-1)}
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
            onClick={() => adjustGuests(1)}
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-500 hover:text-primary-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {errors.guests && <p className="text-red-500 text-sm mt-1">{errors.guests}</p>}
      </div>

      {/* Occasion */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Occasion (Optional)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {occasions.map((occasion) => (
            <button
              key={occasion}
              type="button"
              onClick={() => setFormData({ ...formData, occasion })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                formData.occasion === occasion
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {occasion}
            </button>
          ))}
        </div>
      </div>

      {/* Dietary Restrictions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dietary Restrictions (Optional)
        </label>
        <input
          type="text"
          value={formData.dietaryRestrictions}
          onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
          placeholder="e.g., Vegetarian, Vegan, Gluten-free, Allergies"
          className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
        />
      </div>

      {/* Special Requests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests (Optional)
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <textarea
            value={formData.specialRequests}
            onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            rows={4}
            placeholder="Window seat, quiet area, high chair for baby, etc."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
          />
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

export default DiningBookingForm;
