import {
  MapPin,
  Users,
  Fuel,
  Settings,
  Star,
  Clock,
  Filter,
  X,
} from "lucide-react";

// Car Card Component
const CarCard = ({ car, onClick }) => {
  return (
    <div
      className="group bg-white rounded-2xl border border-gray-50 hover:border-gray-100 transition-all duration-300 hover:shadow-lg overflow-hidden cursor-pointer"
      style={{ boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.04)" }}
      onClick={onClick}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Car Image */}
        <div className="lg:w-80 h-48 relative overflow-hidden flex-shrink-0">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
              Great Deal
            </span>
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-sm">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-gray-800">
                {car.rating}
              </span>
            </div>
          </div>
          <img
            src={car.image}
            alt={car.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>

        {/* Car Details */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {car.package}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {car.name}
                </h3>

                {/* Car Features */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">
                      <span>{car.capacity}</span> seats
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{car.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <Fuel className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">A/C</span>
                  </div>
                  {/* <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Unlimited</span>
                  </div> */}
                </div>
              </div>

              {/* Pricing */}
              <div className="text-right lg:ml-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">
                    Starting from
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    ₦{car.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 line-through">
                    ₦{car.originalPrice.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-600 font-semibold mt-1">
                    Save ₦{(car.originalPrice - car.price).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">
                Free cancellation
              </span>{" "}
              • Available now
            </div>
            <button className="bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Reserve Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
