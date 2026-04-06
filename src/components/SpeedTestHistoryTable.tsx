import React from 'react';
import { SpeedTestResult } from '../hooks/useSpeedTestHistory';
import { Trash2, Activity, Download, Upload } from 'lucide-react';

interface SpeedTestHistoryTableProps {
  history: SpeedTestResult[];
  onClear: () => void;
}

export function SpeedTestHistoryTable({ history, onClear }: SpeedTestHistoryTableProps) {
  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center transition-colors">
        <p className="text-gray-500 dark:text-gray-400">No hay pruebas de velocidad registradas.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Historial de Velocidad</h3>
        <button 
          onClick={onClear}
          className="inline-flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-1.5 rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Borrar</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 font-medium">Fecha y Hora</th>
              <th className="px-6 py-3 font-medium">Ping</th>
              <th className="px-6 py-3 font-medium">Descarga</th>
              <th className="px-6 py-3 font-medium">Subida</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {history.map((result) => (
              <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 text-gray-900 dark:text-gray-300 whitespace-nowrap">
                  {new Date(result.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-300">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <span>{result.ping} ms</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-300">
                    <Download className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{result.download} Mbps</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-300">
                    <Upload className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">{result.upload} Mbps</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
