import { useState, useRef, useEffect } from 'react';

const ResortHouseBookingInputs = ({ onSearch }) => {
  const [destination, setDestination] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredResorts, setFilteredResorts] = useState([]);
  const dropdownRef = useRef(null);

  const resortHouses = [
    'Bamboo House in Lagos',
    'Beachfront Villa in Lagos',
    'Luxury Cabana in Lagos',
    'Relaxation House in Benin',
    'Garden Retreat in Benin',
    'Sunset Bungalow in Calabar',
    'Oceanview Cottage in Calabar',
    'Palm Tree Resort in Port Harcourt',
    'Tropical Paradise in Port Harcourt',
    'Lakeside Lodge in Abuja',
    'Mountain Cabin in Jos',
    'Riverside Chalet in Uyo',
    'Eco Lodge in Ibadan',
    'Beach Hut in Badagry',
    'Poolside Villa in Lekki'
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
    
    if (!destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
    
    if (!checkInDate) {
      newErrors.checkInDate = 'Check-in date is required';
    } else {
      const selectedDate = new Date(checkInDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.checkInDate = 'Date cannot be in the past';
      }
    }
    
    if (!checkInTime) {
      newErrors.checkInTime = 'Check-in time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDestinationChange = (value) => {
    setDestination(value);
    if (errors.destination) {
      setErrors({ ...errors, destination: '' });
    }

    // Filter resort houses based on input
    if (value.trim()) {
      const filtered = resortHouses.filter(resort =>
        resort.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredResorts(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredResorts([]);
      setShowSuggestions(false);
    }
  };

  const handleResortSelect = (resort) => {
    setDestination(resort);
    setShowSuggestions(false);
    if (errors.destination) {
      setErrors({ ...errors, destination: '' });
    }
  };

  const handleSearch = () => {
    if (validateInputs()) {
      onSearch({
        service: 'beach',
        destination: destination.trim(),
        checkInDate,
        checkInTime
      });
    }
  };

  const isFormValid = destination.trim() && checkInDate && checkInTime;

  return (
    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col relative" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Resort type or destination"
            value={destination}
            onChange={(e) => handleDestinationChange(e.target.value)}
            onFocus={() => {
              if (destination.trim() && filteredResorts.length > 0) {
                setShowSuggestions(true);
              }
            }}
            className={`px-4 py-3 rounded-lg focus:outline-none border-3 border-primary-500 ${
              errors.destination ? 'border-red-500' : ''
            }`}
          />
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
              {filteredResorts.length > 0 ? (
                filteredResorts.map((resort, index) => (
                  <div
                    key={index}
                    onClick={() => handleResortSelect(resort)}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    {resort}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-sm">
                  Sorry, we don't have this type of resort house available yet.
                </div>
              )}
            </div>
          )}
          {errors.destination && (
            <span className="text-red-500 text-xs mt-1">{errors.destination}</span>
          )}
        </div>

        <div className="flex flex-col">
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => {
              setCheckInDate(e.target.value);
              if (errors.checkInDate) {
                setErrors({ ...errors, checkInDate: '' });
              }
            }}
            min={new Date().toISOString().split('T')[0]}
            className={`px-4 py-3 rounded-lg focus:outline-none border-3 border-primary-500 ${
              errors.checkInDate ? 'border-red-500' : ''
            }`}
          />
          {errors.checkInDate && (
            <span className="text-red-500 text-xs mt-1">{errors.checkInDate}</span>
          )}
        </div>

        <div className="flex flex-col">
          <input
            type="time"
            value={checkInTime}
            onChange={(e) => {
              setCheckInTime(e.target.value);
              if (errors.checkInTime) {
                setErrors({ ...errors, checkInTime: '' });
              }
            }}
            className={`px-4 py-3 rounded-lg focus:outline-none border-3 border-primary-500 ${
              errors.checkInTime ? 'border-red-500' : ''
            }`}
          />
          {errors.checkInTime && (
            <span className="text-red-500 text-xs mt-1">{errors.checkInTime}</span>
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
          Find Resorts
        </button>
      </div>
    </div>
  );
};

export default ResortHouseBookingInputs;