import * as SecureStore from 'expo-secure-store';

import type { SessionUser } from '@/lib/data/types';

const SESSION_KEY = 'ciudadano.session.user';

export async function readStoredSession() {
  const rawValue = await SecureStore.getItemAsync(SESSION_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as SessionUser;
  } catch {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    return null;
  }
}

export async function writeStoredSession(user: SessionUser) {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(user));
}

export async function clearStoredSession() {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
