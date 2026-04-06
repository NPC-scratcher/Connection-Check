import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AD_REWARD_DURATION = 8 * 60 * 60 * 1000; // 8 hours

export function useAccessControl() {
  const [hasAccess, setHasAccess] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const checkAccess = async () => {
      const now = Date.now();
      const docRef = doc(db, 'userAccess', userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // New user: grant initial access or set to 0? 
        // User wants it 100% free, so maybe grant access by default?
        // Or just set expiry to a very long time?
        // Let's grant access indefinitely for now.
        const accessExpiry = now + (100 * 365 * 24 * 60 * 60 * 1000); // 100 years
        await setDoc(docRef, { userId, accessExpiry });
        setHasAccess(true);
        setTimeLeft(accessExpiry - now);
      } else {
        const data = docSnap.data();
        const accessExpiry = data.accessExpiry;
        
        if (now < accessExpiry) {
          setHasAccess(true);
          setTimeLeft(accessExpiry - now);
        } else {
          setHasAccess(false);
          setTimeLeft(0);
        }
      }
    };

    checkAccess();
    const interval = setInterval(checkAccess, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [userId]);

  const grantAccess = useCallback(async () => {
    if (!userId) return;
    
    const now = Date.now();
    const docRef = doc(db, 'userAccess', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentExpiry = docSnap.data().accessExpiry;
      const newExpiry = Math.max(now, currentExpiry) + AD_REWARD_DURATION;
      await updateDoc(docRef, { accessExpiry: newExpiry });
      setHasAccess(true);
      setTimeLeft(newExpiry - now);
    }
  }, [userId]);

  return { hasAccess, timeLeft, grantAccess };
}
