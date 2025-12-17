import { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, Users, Search } from 'lucide-react';

const ResortHouseBookingInputs = ({ onSearch, showBorder = true }) => {
  const [destination, setDestination] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [focusedField, setFocusedField] = useState(null);
  const dropdownRef = useRef(null);

  const destinations = [
    'Lagos Island, Lagos',
    'Ikeja, Lagos',
    'Victoria Island, Lagos',
    'Lekki, Lagos',
    'Ikoyi, Lagos',
    'Ajah, Lagos',
    'Surulere, Lagos',
    'Yaba, Lagos',
    'Maryland, Lagos',
    'Festac Town, Lagos',
    'Abuja City Center, FCT',
    'Wuse, Abuja',
    'Garki, Abuja',
    'Maitama, Abuja',
    'Port Harcourt City, Rivers',
    'Ibadan, Oyo',
    'Kano City, Kano',
    'Calabar, Cross River',
    'Enugu, Enugu'
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
    
    if (!checkOutDate) {
      newErrors.checkOutDate = 'Check-out date is required';
    } else if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      
      if (checkOut <= checkIn) {
        newErrors.checkOutDate = 'Check-out must be after check-in';
      }
    }
    
    if (!guests) {
      newErrors.guests = 'Number of guests is required';
    } else if (parseInt(guests) < 1) {
      newErrors.guests = 'At least 1 guest is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDestinationChange = (value) => {
    setDestination(value);
    if (errors.destination) {
      setErrors({ ...errors, destination: '' });
    }

    if (value.trim()) {
      const filtered = destinations.filter(dest =>
        dest.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDestinations(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredDestinations([]);
      setShowSuggestions(false);
    }
  };

  const handleDestinationSelect = (dest) => {
    setDestination(dest);
    setShowSuggestions(false);
    if (errors.destination) {
      setErrors({ ...errors, destination: '' });
    }
  };

  const handleSearch = () => {
    if (validateInputs()) {
      onSearch({
        service: 'resort',
        destination: destination.trim(),
        checkInDate,
        checkOutDate,
        guests: parseInt(guests)
      });
    }
  };

  const isFormValid = destination.trim() && checkInDate && checkOutDate && guests && parseInt(guests) >= 1;

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Destination */}
        <div className="flex flex-col relative" ref={dropdownRef}>
          <label className="text-xs font-semibold text-gray-700 mb-1.5 px-1">
            Destination
          </label>
          <div className={`relative transition-all duration-200 ${
            focusedField === 'destination' ? 'z-20' : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <MapPin className={`w-5 h-5 transition-colors ${
                focusedField === 'destination' || destination
                  ? 'text-primary-500'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="text"
              placeholder="Where are you going?"
              value={destination}
              onChange={(e) => handleDestinationChange(e.target.value)}
              onFocus={() => {
                setFocusedField('destination');
                if (destination.trim() && filteredDestinations.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:outline-none transition-all duration-200 placeholder:text-gray-400 text-gray-900 font-medium ${
                errors.destination 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                  : focusedField === 'destination'
                  ? 'border-primary-500 bg-white focus:ring-2 focus:ring-primary-100'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            />
            {errors.destination && (
              <p className="text-xs text-red-600 mt-1 px-1">{errors.destination}</p>
            )}
          </div>
          
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto z-50">
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map((dest, index) => (
                  <div
                    key={index}
                    onClick={() => handleDestinationSelect(dest)}
                    className="px-4 py-3 hover:bg-primary-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
                  >
                    <MapPin className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                    <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">{dest}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-gray-500 text-sm text-center">
                  Destination not found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Check-in Date */}
        <div className="flex flex-col relative">
          <label className="text-xs font-semibold text-gray-700 mb-1.5 px-1">
            Check-in Date
          </label>
          <div className={`relative transition-all duration-200 ${
            focusedField === 'checkIn' ? 'z-20' : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <Calendar className={`w-5 h-5 transition-colors ${
                focusedField === 'checkIn' || checkInDate
                  ? 'text-primary-500'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => {
                setCheckInDate(e.target.value);
                if (errors.checkInDate) {
                  setErrors({ ...errors, checkInDate: '' });
                }
              }}
              onFocus={() => setFocusedField('checkIn')}
              onBlur={() => setFocusedField(null)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:outline-none transition-all duration-200 font-medium cursor-pointer ${
                errors.checkInDate 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                  : focusedField === 'checkIn'
                  ? 'border-primary-500 bg-white focus:ring-2 focus:ring-primary-100'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              } ${checkInDate ? 'text-gray-900' : 'text-gray-400'}`}
              style={{ colorScheme: 'light' }}
            />
            {errors.checkInDate && (
              <p className="text-xs text-red-600 mt-1 px-1">{errors.checkInDate}</p>
            )}
          </div>
        </div>

        {/* Check-out Date */}
        <div className="flex flex-col relative">
          <label className="text-xs font-semibold text-gray-700 mb-1.5 px-1">
            Check-out Date
          </label>
          <div className={`relative transition-all duration-200 ${
            focusedField === 'checkOut' ? 'z-20' : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <Calendar className={`w-5 h-5 transition-colors ${
                focusedField === 'checkOut' || checkOutDate
                  ? 'text-primary-500'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => {
                setCheckOutDate(e.target.value);
                if (errors.checkOutDate) {
                  setErrors({ ...errors, checkOutDate: '' });
                }
              }}
              onFocus={() => setFocusedField('checkOut')}
              onBlur={() => setFocusedField(null)}
              min={checkInDate || new Date().toISOString().split('T')[0]}
              className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:outline-none transition-all duration-200 font-medium cursor-pointer ${
                errors.checkOutDate 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                  : focusedField === 'checkOut'
                  ? 'border-primary-500 bg-white focus:ring-2 focus:ring-primary-100'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              } ${checkOutDate ? 'text-gray-900' : 'text-gray-400'}`}
              style={{ colorScheme: 'light' }}
            />
            {errors.checkOutDate && (
              <p className="text-xs text-red-600 mt-1 px-1">{errors.checkOutDate}</p>
            )}
          </div>
        </div>

        {/* Number of Guests */}
        <div className="flex flex-col relative">
          <label className="text-xs font-semibold text-gray-700 mb-1.5 px-1">
            Guests
          </label>
          <div className={`relative transition-all duration-200 ${
            focusedField === 'guests' ? 'z-20' : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Users className={`w-5 h-5 transition-colors ${
                focusedField === 'guests' || guests
                  ? 'text-primary-500'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="number"
              placeholder="Number of guests"
              value={guests}
              onChange={(e) => {
                setGuests(e.target.value);
                if (errors.guests) {
                  setErrors({ ...errors, guests: '' });
                }
              }}
              onFocus={() => setFocusedField('guests')}
              onBlur={() => setFocusedField(null)}
              min="1"
              className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:outline-none transition-all duration-200 placeholder:text-gray-400 text-gray-900 font-medium ${
                errors.guests 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                  : focusedField === 'guests'
                  ? 'border-primary-500 bg-white focus:ring-2 focus:ring-primary-100'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            />
            {errors.guests && (
              <p className="text-xs text-red-600 mt-1 px-1">{errors.guests}</p>
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

export default ResortHouseBookingInputs;