import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  colorClass: string;
}

export function StatCard({ title, value, icon, colorClass }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4 transition-colors">
      <div className={`p-2 sm:p-3 rounded-lg ${colorClass} flex-shrink-0`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 sm:w-6 sm:h-6' })}
      </div>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
        <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{value}</p>
      </div>
    </div>
  );
}
