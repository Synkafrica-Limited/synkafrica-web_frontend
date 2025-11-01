/**
 * Top Services List Component
 * Displays top performing services by price sold
 */
export default function TopServicesList() {
  // Sample data - replace with actual data from API
  const services = [
    { name: "Jet Ski", price: "₦100k" },
    { name: "Jollof rice", price: "₦100k" },
    { name: "Wash & rinse", price: "₦100k" },
    { name: "Benz", price: "₦100k" },

    { name: "Wash & rinse", price: "₦100k" },
    { name: "Benz", price: "₦100k" },
  ];

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
        Top service by price sold
      </h3>
      
      <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-none overflow-y-auto">
        {services.map((service, index) => (
          <div 
            key={index}
            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <span className="text-xs sm:text-sm text-gray-700 truncate mr-2">{service.name}</span>
            <span className="text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">{service.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
