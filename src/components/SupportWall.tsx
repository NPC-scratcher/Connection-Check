import React, { useState } from 'react';
import { Heart, Loader2, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useSettings } from '../hooks/useSettings';
import { motion, AnimatePresence } from 'motion/react';

interface SupportWallProps {
  onUnlock: () => void;
}

export function SupportWall({ onUnlock }: SupportWallProps) {
  const { settings } = useSettings();
  const { t } = useTranslation(settings.language);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDonate = () => {
    // Open donation link in new tab
    window.open('https://www.buymeacoffee.com/tu-usuario', '_blank');
    
    setIsProcessing(true);
    // Simulate verification
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      setTimeout(() => {
        onUnlock();
      }, 2000);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/95 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="p-8 text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-pink-50 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-pink-600 dark:text-pink-400" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t.adWallTitle}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {t.adWallDesc}
            </p>
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
                  disabled={isProcessing}
                  onClick={handleDonate}
                  className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-pink-500/30 flex items-center justify-center space-x-3 transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>{t.measuring}</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-6 h-6" />
                      <span>{t.donate}</span>
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
