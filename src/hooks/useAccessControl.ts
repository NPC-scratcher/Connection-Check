import { useState, useEffect, useCallback } from 'react';

const TRIAL_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const AD_REWARD_DURATION = 8 * 60 * 60 * 1000; // 8 hours

export function useAccessControl() {
  const [hasAccess, setHasAccess] = useState(true);
  const [isTrial, setIsTrial] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const checkAccess = () => {
      const now = Date.now();
      
      // Check trial
      let trialStarted = localStorage.getItem('trial_started_at');
      if (!trialStarted) {
        trialStarted = now.toString();
        localStorage.setItem('trial_started_at', trialStarted);
      }
      
      const trialExpiry = parseInt(trialStarted) + TRIAL_DURATION;
      const accessExpiry = parseInt(localStorage.getItem('access_expiry') || '0');
      
      if (now < trialExpiry) {
        setIsTrial(true);
        setHasAccess(true);
        setTimeLeft(trialExpiry - now);
      } else if (now < accessExpiry) {
        setIsTrial(false);
        setHasAccess(true);
        setTimeLeft(accessExpiry - now);
      } else {
        setIsTrial(false);
        setHasAccess(false);
        setTimeLeft(0);
      }
    };

    checkAccess();
    const interval = setInterval(checkAccess, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const grantAccess = useCallback(() => {
    const now = Date.now();
    const currentExpiry = parseInt(localStorage.getItem('access_expiry') || '0');
    const newExpiry = Math.max(now, currentExpiry) + AD_REWARD_DURATION;
    
    localStorage.setItem('access_expiry', newExpiry.toString());
    setHasAccess(true);
    setIsTrial(false);
    setTimeLeft(newExpiry - now);
  }, []);

  return { hasAccess, isTrial, timeLeft, grantAccess };
}
