import React, { useMemo, useState, useEffect } from 'react';
import { useConnectionMonitor } from '../hooks/useConnectionMonitor';
import { useSettings } from '../hooks/useSettings';
import { useSpeedTestHistory } from '../hooks/useSpeedTestHistory';
import { StatCard } from './StatCard';
import { HistoryTable } from './HistoryTable';
import { UptimeChart } from './UptimeChart';
import { SpeedTest } from './SpeedTest';
import { SpeedTestHistoryTable } from './SpeedTestHistoryTable';
import { SettingsModal as ProfileTab } from './SettingsModal';
import { NetworkInfoCard } from './NetworkInfoCard';
import { isSameDay, isSameMonth, isSameYear, exportToCSV, exportToExcel, calculateUptimeToday } from '../lib/utils';
import { findBackupFile, downloadBackup, uploadBackup } from '../lib/googleDrive';
import { Wifi, WifiOff, Calendar, CalendarDays, CalendarCheck, Trash2, Download, FileSpreadsheet, Home, Activity, Clock, User as UserIcon, ShieldCheck } from 'lucide-react';
import { translations } from '../lib/translations';

export function Dashboard() {
  const { settings, updateSettings, requestNotificationPermission } = useSettings();
  const t = translations[settings.language];
  const { isOnline, events, clearHistory, importEvents } = useConnectionMonitor(settings);
  const { history: speedHistory, addResult: addSpeedResult, clearHistory: clearSpeedHistory } = useSpeedTestHistory();
  
  const [activeTab, setActiveTab] = useState<'home' | 'speedtest' | 'history' | 'profile'>('home');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [driveToken, setDriveToken] = useState<string | null>(null);

  // Listen for OAuth messages
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const token = event.data.token;
        setDriveToken(token);
        
        try {
          // Fetch user profile info
          const profileRes = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`);
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            updateSettings({
              userName: profileData.name || 'Usuario',
              avatarUrl: profileData.picture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
            });
          }

          // Try to sync
          const fileId = await findBackupFile(token);
          if (fileId) {
            const data = await downloadBackup(token, fileId);
            if (data && Array.isArray(data)) {
              importEvents(data);
              alert(t.syncSuccess);
            }
          } else {
            await uploadBackup(token, events, null);
            alert(t.backupCreated);
          }
        } catch (err) {
          console.error(err);
          alert(t.syncError);
        }
      } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
        alert(t.authError + event.data.error);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [events, importEvents, updateSettings]);

  // Auto-sync to Drive when events change
  useEffect(() => {
    if (!driveToken || events.length === 0) return;
    
    const syncTimeout = setTimeout(async () => {
      try {
        const fileId = await findBackupFile(driveToken);
        await uploadBackup(driveToken, events, fileId);
        console.log(t.autoSyncSuccess);
      } catch (err) {
        console.error(t.autoSyncError, err);
      }
    }, 5000); // Debounce 5 seconds

    return () => clearTimeout(syncTimeout);
  }, [events, driveToken]);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 font-sans transition-colors">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* Header (Visible on Home) */}
        {activeTab === 'home' && (
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {t.connectionSummary}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.checkingEvery} {settings.checkInterval}{t.seconds}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border shadow-sm ${
                isOnline 
                  ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' 
                  : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'
              }`}>
                {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5 animate-pulse" />}
                <span className="font-semibold">{isOnline ? t.connected : t.disconnected}</span>
              </div>
            </div>
          </header>
        )}

        {/* Tab Content */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <NetworkInfoCard />
            
            {/* Quick Actions */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.quickSpeedTest}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.quickSpeedTestDesc}</p>
              </div>
              <button
                onClick={() => setActiveTab('speedtest')}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
              >
                {t.goToSpeed}
              </button>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              <StatCard 
                title={t.score} 
                value={`${Math.max(0, Math.min(100, Math.round(Number(stats.uptime) - (stats.day * 2))))}/100`} 
                icon={<ShieldCheck />}
                colorClass="bg-blue-100 dark:bg-blue-900/50"
              />
              <StatCard 
                title={t.uptimeToday} 
                value={`${stats.uptime}%`} 
                icon={<Activity />}
                colorClass="bg-emerald-100 dark:bg-emerald-900/50"
              />
              <StatCard 
                title={t.dropsToday} 
                value={stats.day} 
                icon={<Calendar />}
                colorClass="bg-orange-100 dark:bg-orange-900/50"
              />
              <StatCard 
                title={t.dropsMonth} 
                value={stats.month} 
                icon={<CalendarDays />}
                colorClass="bg-indigo-100 dark:bg-indigo-900/50"
              />
              <StatCard 
                title={t.dropsYear} 
                value={stats.year} 
                icon={<CalendarCheck />}
                colorClass="bg-purple-100 dark:bg-purple-900/50"
              />
            </section>

            {/* Chart */}
            <section>
              <UptimeChart events={events} />
            </section>
          </div>
        )}

        {activeTab === 'speedtest' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SpeedTest settings={settings} onComplete={addSpeedResult} />
            <SpeedTestHistoryTable history={speedHistory} onClear={clearSpeedHistory} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.disconnectionHistory}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  {events.length > 0 && (
                    <>
                      <button 
                        onClick={() => exportToCSV(events)}
                        className="inline-flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm px-3 py-1.5 rounded-md transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>{t.csv}</span>
                      </button>
                      <button 
                        onClick={() => exportToExcel(events)}
                        className="inline-flex items-center space-x-2 text-sm text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 shadow-sm px-3 py-1.5 rounded-md transition-colors"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>{t.excel}</span>
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
                        <span>{showClearConfirm ? t.confirm : t.clear}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
              <HistoryTable events={events} />
            </section>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ProfileTab 
              settings={settings} 
              onSave={updateSettings} 
              onRequestNotificationPermission={requestNotificationPermission}
            />
          </div>
        )}

      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 flex justify-around items-center h-16 px-2 sm:px-6 z-40 transition-colors pb-safe">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${activeTab === 'home' ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-bold">{t.home}</span>
        </button>
        <button 
          onClick={() => setActiveTab('speedtest')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${activeTab === 'speedtest' ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
        >
          <Activity className={`w-5 h-5 ${activeTab === 'speedtest' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-bold">{t.speedtest}</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${activeTab === 'history' ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
        >
          <Clock className={`w-5 h-5 ${activeTab === 'history' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-bold">{t.history}</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${activeTab === 'profile' ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
        >
          <UserIcon className={`w-5 h-5 ${activeTab === 'profile' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-bold">{t.profile}</span>
        </button>
      </nav>
    </div>
  );
}
