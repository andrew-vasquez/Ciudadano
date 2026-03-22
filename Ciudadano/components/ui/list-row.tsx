import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, Text, View } from 'react-native';

interface ListRowProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle: string;
  trailing?: string;
  onPress?: () => void;
}

export function ListRow({ icon, title, subtitle, trailing, onPress }: ListRowProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      className={`min-h-16 flex-row items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 ${
        onPress ? 'active:scale-[0.99]' : ''
      }`}>
      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900">
        <MaterialIcons color="#60a5fa" name={icon} size={22} />
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-base font-semibold text-zinc-100">{title}</Text>
        <Text className="text-sm leading-5 text-zinc-400">{subtitle}</Text>
      </View>
      {trailing ? <Text className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{trailing}</Text> : null}
    </Pressable>
  );
}
