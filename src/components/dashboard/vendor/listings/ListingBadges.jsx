/**
 * ListingStatusBadge - Visual status indicator for listings
 * Supports vendor dashboard views with DRAFT, ACTIVE, INACTIVE states
 */

export function ListingStatusBadge({ status }) {
  const statusConfig = {
    ACTIVE: {
      label: 'Active',
      className: 'bg-green-100 text-green-800 border-green-200',
      dotClass: 'bg-green-500',
    },
    INACTIVE: {
      label: 'Inactive',
      className: 'bg-gray-100 text-gray-800 border-gray-200',
      dotClass: 'bg-gray-500',
    },
    DRAFT: {
      label: 'Draft',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      dotClass: 'bg-yellow-500',
    },
    PENDING: {
      label: 'Pending',
      className: 'bg-blue-100 text-blue-800 border-blue-200',
      dotClass: 'bg-blue-500',
    },
    ARCHIVED: {
      label: 'Archived',
      className: 'bg-red-100 text-red-800 border-red-200',
      dotClass: 'bg-red-500',
    },
  };

  const config = statusConfig[status] || statusConfig.DRAFT;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
}

/**
 * CategoryBadge - Visual category indicator for listings
 */
export function CategoryBadge({ category }) {
  const categoryConfig = {
    CAR_RENTAL: {
      label: 'Car Rental',
      className: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: '🚗',
    },
    RESORT: {
      label: 'Resort',
      className: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: '🏖️',
    },
    FINE_DINING: {
      label: 'Fine Dining',
      className: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: '🍽️',
    },
    CONVENIENCE_SERVICE: {
      label: 'Service',
      className: 'bg-teal-100 text-teal-800 border-teal-200',
      icon: '🛎️',
    },
  };

  const config = categoryConfig[category] || {
    label: category,
    className: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '📦',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}
