import { useState, useRef, useEffect } from 'react';

const DiningBookingInputs = ({ onSearch }) => {
  const [restaurant, setRestaurant] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [guests, setGuests] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
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

    // Filter restaurants based on input
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
    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="flex flex-col relative" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Restaurant type or location"
            value={restaurant}
            onChange={(e) => handleRestaurantChange(e.target.value)}
            onFocus={() => {
              if (restaurant.trim() && filteredRestaurants.length > 0) {
                setShowSuggestions(true);
              }
            }}
            className={`px-4 py-3 rounded-lg focus:outline-none border-3 border-primary-500 ${
              errors.restaurant ? 'border-red-500' : ''
            }`}
          />
          {/* Rest of dropdown code remains the same */}
        </div>

        <div className="flex flex-col">
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => {
              setBookingDate(e.target.value);
              if (errors.bookingDate) {
                setErrors({ ...errors, bookingDate: '' });
              }
            }}
            min={new Date().toISOString().split('T')[0]}
            className={`px-4 py-3 rounded-lg focus:outline-none border-3 border-primary-500 ${
              errors.bookingDate ? 'border-red-500' : ''
            }`}
          />
          {errors.bookingDate && (
            <span className="text-red-500 text-xs mt-1">{errors.bookingDate}</span>
          )}
        </div>

        <div className="flex flex-col">
          <input
            type="time"
            value={bookingTime}
            onChange={(e) => {
              setBookingTime(e.target.value);
              if (errors.bookingTime) {
                setErrors({ ...errors, bookingTime: '' });
              }
            }}
            className={`px-4 py-3 rounded-lg focus:outline-none border-3 border-primary-500 ${
              errors.bookingTime ? 'border-red-500' : ''
            }`}
          />
          {errors.bookingTime && (
            <span className="text-red-500 text-xs mt-1">{errors.bookingTime}</span>
          )}
        </div>

        <div className="flex flex-col">
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
            min="1"
            className={`px-4 py-3 rounded-lg focus:outline-none border-3 border-primary-500 ${
              errors.guests ? 'border-red-500' : ''
            }`}
          />
          {errors.guests && (
            <span className="text-red-500 text-xs mt-1">{errors.guests}</span>
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
          Book Table
        </button>
      </div>
    </div>
  );
};

export default DiningBookingInputs;