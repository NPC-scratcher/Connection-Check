import React, { useMemo, useState, useRef } from 'react';
import { useConnectionMonitor } from '../hooks/useConnectionMonitor';
import { useSettings } from '../hooks/useSettings';
import { StatCard } from './StatCard';
import { HistoryTable } from './HistoryTable';
import { UptimeChart } from './UptimeChart';
import { SpeedTest } from './SpeedTest';
import { SettingsModal } from './SettingsModal';
import { isSameDay, isSameMonth, isSameYear, exportToCSV, exportToExcel, parseImportFile, calculateUptimeToday } from '../lib/utils';
import { Wifi, WifiOff, Calendar, CalendarDays, CalendarCheck, Trash2, Download, Upload, Settings as SettingsIcon, Activity, FileSpreadsheet } from 'lucide-react';

export function Dashboard() {
  const { settings, updateSettings, requestNotificationPermission } = useSettings();
  const { isOnline, events, clearHistory, importEvents } = useConnectionMonitor(settings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => {
    const now = new Date();
    let day = 0;
    let month = 0;
    let year = 0;

    events.forEach((event) => {
      const eventDate = new Date(event.disconnectTime);
      if (isSameDay(eventDate, now)) day++;
      if (isSameMonth(eventDate, now)) month++;
      if (isSameYear(eventDate, now)) year++;
    });

    const uptime = calculateUptimeToday(events);

    return { day, month, year, uptime };
  }, [events]);

  const handleClearClick = () => {
    if (showClearConfirm) {
      clearHistory();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000); // Reset after 3 seconds
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedEvents = await parseImportFile(file);
      importEvents(importedEvents);
      alert('Historial importado correctamente.');
    } catch (error) {
      console.error(error);
      alert('Error al importar el archivo. Asegúrate de que sea un archivo exportado por esta aplicación.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-8 font-sans transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Monitor de Conexión</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Verificando estado cada {settings.checkInterval} segundos</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
              title="Configuración"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border shadow-sm ${
              isOnline 
                ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' 
                : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'
            }`}>
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5 animate-pulse" />}
              <span className="font-semibold">{isOnline ? 'Conectado' : 'Desconectado'}</span>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            title="Uptime Hoy" 
            value={`${stats.uptime}%`} 
            icon={<Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
            colorClass="bg-emerald-100 dark:bg-emerald-900/50"
          />
          <StatCard 
            title="Caídas Hoy" 
            value={stats.day} 
            icon={<Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
            colorClass="bg-blue-100 dark:bg-blue-900/50"
          />
          <StatCard 
            title="Caídas este Mes" 
            value={stats.month} 
            icon={<CalendarDays className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
            colorClass="bg-indigo-100 dark:bg-indigo-900/50"
          />
          <StatCard 
            title="Caídas este Año" 
            value={stats.year} 
            icon={<CalendarCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
            colorClass="bg-purple-100 dark:bg-purple-900/50"
          />
        </section>

        {/* Chart and Speed Test */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UptimeChart events={events} />
          </div>
          <div className="lg:col-span-1">
            <SpeedTest />
          </div>
        </section>

        {/* History */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Historial de Desconexiones</h2>
            <div className="flex flex-wrap items-center gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".csv, .xlsx, .xls" 
                className="hidden" 
              />
              <button 
                onClick={handleImportClick}
                className="inline-flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm px-3 py-1.5 rounded-md transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Importar</span>
              </button>
              
              {events.length > 0 && (
                <>
                  <button 
                    onClick={() => exportToCSV(events)}
                    className="inline-flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm px-3 py-1.5 rounded-md transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>CSV</span>
                  </button>
                  <button 
                    onClick={() => exportToExcel(events)}
                    className="inline-flex items-center space-x-2 text-sm text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 shadow-sm px-3 py-1.5 rounded-md transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Excel</span>
                  </button>
                  <button 
                    onClick={handleClearClick}
                    className={`inline-flex items-center space-x-2 text-sm px-3 py-1.5 rounded-md transition-colors ${
                      showClearConfirm 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{showClearConfirm ? '¿Confirmar?' : 'Borrar'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
          <HistoryTable events={events} />
        </section>

      </div>

      {isSettingsOpen && (
        <SettingsModal 
          settings={settings} 
          onSave={updateSettings} 
          onClose={() => setIsSettingsOpen(false)} 
          onRequestNotificationPermission={requestNotificationPermission}
        />
      )}
    </div>
  );
}
