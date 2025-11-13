import { useState, useRef, useEffect } from 'react';

const CarRentalBookingInputs = ({ onSearch, showBorder = true }) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const dropdownRef = useRef(null);

  const locations = [
    'Lagos Island, Lagos',
    'Ikeja, Lagos',
    'Victoria Island, Lagos',
    'Lekki, Lagos',
    'Surulere, Lagos',
    'Yaba, Lagos',
    'Ikoyi, Lagos',
    'Ajah, Lagos',
    'Maryland, Lagos',
    'Festac Town, Lagos',
    'Abuja City Center, FCT',
    'Wuse, Abuja',
    'Garki, Abuja',
    'Maitama, Abuja',
    'Port Harcourt City, Rivers',
    'Ibadan, Oyo',
    'Kano City, Kano'
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateInputs = () => {
    const newErrors = {};
    
    if (!pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup location is required';
    }
    
    if (!pickupDate) {
      newErrors.pickupDate = 'Pickup date is required';
    } else {
      const selectedDate = new Date(pickupDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.pickupDate = 'Date cannot be in the past';
      }
    }
    
    if (!pickupTime) {
      newErrors.pickupTime = 'Pickup time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLocationChange = (value) => {
    setPickupLocation(value);
    if (errors.pickupLocation) {
      setErrors({ ...errors, pickupLocation: '' });
    }

    // Filter locations based on input
    if (value.trim()) {
      const filtered = locations.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredLocations([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = (location) => {
    setPickupLocation(location);
    setShowSuggestions(false);
    if (errors.pickupLocation) {
      setErrors({ ...errors, pickupLocation: '' });
    }
  };

  const handleSearch = () => {
    if (validateInputs()) {
      onSearch({
        service: 'car',
        pickupLocation: pickupLocation.trim(),
        pickupDate,
        pickupTime
      });
    }
  };

  const isFormValid = pickupLocation.trim() && pickupDate && pickupTime;

  return (
    <div
  className={`mt-4 sm:mt-6 p-3 sm:p-4 bg-white rounded-2xl relative ${
    showBorder
      ? 'shadow-[0_15px_35px_-10px_rgba(223,93,61,0.5),0_10px_25px_-8px_rgba(223,93,61,0.35),0_8px_18px_-5px_rgba(223,93,61,0.4)] border border-orange-100/50 before:absolute before:inset-x-0 before:-bottom-1 before:h-3 before:bg-gradient-to-t before:from-[#DF5D3D]/20 before:to-transparent before:blur-sm before:pointer-events-none'
      : ''
  }`}
>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col relative" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Pickup location"
            value={pickupLocation}
            onChange={(e) => handleLocationChange(e.target.value)}
            onFocus={() => {
              if (pickupLocation.trim() && filteredLocations.length > 0) {
                setShowSuggestions(true);
              }
            }}
            className={`px-4 py-3 border md:border-3 border-gray-300 md:border-primary-500 rounded-lg focus:outline-none focus:ring-0 ${
              errors.pickupLocation ? 'border-red-500' : ''
            }`}
          />
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location, index) => (
                  <div
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    {location}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-sm">
                  Sorry, our service is not available in this location yet.
                </div>
              )}
            </div>
          )}
          {errors.pickupLocation && (
            <span className="text-red-500 text-xs mt-1">{errors.pickupLocation}</span>
          )}
        </div>

        <div className="flex flex-col relative">
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => {
              setPickupDate(e.target.value);
              if (errors.pickupDate) {
                setErrors({ ...errors, pickupDate: '' });
              }
            }}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-3 pr-3 border md:border-3 border-gray-300 md:border-primary-500 rounded-lg focus:outline-none focus:ring-0 ${
              errors.pickupDate ? 'border-red-500' : ''
            } ${pickupDate ? 'text-gray-900' : 'text-transparent'}`}
            style={{ colorScheme: 'light' }}
          />
          {!pickupDate && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              Pickup date
            </span>
          )}
          {errors.pickupDate && (
            <span className="text-red-500 text-xs mt-1">{errors.pickupDate}</span>
          )}
        </div>

        <div className="flex flex-col relative">
          <input
            type="time"
            value={pickupTime}
            onChange={(e) => {
              setPickupTime(e.target.value);
              if (errors.pickupTime) {
                setErrors({ ...errors, pickupTime: '' });
              }
            }}
            className={`w-full px-4 py-3 pr-3 border md:border-3 border-gray-300 md:border-primary-500 rounded-lg focus:outline-none focus:ring-0 ${
              errors.pickupTime ? 'border-red-500' : ''
            } ${pickupTime ? 'text-gray-900' : 'text-transparent'}`}
            style={{ colorScheme: 'light' }}
          />
          {!pickupTime && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              Pickup time
            </span>
          )}
          {errors.pickupTime && (
            <span className="text-red-500 text-xs mt-1">{errors.pickupTime}</span>
          )}
        </div>

        <button
          onClick={handleSearch}
          disabled={!isFormValid}
          className={`px-6 py-3 text-white rounded-xl font-medium transition-colors ${
            isFormValid
              ? 'bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white py-4 rounded-xl cursor-pointer'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Search Cars
        </button>
      </div>
    </div>
  );
};

export default CarRentalBookingInputs;