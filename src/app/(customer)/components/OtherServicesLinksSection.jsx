import React from "react";

export default function OtherServicesLinks() {
  const services = [
    {
      name: "Flight Booking",
      href: "/flight",
      image:
        "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=80&q=80",
    },
    {
      name: "Beach Resorts",
      href: "/beach",
      image:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=80&q=80",
    },
    {
      name: "Dining",
      href: "/dining",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&q=80",
    },
    {
      name: "Other services",
      href: "/other-services",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&q=80",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12">
      {/* Heading */}
      <h2 className="text-[48px] font-bold text-gray-900 mb-12 text-left">
        Our Other Services
      </h2>

      {/* Service Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {services.map((service, idx) => (
          <a
            key={service.name}
            href={service.href}
            className="relative flex items-center justify-between rounded-2xl overflow-hidden p-6 bg-gray-50 hover:bg-[#DF5D3D]/10 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            style={{ minHeight: "100px" }}
          >
            {/* Left accent bar */}
            <div className="absolute left-0 top-0 h-full w-1 bg-[#DF5D3D] rounded-l-xl"></div>

            {/* Service Text */}
            <span className="relative text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              {service.name}
            </span>

            {/* Smaller Circular Image on Right */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover rounded-full border-2 border-[#DF5D3D]"
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
