import React from 'react';
import { SpeedTestResult } from '../hooks/useSpeedTestHistory';
import { Trash2, Activity, Download, Upload, DownloadCloud } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useTranslation } from '../hooks/useTranslation';

interface SpeedTestHistoryTableProps {
  history: SpeedTestResult[];
  onClear: () => void;
}

export function SpeedTestHistoryTable({ history, onClear }: SpeedTestHistoryTableProps) {
  const { settings } = useSettings();
  const { t } = useTranslation(settings.language);

  const exportToCSV = () => {
    const headers = [t.date, `Ping (ms)`, `${t.download} (Mbps)`, `${t.upload} (Mbps)`];
    const rows = history.map(r => [
      new Date(r.timestamp).toLocaleString(),
      r.ping,
      r.download,
      r.upload
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `speedtest_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center transition-colors">
        <p className="text-gray-500 dark:text-gray-400">{t.noHistory}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.speedHistory}</h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={exportToCSV}
            className="inline-flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-1.5 rounded-md transition-colors"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>{t.exportCsv}</span>
          </button>
          <button 
            onClick={onClear}
            className="inline-flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-1.5 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.clear}</span>
          </button>
        </div>
      </div>

      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {history.map((result) => (
          <div key={result.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
            <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-700/50 pb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {new Date(result.timestamp).toLocaleString()}
              </span>
              <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-300">
                <Activity className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs font-bold">{result.ping} ms</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-bold mb-1">{t.download}</span>
                <div className="flex items-center space-x-1.5 text-blue-600 dark:text-blue-400">
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-bold">{result.download} Mbps</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-bold mb-1">{t.upload}</span>
                <div className="flex items-center space-x-1.5 text-purple-600 dark:text-purple-400">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-bold">{result.upload} Mbps</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 font-medium">{t.time}</th>
                <th className="px-6 py-3 font-medium">{t.ping}</th>
                <th className="px-6 py-3 font-medium">{t.download}</th>
                <th className="px-6 py-3 font-medium">{t.upload}</th>
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
    </div>
  );
}
