import { useState } from 'react';

const FlightBookingInputs = ({ onSearch }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};
    
    if (!from.trim()) {
      newErrors.from = 'Departure location is required';
    }
    
    if (!to.trim()) {
      newErrors.to = 'Destination is required';
    }
    
    if (!departureDate) {
      newErrors.departureDate = 'Departure date is required';
    } else {
      const selectedDate = new Date(departureDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.departureDate = 'Date cannot be in the past';
      }
    }
    
    if (!departureTime) {
      newErrors.departureTime = 'Departure time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = () => {
    if (validateInputs()) {
      onSearch({
        service: 'flight',
        from: from.trim(),
        to: to.trim(),
        departureDate,
        departureTime
      });
    }
  };

  const isFormValid = from.trim() && to.trim() && departureDate && departureTime;

  return (
    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="From"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              if (errors.from) {
                setErrors({ ...errors, from: '' });
              }
            }}
            className={`px-4 py-3 border-3 border-primary-500 rounded-lg focus:outline-none ${
              errors.from ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.from && (
            <span className="text-red-500 text-xs mt-1">{errors.from}</span>
          )}
        </div>

        <div className="flex flex-col">
          <input
            type="text"
            placeholder="To"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              if (errors.to) {
                setErrors({ ...errors, to: '' });
              }
            }}
            className={`px-4 py-3 border-3 border-primary-500 rounded-lg focus:outline-none ${
              errors.to ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.to && (
            <span className="text-red-500 text-xs mt-1">{errors.to}</span>
          )}
        </div>

        <div className="flex flex-col">
          <input
            type="date"
            value={departureDate}
            onChange={(e) => {
              setDepartureDate(e.target.value);
              if (errors.departureDate) {
                setErrors({ ...errors, departureDate: '' });
              }
            }}
            min={new Date().toISOString().split('T')[0]}
            className={`px-4 py-3 border-3 border-primary-500 rounded-lg focus:outline-none ${
              errors.departureDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.departureDate && (
            <span className="text-red-500 text-xs mt-1">{errors.departureDate}</span>
          )}
        </div>

        <div className="flex flex-col">
          <input
            type="time"
            value={departureTime}
            onChange={(e) => {
              setDepartureTime(e.target.value);
              if (errors.departureTime) {
                setErrors({ ...errors, departureTime: '' });
              }
            }}
            className={`px-4 py-3 border-3 border-primary-500 rounded-lg focus:outline-none ${
              errors.departureTime ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.departureTime && (
            <span className="text-red-500 text-xs mt-1">{errors.departureTime}</span>
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
          Search Flights
        </button>
      </div>
    </div>
  );
};

export default FlightBookingInputs;