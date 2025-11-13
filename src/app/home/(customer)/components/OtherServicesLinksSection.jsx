import React from 'react';

export default function OtherServicesLinks() {
  const services = [
    { name: "Flight Booking", href: "/flight" },
    { name: "Beach Resorts", href: "/beach" },
    { name: "Dining", href: "/dining" },
    { name: "Other services", href: "/other-services" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
      {/* Heading */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 sm:mb-8">
        Our other services
      </h2>

      {/* Service Links */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {services.map((service) => (
          <a
            key={service.name}
            href={service.href}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 hover:text-gray-600 transition-colors border-b-4 border-gray-900 hover:border-gray-600 pb-1 inline-block"
          >
            {service.name}
          </a>
        ))}
      </div>
    </div>
  );
}