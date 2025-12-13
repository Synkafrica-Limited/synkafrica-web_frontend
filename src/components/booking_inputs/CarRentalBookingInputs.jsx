import { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, Clock, Search } from 'lucide-react';

const CarRentalBookingInputs = ({ onSearch, onQuickSearch, showBorder = true }) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [focusedField, setFocusedField] = useState(null);
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleaning up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const triggerQuickSearch = (loc) => {
    if (!onQuickSearch) return;
    
    // Clear existing timeout
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    // Set new timeout for debounce
    searchTimeoutRef.current = setTimeout(() => {
      if (loc && loc.length >= 3) {
        onQuickSearch({
          service: 'car',
          location: loc,
          date: pickupDate,
          time: pickupTime
        });
      }
    }, 400); // 400ms debounce
  };

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

    // Trigger quick search
    triggerQuickSearch(value);

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
    // Trigger immediate search on selection
    if (onQuickSearch) {
       onQuickSearch({
        service: 'car',
        location: location,
        date: pickupDate,
        time: pickupTime
      });
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
      className={`mt-4 bg-white rounded-lg relative ${
        showBorder ? 'shadow-xl' : 'shadow-lg'
      }`}
    >
      <div className="p-2 grid grid-cols-1 md:grid-cols-4 gap-2">
        {/* Pickup Location */}
        <div className="flex flex-col relative" ref={dropdownRef}>
          <div className={`relative transition-all duration-200 ${
            focusedField === 'location' 
              ? 'z-20' 
              : ''
          }`}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <MapPin className={`w-5 h-5 transition-colors ${
                focusedField === 'location' || pickupLocation
                  ? 'text-gray-800'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="text"
              placeholder="Where are you going?"
              value={pickupLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              onFocus={() => {
                setFocusedField('location');
                if (pickupLocation.trim() && filteredLocations.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-10 pr-4 py-3.5 border-2 rounded-md focus:outline-none transition-all duration-200 placeholder:text-gray-500 font-medium text-gray-900 ${
                errors.pickupLocation 
                  ? 'border-red-500' 
                  : focusedField === 'location'
                  ? 'border-primary-500'
                  : 'border-transparent hover:bg-gray-50'
              }`}
            />
          </div>
          
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-64 overflow-y-auto z-50">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location, index) => (
                  <div
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
                  >
                    <MapPin className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                    <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">{location}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-gray-500 text-sm text-center">
                  Location not found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pickup Date */}
        <div className="flex flex-col relative border-l-0 md:border-l-2 border-gray-100">
          <div className={`relative transition-all duration-200 ${
            focusedField === 'date' 
              ? 'z-20' 
              : ''
          }`}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <Calendar className={`w-5 h-5 transition-colors ${
                focusedField === 'date' || pickupDate
                  ? 'text-gray-800'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => {
                const newVal = e.target.value;
                setPickupDate(newVal);
                if (errors.pickupDate) {
                  setErrors({ ...errors, pickupDate: '' });
                }
                // Trigger quick search if location exists
                if (onQuickSearch && pickupLocation) {
                  onQuickSearch({
                    service: 'car',
                    location: pickupLocation,
                    date: newVal,
                    time: pickupTime
                  });
                }
              }}
              onFocus={() => setFocusedField('date')}
              onBlur={() => setFocusedField(null)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full pl-10 pr-4 py-3.5 border-2 rounded-md focus:outline-none transition-all duration-200 font-medium cursor-pointer ${
                errors.pickupDate 
                  ? 'border-red-500' 
                  : focusedField === 'date'
                  ? 'border-primary-500'
                  : 'border-transparent hover:bg-gray-50'
              } ${pickupDate || focusedField === 'date' ? 'text-gray-900' : 'text-transparent'}`}
              style={{ colorScheme: 'light' }}
            />
            {!pickupDate && focusedField !== 'date' && (
              <span className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[15px] font-medium z-0">
                Check-in Date
              </span>
            )}
          </div>
        </div>

        {/* Pickup Time */}
        <div className="flex flex-col relative border-l-0 md:border-l-2 border-gray-100">
          <div className={`relative transition-all duration-200 ${
            focusedField === 'time' 
              ? 'z-20' 
              : ''
          }`}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <Clock className={`w-5 h-5 transition-colors ${
                focusedField === 'time' || pickupTime
                  ? 'text-gray-800'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => {
                const newVal = e.target.value;
                setPickupTime(newVal);
                if (errors.pickupTime) {
                  setErrors({ ...errors, pickupTime: '' });
                }
                // Trigger quick search if location exists
                if (onQuickSearch && pickupLocation) {
                  onQuickSearch({
                    service: 'car',
                    location: pickupLocation,
                    date: pickupDate,
                    time: newVal
                  });
                }
              }}
              onFocus={() => setFocusedField('time')}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-10 pr-4 py-3.5 border-2 rounded-md focus:outline-none transition-all duration-200 font-medium cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
                errors.pickupTime 
                  ? 'border-red-500' 
                  : focusedField === 'time'
                  ? 'border-primary-500'
                  : 'border-transparent hover:bg-gray-50'
              } ${pickupTime || focusedField === 'time' ? 'text-gray-900' : 'text-transparent'}`}
              style={{ colorScheme: 'light' }}
            />
            {!pickupTime && focusedField !== 'time' && (
              <span className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[15px] font-medium z-0">
                Time
              </span>
            )}
          </div>
        </div>

        {/* Search Button */}
        <div className="p-1">
          <button
            onClick={handleSearch}
            className={`w-full h-full min-h-[50px] rounded-md font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              isFormValid
                ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-none'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="hidden sm:inline">Search</span>
            <span className="sm:hidden">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarRentalBookingInputs;