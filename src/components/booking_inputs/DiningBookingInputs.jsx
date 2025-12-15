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
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Restaurant/Cuisine */}
        <div className="flex flex-col relative" ref={dropdownRef}>
          <label className="text-xs font-semibold text-gray-700 mb-1.5 px-1">
            Restaurant
          </label>
          <div className={`relative transition-all duration-200 ${
            focusedField === 'restaurant' ? 'z-20' : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <UtensilsCrossed className={`w-5 h-5 transition-colors ${
                focusedField === 'restaurant' || restaurant
                  ? 'text-primary-500'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="text"
              placeholder="Restaurant or cuisine"
              value={restaurant}
              onChange={(e) => handleRestaurantChange(e.target.value)}
              onFocus={() => {
                setFocusedField('restaurant');
                if (restaurant.trim() && filteredRestaurants.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:outline-none transition-all duration-200 placeholder:text-gray-400 text-gray-900 font-medium ${
                errors.restaurant 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                  : focusedField === 'restaurant'
                  ? 'border-primary-500 bg-white focus:ring-2 focus:ring-primary-100'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            />
            {errors.restaurant && (
              <p className="text-xs text-red-600 mt-1 px-1">{errors.restaurant}</p>
            )}
          </div>
          
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto z-50">
              {filteredRestaurants.length > 0 ? (
                filteredRestaurants.map((rest, index) => (
                  <div
                    key={index}
                    onClick={() => handleRestaurantSelect(rest)}
                    className="px-4 py-3 hover:bg-primary-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
                  >
                    <UtensilsCrossed className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                    <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">{rest}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-gray-500 text-sm text-center">
                  Restaurant not found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Booking Date */}
        <div className="flex flex-col relative">
          <label className="text-xs font-semibold text-gray-700 mb-1.5 px-1">
            Booking Date
          </label>
          <div className={`relative transition-all duration-200 ${
            focusedField === 'date' ? 'z-20' : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <Calendar className={`w-5 h-5 transition-colors ${
                focusedField === 'date' || bookingDate
                  ? 'text-primary-500'
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
              className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:outline-none transition-all duration-200 font-medium cursor-pointer ${
                errors.bookingDate 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                  : focusedField === 'date'
                  ? 'border-primary-500 bg-white focus:ring-2 focus:ring-primary-100'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              } ${bookingDate ? 'text-gray-900' : 'text-gray-400'}`}
              style={{ colorScheme: 'light' }}
            />
            {errors.bookingDate && (
              <p className="text-xs text-red-600 mt-1 px-1">{errors.bookingDate}</p>
            )}
          </div>
        </div>

        {/* Booking Time */}
        <div className="flex flex-col relative">
          <label className="text-xs font-semibold text-gray-700 mb-1.5 px-1">
            Booking Time
          </label>
          <div className={`relative transition-all duration-200 ${
            focusedField === 'time' ? 'z-20' : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <Clock className={`w-5 h-5 transition-colors ${
                focusedField === 'time' || bookingTime
                  ? 'text-primary-500'
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
              className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:outline-none transition-all duration-200 font-medium cursor-pointer ${
                errors.bookingTime 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                  : focusedField === 'time'
                  ? 'border-primary-500 bg-white focus:ring-2 focus:ring-primary-100'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              } ${bookingTime ? 'text-gray-900' : 'text-gray-400'}`}
              style={{ colorScheme: 'light' }}
            />
            {errors.bookingTime && (
              <p className="text-xs text-red-600 mt-1 px-1">{errors.bookingTime}</p>
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

export default DiningBookingInputs;