import React from 'react';
import { Globe, MapPin, Server, ShieldCheck } from 'lucide-react';
import { useNetworkInfo } from '../hooks/useNetworkInfo';
import { useSettings } from '../hooks/useSettings';
import { translations } from '../lib/translations';

export function NetworkInfoCard() {
  const { info, loading } = useNetworkInfo();
  const { settings } = useSettings();
  const t = translations[settings.language];

  if (loading) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-20 rounded-2xl w-full"></div>;
  }

  if (!info) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">{t.publicIp}</p>
          <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">{info.ip}</p>
        </div>
      </div>
    </div>
  );
}
