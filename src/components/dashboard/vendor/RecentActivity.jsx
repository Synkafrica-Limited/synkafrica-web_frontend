import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import fallback from "@/lib/fallbackData/dashboard/recentActivity.json";

/**
 * Recent Activity Component
 * Displays recent activity provided by backend (fallback to local JSON)
 */
export default function RecentActivity({ activities }) {
  const list = activities && activities.length ? activities : fallback;

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-1 sm:mb-2">
        <FontAwesomeIcon icon={faCircleInfo} className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
        Latest events from your business.
      </p>

      <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
        {list.map((activity) => (
          <div 
            key={activity.id}
            className="flex items-start justify-between gap-2 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-primary-500 flex items-center justify-center shrink-0 mt-0.5">
                <FontAwesomeIcon icon={faCircleInfo} className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-500" />
              </div>
              <p className="text-xs sm:text-sm text-gray-700 wrap-break-word">{activity.message}</p>
            </div>
            <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap shrink-0">
              {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
