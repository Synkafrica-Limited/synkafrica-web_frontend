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
    <div
      className={`mt-4 sm:mt-6 p-4 sm:p-6 bg-white rounded-3xl relative ${
        showBorder
          ? 'shadow-[0_20px_60px_-15px_rgba(223,93,61,0.4),0_10px_30px_-10px_rgba(223,93,61,0.3)] border border-orange-50'
          : ''
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* Service Query */}
        <div className="flex flex-col relative" ref={dropdownRef}>
          <div className={`relative transition-all duration-200 ${
            focusedField === 'query' 
              ? 'ring-2 ring-[#DF5D3D]/20 rounded-xl' 
              : ''
          }`}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Sparkles className={`w-5 h-5 transition-colors ${
                focusedField === 'query' || query
                  ? 'text-[#DF5D3D]'
                  : 'text-gray-400'
              }`} />
            </div>
            <input
              type="text"
              placeholder="What are you looking for?"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => {
                setFocusedField('query');
                if (query.trim() && filteredServices.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => setFocusedField(null)}
              className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-200 placeholder:text-gray-400 ${
                errors.query 
                  ? 'border-red-400 bg-red-50/30' 
                  : focusedField === 'query'
                  ? 'border-[#DF5D3D] bg-orange-50/30'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
              }`}
            />
          </div>
          
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-xl max-h-64 overflow-y-auto z-20">
              {filteredServices.length > 0 ? (
                filteredServices.map((service, index) => (
                  <div
                    key={index}
                    onClick={() => handleServiceSelect(service)}
                    className="px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 group"
                  >
                    <Sparkles className="w-4 h-4 text-gray-400 group-hover:text-[#DF5D3D] transition-colors" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{service}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-gray-500 text-sm text-center">
                  No services found. Try describing what you need!
                </div>
              )}
            </div>
          )}
          
          {errors.query && (
            <span className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.query}</span>
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
          <span className="hidden sm:inline">Get Started</span>
          <span className="sm:hidden">Start</span>
        </button>
      </div>
    </div>
  );
};

export default OtherServicesBookingInputs;