import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getLocales } from 'expo-localization';

import { readStoredLanguage, writeStoredLanguage } from '@/lib/i18n/storage';
import { translations, type Language } from '@/lib/i18n/translations';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  isLoading: boolean;
  copy: (typeof translations)[Language];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getSystemLanguage(): Language {
  const primaryLocale = getLocales()[0];
  const rawCode = primaryLocale?.languageCode ?? primaryLocale?.languageTag?.split('-')[0] ?? 'en';

  if (rawCode === 'es') {
    return 'es';
  }

  if (rawCode === 'en') {
    return 'en';
  }

  return 'en';
}

export function LanguageProvider({ children }: React.PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      const storedLanguage = await readStoredLanguage();
      const nextLanguage = storedLanguage ?? getSystemLanguage();

      if (!storedLanguage) {
        await writeStoredLanguage(nextLanguage);
      }

      if (isMounted) {
        setLanguageState(nextLanguage);
        setIsLoading(false);
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      async setLanguage(nextLanguage) {
        setLanguageState(nextLanguage);
        await writeStoredLanguage(nextLanguage);
      },
      isLoading,
      copy: translations[language],
    }),
    [isLoading, language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useI18n must be used within a LanguageProvider.');
  }

  return context;
}
