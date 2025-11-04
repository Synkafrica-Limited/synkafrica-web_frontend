import { useState } from 'react';

const OtherServicesBookingInputs = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};
    
    if (!query.trim()) {
      newErrors.query = 'Please describe what you are looking for';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = () => {
    if (validateInputs()) {
      onSearch({
        service: 'other',
        query: query.trim()
      });
    }
  };

  const isFormValid = query.trim();

  return (
    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="What are you looking for?"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (errors.query) {
                setErrors({ ...errors, query: '' });
              }
            }}
            className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
              errors.query ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.query && (
            <span className="text-red-500 text-xs mt-1">{errors.query}</span>
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
          Get Started
        </button>
      </div>
    </div>
  );
};

export default OtherServicesBookingInputs;