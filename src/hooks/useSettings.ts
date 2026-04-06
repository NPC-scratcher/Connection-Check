import { useState, useEffect } from 'react';

export interface Settings {
  checkInterval: number;
  pingUrl: string;
  notificationsEnabled: boolean;
  darkMode: boolean;
  autoSpeedtestInterval?: number;
  userName?: string;
  avatarUrl?: string;
}

const DEFAULT_SETTINGS: Settings = {
  checkInterval: 10,
  pingUrl: 'https://www.google.com/favicon.ico',
  notificationsEnabled: false,
  darkMode: false,
  autoSpeedtestInterval: 0,
  userName: 'Usuario',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem('connection_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch (e) {
      console.warn('localStorage no disponible:', e);
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('connection_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('localStorage no disponible:', e);
    }
    
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      return false;
    }
    
    try {
      if (Notification.permission === 'granted') {
        return true;
      }
      
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  };

  return { settings, updateSettings, requestNotificationPermission };
}
