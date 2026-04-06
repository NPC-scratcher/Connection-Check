import React, { useState } from 'react';
import { Settings } from '../hooks/useSettings';
import { Bell, Moon, Clock, AlertCircle, Cloud, Gauge, User, Globe, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  settings: Settings;
  onSave: (newSettings: Partial<Settings>) => void;
  onRequestNotificationPermission: () => Promise<boolean>;
}

export function SettingsModal({ settings, onSave, onRequestNotificationPermission }: SettingsModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

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
            setError('Las notificaciones están bloqueadas en esta vista previa. Abre la app en una pestaña nueva (icono ↗ arriba a la derecha) para activarlas.');
          } else {
            setError('Permiso denegado. Haz clic en el candado de la barra de direcciones para permitir notificaciones.');
          }
        }
      } catch (e) {
        if (isIframe) {
          setError('Las notificaciones están bloqueadas en esta vista previa. Abre la app en una pestaña nueva (icono ↗ arriba a la derecha) para activarlas.');
        } else {
          setError('No se pudieron solicitar los permisos en este entorno.');
        }
      }
    } else {
      onSave({ notificationsEnabled: false });
    }
  };

  const handleDriveSync = () => {
    const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Falta el VITE_GOOGLE_CLIENT_ID en las variables de entorno.');
      return;
    }

    const redirectUri = `${window.location.origin}/oauth-callback.html`;
    const scope = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;

    const popup = window.open(authUrl, 'google_oauth', 'width=600,height=700');
    if (!popup) {
      setError('El navegador bloqueó la ventana emergente. Por favor, permite las ventanas emergentes para sincronizar con Google Drive.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
      <div className="p-6 sm:p-8 space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6">
          {settings.userName && settings.userName !== 'Usuario' ? (
            <img 
              src={settings.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
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
              {settings.userName && settings.userName !== 'Usuario' ? `Hola, ${settings.userName}` : 'Perfil de Usuario'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {settings.userName && settings.userName !== 'Usuario' ? 'Gestiona tu cuenta y preferencias de monitoreo.' : 'Inicia sesión para sincronizar tus datos en la nube.'}
            </p>
            {settings.userName === 'Usuario' && (
              <button
                onClick={handleDriveSync}
                className="mt-4 inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm"
              >
                <User className="w-4 h-4" />
                <span>Iniciar Sesión con Google</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          {/* Monitor Settings */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-100 dark:border-gray-700">
              <Clock className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Configuración del Monitor</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Intervalo de comprobación</label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="1"
                    max="3600"
                    value={settings.checkInterval}
                    onChange={(e) => onSave({ checkInterval: Number(e.target.value) || 10 })}
                    className="w-full pl-3 pr-12 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-gray-700 dark:text-white font-medium"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">SEG</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Auto-Speedtest</label>
                <select 
                  value={settings.autoSpeedtestInterval || 0}
                  onChange={(e) => onSave({ autoSpeedtestInterval: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-gray-700 dark:text-white font-medium"
                >
                  <option value={0}>Desactivado</option>
                  <option value={1}>Cada 1 hora</option>
                  <option value={4}>Cada 4 horas</option>
                  <option value={12}>Cada 12 horas</option>
                  <option value={24}>Cada 24 horas</option>
                </select>
              </div>

            </div>
          </div>

          {/* Preferences & Sync */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-100 dark:border-gray-700">
              <ShieldCheck className="w-5 h-5 text-purple-500" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Preferencias y Sistema</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notificaciones</span>
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
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Modo Oscuro</span>
                </div>
                <button 
                  type="button"
                  onClick={() => onSave({ darkMode: !settings.darkMode })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {settings.userName && settings.userName !== 'Usuario' && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-bold text-blue-900 dark:text-blue-100">Sincronización Activa</span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    Tus datos se están sincronizando automáticamente con Google Drive. Puedes acceder a ellos desde cualquier dispositivo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-700">
          <button 
            type="button"
            onClick={() => onSave({ checkInterval: 10, darkMode: false, notificationsEnabled: false, autoSpeedtestInterval: 0, userName: 'Usuario', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' })}
            className="text-sm text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 font-medium transition-colors"
          >
            Restaurar valores por defecto
          </button>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Connection Monitor v2.0</p>
        </div>
      </div>
    </div>
  );
}
