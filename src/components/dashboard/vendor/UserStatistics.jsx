import { Users } from "lucide-react";

/**
 * User Statistics Component
 * Displays key user metrics and insights
 */
export default function UserStatistics() {
  // Sample data - replace with actual data from API
  const stats = [
    {
      label: "New Users (Last 30 days)",
      value: "150",
    },
    {
      label: "Total Active Users",
      value: "1500",
    },
    {
      label: "Average Daily Orders",
      value: "500",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1 sm:mb-2">
        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">User Statistics</h3>
      </div>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
        Key insights into your user base.
      </p>

      {/* Statistics List */}
      <div className="space-y-4 sm:space-y-6">
        {stats.map((stat, index) => (
          <div key={index}>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
