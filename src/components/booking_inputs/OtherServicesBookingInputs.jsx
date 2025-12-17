import { useState, useRef, useEffect } from 'react';
import { Sparkles, Search } from 'lucide-react';

const OtherServicesBookingInputs = ({ onSearch, showBorder = true }) => {
  const [query, setQuery] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredServices, setFilteredServices] = useState([]);
  const [focusedField, setFocusedField] = useState(null);
  const dropdownRef = useRef(null);

  const otherServices = [
    'Laundry Service in Lagos',
    'Laundry Service in Ikeja, Lagos',
    'Laundry Service in Lekki, Lagos',
    'Laundry Service in Victoria Island, Lagos',
    'Laundry Service in Abuja',
    'Dry Cleaning in Lagos',
    'Dry Cleaning in Lekki, Lagos',
    'Dry Cleaning in Victoria Island, Lagos',
    'Dry Cleaning in Abuja',
    'Ironing Service in Lagos',
    'Pickup & Delivery Laundry in Lagos',
    'Pickup & Delivery Laundry in Abuja',
    'Express Laundry in Lagos',
    'Commercial Laundry in Lagos'
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
    
    if (!query.trim()) {
      newErrors.query = 'Please describe what you are looking for';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    if (errors.query) {
      setErrors({ ...errors, query: '' });
    }

    if (value.trim()) {
      const filtered = otherServices.filter(service =>
        service.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredServices(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredServices([]);
      setShowSuggestions(false);
    }
  };

  const handleServiceSelect = (service) => {
    setQuery(service);
    setShowSuggestions(false);
    if (errors.query) {
      setErrors({ ...errors, query: '' });
    }
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
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Service Query */}
        <div className="flex flex-col relative" ref={dropdownRef}>
          <label className="text-xs font-semibold text-gray-700 mb-1.5 px-1">
            What are you looking for?
          </label>
          <div className={`relative transition-all duration-200 ${
            focusedField === 'query' ? 'z-20' : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Sparkles className={`w-5 h-5 transition-colors ${
                focusedField === 'query' || query
                  ? 'text-primary-500'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="text"
              placeholder="Describe your service need"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => {
                setFocusedField('query');
                if (query.trim() && filteredServices.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:outline-none transition-all duration-200 placeholder:text-gray-400 text-gray-900 font-medium ${
                errors.query 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                  : focusedField === 'query'
                  ? 'border-primary-500 bg-white focus:ring-2 focus:ring-primary-100'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            />
            {errors.query && (
              <p className="text-xs text-red-600 mt-1 px-1">{errors.query}</p>
            )}
          </div>
          
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto z-50">
              {filteredServices.length > 0 ? (
                filteredServices.map((service, index) => (
                  <div
                    key={index}
                    onClick={() => handleServiceSelect(service)}
                    className="px-4 py-3 hover:bg-primary-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
                  >
                    <Sparkles className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                    <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">{service}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-gray-500 text-sm text-center">
                  Service not found
                </div>
              )}
            </div>
          )}
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

export default OtherServicesBookingInputs;