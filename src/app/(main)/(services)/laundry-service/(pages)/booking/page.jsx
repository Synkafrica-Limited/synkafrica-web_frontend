"use client"

import React, { useState } from 'react';
import { Edit2, Calendar, Clock, Shield, Headphones, DollarSign, MapPin, ChevronLeft, ChevronRight, MessageCircle, Phone } from 'lucide-react';

export default function LaundryBookingForm() {
  const [editingSection, setEditingSection] = useState(null);
  const [contactDetails, setContactDetails] = useState({
    name: 'Temi Emma',
    email: 'emmaruelmobojishi@gmail.com',
    phone: 'Phone: 08065077856'
  });
  
  const [addressDetails, setAddressDetails] = useState({
    country: 'Nigeria',
    street: 'No 64, ile opo shinayi',
    city: 'Iyano-ipaja',
    province: 'Lagos',
    postal: '101439'
  });

  const [paymentOption, setPaymentOption] = useState('book-now');
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

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            
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
                    type="text"
                    value={contactDetails.phone}
                    onChange={(e) => setContactDetails({...contactDetails, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Phone number"
                  />
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleSave('contact')}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
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
                <h2 className="text-lg font-semibold text-gray-900">Add your address details</h2>
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
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
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
                  <label className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment-option"
                        value="book-now"
                        checked={paymentOption === 'book-now'}
                        onChange={(e) => setPaymentOption(e.target.value)}
                        className="mr-3"
                      />
                      <span className="font-medium">Book Now</span>
                    </div>
                    <span className="font-semibold">$10</span>
                  </label>
                  
                  <label className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="payment-option"
                        value="reserve-later"
                        checked={paymentOption === 'reserve-later'}
                        onChange={(e) => setPaymentOption(e.target.value)}
                        className="mr-3"
                      />
                      <span className="font-medium">Reserve Now, Pay later</span>
                    </div>
                    <span className="font-semibold">$00</span>
                  </label>
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
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="text-center mb-4">
                  <p className="text-xl font-bold text-gray-900">Total price $10</p>
                  <p className="text-sm text-gray-600 mt-1">Free cancellation before 06:00pm on Aug 9th</p>
                </div>
                
                <p className="text-xs text-gray-500 mb-4">
                  By clicking "Book Now", you agree to syncafrica Terms & Privacy and cookies statement, plus 
                  operator's rules and regulations (see listing for more details).
                </p>
                
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium">
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
                <h3 className="font-medium text-gray-900 mb-2">Wash and Iron</h3>
                
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Pick up date: Aug 11</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Drop off date: Aug 14</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Pick up time: 01:00pm</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Drop off time: 01:00pm</span>
                </div>
              </div>

              <div className="relative mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&h=150&fit=crop" 
                  alt="Laundry service" 
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
                  <span className="font-bold text-xl">$10</span>
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
                <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs">Nigeria</div>
              </div>
              <button className="text-orange-500 text-sm hover:underline flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                View map
              </button>
            </div>

            {/* Status Progress */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">Picked up</span>
                </div>
                
                <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
                
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">In progress</span>
                </div>
                
                <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
                
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">Delivered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}