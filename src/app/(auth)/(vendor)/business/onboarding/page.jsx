// app/dashboard/vendor/page.jsx
"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Check, MapPin, Building2, Phone, Globe } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY_HERE';

// ----- Custom Hook -----
const useOnboarding = () => {
  const router = useRouter();

  const submitOnboarding = async (data) => {
    try {
      // Example: replace with your real API endpoint
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to submit onboarding');

      const result = await response.json();
      console.log('Onboarding submitted successfully:', result);

      // Redirect to dashboard after successful onboarding
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Something went wrong during onboarding. Please try again.');
    }
  };

  return { submitOnboarding };
};

// ----- Main Component -----
const OnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessType: '',
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    address: '',
    city: '',
    state: '',
    country: 'Nigeria',
    postalCode: '',
    description: '',
    website: '',
    latitude: null,
    longitude: null
  });

  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchBox, setSearchBox] = useState(null);

  const totalSteps = 4;
  const brandColor = '#DF5D3D';

  const { submitOnboarding } = useOnboarding();

  // Load Google Maps Script
  useEffect(() => {
    if (step === 3 && !mapLoaded) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    }
  }, [step, mapLoaded]);

  // Initialize Map
  useEffect(() => {
    if (mapLoaded && step === 3 && !map) {
      const mapInstance = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 6.5244, lng: 3.3792 }, // Lagos, Nigeria default
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });

      const markerInstance = new google.maps.Marker({
        map: mapInstance,
        draggable: true,
        position: { lat: 6.5244, lng: 3.3792 }
      });

      markerInstance.addListener('dragend', (e) => {
        updateFormData('latitude', e.latLng.lat());
        updateFormData('longitude', e.latLng.lng());
      });

      const input = document.getElementById('location-search');
      const searchBoxInstance = new google.maps.places.SearchBox(input);

      mapInstance.addListener('bounds_changed', () => {
        searchBoxInstance.setBounds(mapInstance.getBounds());
      });

      searchBoxInstance.addListener('places_changed', () => {
        const places = searchBoxInstance.getPlaces();
        if (places.length === 0) return;
        const place = places[0];
        if (!place.geometry || !place.geometry.location) return;

        mapInstance.setCenter(place.geometry.location);
        mapInstance.setZoom(15);
        markerInstance.setPosition(place.geometry.location);

        updateFormData('latitude', place.geometry.location.lat());
        updateFormData('longitude', place.geometry.location.lng());
      });

      setMap(mapInstance);
      setMarker(markerInstance);
      setSearchBox(searchBoxInstance);
    }
  }, [mapLoaded, step, map]);

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    submitOnboarding(formData);
  };

  const isStepValid = () => {
    switch(step) {
      case 1:
        return formData.businessType && formData.businessName;
      case 2:
        return formData.businessEmail && formData.businessPhone;
      case 3:
        return formData.latitude && formData.longitude && formData.address;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gray-100 h-2">
          <div 
            className="h-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%`, backgroundColor: brandColor }}
          />
        </div>

        <div className="p-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      s < step ? 'text-white' : s === step ? 'text-white' : 'bg-gray-200 text-gray-400'
                    }`}
                    style={s <= step ? { backgroundColor: brandColor } : {}}
                  >
                    {s < step ? <Check size={20} /> : s}
                  </div>
                  <span className="text-xs mt-2 text-gray-600">
                    {s === 1 ? 'Business' : s === 2 ? 'Contact' : s === 3 ? 'Location' : 'Details'}
                  </span>
                </div>
                {s < 4 && <div className="w-16 h-0.5 bg-gray-200 mx-2 mb-6" />}
              </React.Fragment>
            ))}
          </div>

          {/* Step Content */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Building2 size={48} style={{ color: brandColor }} className="mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Let's start with the basics</h2>
                <p className="text-gray-600 mt-2">Tell us about your business</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => updateFormData('businessType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="Car">Car Rental</option>
                  <option value="Resort">Resort</option>
                  <option value="Restaurant">Restaurant</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => updateFormData('businessName', e.target.value)}
                  placeholder="Enter your business name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Phone size={48} style={{ color: brandColor }} className="mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
                <p className="text-gray-600 mt-2">How can customers reach you?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                <input
                  type="email"
                  value={formData.businessEmail}
                  onChange={(e) => updateFormData('businessEmail', e.target.value)}
                  placeholder="info@yourbusiness.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Phone</label>
                <input
                  type="tel"
                  value={formData.businessPhone}
                  onChange={(e) => updateFormData('businessPhone', e.target.value)}
                  placeholder="+2348000000000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website (Optional)</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                  placeholder="https://yourbusiness.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <MapPin size={48} style={{ color: brandColor }} className="mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Where are you located?</h2>
                <p className="text-gray-600 mt-2">Search for your location or drag the marker</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Location</label>
                <input
                  id="location-search"
                  type="text"
                  placeholder="Search for your business location..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                />
              </div>

              <div id="map" className="w-full h-64 rounded-lg border border-gray-300" />

              {formData.latitude && formData.longitude && (
                <div className="bg-orange-50 p-4 rounded-lg text-sm">
                  <p className="text-gray-700">
                    <strong>Coordinates:</strong> {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    placeholder="Lagos"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => updateFormData('state', e.target.value)}
                    placeholder="Lagos State"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => updateFormData('country', e.target.value)}
                    placeholder="Nigeria"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => updateFormData('postalCode', e.target.value)}
                    placeholder="101001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Globe size={48} style={{ color: brandColor }} className="mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Almost done!</h2>
                <p className="text-gray-600 mt-2">Tell us more about your business</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Describe your business and what makes it special..."
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent resize-none"
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Review Your Information</h3>
                <div className="space-y-1 text-sm text-green-800">
                  <p><strong>Business:</strong> {formData.businessName}</p>
                  <p><strong>Type:</strong> {formData.businessType}</p>
                  <p><strong>Email:</strong> {formData.businessEmail}</p>
                  <p><strong>Phone:</strong> {formData.businessPhone}</p>
                  <p><strong>Location:</strong> {formData.city}, {formData.state}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} className="mr-2" /> Back
            </button>

            {step < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center px-6 py-3 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                style={{ backgroundColor: brandColor }}
              >
                Next <ChevronRight size={20} className="ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: brandColor }}
              >
                Complete Setup <Check size={20} className="ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
