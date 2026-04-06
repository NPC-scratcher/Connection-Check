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
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-32 rounded-2xl w-full"></div>;
  }

  if (!info) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
        {t.networkInfo}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="flex items-center sm:items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl sm:bg-transparent sm:p-0">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 flex-shrink-0">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">{t.publicIp}</p>
            <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">{info.ip}</p>
          </div>
        </div>
        <div className="flex items-center sm:items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl sm:bg-transparent sm:p-0">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 flex-shrink-0">
            <Server className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">{t.provider}</p>
            <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate" title={info.isp}>{info.isp}</p>
          </div>
        </div>
        <div className="flex items-center sm:items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl sm:bg-transparent sm:p-0">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400 flex-shrink-0">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">{t.location}</p>
            <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">{info.city}, {info.country_name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
