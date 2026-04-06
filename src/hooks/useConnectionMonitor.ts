import { useState, useEffect, useCallback, useRef } from 'react';
import { Settings } from './useSettings';

export interface DisconnectionEvent {
  id: string;
  disconnectTime: number;
  reconnectTime: number | null;
  duration: number | null;
}

export function useConnectionMonitor(settings: Settings) {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  // Use a ref to keep track of the latest settings inside the interval without restarting it
  const settingsRef = useRef(settings);
  
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const [events, setEvents] = useState<DisconnectionEvent[]>(() => {
    try {
      const saved = localStorage.getItem('connection_events');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('localStorage no disponible:', e);
    }
    return [];
  });

  // Save to local storage whenever events change
  useEffect(() => {
    try {
      localStorage.setItem('connection_events', JSON.stringify(events));
    } catch (e) {
      console.warn('localStorage no disponible:', e);
    }
  }, [events]);

  const handleOffline = useCallback(() => {
    setIsOnline((prevOnline) => {
      if (prevOnline) {
        if (settingsRef.current.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('Conexión Perdida', { 
            body: 'Se ha perdido la conexión a internet.',
            icon: '/vite.svg'
          });
        }
      }
      return false;
    });
    
    setEvents((prev) => {
      // Check if there's already an ongoing disconnection
      const ongoing = prev.find((e) => e.reconnectTime === null);
      if (ongoing) return prev;

      const newEvent: DisconnectionEvent = {
        id: crypto.randomUUID(),
        disconnectTime: Date.now(),
        reconnectTime: null,
        duration: null,
      };
      return [newEvent, ...prev];
    });
  }, []);

  const handleOnline = useCallback(() => {
    setIsOnline((prevOnline) => {
      if (!prevOnline) {
        if (settingsRef.current.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('Conexión Restaurada', { 
            body: 'Se ha recuperado la conexión a internet.',
            icon: '/vite.svg'
          });
        }
      }
      return true;
    });

    setEvents((prev) => {
      return prev.map((event) => {
        if (event.reconnectTime === null) {
          const reconnectTime = Date.now();
          return {
            ...event,
            reconnectTime,
            duration: reconnectTime - event.disconnectTime,
          };
        }
        return event;
      });
    });
  }, []);

  useEffect(() => {
    // Listen to standard browser events for immediate feedback
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Polling based on settings interval (minimum 1 second to prevent browser freezing)
    let timeoutId: ReturnType<typeof setTimeout>;
    let isUnmounted = false;

    const checkConnection = async () => {
      if (isUnmounted) return;
      
      try {
        const url = settingsRef.current.pingUrl || 'https://www.google.com/favicon.ico';
        await fetch(`${url}?_t=${Date.now()}`, {
          mode: 'no-cors',
          cache: 'no-store',
        });
        
        if (!isUnmounted) handleOnline();
      } catch (error) {
        if (!isUnmounted) handleOffline();
      } finally {
        if (!isUnmounted) {
          const safeInterval = Math.max(1, settingsRef.current.checkInterval) * 1000;
          timeoutId = setTimeout(checkConnection, safeInterval);
        }
      }
    };

    // Start the loop
    checkConnection();

    return () => {
      isUnmounted = true;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(timeoutId);
    };
  }, [handleOnline, handleOffline, settings.checkInterval]); // Restart loop if checkInterval changes

  const clearHistory = () => {
    setEvents([]);
  };

  const importEvents = useCallback((newEvents: DisconnectionEvent[]) => {
    setEvents((prev) => {
      // Merge and deduplicate by ID
      const eventMap = new Map<string, DisconnectionEvent>();
      prev.forEach(e => eventMap.set(e.id, e));
      newEvents.forEach(e => eventMap.set(e.id, e));
      
      // Sort by disconnectTime descending
      return Array.from(eventMap.values()).sort((a, b) => b.disconnectTime - a.disconnectTime);
    });
  }, []);

  return { isOnline, events, clearHistory, importEvents };
}
