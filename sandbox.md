const FlightBookingInputs = ({ onSearch }) => (
  <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)]">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <input type="text" placeholder="From" className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
      <input type="text" placeholder="To" className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
      <input type="date" className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
      <button onClick={() => onSearch({ service: 'flight' })} className="px-6 py-3 bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-medium">
        Search Flights
      </button>
    </div>
  </div>
);