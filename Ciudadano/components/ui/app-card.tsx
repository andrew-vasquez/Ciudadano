import type { PropsWithChildren } from 'react';
import { View } from 'react-native';

interface AppCardProps extends PropsWithChildren {
  className?: string;
}

export function AppCard({ children, className }: AppCardProps) {
  return (
    <View
      className={`rounded-[22px] border border-zinc-800/90 bg-zinc-950/72 p-4 ${className ?? ''}`}
      style={{
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.22)',
      }}>
      {children}
    </View>
  );
}
