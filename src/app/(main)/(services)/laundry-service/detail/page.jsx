import React from 'react';
import { Star, Shield, Clock } from 'lucide-react';

export default function LaundryServiceLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left side - Image and main content */}
            <div className="space-y-6">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500&h=400&fit=crop" 
                  alt="Laundry service" 
                  className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
              
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Spin & Sparkle
                </h1>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  Watch your game while I wash—dependable laundry 
                  service to keep you fresh and ready.
                </p>
                <p className="text-xs text-gray-500 mb-6">
                  4 hr minimum • Starting at $20
                </p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto">
                  Book now
                </button>
              </div>
            </div>

            {/* Right side - Service options */}
            <div className="space-y-4">
              {/* Wash and Iron */}
              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="w-6 h-6 bg-purple-500 rounded"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Wash and Iron</h3>
                  <p className="text-sm text-gray-600">
                    Watch your game while I wash—dependable laundry service to keep you fresh and ready.
                  </p>
                </div>
              </div>

              {/* Wash and Fold */}
              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="w-6 h-6 bg-blue-500 rounded"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Wash and Fold</h3>
                  <p className="text-sm text-gray-600">
                    Watch your game while I wash—dependable laundry service to keep you fresh and ready.
                  </p>
                </div>
              </div>

              {/* Dry Cleaning */}
              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="w-6 h-6 bg-yellow-600 rounded"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Dry Cleaning</h3>
                  <p className="text-sm text-gray-600">
                    Watch your game while I wash—dependable laundry service to keep you fresh and ready.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My portfolio</h2>
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=300&h=300&fit=crop" 
              alt="Dress shirts" 
              className="w-full h-48 sm:h-64 object-cover rounded-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop" 
              alt="Suits" 
              className="w-full h-48 sm:h-64 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-lg font-semibold">4.90</span>
              <span className="ml-1 text-gray-600">• 10 reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Review 1 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Sara</p>
                  <p className="text-sm text-gray-600">United States</p>
                </div>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-sm text-gray-700">
                Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            {/* Review 2 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Emma</p>
                  <p className="text-sm text-gray-600">United States</p>
                </div>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-sm text-gray-700">
                Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            {/* Review 3 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Chris</p>
                  <p className="text-sm text-gray-600">United States</p>
                </div>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-sm text-gray-700">
                Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            {/* Review 4 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Sarah</p>
                  <p className="text-sm text-gray-600">United States</p>
                </div>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-sm text-gray-700">
                Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Things to Know Section */}
      <div className="bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Things to know</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-3">
                <Shield className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Cancellation policy</h3>
              </div>
              <p className="text-sm text-gray-600">
                Cancel up to 24 hours before your booking for a full refund
              </p>
            </div>

            <div>
              <div className="flex items-center mb-3">
                <Clock className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Booking conditions</h3>
              </div>
              <p className="text-sm text-gray-600">
                Minimum 4 hour booking. Additional charges may apply for express service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Badge Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Laundry companies on Syncafrica
          </h2>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            are vetted for quality
          </h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Laundry companies are screened for their experience in hospitality services, 
            ensuring quality work and dependable service.
          </p>
        </div>
      </div>
    </div>
  );
}