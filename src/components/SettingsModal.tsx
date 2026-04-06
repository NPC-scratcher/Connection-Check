import React, { useState } from 'react';
import { Settings } from '../hooks/useSettings';
import { X, Bell, Moon, Clock, AlertCircle, Cloud, Gauge, User, Globe } from 'lucide-react';

interface SettingsModalProps {
  settings: Settings;
  onSave: (newSettings: Partial<Settings>) => void;
  onClose: () => void;
  onRequestNotificationPermission: () => Promise<boolean>;
}

export function SettingsModal({ settings, onSave, onClose, onRequestNotificationPermission }: SettingsModalProps) {
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
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Perfil y Configuración</h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-6">
          {settings.userName && settings.userName !== 'Usuario' && (
            <img 
              src={settings.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
              alt="Avatar" 
              className="w-16 h-16 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {settings.userName && settings.userName !== 'Usuario' ? `Hola, ${settings.userName}` : 'Perfil de Usuario'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {settings.userName && settings.userName !== 'Usuario' ? 'Conectado mediante Google' : 'Usuario local (No conectado)'}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700"></div>

        {/* Monitor Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Monitor</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Clock className="w-4 h-4" />
                <span>Intervalo de comprobación (segundos)</span>
              </label>
              <input 
                type="number" 
                min="1"
                max="3600"
                value={settings.checkInterval}
                onChange={(e) => onSave({ checkInterval: Number(e.target.value) || 10 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Gauge className="w-4 h-4" />
                <span>Auto-Speedtest (horas)</span>
              </label>
              <select 
                value={settings.autoSpeedtestInterval || 0}
                onChange={(e) => onSave({ autoSpeedtestInterval: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-gray-700 dark:text-white"
              >
                <option value={0}>Desactivado</option>
                <option value={1}>Cada 1 hora</option>
                <option value={4}>Cada 4 horas</option>
                <option value={12}>Cada 12 horas</option>
                <option value={24}>Cada 24 horas</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Globe className="w-4 h-4" />
                <span>Servidor de prueba (URL)</span>
              </label>
              <input 
                type="url" 
                value={settings.pingUrl}
                onChange={(e) => onSave({ pingUrl: e.target.value })}
                placeholder="https://www.google.com/favicon.ico"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">URL que se usará para comprobar si hay conexión a internet.</p>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700"></div>

          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Notificaciones</h3>
            
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notificaciones de escritorio</span>
                </div>
                <button 
                  type="button"
                  onClick={handleNotificationToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notificationsEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              {error && (
                <div className="flex items-start space-x-1 text-xs text-red-500 dark:text-red-400">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700"></div>

          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Apariencia y App</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Moon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700"></div>

          {/* Google Drive Sync */}
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Cloud className="w-4 h-4" />
                <span>Sincronización en la Nube</span>
              </label>
              <button
                onClick={handleDriveSync}
                className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <img src="https://www.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png" alt="Google Drive" className="w-5 h-5" />
                <span>Conectar con Google Drive</span>
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Guarda una copia de seguridad automática de tu historial en tu Google Drive (requiere configurar VITE_GOOGLE_CLIENT_ID).
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
          <button 
            type="button"
            onClick={() => onSave({ checkInterval: 10, darkMode: false, notificationsEnabled: false, autoSpeedtestInterval: 0, userName: 'Usuario', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' })}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            Restaurar valores por defecto
          </button>
        </div>
    </div>
  );
}
