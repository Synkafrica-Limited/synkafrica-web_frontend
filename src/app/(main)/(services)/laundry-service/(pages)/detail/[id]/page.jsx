"use client";

import { useState } from "react";
import { Star, Clock, Package, Shield, CheckCircle } from "lucide-react";

const ServiceDetailsPage = () => {
  const serviceData = {
    id: "spin-sparkle",
    name: "Spin & Sparkle",
    tagline: "Wash green, wear clean - sustainable laundry made simple",
    rating: 4.9,
    reviewCount: 10,
    location: "Lagos, Nigeria",
    price: 1000,
    currency: "₦",
    mainImage: "/api/placeholder/600/400",
    address: {
      street: "123 Clean Street",
      city: "Lagos",
      state: "Lagos State",
      country: "Nigeria",
      zipCode: "100001",
    },
    workingHours: {
      monday: { open: "9:00 AM", close: "6:00 PM" },
      tuesday: { open: "9:00 AM", close: "6:00 PM" },
      wednesday: { open: "9:00 AM", close: "6:00 PM" },
      thursday: { open: "9:00 AM", close: "6:00 PM" },
      friday: { open: "9:00 AM", close: "6:00 PM" },
      saturday: { open: "10:00 AM", close: "4:00 PM" },
      sunday: { open: "Closed", close: "" },
    },
    services: [
      {
        icon: "/api/placeholder/60/60",
        title: "Wash and Iron",
        description:
          "Lorem ipsum dolor sit amet consectetur. Varius a tempus ut odio. Sagittis in gravida pellentesque scelerisque ut ultrices magna risus fermentum.",
      },
      {
        icon: "/api/placeholder/60/60",
        title: "Wash and Fold",
        description:
          "Lorem ipsum dolor sit amet consectetur. Varius a tempus ut odio. Sagittis in gravida pellentesque scelerisque ut ultrices magna risus fermentum.",
      },
      {
        icon: "/api/placeholder/60/60",
        title: "Packaging",
        description:
          "Lorem ipsum dolor sit amet consectetur. Varius a tempus ut odio. Sagittis in gravida pellentesque scelerisque ut ultrices magna risus fermentum.",
      },
    ],
    portfolio: [
      "/api/placeholder/300/200",
      "/api/placeholder/300/200",
      "/api/placeholder/300/200",
      "/api/placeholder/300/200",
    ],
    reviews: [
      {
        id: 1,
        name: "Temi",
        location: "Lagos, Nigeria",
        rating: 5,
        timeAgo: "2 hours ago",
        comment:
          "Lorem ipsum dolor sit amet consectetur. Nulla sed volutpat nisl faucibus. Consectetur sodales nec libero vitae velit magna suspendisse sed.",
      },
      {
        id: 2,
        name: "Emma",
        location: "Lagos, Nigeria",
        rating: 5,
        timeAgo: "4 hours ago",
        comment:
          "Lorem ipsum dolor sit amet consectetur. Nulla sed volutpat nisl faucibus. Consectetur sodales nec libero vitae velit magna suspendisse sed.",
      },
      {
        id: 3,
        name: "Bola",
        location: "Lagos, Nigeria",
        rating: 4,
        timeAgo: "8 hours ago",
        comment:
          "Lorem ipsum dolor sit amet consectetur. Nulla sed volutpat nisl faucibus. Consectetur sodales nec libero vitae velit magna suspendisse sed.",
      },
      {
        id: 4,
        name: "Dami",
        location: "Lagos, Nigeria",
        rating: 5,
        timeAgo: "6 hours ago",
        comment:
          "Lorem ipsum dolor sit amet consectetur. Nulla sed volutpat nisl faucibus. Consectetur sodales nec libero vitae velit magna suspendisse sed.",
      },
    ],
  };

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const reserveHandler = (id) => {};

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Service Card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={serviceData.mainImage}
                    alt={serviceData.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20" />
                  <div className="absolute top-4 left-4 flex space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-white bg-opacity-20 rounded-full"
                      />
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {serviceData.name}
                  </h1>
                  <p className="text-gray-600 text-sm mb-4">
                    {serviceData.tagline}
                  </p>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {renderStars(Math.floor(serviceData.rating))}
                      <span className="ml-2 text-sm font-semibold text-gray-900">
                        {serviceData.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      • {serviceData.reviewCount} reviews •{" "}
                      {serviceData.location}
                    </span>
                  </div>
                  <div className="mb-6">
                    <span className="text-2xl font-bold text-gray-900">
                      From {serviceData.currency}
                      {serviceData.price}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">per item</span>
                  </div>
                  <button
                    onClick={() => reserveHandler(serviceData.id)}
                    className="w-full bg-primary-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Reserve
                  </button>
                </div>
              </div>

              {/* Address & Working Hours */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Location & Hours
                </h3>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {serviceData.address.street}
                    <br />
                    {serviceData.address.city}, {serviceData.address.state}
                    <br />
                    {serviceData.address.country} {serviceData.address.zipCode}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Working Hours
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(serviceData.workingHours).map(
                      ([day, hours]) => (
                        <div
                          key={day}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-600 capitalize">
                            {day}
                          </span>
                          <span
                            className={`font-medium ${
                              hours.open === "Closed"
                                ? "text-red-500"
                                : "text-gray-900"
                            }`}
                          >
                            {hours.open === "Closed"
                              ? "Closed"
                              : `${hours.open} - ${hours.close}`}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Our Services
              </h2>
              <div className="space-y-6">
                {serviceData.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                My Portfolio
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {serviceData.portfolio.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">
                    {serviceData.rating} • {serviceData.reviewCount} reviews
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {serviceData.reviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-xl bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {review.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {review.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {review.timeAgo}
                          </span>
                        </div>
                        <div className="flex items-center mb-2">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-gray-600 text-sm">
                          {review.location}
                        </p>
                        <p className="text-gray-700 text-sm mt-2 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Things to Know */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Things to Know
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Clock className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Booking policy
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Cancel at least 1 day before the pick-up date for a full
                      refund.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Order completion
                    </h3>
                    <p className="text-gray-600 text-sm">
                      An email will be sent to your registered email upon
                      booking completion.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Badge */}
            <div className="bg-primary-500 rounded-2xl p-8 text-center text-white">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Laundry companies on Syncafrica
              </h3>
              <h4 className="text-lg font-semibold mb-2">
                are vetted for quality
              </h4>
              <p className="text-white text-opacity-80 text-sm max-w-md mx-auto">
                Laundry companies are evaluated for their professional
                experience, portfolio of strong work, and reputation for
                excellence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
