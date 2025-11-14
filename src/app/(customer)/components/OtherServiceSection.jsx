import React from "react";

const OtherServices = () => {
  const upcomingServices = [
    "Spa & Wellness",
    "Event Planning",
    "Tour Packages",
    "Chauffeur Service",
    "Luxury Concierge",
    "Private Jet Booking",
    "Helicopter Tours",
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 text-center">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Other Services
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          We're working hard to bring you more luxury experiences — stay tuned!
        </p>
      </div>

      {/* Coming Soon Section */}
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-8 sm:p-12 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
          Coming Soon 🚀
        </h2>
        <p className="text-gray-500 mb-6">
          Exciting new services will be available soon.
        </p>

        {/* Upcoming Services List */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {upcomingServices.map((service, index) => (
            <div
              key={index}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-white border border-gray-200 rounded-full text-gray-700 shadow-sm hover:shadow-md transition-all"
            >
              {service}
            </div>
          ))}
        </div>

        {/* Optional Button */}
        <div className="mt-10">
          <button
            disabled
            className="bg-primary-500/50 text-white px-8 py-3 rounded-lg font-medium cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtherServices;
