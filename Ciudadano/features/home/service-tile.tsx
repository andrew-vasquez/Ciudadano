import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, Text, View } from 'react-native';

import type { EmergencyService } from '@/lib/data/types';

const toneClasses = {
  critical: 'bg-rose-950',
  warning: 'bg-amber-950',
  info: 'bg-blue-950',
} as const;

interface ServiceTileProps {
  service: EmergencyService;
}

export function ServiceTile({ service }: ServiceTileProps) {
  return (
    <Pressable className="flex-1 rounded-3xl border border-zinc-800 bg-zinc-950 px-4 py-5 active:scale-[0.98]">
      <View className={`mb-4 h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[service.tone]}`}>
        <MaterialIcons color="#FFFFFF" name={service.icon as keyof typeof MaterialIcons.glyphMap} size={24} />
      </View>
      <View className="gap-1">
        <Text className="text-base font-semibold text-white">{service.label}</Text>
        <Text className="text-sm leading-5 text-zinc-400">{service.description}</Text>
      </View>
    </Pressable>
  );
}
