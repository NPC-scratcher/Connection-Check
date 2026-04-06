import React, { useState } from 'react';
import { Settings, DEFAULT_USER_NAME } from '../hooks/useSettings';
import { Bell, Moon, Clock, AlertCircle, Cloud, Gauge, User, Globe, ShieldCheck, X } from 'lucide-react';
import { translations, Language } from '../lib/translations';

interface SettingsModalProps {
  settings: Settings;
  onSave: (newSettings: Partial<Settings>) => void;
  onLogout: () => void;
  onRequestNotificationPermission: () => Promise<boolean>;
}

export function SettingsModal({ settings, onSave, onLogout, onRequestNotificationPermission }: SettingsModalProps) {
  const t = translations[settings.language];
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const [copySuccess, setCopySuccess] = useState(false);

  const handleNotificationToggle = async () => {
    setError(null);
    if (!settings.notificationsEnabled) {
      let isIframe = false;
      try {
        isIframe = window.self !== window.top;
      } catch (e) {
        isIframe = true;
      }

      try {
        const granted = await onRequestNotificationPermission();
        if (granted) {
          onSave({ notificationsEnabled: true });
        } else {
          if (isIframe) {
            setError(t.notifIframeError);
          } else {
            setError(t.notifDeniedError);
          }
        }
      } catch (e) {
        if (isIframe) {
          setError(t.notifIframeError);
        } else {
          setError(t.notifEnvError);
        }
      }
    } else {
      onSave({ notificationsEnabled: false });
    }
  };

  const handleDriveSync = () => {
    // Hardcoded Client ID to ensure it works in all environments
    const clientId = "1031601818055-5tsakq99msd3s0iatar6nijoi58c557m.apps.googleusercontent.com";
    console.log('Iniciando sincronización con Client ID:', clientId);
    
    const redirectUri = `${window.location.origin}/oauth-callback.html`;
    console.log('Redirect URI configurada:', redirectUri);
    
    const scope = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}`;

    const popup = window.open(authUrl, 'google_oauth', 'width=600,height=700');
    if (!popup) {
      setError(t.popupBlockedError);
    }
  };

  const copyRedirectUri = () => {
    const uri = `${window.location.origin}/oauth-callback.html`;
    navigator.clipboard.writeText(uri);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
      <div className="p-6 sm:p-8 space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6">
          {settings.userName && settings.userName !== DEFAULT_USER_NAME ? (
            <img 
              src={settings.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${settings.userName}`} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full border-4 border-blue-50 dark:border-blue-900/30 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-4 border-gray-50 dark:border-gray-800">
              <User className="w-10 h-10 text-gray-400" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {settings.userName && settings.userName !== DEFAULT_USER_NAME ? `${t.hello}, ${settings.userName}` : t.profile}
            </h1>
            {settings.userEmail && (
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{settings.userEmail}</p>
            )}
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {settings.userName && settings.userName !== DEFAULT_USER_NAME ? t.googleSyncDesc : t.googleSyncDesc}
            </p>
            {settings.userName !== DEFAULT_USER_NAME && (
              <button
                onClick={onLogout}
                className="mt-3 inline-flex items-center space-x-2 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t.logout}</span>
              </button>
            )}
            {settings.userName === DEFAULT_USER_NAME && (
              <div className="space-y-3">
                <button
                  onClick={handleDriveSync}
                  className="mt-4 inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm"
                >
                  <User className="w-4 h-4" />
                  <span>{t.googleSync.split(' ')[0]} {t.withGoogle}</span>
                </button>

                {/* Developer notice only in AI Studio preview */}
                {(window.location.hostname.includes('ais-dev') || window.location.hostname.includes('ais-pre')) && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-xl p-4 mt-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-amber-900 dark:text-amber-100 uppercase tracking-wider mb-1">{t.devNote}</p>
                        <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                          {t.redirectUriMismatch}
                        </p>
                        <div className="mt-2 flex items-center space-x-2">
                          <code className="flex-1 bg-white dark:bg-gray-900 p-2 rounded border border-amber-200 dark:border-amber-800 text-[10px] text-gray-600 dark:text-gray-400 break-all">
                            {window.location.origin}/oauth-callback.html
                          </code>
                          <button 
                            onClick={copyRedirectUri}
                            className="p-2 bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-800 rounded hover:bg-amber-50 dark:hover:bg-amber-800/50 transition-colors"
                          >
                            {copySuccess ? <ShieldCheck className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-amber-600" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          {/* Monitor Settings */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-100 dark:border-gray-700">
              <Clock className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">{t.settings}</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.checkInterval}</label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="1"
                    max="3600"
                    value={settings.checkInterval}
                    onChange={(e) => onSave({ checkInterval: Number(e.target.value) || 10 })}
                    className="w-full pl-3 pr-12 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-gray-700 dark:text-white font-medium"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase">{t.seconds}</span>
                </div>
              </div>

              {settings.userName !== DEFAULT_USER_NAME && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.autoSpeedtest}</label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <input 
                        type="number" 
                        min="0"
                        value={settings.autoSpeedtestInterval || 0}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          // If user tries to set a value between 1 and 4, we force it to 5 as per request
                          const finalVal = (val > 0 && val < 5) ? 5 : val;
                          onSave({ autoSpeedtestInterval: finalVal });
                        }}
                        className="w-full pl-3 pr-12 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-gray-700 dark:text-white font-medium"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase">{t.minutes}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">{t.autoSpeedtestDesc}</p>
                </div>
              )}

            </div>
          </div>

          {/* Preferences & Sync */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-100 dark:border-gray-700">
              <ShieldCheck className="w-5 h-5 text-purple-500" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">{t.preferencesSystem}</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.notifications}</span>
                </div>
                <button 
                  type="button"
                  onClick={handleNotificationToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notificationsEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Moon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.darkMode}</span>
                </div>
                <button 
                  type="button"
                  onClick={() => onSave({ darkMode: !settings.darkMode })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {settings.userName && settings.userName !== DEFAULT_USER_NAME && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-bold text-blue-900 dark:text-blue-100">{t.autoSync}</span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    {t.autoSyncDesc}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-700">
          <button 
            type="button"
            onClick={() => onSave({ checkInterval: 10, darkMode: false, notificationsEnabled: false, autoSpeedtestInterval: 0, userName: DEFAULT_USER_NAME, avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${DEFAULT_USER_NAME}` })}
            className="text-sm text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 font-medium transition-colors"
          >
            {t.restoreDefaults}
          </button>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Connection Monitor v2.0</p>
        </div>
      </div>
    </div>
  );
}
