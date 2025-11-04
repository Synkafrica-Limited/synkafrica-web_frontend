import { useState, useRef, useEffect } from 'react';

const CarRentalBookingInputs = ({ onSearch }) => {
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
    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)]">
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
            className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
              errors.pickupLocation ? 'border-red-500' : 'border-gray-300'
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

        <div className="flex flex-col">
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
            className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
              errors.pickupDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.pickupDate && (
            <span className="text-red-500 text-xs mt-1">{errors.pickupDate}</span>
          )}
        </div>

        <div className="flex flex-col">
          <input
            type="time"
            value={pickupTime}
            onChange={(e) => {
              setPickupTime(e.target.value);
              if (errors.pickupTime) {
                setErrors({ ...errors, pickupTime: '' });
              }
            }}
            className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
              errors.pickupTime ? 'border-red-500' : 'border-gray-300'
            }`}
          />
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