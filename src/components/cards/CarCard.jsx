import React from "react";
import { Phone, MapPin } from "lucide-react";

const CarCard = ({
  image,
  name,
  price,
  location,
  buttonVariant = "filled",
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="w-full h-48 bg-gray-50 flex items-center justify-center">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      <div className="p-5">
        {/* Car Name */}
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{name}</h3>

        {/* Price and Location */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">${price}</span>
            <span className="text-sm text-gray-500">/Day</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin size={16} />
            <span className="text-sm">{location}</span>
          </div>
        </div>

        {/* Book Now Button */}
        {/* {buttonVariant === "filled" ? (
          <button className="w-full bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
            <Phone size={18} />
            Book Now
          </button>
        ) : (
          <button className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 bg-white">
            <Phone size={18} />
            Book Now
          </button>
        )} */}
      </div>
    </div>
  );
};

export default CarCard;