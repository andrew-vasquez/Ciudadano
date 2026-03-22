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
    <AppCard className="flex-1 gap-3.5">
      <View className="flex-row items-center justify-between">
        <Text className="text-[11px] font-semibold uppercase tracking-[1.5px] text-blue-300">{label}</Text>
        <View className="h-8 w-8 items-center justify-center rounded-full bg-zinc-900">
          <MaterialIcons color="#60a5fa" name={icon} size={17} />
        </View>
      </View>
      <View className="gap-1">
        <Text className="text-[30px] font-black tracking-tight text-white">{value}</Text>
        <Text className="text-sm leading-5 text-zinc-400">{description}</Text>
      </View>
    </AppCard>
  );
}
