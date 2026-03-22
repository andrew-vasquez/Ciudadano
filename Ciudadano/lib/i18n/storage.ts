import * as SecureStore from 'expo-secure-store';

import type { Language } from '@/lib/i18n/translations';

const LANGUAGE_KEY = 'ciudadano.app.language';

export async function readStoredLanguage(): Promise<Language | null> {
  const value = await SecureStore.getItemAsync(LANGUAGE_KEY);

  if (value === 'en' || value === 'es') {
    return value;
  }

  return null;
}

export async function writeStoredLanguage(language: Language) {
  await SecureStore.setItemAsync(LANGUAGE_KEY, language);
}
