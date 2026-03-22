import type { PropsWithChildren } from 'react';
import { View } from 'react-native';

interface AppCardProps extends PropsWithChildren {
  className?: string;
}

export function AppCard({ children, className }: AppCardProps) {
  return (
    <View
      className={`rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5 ${className ?? ''}`}
      style={{
        boxShadow: '0 18px 48px rgba(0, 0, 0, 0.28)',
      }}>
      {children}
    </View>
  );
}
