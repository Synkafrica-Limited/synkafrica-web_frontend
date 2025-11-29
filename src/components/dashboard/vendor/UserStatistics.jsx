import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faCalendarDays, faCreditCard, faPercent } from '@fortawesome/free-solid-svg-icons';
import fallback from "@/lib/fallbackData/dashboard/userStats.json";

/**
 * Vendor Statistics Component
 * Displays vendor-focused metrics (fallback to local JSON when backend data is absent)
 */
export default function UserStatistics({ stats }) {
  const data = stats && Object.keys(stats).length ? stats : fallback;

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "—";
    try {
      return `₦${Number(value).toLocaleString()}`;
    } catch {
      return `₦${value}`;
    }
  };

  const formatNumber = (value) => (value === undefined || value === null ? "—" : value);

  const formatPercent = (value) =>
    value === undefined || value === null ? "—" : `${Number(value).toFixed(1)}%`;

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-1 sm:mb-2">
        <FontAwesomeIcon icon={faBox} className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Business Overview</h3>
      </div>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Key vendor metrics for your business.</p>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-md shadow-sm">
              <FontAwesomeIcon icon={faBox} className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{formatNumber(data.activeListings)}</div>
              <div className="text-xs text-gray-600">Active Listings</div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-md shadow-sm">
              <FontAwesomeIcon icon={faCalendarDays} className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{formatNumber(data.bookings30d)}</div>
              <div className="text-xs text-gray-600">Bookings (30d)</div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-md shadow-sm">
              <FontAwesomeIcon icon={faCreditCard} className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{formatCurrency(data.pendingPayouts)}</div>
              <div className="text-xs text-gray-600">Pending Payouts</div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-md shadow-sm">
              <FontAwesomeIcon icon={faPercent} className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{formatPercent(data.conversionRate)}</div>
              <div className="text-xs text-gray-600">Conversion Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
