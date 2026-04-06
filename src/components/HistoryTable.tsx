import React from 'react';
import { DisconnectionEvent } from '../hooks/useConnectionMonitor';
import { formatDate, formatTime, formatDuration } from '../lib/utils';
import { Clock, Calendar, Timer, Activity } from 'lucide-react';

interface HistoryTableProps {
  events: DisconnectionEvent[];
}

export function HistoryTable({ events }: HistoryTableProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
        <Activity className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sin desconexiones</h3>
        <p className="text-gray-500 dark:text-gray-400">No se han registrado caídas de conexión aún.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
              <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Día</span>
                </div>
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span>Desconexión</span>
                </div>
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span>Reconexión</span>
                </div>
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-2">
                  <Timer className="w-4 h-4" />
                  <span>Duración</span>
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
                      Esperando...
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
  );
}
