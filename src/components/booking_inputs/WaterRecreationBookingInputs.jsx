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
    <div
      className={`mt-4 bg-white rounded-lg relative ${
        showBorder ? 'shadow-xl' : 'shadow-lg'
      }`}
    >
      <div className="p-2 grid grid-cols-1 md:grid-cols-4 gap-2">
        {/* Activity/Experience */}
        <div className="flex flex-col relative" ref={dropdownRef}>
          <div className={`relative transition-all duration-200 ${
            focusedField === 'activity' 
              ? 'ring-2 ring-[#DF5D3D]/20 rounded-xl' 
              : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Waves className={`w-5 h-5 transition-colors ${
                focusedField === 'activity' || activity
                  ? 'text-[#DF5D3D]'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="text"
              placeholder="Activity or experience"
              value={activity}
              onChange={(e) => handleActivityChange(e.target.value)}
              onFocus={() => {
                setFocusedField('activity');
                if (activity.trim() && filteredActivities.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-200 placeholder:text-gray-400 ${
                errors.activity 
                  ? 'border-red-400 bg-red-50/30' 
                  : focusedField === 'activity'
                  ? 'border-[#DF5D3D] bg-orange-50/30'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
              }`}
            />
          </div>
          
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-xl max-h-64 overflow-y-auto z-20">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((act, index) => (
                  <div
                    key={index}
                    onClick={() => handleActivitySelect(act)}
                    className="px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
                  >
                    <Waves className="w-4 h-4 text-gray-400 group-hover:text-[#DF5D3D] transition-colors" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{act}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-gray-500 text-sm text-center">
                  Sorry, this water recreation activity is not available yet.
                </div>
              )}
            </div>
          )}
          
          {errors.activity && (
            <span className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.activity}</span>
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

        {/* Search Button */}
        <div className="p-1">
          <button
            onClick={handleSearch}
            disabled={!isFormValid}
            className={`w-full h-full min-h-[50px] rounded-md font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              isFormValid
                ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-none'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Book Activity</span>
            <span className="sm:hidden">Book</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaterRecreationBookingInputs;