import { useState, useRef, useEffect } from 'react';
import { MapPin, Calendar, Clock, Search } from 'lucide-react';

const CarRentalBookingInputs = ({ onSearch, showBorder = true }) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [focusedField, setFocusedField] = useState(null);
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
      className={`mt-4 sm:mt-6 p-4 sm:p-6 bg-white rounded-3xl relative ${
        showBorder
          ? 'shadow-[0_20px_60px_-15px_rgba(223,93,61,0.4),0_10px_30px_-10px_rgba(223,93,61,0.3)] border border-orange-50'
          : ''
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Pickup Location */}
        <div className="flex flex-col relative" ref={dropdownRef}>
          <div className={`relative transition-all duration-200 ${
            focusedField === 'location' 
              ? 'ring-2 ring-[#DF5D3D]/20 rounded-xl' 
              : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <MapPin className={`w-5 h-5 transition-colors ${
                focusedField === 'location' || pickupLocation
                  ? 'text-[#DF5D3D]'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="text"
              placeholder="Pickup location"
              value={pickupLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              onFocus={() => {
                setFocusedField('location');
                if (pickupLocation.trim() && filteredLocations.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-200 placeholder:text-gray-400 ${
                errors.pickupLocation 
                  ? 'border-red-400 bg-red-50/30' 
                  : focusedField === 'location'
                  ? 'border-[#DF5D3D] bg-orange-50/30'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
              }`}
            />
          </div>
          
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-xl max-h-64 overflow-y-auto z-20">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location, index) => (
                  <div
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className="px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
                  >
                    <MapPin className="w-4 h-4 text-gray-400 group-hover:text-[#DF5D3D] transition-colors" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{location}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-gray-500 text-sm text-center">
                  Sorry, our service is not available in this location yet.
                </div>
              )}
            </div>
          )}
          
          {errors.pickupLocation && (
            <span className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.pickupLocation}</span>
          )}
        </div>

        {/* Pickup Date */}
        <div className="flex flex-col relative">
          <div className={`relative transition-all duration-200 ${
            focusedField === 'date' 
              ? 'ring-2 ring-[#DF5D3D]/20 rounded-xl' 
              : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <Calendar className={`w-5 h-5 transition-colors ${
                focusedField === 'date' || pickupDate
                  ? 'text-[#DF5D3D]'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => {
                setPickupDate(e.target.value);
                if (errors.pickupDate) {
                  setErrors({ ...errors, pickupDate: '' });
                }
              }}
              onFocus={() => setFocusedField('date')}
              onBlur={() => setFocusedField(null)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                errors.pickupDate 
                  ? 'border-red-400 bg-red-50/30' 
                  : focusedField === 'date'
                  ? 'border-[#DF5D3D] bg-orange-50/30'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
              } ${pickupDate || focusedField === 'date' ? 'text-gray-900' : 'text-transparent'}`}
              style={{ colorScheme: 'light' }}
            />
            {!pickupDate && focusedField !== 'date' && (
              <span className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[15px] z-0">
                Pickup date
              </span>
            )}
          </div>
          
          {errors.pickupDate && (
            <span className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.pickupDate}</span>
          )}
        </div>

        {/* Pickup Time */}
        <div className="flex flex-col relative">
          <div className={`relative transition-all duration-200 ${
            focusedField === 'time' 
              ? 'ring-2 ring-[#DF5D3D]/20 rounded-xl' 
              : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <Clock className={`w-5 h-5 transition-colors ${
                focusedField === 'time' || pickupTime
                  ? 'text-[#DF5D3D]'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => {
                setPickupTime(e.target.value);
                if (errors.pickupTime) {
                  setErrors({ ...errors, pickupTime: '' });
                }
              }}
              onFocus={() => setFocusedField('time')}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-200 [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
                errors.pickupTime 
                  ? 'border-red-400 bg-red-50/30' 
                  : focusedField === 'time'
                  ? 'border-[#DF5D3D] bg-orange-50/30'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
              } ${pickupTime || focusedField === 'time' ? 'text-gray-900' : 'text-transparent'}`}
              style={{ colorScheme: 'light' }}
            />
            {!pickupTime && focusedField !== 'time' && (
              <span className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[15px] z-0">
                Pickup time
              </span>
            )}
          </div>
          
          {errors.pickupTime && (
            <span className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.pickupTime}</span>
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
          <span className="hidden sm:inline">Search Cars</span>
          <span className="sm:hidden">Search</span>
        </button>
      </div>
    </div>
  );
};

export default CarRentalBookingInputs;