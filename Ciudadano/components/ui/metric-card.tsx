import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text, View } from 'react-native';

import { AppCard } from '@/components/ui/app-card';

interface MetricCardProps {
  label: string;
  value: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

export function MetricCard({ label, value, description, icon }: MetricCardProps) {
  return (
    <AppCard className="flex-1 gap-6">
      <View className="flex-row items-center justify-between">
        <Text className="text-[11px] font-semibold uppercase tracking-[1.5px] text-blue-300">{label}</Text>
        <MaterialIcons color="#60a5fa" name={icon} size={20} />
      </View>
      <View className="gap-1">
        <Text className="text-4xl font-black tracking-tight text-white">{value}</Text>
        <Text className="text-sm leading-5 text-zinc-400">{description}</Text>
      </View>
    </AppCard>
  );
}
