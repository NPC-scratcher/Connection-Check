import React from 'react';
import { DisconnectionEvent } from '../hooks/useConnectionMonitor';
import { formatDate, formatTime, formatDuration } from '../lib/utils';
import { Clock, Calendar, Timer, Activity } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { translations } from '../lib/translations';

interface HistoryTableProps {
  events: DisconnectionEvent[];
}

export function HistoryTable({ events }: HistoryTableProps) {
  const { settings } = useSettings();
  const t = translations[settings.language];

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
        <Activity className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t.noHistory}</h3>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {events.map((event) => (
          <div key={event.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">{formatDate(event.disconnectTime)}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-900 dark:text-white font-mono text-sm">
                <Timer className="w-3.5 h-3.5 text-gray-400" />
                <span>{formatDuration(event.duration)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50 dark:border-gray-700/50">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">{t.drop}</p>
                <div className="flex items-center space-x-1.5 text-red-600 dark:text-red-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-sm font-medium">{formatTime(event.disconnectTime)}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">{t.recovery}</p>
                <div className="flex items-center space-x-1.5 text-green-600 dark:text-green-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-sm font-medium">
                    {event.reconnectTime ? formatTime(event.reconnectTime) : '...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{t.day}</span>
                  </div>
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span>{t.disconnection}</span>
                  </div>
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span>{t.reconnection}</span>
                  </div>
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Timer className="w-4 h-4" />
                    <span>{t.duration}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                    {formatDate(event.disconnectTime)}
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatTime(event.disconnectTime)}
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    {event.reconnectTime ? formatTime(event.reconnectTime) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        {t.waiting}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm font-mono text-gray-700 dark:text-gray-300">
                    {formatDuration(event.duration)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
