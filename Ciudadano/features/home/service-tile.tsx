import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text, View } from 'react-native';

import { BouncyPressable } from '@/components/ui/bouncy-pressable';
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
    <BouncyPressable
      pressScale={0.985}
      className="flex-1 rounded-[22px] border border-zinc-800 bg-zinc-950/84 px-4 py-4">
      <View className={`mb-3.5 h-11 w-11 items-center justify-center rounded-[18px] ${toneClasses[service.tone]}`}>
        <MaterialIcons color="#FFFFFF" name={service.icon as keyof typeof MaterialIcons.glyphMap} size={24} />
      </View>
      <View className="gap-1">
        <Text className="text-base font-semibold text-white">{service.label}</Text>
        <Text className="text-sm leading-5 text-zinc-400">{service.description}</Text>
      </View>
    </BouncyPressable>
  );
}
