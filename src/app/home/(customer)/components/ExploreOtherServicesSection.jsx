export default function ExploreOtherServices() {
  const services = [
    {
      title: "Beach Experiences",
      description: "Relax and unwind with our premium beach services.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"
    },
    {
      title: "Dining Reservations",
      description: "Your VIP pass to the city's best spot, without the wait.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
    },
    {
      title: "Convenience Services",
      description: "Discover ultimate convenience services at your fingertips.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="h-56 overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                {service.description}
              </p>
              <button className="w-full bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                Explore Now!
                <span>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}