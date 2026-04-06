import React, { useState, useMemo } from 'react';
import { DisconnectionEvent } from '../hooks/useConnectionMonitor';
import { formatDate, formatTime, formatDuration } from '../lib/utils';
import { Clock, Calendar, Timer, Activity, Filter, X } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useTranslation } from '../hooks/useTranslation';

interface HistoryTableProps {
  events: DisconnectionEvent[];
}

export function HistoryTable({ events }: HistoryTableProps) {
  const { settings } = useSettings();
  const { t } = useTranslation(settings.language);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('00:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('23:59');

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const eventTime = event.disconnectTime;

      if (startDate) {
        const start = new Date(`${startDate}T${startTime || '00:00'}`).getTime();
        if (eventTime < start) return false;
      }

      if (endDate) {
        const end = new Date(`${endDate}T${endTime || '23:59'}`).getTime();
        if (eventTime > end) return false;
      }

      return true;
    });
  }, [events, startDate, startTime, endDate, endTime]);

  const clearFilters = () => {
    setStartDate('');
    setStartTime('00:00');
    setEndDate('');
    setEndTime('23:59');
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
        <Activity className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t.noHistory}</h3>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 items-end gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3 h-3" />
              {t.startDate}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {t.time}
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3 h-3" />
              {t.endDate}
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {t.time}
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
            />
          </div>
          {(startDate || endDate || startTime !== '00:00' || endTime !== '23:59') && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              {t.clear}
            </button>
          )}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
          <p className="text-gray-500 dark:text-gray-400">{t.noHistory}</p>
        </div>
      ) : (
        <>
          {/* Mobile View: Cards */}
          <div className="grid grid-cols-1 gap-3 sm:hidden">
            {filteredEvents.map((event) => (
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
                  {filteredEvents.map((event) => (
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
        </>
      )}
    </div>
  );
}
