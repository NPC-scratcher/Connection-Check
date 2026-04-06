import React, { useState, useEffect, useCallback } from 'react';
import { Gauge, Download, Upload, Play, Loader2, Activity } from 'lucide-react';
import { Settings } from '../hooks/useSettings';
import { useTranslation } from '../hooks/useTranslation';

interface SpeedTestProps {
  settings?: Settings;
  onComplete?: (result: { ping: number; download: number; upload: number }) => void;
}

export function SpeedTest({ settings, onComplete }: SpeedTestProps) {
  const { t } = useTranslation(settings?.language || 'es');
  const [isTesting, setIsTesting] = useState(false);
  const [speedMbps, setSpeedMbps] = useState<number | null>(null);
  const [uploadMbps, setUploadMbps] = useState<number | null>(null);
  const [pingMs, setPingMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runTest = useCallback(async () => {
    if (isTesting) return;
    setIsTesting(true);
    setSpeedMbps(null);
    setUploadMbps(null);
    setPingMs(null);
    setError(null);

    try {
      // 1. Test Ping (small file)
      const pingStart = performance.now();
      await fetch(`https://speed.cloudflare.com/__down?bytes=10&_t=${Date.now()}`, { cache: 'no-store' });
      const pingEnd = performance.now();
      const finalPing = Math.round(pingEnd - pingStart);
      setPingMs(finalPing);

      // 2. Test Download Speed (15 MB file for a good average)
      const downloadSize = 15 * 1024 * 1024; // 15 MB
      const downloadStart = performance.now();
      const response = await fetch(`https://speed.cloudflare.com/__down?bytes=${downloadSize}&_t=${Date.now()}`, { cache: 'no-store' });
      
      if (!response.ok) throw new Error(t.downloadError);
      
      // Consume the body to measure the full download time accurately
      const reader = response.body?.getReader();
      if (!reader) throw new Error(t.readError);

      let receivedLength = 0;
      while(true) {
        const {done, value} = await reader.read();
        if (done) break;
        receivedLength += value.length;
      }

      const downloadEnd = performance.now();
      const durationSeconds = (downloadEnd - downloadStart) / 1000;
      
      // Calculate Mbps: (bytes * 8) / seconds / 1,000,000
      const mbps = (receivedLength * 8) / durationSeconds / 1000000;
      const finalDownload = Number(mbps.toFixed(2));
      setSpeedMbps(finalDownload);

      // 3. Test Upload Speed (5 MB file)
      const uploadSize = 5 * 1024 * 1024; // 5 MB
      const uploadData = new Uint8Array(uploadSize);
      // Fill with random data so it's not easily compressible
      for (let i = 0; i < uploadSize; i += 65536) {
        crypto.getRandomValues(new Uint8Array(uploadData.buffer, i, Math.min(65536, uploadSize - i)));
      }

      const uploadStart = performance.now();
      await fetch(`https://speed.cloudflare.com/__up?_t=${Date.now()}`, {
        method: 'POST',
        body: uploadData,
        cache: 'no-store'
      });
      const uploadEnd = performance.now();
      const uploadDurationSeconds = (uploadEnd - uploadStart) / 1000;
      const upMbps = (uploadSize * 8) / uploadDurationSeconds / 1000000;
      const finalUpload = Number(upMbps.toFixed(2));
      setUploadMbps(finalUpload);

      // Call onComplete callback
      onComplete?.({ ping: finalPing, download: finalDownload, upload: finalUpload });

    } catch (err) {
      console.error(err);
      setError(t.testError);
    } finally {
      setIsTesting(false);
    }
  }, [isTesting, onComplete]);

  // Auto-speedtest logic
  useEffect(() => {
    if (!settings?.autoSpeedtestInterval || settings.autoSpeedtestInterval <= 0) return;

    const intervalMs = settings.autoSpeedtestInterval * 60 * 1000; // minutes to ms
    
    const intervalId = setInterval(() => {
      runTest();
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [settings?.autoSpeedtestInterval, runTest]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <Gauge className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t.speedtest}</h2>
        </div>
        <button
          onClick={runTest}
          disabled={isTesting}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {isTesting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t.measuring}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>{t.startTest}</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center space-x-1">
            <Download className="w-4 h-4" />
            <span>{t.download}</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {speedMbps !== null ? speedMbps : '--'}
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Mbps</span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center space-x-1">
            <Upload className="w-4 h-4" />
            <span>{t.upload}</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {uploadMbps !== null ? uploadMbps : '--'}
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Mbps</span>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center space-x-1">
            <Activity className="w-4 h-4" />
            <span>{t.ping}</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {pingMs !== null ? pingMs : '--'}
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">ms</span>
          </div>
        </div>
      </div>
      
      {error && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
