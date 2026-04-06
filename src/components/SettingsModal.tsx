import React, { useState } from 'react';
import { Settings } from '../hooks/useSettings';
import { X, Bell, Moon, Clock, Globe, AlertCircle } from 'lucide-react';

interface SettingsModalProps {
  settings: Settings;
  onSave: (newSettings: Partial<Settings>) => void;
  onClose: () => void;
  onRequestNotificationPermission: () => Promise<boolean>;
}

export function SettingsModal({ settings, onSave, onClose, onRequestNotificationPermission }: SettingsModalProps) {
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transition-colors">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Configuración</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Interval Setting */}
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
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Cada cuántos segundos se verificará si hay internet.
            </p>
          </div>

          {/* Toggles */}
          <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-700">
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
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
          <button 
            type="button"
            onClick={() => onSave({ checkInterval: 10, darkMode: false, notificationsEnabled: false })}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            Restaurar valores por defecto
          </button>
        </div>
      </div>
    </div>
  );
}
