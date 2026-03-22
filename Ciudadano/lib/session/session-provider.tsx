import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { SessionUser } from '@/lib/data/types';
import { clearStoredSession, readStoredSession, writeStoredSession } from '@/lib/session/storage';

interface SignInPayload {
  email: string;
  password: string;
}

interface SignUpPayload extends SignInPayload {
  fullName: string;
  homeZone: string;
}

interface SessionContextValue {
  user: SessionUser | null;
  isLoading: boolean;
  signIn(payload: SignInPayload): Promise<void>;
  signUp(payload: SignUpPayload): Promise<void>;
  signOut(): Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

function buildSessionUser(input: { fullName?: string; email: string; homeZone?: string }): SessionUser {
  const fullName =
    input.fullName?.trim() ||
    input.email
      .split('@')[0]
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

  return {
    id: input.email.toLowerCase(),
    fullName,
    email: input.email.trim().toLowerCase(),
    homeZone: input.homeZone?.trim() || 'Polanco, CDMX',
    memberSince: '2026',
  };
}

export function SessionProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      const storedUser = await readStoredSession();

      if (isMounted) {
        setUser(storedUser);
        setIsLoading(false);
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInPayload) => {
    const nextUser = buildSessionUser({ email });
    await writeStoredSession(nextUser);
    setUser(nextUser);
  }, []);

  const signUp = useCallback(async ({ fullName, email, password, homeZone }: SignUpPayload) => {
    const nextUser = buildSessionUser({ fullName, email, homeZone });
    await writeStoredSession(nextUser);
    setUser(nextUser);
  }, []);

  const signOut = useCallback(async () => {
    await clearStoredSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
    }),
    [isLoading, signIn, signOut, signUp, user]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider.');
  }

  return context;
}
