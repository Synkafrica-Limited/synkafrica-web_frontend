import { useState, useRef, useEffect } from 'react';
import { UtensilsCrossed, Calendar, Clock, Users, Search } from 'lucide-react';

const DiningBookingInputs = ({ onSearch, showBorder = true }) => {
  const [restaurant, setRestaurant] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [guests, setGuests] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [focusedField, setFocusedField] = useState(null);
  const dropdownRef = useRef(null);

  const restaurants = [
    'Private Dining in Ikeja, Lagos',
    'Fine Dining in Lekki, Lagos',
    'Group Dining in Victoria Island, Lagos',
    'Event Capacity in Victoria Island, Lagos',
    'Premium Dining in Ajah, Lagos',
    'Casual Dining in Surulere, Lagos',
    'Family Dining in Yaba, Lagos',
    'Rooftop Dining in Ikoyi, Lagos',
    'Waterfront Dining in Lekki, Lagos',
    'Buffet Dining in Ikeja, Lagos',
    'Fine Dining in Maitama, Abuja',
    'Private Dining in Wuse, Abuja',
    'Group Dining in Garki, Abuja',
    'Premium Dining in Port Harcourt, Rivers',
    'Casual Dining in Ibadan, Oyo',
    'Event Capacity in Lekki, Lagos'
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
    
    if (!restaurant.trim()) {
      newErrors.restaurant = 'Restaurant or cuisine is required';
    }
    
    if (!bookingDate) {
      newErrors.bookingDate = 'Booking date is required';
    } else {
      const selectedDate = new Date(bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.bookingDate = 'Date cannot be in the past';
      }
    }
    
    if (!bookingTime) {
      newErrors.bookingTime = 'Booking time is required';
    }
    
    if (!guests) {
      newErrors.guests = 'Number of guests is required';
    } else if (parseInt(guests) < 1) {
      newErrors.guests = 'At least 1 guest is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRestaurantChange = (value) => {
    setRestaurant(value);
    if (errors.restaurant) {
      setErrors({ ...errors, restaurant: '' });
    }

    if (value.trim()) {
      const filtered = restaurants.filter(rest =>
        rest.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRestaurants(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredRestaurants([]);
      setShowSuggestions(false);
    }
  };

  const handleRestaurantSelect = (rest) => {
    setRestaurant(rest);
    setShowSuggestions(false);
    if (errors.restaurant) {
      setErrors({ ...errors, restaurant: '' });
    }
  };

  const handleSearch = () => {
    if (validateInputs()) {
      onSearch({
        service: 'dining',
        restaurant: restaurant.trim(),
        bookingDate,
        bookingTime,
        guests: parseInt(guests)
      });
    }
  };

  const isFormValid = restaurant.trim() && bookingDate && bookingTime && guests && parseInt(guests) >= 1;

  return (
    <div
      className={`mt-4 sm:mt-6 p-4 sm:p-6 bg-white rounded-3xl relative ${
        showBorder
          ? 'shadow-[0_20px_60px_-15px_rgba(223,93,61,0.4),0_10px_30px_-10px_rgba(223,93,61,0.3)] border border-orange-50'
          : ''
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4">
        {/* Restaurant/Cuisine */}
        <div className="flex flex-col relative" ref={dropdownRef}>
          <div className={`relative transition-all duration-200 ${
            focusedField === 'restaurant' 
              ? 'ring-2 ring-[#DF5D3D]/20 rounded-xl' 
              : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <UtensilsCrossed className={`w-5 h-5 transition-colors ${
                focusedField === 'restaurant' || restaurant
                  ? 'text-[#DF5D3D]'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="text"
              placeholder="Restaurant type or location"
              value={restaurant}
              onChange={(e) => handleRestaurantChange(e.target.value)}
              onFocus={() => {
                setFocusedField('restaurant');
                if (restaurant.trim() && filteredRestaurants.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-200 placeholder:text-gray-400 ${
                errors.restaurant 
                  ? 'border-red-400 bg-red-50/30' 
                  : focusedField === 'restaurant'
                  ? 'border-[#DF5D3D] bg-orange-50/30'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
              }`}
            />
          </div>
          
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-xl max-h-64 overflow-y-auto z-20">
              {filteredRestaurants.length > 0 ? (
                filteredRestaurants.map((rest, index) => (
                  <div
                    key={index}
                    onClick={() => handleRestaurantSelect(rest)}
                    className="px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
                  >
                    <UtensilsCrossed className="w-4 h-4 text-gray-400 group-hover:text-[#DF5D3D] transition-colors" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{rest}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-gray-500 text-sm text-center">
                  No restaurants found matching your search.
                </div>
              )}
            </div>
          )}
          
          {errors.restaurant && (
            <span className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.restaurant}</span>
          )}
        </div>

        {/* Booking Date */}
        <div className="flex flex-col relative">
          <div className={`relative transition-all duration-200 ${
            focusedField === 'date' 
              ? 'ring-2 ring-[#DF5D3D]/20 rounded-xl' 
              : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <Calendar className={`w-5 h-5 transition-colors ${
                focusedField === 'date' || bookingDate
                  ? 'text-[#DF5D3D]'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => {
                setBookingDate(e.target.value);
                if (errors.bookingDate) {
                  setErrors({ ...errors, bookingDate: '' });
                }
              }}
              onFocus={() => setFocusedField('date')}
              onBlur={() => setFocusedField(null)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-200 [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
                errors.bookingDate 
                  ? 'border-red-400 bg-red-50/30' 
                  : focusedField === 'date'
                  ? 'border-[#DF5D3D] bg-orange-50/30'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
              } ${bookingDate || focusedField === 'date' ? 'text-gray-900' : 'text-transparent'}`}
              style={{ colorScheme: 'light' }}
            />
            {!bookingDate && focusedField !== 'date' && (
              <span className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[15px] z-0">
                Booking date
              </span>
            )}
          </div>
          
          {errors.bookingDate && (
            <span className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.bookingDate}</span>
          )}
        </div>

        {/* Booking Time */}
        <div className="flex flex-col relative">
          <div className={`relative transition-all duration-200 ${
            focusedField === 'time' 
              ? 'ring-2 ring-[#DF5D3D]/20 rounded-xl' 
              : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <Clock className={`w-5 h-5 transition-colors ${
                focusedField === 'time' || bookingTime
                  ? 'text-[#DF5D3D]'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="time"
              value={bookingTime}
              onChange={(e) => {
                setBookingTime(e.target.value);
                if (errors.bookingTime) {
                  setErrors({ ...errors, bookingTime: '' });
                }
              }}
              onFocus={() => setFocusedField('time')}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-200 [&::-webkit-calendar-picker-indicator]:cursor-pointer ${
                errors.bookingTime 
                  ? 'border-red-400 bg-red-50/30' 
                  : focusedField === 'time'
                  ? 'border-[#DF5D3D] bg-orange-50/30'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
              } ${bookingTime || focusedField === 'time' ? 'text-gray-900' : 'text-transparent'}`}
              style={{ colorScheme: 'light' }}
            />
            {!bookingTime && focusedField !== 'time' && (
              <span className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[15px] z-0">
                Booking time
              </span>
            )}
          </div>
          
          {errors.bookingTime && (
            <span className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.bookingTime}</span>
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
          <span className="hidden sm:inline">Book Table</span>
          <span className="sm:hidden">Book</span>
        </button>
      </div>
    </div>
  );
};

export default DiningBookingInputs;