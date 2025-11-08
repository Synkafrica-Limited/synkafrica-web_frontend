import React from 'react';

// Service-specific content configuration
const serviceContent = {
  car: {
    heading: "Book our cars and go\nanywhere!",
    useCases: [
      { number: "01", title: "Events" },
      { number: "02", title: "Airport transportation" },
      { number: "03", title: "Resorts location" },
      { number: "04", title: "Anywhere" }
    ],
    ctaCard: {
      title: "Ready now",
      description: "It's easy to list your product and\nearn extra income",
      buttonText: "Rent car now!",
      bgColor: "bg-rose-400/90",
      image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80"
    }
  },
  flight: {
    heading: "Fly anywhere in\nthe world!",
    useCases: [
      { number: "01", title: "Business trips" },
      { number: "02", title: "Vacation travel" },
      { number: "03", title: "Family visits" },
      { number: "04", title: "Adventure awaits" }
    ],
    ctaCard: {
      title: "Book now",
      description: "Compare prices and find\nthe best deals instantly",
      buttonText: "Search flights!",
      bgColor: "bg-blue-500/90",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80"
    }
  },
  beach: {
    heading: "Discover paradise\nbeach resorts!",
    useCases: [
      { number: "01", title: "Honeymoons" },
      { number: "02", title: "Family vacations" },
      { number: "03", title: "Romantic getaways" },
      { number: "04", title: "Group retreats" }
    ],
    ctaCard: {
      title: "Paradise awaits",
      description: "Exclusive beach resorts with\nall-inclusive packages",
      buttonText: "Book resort now!",
      bgColor: "bg-cyan-400/90",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80"
    }
  },
  dining: {
    heading: "Reserve tables at\ntop restaurants!",
    useCases: [
      { number: "01", title: "Special occasions" },
      { number: "02", title: "Business dinners" },
      { number: "03", title: "Romantic dates" },
      { number: "04", title: "Group celebrations" }
    ],
    ctaCard: {
      title: "Dine in style",
      description: "Reserve your table at\npremium restaurants",
      buttonText: "Book table now!",
      bgColor: "bg-amber-500/90",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80"
    }
  },
  other: {
    heading: "Explore endless\nservices!",
    useCases: [
      { number: "01", title: "Custom experiences" },
      { number: "02", title: "Local tours" },
      { number: "03", title: "Event planning" },
      { number: "04", title: "Personal concierge" }
    ],
    ctaCard: {
      title: "Get started",
      description: "Personalized services tailored\nto your needs",
      buttonText: "Explore services!",
      bgColor: "bg-purple-500/90",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80"
    }
  }
};

export default function AboutService({ service = "car" }) {
  const content = serviceContent[service] || serviceContent.car;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-8 sm:mb-12 whitespace-pre-line">
        {content.heading}
      </h2>

      {/* Use Cases */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {content.useCases.map((useCase) => (
          <div key={useCase.number} className="flex flex-col">
            <span className="text-3xl sm:text-4xl font-bold text-gray-300 mb-2">
              {useCase.number}
            </span>
            <span className="text-sm sm:text-base text-gray-700">
              {useCase.title}
            </span>
          </div>
        ))}
      </div>

      {/* Image Card with CTA */}
      <div className="relative rounded-3xl overflow-hidden h-[300px] sm:h-[400px] md:h-[450px]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${content.ctaCard.image}')`,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        </div>

        {/* Content Card */}
        <div className="relative z-10 h-full flex items-center p-6 sm:p-8 md:p-12">
          <div
            className="backdrop-blur-sm rounded-2xl p-6 sm:p-8 max-w-xs sm:max-w-sm"
            style={{
              backgroundImage: 'linear-gradient(90deg, #E05D3D 0%, #FFC0B1 100%)'
            }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">
              {content.ctaCard.title}
            </h3>
            <p className="text-white/90 text-sm sm:text-base mb-4 sm:mb-6 whitespace-pre-line">
              {content.ctaCard.description}
            </p>
            <button
              style={{ backgroundColor: '#1F2937' }}
              className="w-full hover:border-gray-400 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {content.ctaCard.buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}