import { useState, useRef, useEffect } from 'react';

const WaterRecreationBookingInputs = ({ onSearch }) => {
  const [activity, setActivity] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const dropdownRef = useRef(null);

  const waterActivities = [
    'Jet Ski Rental in Lekki, Lagos',
    'Jet Ski Rental in Ajah, Lagos',
    'Jet Ski Rental in Victoria Island, Lagos',
    'Boat Rental in Lekki, Lagos',
    'Boat Rental in Victoria Island, Lagos',
    'Boat Rental in Ikoyi, Lagos',
    'Yacht Rental in Lekki, Lagos',
    'Yacht Rental in Victoria Island, Lagos',
    'Boat Party in Lekki, Lagos',
    'Boat Party in Victoria Island, Lagos',
    'Yacht Party in Lekki, Lagos',
    'Yacht Party in Victoria Island, Lagos',
    'Sunset Cruise in Lagos',
    'Island Hopping in Lagos',
    'Private Boat Tour in Lagos',
    'Jet Ski Rental in Calabar',
    'Boat Rental in Calabar',
    'Yacht Party in Calabar',
    'Jet Ski Rental in Port Harcourt',
    'Boat Party in Port Harcourt',
    'Beach Water Sports in Badagry, Lagos'
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
    
    if (!activity.trim()) {
      newErrors.activity = 'Activity or experience is required';
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleActivityChange = (value) => {
    setActivity(value);
    if (errors.activity) {
      setErrors({ ...errors, activity: '' });
    }

    // Filter activities based on input
    if (value.trim()) {
      const filtered = waterActivities.filter(act =>
        act.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredActivities(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredActivities([]);
      setShowSuggestions(false);
    }
  };

  const handleActivitySelect = (act) => {
    setActivity(act);
    setShowSuggestions(false);
    if (errors.activity) {
      setErrors({ ...errors, activity: '' });
    }
  };

  const handleSearch = () => {
    if (validateInputs()) {
      onSearch({
        service: 'water-recreation',
        activity: activity.trim(),
        bookingDate,
        bookingTime
      });
    }
  };

  const isFormValid = activity.trim() && bookingDate && bookingTime;

  return (
    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="flex flex-col relative" ref={dropdownRef}>
        <input
        type="text"
        placeholder="Activity or experience"
        value={activity}
        onChange={(e) => handleActivityChange(e.target.value)}
        onFocus={() => {
          if (activity.trim() && filteredActivities.length > 0) {
          setShowSuggestions(true);
          }
        }}
        className={`px-4 py-3 border-3 border-primary-500 rounded-lg focus:outline-none ${
          errors.activity ? 'border-red-500' : ''
        }`}
        />
        {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
          {filteredActivities.length > 0 ? (
          filteredActivities.map((act, index) => (
            <div
            key={index}
            onClick={() => handleActivitySelect(act)}
            className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
            >
            {act}
            </div>
          ))
          ) : (
          <div className="px-4 py-3 text-gray-500 text-sm">
            Sorry, this water recreation activity is not available yet.
          </div>
          )}
        </div>
        )}
        {errors.activity && (
        <span className="text-red-500 text-xs mt-1">{errors.activity}</span>
        )}
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
        className={`px-4 py-3 border-3 border-primary-500 rounded-lg focus:outline-none ${
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
        className={`px-4 py-3 border-3 border-primary-500 rounded-lg focus:outline-none ${
          errors.bookingTime ? 'border-red-500' : ''
        }`}
        />
        {errors.bookingTime && (
        <span className="text-red-500 text-xs mt-1">{errors.bookingTime}</span>
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
        Book Activity
      </button>
      </div>
    </div>
    );
};

export default WaterRecreationBookingInputs;