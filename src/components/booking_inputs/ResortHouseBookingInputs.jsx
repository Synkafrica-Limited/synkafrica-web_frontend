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
        service: 'hotel',
        destination: destination.trim(),
        checkInDate,
        checkOutDate,
        guests: parseInt(guests)
      });
    }
  };

  const isFormValid = destination.trim() && checkInDate && checkOutDate && guests && parseInt(guests) >= 1;

  return (
    <div
      className={`mt-4 sm:mt-6 p-4 sm:p-6 bg-white rounded-3xl relative ${
        showBorder
          ? 'shadow-[0_20px_60px_-15px_rgba(223,93,61,0.4),0_10px_30px_-10px_rgba(223,93,61,0.3)] border border-orange-50'
          : ''
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4">
        {/* Destination */}
        <div className="flex flex-col relative" ref={dropdownRef}>
          <div className={`relative transition-all duration-200 ${
            focusedField === 'destination' 
              ? 'ring-2 ring-[#DF5D3D]/20 rounded-xl' 
              : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <MapPin className={`w-5 h-5 transition-colors ${
                focusedField === 'destination' || destination
                  ? 'text-[#DF5D3D]'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e) => handleDestinationChange(e.target.value)}
              onFocus={() => {
                setFocusedField('destination');
                if (destination.trim() && filteredDestinations.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-200 placeholder:text-gray-400 ${
                errors.destination 
                  ? 'border-red-400 bg-red-50/30' 
                  : focusedField === 'destination'
                  ? 'border-[#DF5D3D] bg-orange-50/30'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
              }`}
            />
          </div>
          
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-xl max-h-64 overflow-y-auto z-20">
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map((dest, index) => (
                  <div
                    key={index}
                    onClick={() => handleDestinationSelect(dest)}
                    className="px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
                  >
                    <MapPin className="w-4 h-4 text-gray-400 group-hover:text-[#DF5D3D] transition-colors" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{dest}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-gray-500 text-sm text-center">
                  No destinations found matching your search.
                </div>
              )}
            </div>
          )}
          
          {errors.destination && (
            <span className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.destination}</span>
          )}
        </div>

        {/* Check-in Date */}
        <div className="flex flex-col relative">
          <div className={`relative transition-all duration-200 ${
            focusedField === 'checkIn' 
              ? 'ring-2 ring-[#DF5D3D]/20 rounded-xl' 
              : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <Calendar className={`w-5 h-5 transition-colors ${
                focusedField === 'checkIn' || checkInDate
                  ? 'text-[#DF5D3D]'
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
              className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-200 [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
                errors.checkInDate 
                  ? 'border-red-400 bg-red-50/30' 
                  : focusedField === 'checkIn'
                  ? 'border-[#DF5D3D] bg-orange-50/30'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
              } ${checkInDate || focusedField === 'checkIn' ? 'text-gray-900' : 'text-transparent'}`}
              style={{ colorScheme: 'light' }}
            />
            {!checkInDate && focusedField !== 'checkIn' && (
              <span className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[15px] z-0">
                Check-in date
              </span>
            )}
          </div>
          
          {errors.checkInDate && (
            <span className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.checkInDate}</span>
          )}
        </div>

        {/* Check-out Date */}
        <div className="flex flex-col relative">
          <div className={`relative transition-all duration-200 ${
            focusedField === 'checkOut' 
              ? 'ring-2 ring-[#DF5D3D]/20 rounded-xl' 
              : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <Calendar className={`w-5 h-5 transition-colors ${
                focusedField === 'checkOut' || checkOutDate
                  ? 'text-[#DF5D3D]'
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
              className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-200 [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
                errors.checkOutDate 
                  ? 'border-red-400 bg-red-50/30' 
                  : focusedField === 'checkOut'
                  ? 'border-[#DF5D3D] bg-orange-50/30'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
              } ${checkOutDate || focusedField === 'checkOut' ? 'text-gray-900' : 'text-transparent'}`}
              style={{ colorScheme: 'light' }}
            />
            {!checkOutDate && focusedField !== 'checkOut' && (
              <span className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[15px] z-0">
                Check-out date
              </span>
            )}
          </div>
          
          {errors.checkOutDate && (
            <span className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.checkOutDate}</span>
          )}
        </div>

        {/* Number of Guests */}
        <div className="flex flex-col relative">
          <div className={`relative transition-all duration-200 ${
            focusedField === 'guests' 
              ? 'ring-2 ring-[#DF5D3D]/20 rounded-xl' 
              : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Users className={`w-5 h-5 transition-colors ${
                focusedField === 'guests' || guests
                  ? 'text-[#DF5D3D]'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="number"
              placeholder="Guests"
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
              className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-200 placeholder:text-gray-400 ${
                errors.guests 
                  ? 'border-red-400 bg-red-50/30' 
                  : focusedField === 'guests'
                  ? 'border-[#DF5D3D] bg-orange-50/30'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
              }`}
            />
          </div>
          
          {errors.guests && (
            <span className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.guests}</span>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={!isFormValid}
          className={`px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            isFormValid
              ? 'bg-[#DF5D3D] hover:bg-[#c94e30] active:bg-[#b33d20] text-white shadow-lg shadow-[#DF5D3D]/30 hover:shadow-xl hover:shadow-[#DF5D3D]/40 hover:-translate-y-0.5'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="hidden sm:inline">Search Hotels</span>
          <span className="sm:hidden">Search</span>
        </button>
      </div>
    </div>
  );
};

export default ResortHouseBookingInputs;