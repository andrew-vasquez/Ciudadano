import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text, View } from 'react-native';

import { AppCard } from '@/components/ui/app-card';

interface EmptyStateProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <AppCard className="items-center gap-4 py-8">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-zinc-900">
        <MaterialIcons color="#60a5fa" name={icon} size={26} />
      </View>
      <View className="items-center gap-2">
        <Text className="text-lg font-semibold text-white">{title}</Text>
        <Text className="max-w-xs text-center text-sm leading-6 text-zinc-400">{description}</Text>
      </View>
    </AppCard>
  );
}
