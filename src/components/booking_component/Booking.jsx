"use client"

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/ToastProvider';
import { Calendar, Clock, MapPin, Phone, Mail, User, Users, ChevronLeft, ChevronRight, MessageCircle, PhoneCall, Shield, DollarSign, Headphones } from 'lucide-react';

const BookingComponent = ({ serviceId, serviceType = 'resort' }) => {
  const [currentService, setCurrentService] = useState(serviceType);
  const [contactDetails, setContactDetails] = useState({
    name: 'Temi Emma',
    email: 'emmanueltmedolaji01@gmail.com',
    phone: '08065017856'
  });

  const [addressDetails, setAddressDetails] = useState({
    country: 'Nigeria',
    streetAddress: 'No 66, ile epo alhaji',
    cityTown: 'Village Igana Ipaja',
    provinceState: 'Lagos',
    postalCode: '101455'
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const toast = useToast();

  // Update current service when serviceType prop changes
  useEffect(() => {
    setCurrentService(serviceType);
  }, [serviceType]);

  const services = {
    laundry: {
      title: 'Wash and Iron',
      date: 'Aug 11',
      dropOffDate: 'Aug 14',
      pickUpTime: '01:00pm',
      dropOffTime: '01:00pm',
      total: '$10',
      images: [
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMwMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJsYXVuZHJ5R3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZGY0ZmY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZTVlN2ViO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTgwIiBmaWxsPSJ1cmwoI2xhdW5kcnlHcmFkaWVudCkiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSI5MCIgcj0iNDAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuOCIvPjx0ZXh0IHg9IjE1MCIgeT0iOTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2YjcyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiPkxhdW5kcnk8L3RleHQ+PC9zdmc+'
      ],
      trackingSteps: ['Picked up', 'In progress', 'Delivered']
    },
    resort: {
      title: serviceId ? `Resort Booking #${serviceId}` : 'Oniru private beach',
      date: 'Aug 11',
      guests: '2 adult, 1 child',
      total: '$50',
      images: [
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMwMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJiZWFjaEdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmVmM2M3O3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2ZkYjM0ZDtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgZmlsbD0idXJsKCNiZWFjaEdyYWRpZW50KSIvPjxjaXJjbGUgY3g9IjI1MCIgY3k9IjMwIiByPSIyMCIgZmlsbD0iI2ZiYjc0NiIgb3BhY2l0eT0iMC44Ii8+PGVsbGlwc2UgY3g9IjE1MCIgY3k9IjE0MCIgcng9IjgwIiByeT0iMjAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNiIvPjx0ZXh0IHg9IjE1MCIgeT0iOTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM3MjQ4MTMiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiPkJlYWNoIFJlc29ydDwvdGV4dD48L3N2Zz4=',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMwMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJwb29sR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNkZGY0ZmY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMzk4MWYzO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTgwIiBmaWxsPSJ1cmwoI3Bvb2xHcmFkaWVudCkiLz48ZWxsaXBzZSBjeD0iMTUwIiBjeT0iOTAiIHJ4PSI2MCIgcnk9IjMwIiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjciLz48dGV4dCB4PSIxNTAiIHk9Ijk1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMWU0MGFmIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIj5Qb29sPC90ZXh0Pjwvc3ZnPg=='
      ]
    },
    dining: {
      title: 'Soho Restaurant',
      date: 'Aug 11',
      time: '01:00pm',
      total: '$50',
      images: [
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMwMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJyZXN0YXVyYW50R3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZWY3ZmY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZTNlN2Y5O3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTgwIiBmaWxsPSJ1cmwoI3Jlc3RhdXJhbnRHcmFkaWVudCkiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSI2MCIgcj0iMTUiIGZpbGw9IiM4YjVjZjYiIG9wYWNpdHk9IjAuNiIvPjxyZWN0IHg9IjE4MCIgeT0iMTIwIiB3aWR0aD0iODAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjgiLz48dGV4dCB4PSIyMjAiIHk9IjE0NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzM3NDE1MSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCI+UGxhdGU8L3RleHQ+PHRleHQgeD0iMTUwIiB5PSI5NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzM3NDE1MSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCI+UmVzdGF1cmFudDwvdGV4dD48L3N2Zz4='
      ]
    }
  };

  const currentServiceData = services[currentService];

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === currentServiceData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? currentServiceData.images.length - 1 : prev - 1
    );
  };

  const handleContactChange = (field, value) => {
    setContactDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setAddressDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleProcess = () => {
    const bookingData = {
      serviceId,
      service: currentService,
      serviceDetails: currentServiceData,
      contact: contactDetails,
      address: addressDetails,
      timestamp: new Date().toISOString()
    };
    console.log('Processing booking:', bookingData);
    toast?.info?.(`Processing ${currentService} booking for ${contactDetails.name}${serviceId ? ` (Service ID: ${serviceId})` : ''}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Contact details</h2>
                <button className="text-orange-500 border border-orange-500 px-3 py-1 rounded-md text-sm hover:bg-orange-50">
                  Edit
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={contactDetails.name}
                    onChange={(e) => handleContactChange('name', e.target.value)}
                    className="text-gray-900 bg-transparent border-none outline-none flex-1"
                    placeholder="Full name"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={contactDetails.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className="text-gray-600 bg-transparent border-none outline-none flex-1"
                    placeholder="Email address"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={contactDetails.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    className="text-gray-600 bg-transparent border-none outline-none flex-1"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Add your address details</h2>
                <button className="text-orange-500 border border-orange-500 px-3 py-1 rounded-md text-sm hover:bg-orange-50">
                  Edit
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Country</label>
                  <input
                    type="text"
                    value={addressDetails.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    className="w-full text-gray-900 bg-transparent border-none outline-none"
                    placeholder="Country"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Street address</label>
                  <input
                    type="text"
                    value={addressDetails.streetAddress}
                    onChange={(e) => handleAddressChange('streetAddress', e.target.value)}
                    className="w-full text-gray-600 bg-transparent border-none outline-none"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">City/town/village</label>
                  <input
                    type="text"
                    value={addressDetails.cityTown}
                    onChange={(e) => handleAddressChange('cityTown', e.target.value)}
                    className="w-full text-gray-600 bg-transparent border-none outline-none"
                    placeholder="City/town/village"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Province/state</label>
                  <input
                    type="text"
                    value={addressDetails.provinceState}
                    onChange={(e) => handleAddressChange('provinceState', e.target.value)}
                    className="w-full text-gray-600 bg-transparent border-none outline-none"
                    placeholder="Province/state"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Postal code</label>
                  <input
                    type="text"
                    value={addressDetails.postalCode}
                    onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                    className="w-full text-gray-600 bg-transparent border-none outline-none"
                    placeholder="Postal code"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking summary</h3>
              {serviceId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Service ID:</span> {serviceId}
                  </p>
                </div>
              )}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">{currentServiceData.title}</h4>
                
                {/* Service Details */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {currentService === 'laundry' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Pick-up date: {currentServiceData.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Drop-off date: {currentServiceData.dropOffDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Pick-up time: {currentServiceData.pickUpTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Drop-off time: {currentServiceData.dropOffTime}</span>
                      </div>
                    </>
                  )}
                  
                  {currentService === 'resort' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Date: {currentServiceData.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{currentServiceData.guests}</span>
                      </div>
                    </>
                  )}
                  
                  {currentService === 'dining' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Date: {currentServiceData.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Time: {currentServiceData.time}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Image Carousel */}
              <div className="relative mb-4">
                <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={currentServiceData.images[currentImageIndex]}
                    alt={currentServiceData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {currentServiceData.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center text-lg font-semibold text-gray-900 pt-4 border-t border-gray-200">
                <span>Total</span>
                <span>{currentServiceData.total}</span>
              </div>
            </div>

            {/* Book with Confidence */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book with confidence</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Lowest price guarantee</h4>
                    <p className="text-sm text-gray-600">Find it cheaper? We'll refund the difference</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Privacy protection</h4>
                    <p className="text-sm text-gray-600">We use SSL encryption to keep your data secure</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Headphones className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">24/7 global support</h4>
                    <p className="text-sm text-gray-600">Get the answers you need, when you need them</p>
                  </div>
                </div>
              </div>
              
              {/* Contact Buttons */}
              <div className="flex space-x-3 mt-6">
                <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat now</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex-1">
                  <PhoneCall className="w-4 h-4" />
                  <span>Call</span>
                </button>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-full h-32 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <div className="flex items-center space-x-2 text-green-700">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">Nigeria</span>
                </div>
              </div>
              <button className="text-red-500 text-sm hover:underline">View map</button>

              {/* Tracking for Laundry */}
              {currentService === 'laundry' && (
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    {currentServiceData.trackingSteps.map((step, index) => (
                      <div key={step} className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${
                          index === 0 ? 'bg-orange-500' : 'bg-gray-300'
                        }`} />
                        <span className="text-xs text-gray-600 mt-1">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Process Button */}
            <button
              onClick={handleProcess}
              className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors"
            >
              Process {currentService.charAt(0).toUpperCase() + currentService.slice(1)} Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingComponent;