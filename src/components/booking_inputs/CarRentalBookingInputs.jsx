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
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Pickup Location */}
        <div className="flex flex-col relative" ref={dropdownRef}>
          <label className="text-xs font-semibold text-gray-700 mb-1.5 px-1">
            Pickup Location
          </label>
          <div className={`relative transition-all duration-200 ${
            focusedField === 'location' ? 'z-20' : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <MapPin className={`w-5 h-5 transition-colors ${
                focusedField === 'location' || pickupLocation
                  ? 'text-primary-500'
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
              className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:outline-none transition-all duration-200 placeholder:text-gray-400 text-gray-900 font-medium ${
                errors.pickupLocation 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                  : focusedField === 'location'
                  ? 'border-primary-500 bg-white focus:ring-2 focus:ring-primary-100'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            />
            {errors.pickupLocation && (
              <p className="text-xs text-red-600 mt-1 px-1">{errors.pickupLocation}</p>
            )}
          </div>
          
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto z-50">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location, index) => (
                  <div
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className="px-4 py-3 hover:bg-primary-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
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
        <div className="flex flex-col relative">
          <label className="text-xs font-semibold text-gray-700 mb-1.5 px-1">
            Check-in Date
          </label>
          <div className={`relative transition-all duration-200 ${
            focusedField === 'date' ? 'z-20' : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <Calendar className={`w-5 h-5 transition-colors ${
                focusedField === 'date' || pickupDate
                  ? 'text-primary-500'
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
              className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:outline-none transition-all duration-200 font-medium cursor-pointer ${
                errors.pickupDate 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                  : focusedField === 'date'
                  ? 'border-primary-500 bg-white focus:ring-2 focus:ring-primary-100'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              } ${pickupDate ? 'text-gray-900' : 'text-gray-400'}`}
              style={{ colorScheme: 'light' }}
            />
            {errors.pickupDate && (
              <p className="text-xs text-red-600 mt-1 px-1">{errors.pickupDate}</p>
            )}
          </div>
        </div>

        {/* Pickup Time */}
        <div className="flex flex-col relative">
          <label className="text-xs font-semibold text-gray-700 mb-1.5 px-1">
            Pickup Time
          </label>
          <div className={`relative transition-all duration-200 ${
            focusedField === 'time' ? 'z-20' : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <Clock className={`w-5 h-5 transition-colors ${
                focusedField === 'time' || pickupTime
                  ? 'text-primary-500'
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
              className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:outline-none transition-all duration-200 font-medium cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
                errors.pickupTime 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                  : focusedField === 'time'
                  ? 'border-primary-500 bg-white focus:ring-2 focus:ring-primary-100'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              } ${pickupTime ? 'text-gray-900' : 'text-gray-400'}`}
              style={{ colorScheme: 'light' }}
            />
            {errors.pickupTime && (
              <p className="text-xs text-red-600 mt-1 px-1">{errors.pickupTime}</p>
            )}
          </div>
        </div>

        {/* Search Button */}
        <div className="flex flex-col justify-end">
          <button
            onClick={handleSearch}
            disabled={!isFormValid}
            className={`w-full h-[52px] rounded-lg font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 ${
              isFormValid
                ? 'bg-[#E05D3D] hover:bg-[#c54a2a] text-white shadow-md hover:shadow-lg active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarRentalBookingInputs;