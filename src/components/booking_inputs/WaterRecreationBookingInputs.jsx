import { useState, useRef, useEffect } from 'react';
import { Waves, Calendar, Clock, Search } from 'lucide-react';

const WaterRecreationBookingInputs = ({ onSearch, showBorder = true }) => {
  const [activity, setActivity] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [focusedField, setFocusedField] = useState(null);
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
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Activity/Experience */}
        <div className="flex flex-col relative" ref={dropdownRef}>
          <label className="text-xs font-semibold text-gray-700 mb-1.5 px-1">
            Activity
          </label>
          <div className={`relative transition-all duration-200 ${
            focusedField === 'activity' ? 'z-20' : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Waves className={`w-5 h-5 transition-colors ${
                focusedField === 'activity' || activity
                  ? 'text-primary-500'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="text"
              placeholder="Water activity"
              value={activity}
              onChange={(e) => handleActivityChange(e.target.value)}
              onFocus={() => {
                setFocusedField('activity');
                if (activity.trim() && filteredActivities.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:outline-none transition-all duration-200 placeholder:text-gray-400 text-gray-900 font-medium ${
                errors.activity 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                  : focusedField === 'activity'
                  ? 'border-primary-500 bg-white focus:ring-2 focus:ring-primary-100'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            />
            {errors.activity && (
              <p className="text-xs text-red-600 mt-1 px-1">{errors.activity}</p>
            )}
          </div>
          
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto z-50">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((act, index) => (
                  <div
                    key={index}
                    onClick={() => handleActivitySelect(act)}
                    className="px-4 py-3 hover:bg-primary-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
                  >
                    <Waves className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                    <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">{act}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-gray-500 text-sm text-center">
                  Activity not found
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

export default WaterRecreationBookingInputs;