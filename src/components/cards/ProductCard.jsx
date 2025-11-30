import React from "react";
import { Phone, MapPin } from "lucide-react";

const ProductCard = ({
  id,
  image,
  name,
  price,
  location,
  buttonVariant = "filled",
  type = "car", // car, dining, resort, recreation, laundry
}) => {
  const getNavigationPath = () => {
    const pathMap = {
      car: `/car/${id}`,
      dining: `/dining/${id}`,
      resort: `/resort/${id}`,
      recreation: `/recreation/${id}`,
      laundry: `/laundry/${id}`,
    };
    return pathMap[type] || `/product/${id}`;
  };

  const getPriceLabel = () => {
    const labelMap = {
      car: "/Day",
      dining: "/Table",
      resort: "/Night",
      recreation: "/Hour",
      laundry: "/Load",
    };
    return labelMap[type] || "/Day";
  };

  const handleClick = () => {
    window.location.href = getNavigationPath();
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="w-full h-48 bg-gray-50 flex items-center justify-center">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{name}</h3>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-2xl font-bold text-gray-900">
            ₦{price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">{getPriceLabel(type)}</span>
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1 text-gray-500 mb-4">
            <MapPin size={16} className="shrink-0" />
            <span className="text-sm truncate">{location}</span>
          </div>
        )}

        {/* Book Now Button (optional) */}
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

export default ProductCard;
