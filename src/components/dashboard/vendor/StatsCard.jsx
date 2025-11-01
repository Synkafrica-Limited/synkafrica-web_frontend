import { TrendingUp } from "lucide-react";

/**
 * Stats Card Component for Dashboard Metrics
 * Displays key metrics with icon, value, and trend
 */
export default function StatsCard({ icon: Icon, title, value, trend, link }) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <span className="text-xs sm:text-sm text-gray-600">{title}</span>
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{value}</div>
          {trend && (
            <div className="flex items-center gap-1 text-xs sm:text-sm text-green-600">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>+{trend}</span>
            </div>
          )}
        </div>
        
        {link && (
          <a 
            href={link} 
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline whitespace-nowrap"
          >
            See all →
          </a>
        )}
      </div>
    </div>
  );
}
