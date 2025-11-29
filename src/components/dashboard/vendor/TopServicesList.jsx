/**
 * Top Services List Component
 * Displays top performing services by price sold
 */
import fallback from "@/lib/fallbackData/dashboard/topServices.json";

export default function TopServicesList({ topServices }) {
  const services = topServices && topServices.length ? topServices : fallback;

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
        Top services by price sold
      </h3>

      <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-none overflow-y-auto">
        {services.map((service, index) => (
          <div 
            key={service.id || index}
            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <span className="text-xs sm:text-sm text-gray-700 truncate mr-2">{service.name}</span>
            <span className="text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">{typeof service.price === 'number' ? `₦${service.price.toLocaleString()}` : service.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
