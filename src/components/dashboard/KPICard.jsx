import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ReactNode;
  format?: 'currency' | 'number' | 'percentage';
  loading?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon,
  format = 'number',
  loading = false,
}) => {
  const formatValue = (val: string | number) => {
    if (loading) return '---';

    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(Number(val));
    }
    if (format === 'percentage') {
      return `${val}%`;
    }
    return val.toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatValue(value)}
          </p>
          {change && (
            <p className={`text-sm flex items-center ${
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change.type === 'increase' ? '↗' : '↘'}
              {Math.abs(change.value)}% from last month
            </p>
          )}
        </div>
        <div className="text-gray-400">{icon}</div>
      </div>
    </div>
  );
};