import { useState, useEffect, useMemo } from 'react';
import { translations, Translation, Language } from '../lib/translations';
import { translateUI } from '../services/translationService';

export function useTranslation(language: Language) {
  const [dynamicTranslations, setDynamicTranslations] = useState<Record<string, Translation>>(() => {
    try {
      const saved = localStorage.getItem('dynamic_translations');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // If language is already in static translations or cached dynamic translations, do nothing
    if (translations[language as keyof typeof translations] || dynamicTranslations[language]) {
      return;
    }

    // Otherwise, translate using Gemini
    const performTranslation = async () => {
      setIsTranslating(true);
      try {
        const baseTranslation = translations['es']; // Use Spanish as base
        const newTranslation = await translateUI(language, baseTranslation);
        
        setDynamicTranslations(prev => {
          const updated = { ...prev, [language]: newTranslation };
          localStorage.setItem('dynamic_translations', JSON.stringify(updated));
          return updated;
        });
      } catch (error) {
        console.error("Auto-translation failed:", error);
      } finally {
        setIsTranslating(false);
      }
    };

    performTranslation();
  }, [language, dynamicTranslations]);

  const t = useMemo(() => {
    return translations[language as keyof typeof translations] || dynamicTranslations[language] || translations['es'];
  }, [language, dynamicTranslations]);

  return { t, isTranslating };
}
