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
  
  const importHistory = (newHistory: SpeedTestResult[]) => {
    setHistory(prev => {
      const historyMap = new Map<string, SpeedTestResult>();
      prev.forEach(h => historyMap.set(h.id, h));
      newHistory.forEach(h => historyMap.set(h.id, h));
      return Array.from(historyMap.values()).sort((a, b) => b.timestamp - a.timestamp);
    });
  };
  
  return { history, addResult, clearHistory, importHistory };
}
