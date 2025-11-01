"use client"

import React, { useState } from 'react';
import { Edit2, Calendar, Clock, Shield, Headphones, DollarSign, MapPin, ChevronLeft, ChevronRight, MessageCircle, Phone, Users, Utensils, Waves, Package, Shirt, Car } from 'lucide-react';

// Service type configurations with proper booking forms
const serviceConfigs = {
  laundry: {
    title: "Wash and Iron Service",
    icon: "🧺",
    image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&h=150&fit=crop",
    serviceForm: {
      title: "Service Details",
      fields: [
        { key: 'serviceType', label: 'Service Type', type: 'select', options: ['Wash Only', 'Wash & Iron', 'Dry Cleaning', 'Express Service'], required: true },
        { key: 'itemCount', label: 'Number of Items', type: 'number', min: 1, max: 50, required: true },
        { key: 'itemTypes', label: 'Item Types', type: 'checkbox', options: ['Shirts', 'Pants', 'Dresses', 'Bedding', 'Delicates', 'Heavy Items'], required: true },
        { key: 'pickupDate', label: 'Pickup Date', type: 'date', required: true },
        { key: 'pickupTime', label: 'Pickup Time', type: 'select', options: ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'], required: true },
        { key: 'deliveryDate', label: 'Preferred Delivery Date', type: 'date', required: true },
        { key: 'deliveryTime', label: 'Delivery Time', type: 'select', options: ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'], required: true },
        { key: 'specialInstructions', label: 'Special Instructions', type: 'textarea', placeholder: 'Any special care instructions, stains to note, etc.' }
      ]
    },
    paymentOptions: [
      { value: 'pay-now', label: 'Pay Now (10% discount)', price: 27, originalPrice: 30 },
      { value: 'pay-on-delivery', label: 'Pay on Delivery', price: 30 }
    ],
    cancellationText: "Free cancellation up to 2 hours before pickup"
  },
  beachResort: {
    title: "Beach Resort Booking",
    icon: "🏖️",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&h=150&fit=crop",
    serviceForm: {
      title: "Reservation Details",
      fields: [
        { key: 'checkinDate', label: 'Check-in Date', type: 'date', required: true },
        { key: 'checkoutDate', label: 'Check-out Date', type: 'date', required: true },
        { key: 'roomType', label: 'Room Type', type: 'select', options: ['Standard Ocean View', 'Deluxe Ocean View', 'Suite with Balcony', 'Presidential Suite'], required: true },
        { key: 'adults', label: 'Number of Adults', type: 'number', min: 1, max: 8, required: true },
        { key: 'children', label: 'Number of Children', type: 'number', min: 0, max: 6 },
        { key: 'childrenAges', label: 'Children Ages (if applicable)', type: 'text', placeholder: 'e.g., 5, 8, 12' },
        { key: 'mealPlan', label: 'Meal Plan', type: 'select', options: ['Room Only', 'Breakfast Included', 'Half Board', 'Full Board', 'All Inclusive'], required: true },
        { key: 'activities', label: 'Preferred Activities', type: 'checkbox', options: ['Spa Services', 'Water Sports', 'Beach Volleyball', 'Diving', 'Fishing', 'Gym Access'] },
        { key: 'specialRequests', label: 'Special Requests', type: 'textarea', placeholder: 'Anniversary celebration, accessibility needs, dietary restrictions, etc.' },
        { key: 'transportation', label: 'Airport Transportation', type: 'select', options: ['None', 'One Way Pickup', 'Round Trip'], required: true }
      ]
    },
    paymentOptions: [
      { value: 'full-payment', label: 'Pay Full Amount (5% discount)', price: 427.50, originalPrice: 450 },
      { value: 'deposit', label: 'Pay 30% Deposit', price: 135 }
    ],
    cancellationText: "Free cancellation up to 48 hours before check-in"
  },
  dining: {
    title: "Fine Dining Reservation",
    icon: "🍽️",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=150&fit=crop",
    serviceForm: {
      title: "Reservation Details",
      fields: [
        { key: 'reservationDate', label: 'Reservation Date', type: 'date', required: true },
        { key: 'reservationTime', label: 'Preferred Time', type: 'select', options: ['5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'], required: true },
        { key: 'partySize', label: 'Party Size', type: 'number', min: 1, max: 12, required: true },
        { key: 'occasion', label: 'Special Occasion', type: 'select', options: ['Regular Dining', 'Birthday', 'Anniversary', 'Business Dinner', 'Date Night', 'Celebration'] },
        { key: 'seatingPreference', label: 'Seating Preference', type: 'select', options: ['No Preference', 'Window Table', 'Quiet Corner', 'Chef\'s Table', 'Private Dining Room'], required: true },
        { key: 'menuType', label: 'Menu Preference', type: 'select', options: ['À la Carte', 'Chef\'s Tasting Menu', 'Prix Fixe Menu', 'Wine Pairing Menu'], required: true },
        { key: 'dietaryRestrictions', label: 'Dietary Restrictions', type: 'checkbox', options: ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Kosher', 'Halal', 'Nut Allergies', 'Seafood Allergies'] },
        { key: 'winePreference', label: 'Wine Preference', type: 'select', options: ['No Wine', 'Red Wine', 'White Wine', 'Rosé', 'Champagne', 'Sommelier\'s Choice'] },
        { key: 'specialRequests', label: 'Special Requests', type: 'textarea', placeholder: 'Cake for celebration, table decorations, accessibility needs, etc.' }
      ]
    },
    paymentOptions: [
      { value: 'prepay-menu', label: 'Pre-pay for Tasting Menu', price: 120 },
      { value: 'deposit-only', label: 'Reservation Deposit', price: 25 }
    ],
    cancellationText: "Free cancellation up to 4 hours before reservation"
  }
};

export default function BookingForm({ 
  serviceType = 'laundry',
  initialContactDetails,
  initialAddressDetails,
  companyName = 'Synkkafrica',
  onBookingComplete
}) {
  const config = serviceConfigs[serviceType];
  const [editingSection, setEditingSection] = useState(null);
  const [currentServiceType, setCurrentServiceType] = useState(serviceType);
  
  const [contactDetails, setContactDetails] = useState(initialContactDetails || {
    name: 'Temi Emma',
    email: 'emmaruelmobojishi@gmail.com',
    phone: '08065077856'
  });
  
  const [addressDetails, setAddressDetails] = useState(initialAddressDetails || {
    country: 'Nigeria',
    street: 'No 64, ile opo shinayi',
    city: 'Iyano-ipaja',
    province: 'Lagos',
    postal: '101439'
  });

  // Initialize service form data
  const [serviceFormData, setServiceFormData] = useState(() => {
    const initialData = {};
    config.serviceForm.fields.forEach(field => {
      if (field.type === 'checkbox') {
        initialData[field.key] = [];
      } else if (field.type === 'number') {
        initialData[field.key] = field.min || 1;
      } else {
        initialData[field.key] = '';
      }
    });
    return initialData;
  });

  const [paymentOption, setPaymentOption] = useState(config.paymentOptions[0].value);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  const handleEdit = (section) => {
    setEditingSection(section);
  };

  const handleSave = (section) => {
    setEditingSection(null);
  };

  const handleCancel = () => {
    setEditingSection(null);
  };

  const handleServiceFormChange = (key, value, isCheckbox = false) => {
    if (isCheckbox) {
      setServiceFormData(prev => ({
        ...prev,
        [key]: prev[key].includes(value) 
          ? prev[key].filter(item => item !== value)
          : [...prev[key], value]
      }));
    } else {
      setServiceFormData(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const handleServiceTypeChange = (newServiceType) => {
    setCurrentServiceType(newServiceType);
    // Reset form data for new service type
    const newConfig = serviceConfigs[newServiceType];
    const newFormData = {};
    newConfig.serviceForm.fields.forEach(field => {
      if (field.type === 'checkbox') {
        newFormData[field.key] = [];
      } else if (field.type === 'number') {
        newFormData[field.key] = field.min || 1;
      } else {
        newFormData[field.key] = '';
      }
    });
    setServiceFormData(newFormData);
    setPaymentOption(newConfig.paymentOptions[0].value);
  };

  const handleBookNow = () => {
    const selectedPaymentOption = config.paymentOptions.find(opt => opt.value === paymentOption);
    const bookingDetails = {
      serviceType: currentServiceType,
      contactDetails,
      addressDetails,
      serviceFormData,
      paymentOption,
      paymentMethod,
      totalPrice: selectedPaymentOption.price
    };
    
    if (onBookingComplete) {
      onBookingComplete(bookingDetails);
    } else {
      console.log('Booking completed:', bookingDetails);
      alert(`${config.title} booking completed! Total: $${selectedPaymentOption.price}`);
    }
  };

  const renderFormField = (field) => {
    const value = serviceFormData[field.key];
    
    switch (field.type) {
      case 'text':
      case 'date':
      case 'number':
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleServiceFormChange(field.key, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder={field.placeholder}
            required={field.required}
            min={field.min}
            max={field.max}
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleServiceFormChange(field.key, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleServiceFormChange(field.key, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder={field.placeholder}
            rows={3}
          />
        );
      
      case 'checkbox':
        return (
          <div className="grid grid-cols-2 gap-2">
            {field.options.map(option => (
              <label key={option} className="flex items-center space-x-2 p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={value.includes(option)}
                  onChange={() => handleServiceFormChange(field.key, option, true)}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  const selectedPaymentOption = config.paymentOptions.find(opt => opt.value === paymentOption);

  return (
    <div className="min-h-screen py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Service-Specific Form */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{config.serviceForm.title}</h2>
              <div className="space-y-4">
                {config.serviceForm.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {renderFormField(field)}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Contact details</h2>
                {editingSection !== 'contact' && (
                  <button 
                    onClick={() => handleEdit('contact')}
                    className="text-orange-500 border border-orange-500 px-3 py-1 rounded text-sm hover:bg-orange-50"
                  >
                    Edit
                  </button>
                )}
              </div>
              
              {editingSection === 'contact' ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={contactDetails.name}
                    onChange={(e) => setContactDetails({...contactDetails, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Full name"
                  />
                  <input
                    type="email"
                    value={contactDetails.email}
                    onChange={(e) => setContactDetails({...contactDetails, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Email address"
                  />
                  <input
                    type="tel"
                    value={contactDetails.phone}
                    onChange={(e) => setContactDetails({...contactDetails, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Phone number"
                  />
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleSave('contact')}
                      className="bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                    >
                      Save
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{contactDetails.name}</p>
                  <p className="text-gray-600">{contactDetails.email}</p>
                  <p className="text-gray-600">{contactDetails.phone}</p>
                </div>
              )}
            </div>

            {/* Address Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentServiceType === 'dining' ? 'Contact Address' : 'Service Address'}
                </h2>
                {editingSection !== 'address' && (
                  <button 
                    onClick={() => handleEdit('address')}
                    className="text-orange-500 border border-orange-500 px-3 py-1 rounded text-sm hover:bg-orange-50"
                  >
                    {addressDetails.street ? 'Edit' : 'Save'}
                  </button>
                )}
              </div>
              
              {editingSection === 'address' || !addressDetails.street ? (
                <div className="space-y-4">
                  <select 
                    value={addressDetails.country}
                    onChange={(e) => setAddressDetails({...addressDetails, country: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Kenya">Kenya</option>
                  </select>
                  <input
                    type="text"
                    value={addressDetails.street}
                    onChange={(e) => setAddressDetails({...addressDetails, street: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Street address"
                  />
                  <input
                    type="text"
                    value={addressDetails.city}
                    onChange={(e) => setAddressDetails({...addressDetails, city: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="City/town/village"
                  />
                  <input
                    type="text"
                    value={addressDetails.province}
                    onChange={(e) => setAddressDetails({...addressDetails, province: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Province/state"
                  />
                  <input
                    type="text"
                    value={addressDetails.postal}
                    onChange={(e) => setAddressDetails({...addressDetails, postal: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Postal code"
                  />
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleSave('address')}
                      className="bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white px-4 py-2 rounded-lg"
                    >
                      Save
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-600">Country: {addressDetails.country}</p>
                  <p className="text-gray-600">Street address: {addressDetails.street}</p>
                  <p className="text-gray-600">City/town/village: {addressDetails.city}</p>
                  <p className="text-gray-600">Province/state: {addressDetails.province}</p>
                  <p className="text-gray-600">Postal code: {addressDetails.postal}</p>
                </div>
              )}
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment details</h2>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Choose payment option</h3>
                <div className="space-y-3">
                  {config.paymentOptions.map((option) => (
                    <label key={option.value} className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="payment-option"
                          value={option.value}
                          checked={paymentOption === option.value}
                          onChange={(e) => setPaymentOption(e.target.value)}
                          className="mr-3"
                        />
                        <span className="font-medium">{option.label}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">${option.price}</span>
                        {option.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">${option.originalPrice}</div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Pay with</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment-method"
                        value="credit-card"
                        checked={paymentMethod === 'credit-card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <span>Credit/Debit Card</span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-5 bg-blue-600 rounded"></div>
                      <div className="w-8 h-5 bg-red-600 rounded"></div>
                    </div>
                  </label>
                  
                  <label className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment-method"
                        value="paystack"
                        checked={paymentMethod === 'paystack'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <span>Paystack</span>
                    </div>
                    <div className="w-8 h-5 bg-blue-500 rounded"></div>
                  </label>

                  <label className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment-method"
                        value="bank-transfer"
                        checked={paymentMethod === 'bank-transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <span>Bank Transfer</span>
                    </div>
                    <div className="w-8 h-5 bg-green-600 rounded"></div>
                  </label>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="text-center mb-4">
                  <p className="text-xl font-bold text-gray-900">Total price ${selectedPaymentOption?.price}</p>
                  <p className="text-sm text-gray-600 mt-1">{config.cancellationText}</p>
                </div>
                
                <p className="text-xs text-gray-500 mb-4">
                  By clicking "Book Now", you agree to {companyName} Terms & Privacy and cookies statement, plus 
                  operator's rules and regulations (see listing for more details).
                </p>
                
                <button 
                  onClick={handleBookNow}
                  className="w-full bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white py-3 rounded-lg font-medium"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-6">
            
            {/* Booking Summary Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking summary</h2>
              
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                  <span className="mr-2">{config.icon}</span>
                  {config.title}
                </h3>
                
                {/* Display key service details */}
                <div className="space-y-2 text-sm text-gray-600">
                  {Object.entries(serviceFormData).map(([key, value]) => {
                    const field = config.serviceForm.fields.find(f => f.key === key);
                    if (!field || !value || (Array.isArray(value) && value.length === 0)) return null;
                    
                    return (
                      <div key={key} className="flex justify-between">
                        <span>{field.label}:</span>
                        <span className="font-medium">
                          {Array.isArray(value) ? value.join(', ') : value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative mb-4">
                <img 
                  src={config.image} 
                  alt={config.title} 
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-xl">${selectedPaymentOption?.price}</span>
                </div>
              </div>
            </div>

            {/* Book with Confidence */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Book with confidence</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Lowest price guarantee</h4>
                    <p className="text-sm text-gray-600">Find it cheaper? We'll refund the difference</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Privacy protection</h4>
                    <p className="text-sm text-gray-600">We use SSL encryption to keep your data secure</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Headphones className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">24/7 global support</h4>
                    <p className="text-sm text-gray-600">Get the answers you need, when you need them</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50">
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat now</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50">
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="h-48 bg-green-100 rounded-lg relative mb-3">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-green-600" />
                </div>
                <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs">{addressDetails.country}</div>
              </div>
              <button className="text-orange-500 text-sm hover:underline flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                View map
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}