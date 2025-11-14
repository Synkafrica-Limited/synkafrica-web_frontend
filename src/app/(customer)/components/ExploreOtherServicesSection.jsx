import React from "react";

export default function ExploreOtherServices() {
  const services = [
    {
      title: "Beach Experiences",
      description: "Relax and unwind with our premium beach services.",
      image:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    },
    {
      title: "Dining Reservations",
      description: "Your VIP pass to the city's best spot, without the wait.",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    },
    {
      title: "Convenience Services",
      description:
        "Discover ultimate convenience services at your fingertips.",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <a
            key={idx}
            href="#"
            className="relative block rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
          >
            {/* Image */}
            <div className="relative h-64 md:h-72 lg:h-80 overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-[#EEFF77]/70 to-[#FFC0B1]/70 relative">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base">
                {service.description}
              </p>
              <button className="w-full bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                Explore Now <span className="text-xl">→</span>
              </button>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
