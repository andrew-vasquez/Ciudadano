import type { PropsWithChildren } from 'react';
import { View } from 'react-native';

interface AppCardProps extends PropsWithChildren {
  className?: string;
}

export function AppCard({ children, className }: AppCardProps) {
  return (
    <View
      className={`rounded-[24px] border border-zinc-800/95 bg-zinc-950/74 p-[18px] ${className ?? ''}`}
      style={{
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.22)',
      }}>
      {children}
    </View>
  );
}
