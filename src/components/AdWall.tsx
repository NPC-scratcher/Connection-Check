import React, { useState, useEffect } from 'react';
import { Lock, Play, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useSettings } from '../hooks/useSettings';
import { motion, AnimatePresence } from 'motion/react';

interface AdWallProps {
  onUnlock: () => void;
}

export function AdWall({ onUnlock }: AdWallProps) {
  const { settings } = useSettings();
  const { t } = useTranslation(settings.language);
  const [isWatching, setIsWatching] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleWatchAd = () => {
    setIsWatching(true);
    // Simulate ad watching for 5 seconds
    setTimeout(() => {
      setIsWatching(false);
      setShowSuccess(true);
      setTimeout(() => {
        onUnlock();
      }, 2000);
    }, 5000);
  };

  useEffect(() => {
    // Push AdSense ad if available
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense push failed', e);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/95 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="p-8 text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Lock className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t.adWallTitle}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {t.adWallDesc}
            </p>
          </div>

          {/* AdSense Placeholder */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 min-h-[250px] flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-gray-700">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Publicidad</span>
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-9738594935380369"
                 data-ad-slot="1234567890" // Placeholder slot
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>

          <div className="pt-4">
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 font-bold py-4"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  <span>{t.unlockSuccess}</span>
                </motion.div>
              ) : (
                <motion.button
                  key="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isWatching}
                  onClick={handleWatchAd}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-3 transition-all"
                >
                  {isWatching ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>{t.measuring}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-6 h-6" />
                      <span>{t.watchAd}</span>
                    </>
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{t.freeTrialDesc}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
