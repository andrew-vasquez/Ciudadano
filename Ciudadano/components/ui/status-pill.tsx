import { Text, View } from 'react-native';

import type { AlertTone } from '@/lib/data/types';

const toneStyles: Record<AlertTone | 'neutral', { container: string; text: string }> = {
  critical: { container: 'bg-rose-950 border-rose-800', text: 'text-rose-200' },
  warning: { container: 'bg-amber-950 border-amber-800', text: 'text-amber-200' },
  info: { container: 'bg-blue-950 border-blue-800', text: 'text-blue-200' },
  neutral: { container: 'bg-zinc-900 border-zinc-800', text: 'text-zinc-300' },
};

interface StatusPillProps {
  label: string;
  tone?: AlertTone | 'neutral';
}

export function StatusPill({ label, tone = 'neutral' }: StatusPillProps) {
  return (
    <View className={`self-start rounded-full border px-3 py-1 ${toneStyles[tone].container}`}>
      <Text className={`text-[11px] font-semibold uppercase tracking-[1px] ${toneStyles[tone].text}`}>{label}</Text>
    </View>
  );
}
