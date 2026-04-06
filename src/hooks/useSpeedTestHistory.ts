import { useState, useEffect } from 'react';

export interface SpeedTestResult {
  id: string;
  timestamp: number;
  ping: number;
  download: number;
  upload: number;
}

export function useSpeedTestHistory() {
  const [history, setHistory] = useState<SpeedTestResult[]>(() => {
    try {
      const saved = localStorage.getItem('speedtest_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('speedtest_history', JSON.stringify(history));
  }, [history]);

  const addResult = (result: Omit<SpeedTestResult, 'id' | 'timestamp'>) => {
    setHistory(prev => [{
      ...result,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    }, ...prev]);
  };

  const clearHistory = () => setHistory([]);

  return { history, addResult, clearHistory };
}
