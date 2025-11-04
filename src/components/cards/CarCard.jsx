import React from 'react';
import { Phone, MapPin } from 'lucide-react';

const CarCard = ({ 
  image, 
  name, 
  price, 
  location, 
  buttonVariant = 'filled' // 'filled' or 'outline'
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Car Image */}
      <div className="bg-gray-50 p-6 flex items-center justify-center h-48">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Car Name */}
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {name}
        </h3>

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

        {/* Rent Now Button */}
        {buttonVariant === 'filled' ? (
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
            <Phone size={18} />
            Rent Now
          </button>
        ) : (
          <button className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 bg-white">
            <Phone size={18} />
            Rent Now
          </button>
        )}
      </div>
    </div>
  );
};

// Demo Component showing both variants
const CarRentalCards = () => {
  const cars = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop',
      name: 'Lexus CT200H',
      price: 120,
      location: 'Lagos',
      buttonVariant: 'filled'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop',
      name: 'Jaguar F-Pace',
      price: 132,
      location: 'Lagos',
      buttonVariant: 'outline'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=300&fit=crop',
      name: 'Mercedes-Benz C-Class',
      price: 150,
      location: 'Abuja',
      buttonVariant: 'filled'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=500&h=300&fit=crop',
      name: 'BMW X5',
      price: 145,
      location: 'Lagos',
      buttonVariant: 'outline'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Available Cars for Rent
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <CarCard
              key={car.id}
              image={car.image}
              name={car.name}
              price={car.price}
              location={car.location}
              buttonVariant={car.buttonVariant}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarRentalCards;