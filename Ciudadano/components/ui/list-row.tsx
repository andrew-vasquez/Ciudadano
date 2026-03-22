import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text, View } from 'react-native';

import { BouncyPressable } from '@/components/ui/bouncy-pressable';

interface ListRowProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle: string;
  trailing?: string;
  onPress?: () => void;
}

export function ListRow({ icon, title, subtitle, trailing, onPress }: ListRowProps) {
  return (
    <BouncyPressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      pressScale={0.985}
      className="min-h-[72px] flex-row items-start gap-4 rounded-[22px] border border-zinc-800/95 bg-zinc-950 px-4 py-3.5">
      <View className="h-10 w-10 items-center justify-center rounded-[18px] bg-zinc-900">
        <MaterialIcons color="#60a5fa" name={icon} size={22} />
      </View>
      <View className="flex-1 gap-1 pt-0.5">
        <Text className="text-base font-semibold text-zinc-100">{title}</Text>
        <Text className="text-sm leading-5 text-zinc-400">{subtitle}</Text>
      </View>
      {trailing ? <Text className="pt-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">{trailing}</Text> : null}
    </BouncyPressable>
  );
}
