import React from 'react';
import { Globe, MapPin, Server, ShieldCheck } from 'lucide-react';
import { useNetworkInfo } from '../hooks/useNetworkInfo';

export function NetworkInfoCard() {
  const { info, loading } = useNetworkInfo();

  if (loading) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-32 rounded-2xl w-full"></div>;
  }

  if (!info) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5 text-blue-500" />
        Información de Red Pública
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Dirección IP</p>
            <p className="font-medium text-gray-900 dark:text-white">{info.ip}</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Proveedor (ISP)</p>
            <p className="font-medium text-gray-900 dark:text-white line-clamp-1" title={info.isp}>{info.isp}</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Ubicación</p>
            <p className="font-medium text-gray-900 dark:text-white">{info.city}, {info.country_name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
