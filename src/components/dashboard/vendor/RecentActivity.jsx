import { Info } from "lucide-react";

/**
 * Recent Activity Component
 * Displays recent user interactions and booking activities
 */
export default function RecentActivity() {
  // Sample data - replace with actual data from API
  const activities = [
    {
      id: 1,
      message: "Emmanuel created a new booking for luxury sedan.",
      time: "2 mins ago",
    },
    {
      id: 2,
      message: "Emmanuel created a new booking for luxury sedan.",
      time: "2 mins ago",
    },
    {
      id: 3,
      message: "Emmanuel created a new booking for luxury sedan.",
      time: "2 mins ago",
    },
    {
      id: 4,
      message: "Emmanuel created a new booking for luxury sedan.",
      time: "2 mins ago",
    },
    {
      id: 5,
      message: "Emmanuel created a new booking for luxury sedan.",
      time: "2 mins ago",
    },
    {
      id: 6,
      message: "Emmanuel created a new booking for luxury sedan.",
      time: "2 mins ago",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1 sm:mb-2">
        <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
        Latest interactions and changes in customer profiles.
      </p>

      {/* Activity List */}
      <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div 
            key={activity.id}
            className="flex items-start justify-between gap-2 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-primary-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-500" />
              </div>
              <p className="text-xs sm:text-sm text-gray-700 break-words">{activity.message}</p>
            </div>
            <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
