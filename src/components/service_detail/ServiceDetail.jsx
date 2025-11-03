"use client";

import { useState } from "react";
import { 
  Star, 
  Clock, 
  Package, 
  Shield, 
  CheckCircle, 
  Waves, 
  UtensilsCrossed,
  MapPin,
  Calendar,
  Users,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Utensils,
  Camera,
  Mountain,
  Bed,
  Bath,
  Shirt,
  Sparkles
} from "lucide-react";

const ServiceDetails = ({ 
  service, 
  onReserve, 
  platformName = "Synkkafrica",
  platformTheme = {
    primary: "bg-primary-500",
    primaryHover: "bg-primary-600"
  }
}) => {
  // Default service data structure for reference
  const defaultService = {
    id: "",
    name: "",
    tagline: "",
    rating: 0,
    reviewCount: 0,
    location: "",
    price: 0,
    currency: "₦",
    mainImage: "/api/placeholder/600/400",
    serviceType: "general",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
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
    services: [],
    portfolio: [],
    reviews: [],
    policies: {
      cancellation: "Cancel at least 1 day before the pick-up date for a full refund.",
      completion: "An email will be sent to your registered email upon booking completion."
    },
    qualityBadge: {
      title: "Service providers on " + platformName,
      subtitle: "are vetted for quality",
      description: "Service providers are evaluated for their professional experience, portfolio of strong work, and reputation for excellence."
    },
    // Service-specific data
    menu: [], // For dining services
    activities: [], // For beach resort services
    amenities: [], // For beach resort services
    accommodation: {}, // For beach resort services
    laundryServices: [] // For laundry services
  };

  // Merge provided service data with defaults
  const serviceData = { ...defaultService, ...service };
  
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

  const handleReserve = () => {
    if (onReserve) {
      onReserve(serviceData.id, serviceData);
    }
  };

  const getServiceIcon = (serviceTitle) => {
    const iconMap = {
      "wash": Shirt,
      "iron": Sparkles,
      "fold": Package,
      "packaging": Package,
      "delivery": Package,
      "laundry": Shirt,
      "dry cleaning": Sparkles,
      "dining": Utensils,
      "restaurant": UtensilsCrossed,
      "beach": Waves,
      "resort": Mountain,
      "accommodation": Bed,
      "room": Bed,
      "spa": Bath,
      "gym": Dumbbell,
      "wifi": Wifi,
      "parking": Car,
      "coffee": Coffee,
      "bar": Coffee,
      "pool": Waves,
      "activity": Camera,
      "tour": MapPin
    };
    
    const key = serviceTitle.toLowerCase();
    const IconComponent = Object.keys(iconMap).find(k => key.includes(k)) 
      ? iconMap[Object.keys(iconMap).find(k => key.includes(k))]
      : Package;
    
    return IconComponent;
  };

  const getServiceTypeIcon = (serviceType) => {
    const typeIcons = {
      "laundry": Shirt,
      "dining": UtensilsCrossed,
      "beach-resort": Waves,
      "resort": Mountain,
      "restaurant": Utensils,
      "general": Package
    };
    return typeIcons[serviceType] || Package;
  };

  const renderServiceSpecificContent = () => {
    const content = [];

    // Menu Section for Dining Services
    if (serviceData.serviceType === "dining" && serviceData.menu && serviceData.menu.length > 0) {
      content.push(
        <div key="menu" className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <UtensilsCrossed className="w-6 h-6 mr-2 text-primary-500" />
            Our Menu
          </h2>
          <div className="space-y-6">
            {serviceData.menu.map((category, index) => (
              <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {category.name}
                </h3>
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-start p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {item.name}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {item.description}
                        </p>
                        {item.ingredients && (
                          <p className="text-xs text-gray-500 italic">
                            {item.ingredients}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <span className="text-lg font-bold text-primary-500">
                          {serviceData.currency}{item.price.toLocaleString()}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            {serviceData.currency}{item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Activities Section for Beach Resort Services
    if (serviceData.serviceType === "beach-resort" && serviceData.activities && serviceData.activities.length > 0) {
      content.push(
        <div key="activities" className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Waves className="w-6 h-6 mr-2 text-primary-500" />
            Activities & Experiences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviceData.activities.map((activity, index) => {
              const IconComponent = getServiceIcon(activity.name);
              return (
                <div key={index} className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {activity.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {activity.description}
                      </p>
                      {activity.duration && (
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.duration}
                        </div>
                      )}
                      {activity.price && (
                        <div className="text-primary-500 font-semibold">
                          {serviceData.currency}{activity.price.toLocaleString()}
                          {activity.priceUnit && <span className="text-sm"> {activity.priceUnit}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Amenities Section for Beach Resort Services
    if (serviceData.serviceType === "beach-resort" && serviceData.amenities && serviceData.amenities.length > 0) {
      content.push(
        <div key="amenities" className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Mountain className="w-6 h-6 mr-2 text-primary-500" />
            Amenities & Facilities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {serviceData.amenities.map((amenity, index) => {
              const IconComponent = getServiceIcon(amenity.name);
              return (
                <div key={index} className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-center">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm">
                    {amenity.name}
                  </h3>
                  {amenity.available && (
                    <p className="text-xs text-green-600 mt-1">Available</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Accommodation Section for Beach Resort Services
    if (serviceData.serviceType === "beach-resort" && serviceData.accommodation && Object.keys(serviceData.accommodation).length > 0) {
      content.push(
        <div key="accommodation" className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Bed className="w-6 h-6 mr-2 text-primary-500" />
            Accommodation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-3">Room Details</h3>
              <div className="space-y-2 text-sm">
                {serviceData.accommodation.roomType && (
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{serviceData.accommodation.roomType}</span>
                  </div>
                )}
                {serviceData.accommodation.capacity && (
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Up to {serviceData.accommodation.capacity} guests</span>
                  </div>
                )}
                {serviceData.accommodation.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{serviceData.accommodation.bathrooms} bathroom(s)</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
              <div className="space-y-2">
                {serviceData.accommodation.features && serviceData.accommodation.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Laundry Services Section for Laundry Services
    if (serviceData.serviceType === "laundry" && serviceData.laundryServices && serviceData.laundryServices.length > 0) {
      content.push(
        <div key="laundry-services" className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Shirt className="w-6 h-6 mr-2 text-primary-500" />
            Laundry Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviceData.laundryServices.map((service, index) => {
              const IconComponent = getServiceIcon(service.name);
              return (
                <div key={index} className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {service.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-primary-500 font-semibold">
                          {serviceData.currency}{service.price.toLocaleString()}
                        </span>
                        {service.turnaround && (
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                            {service.turnaround}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return content;
  };

  const getServiceTypeTitle = () => {
    const titles = {
      "laundry": "Laundry Services",
      "dining": "Dining Experience",
      "beach-resort": "Beach Resort",
      "resort": "Resort Services",
      "restaurant": "Restaurant",
      "general": "Services"
    };
    return titles[serviceData.serviceType] || "Services";
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Service Card & Info */}
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
                    {serviceData.portfolio.slice(0, 4).map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-white bg-opacity-20 rounded-full"
                      />
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white text-xs font-medium">
                        {getServiceTypeTitle()}
                      </span>
                    </div>
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
                  </div>
                  <div className="mb-6">
                    <span className="text-2xl font-bold text-gray-900">
                      From {serviceData.currency}
                      {serviceData.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      {serviceData.serviceType === "dining" ? "per table" : 
                       serviceData.serviceType === "beach-resort" ? "per day" : "per item"}
                    </span>
                  </div>
                  <button
                    onClick={handleReserve}
                    className="w-full bg-primary-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {serviceData.serviceType === "dining" ? "Make Reservation" : 
                     serviceData.serviceType === "beach-resort" ? "Book Now" : "Reserve"}
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
                    {serviceData.serviceType === "beach-resort" ? "Reception Hours" : "Working Hours"}
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
            {/* Service-specific content */}
            {renderServiceSpecificContent()}

            {/* Services */}
            {serviceData.services.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Our Services
                </h2>
                <div className="space-y-6">
                  {serviceData.services.map((service, index) => {
                    const IconComponent = getServiceIcon(service.title);
                    return (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-8 h-8 text-white" />
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
                    );
                  })}
                </div>
              </div>
            )}

            {/* Portfolio */}
            {serviceData.portfolio.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {serviceData.serviceType === "dining" ? "Gallery" : 
                   serviceData.serviceType === "beach-resort" ? "Photo Gallery" : "Portfolio"}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {serviceData.portfolio.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`${serviceData.serviceType === "dining" ? "Restaurant" : 
                               serviceData.serviceType === "beach-resort" ? "Resort" : "Portfolio"} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {serviceData.reviews.length > 0 && (
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
            )}

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
                      {serviceData.serviceType === "dining" ? "Reservation policy" : 
                       serviceData.serviceType === "beach-resort" ? "Cancellation policy" : "Booking policy"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {serviceData.policies.cancellation}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {serviceData.serviceType === "dining" ? "Booking confirmation" : 
                       serviceData.serviceType === "beach-resort" ? "Check-in confirmation" : "Order completion"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {serviceData.policies.completion}
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
                {serviceData.qualityBadge.title}
              </h3>
              <h4 className="text-lg font-semibold mb-2">
                {serviceData.qualityBadge.subtitle}
              </h4>
              <p className="text-white text-opacity-80 text-sm max-w-md mx-auto">
                {serviceData.qualityBadge.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;