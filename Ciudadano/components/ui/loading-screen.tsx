import { ActivityIndicator, Text, View } from 'react-native';

import { useI18n } from '@/lib/i18n/language-provider';

export function LoadingScreen({ label }: { label?: string }) {
  const { copy } = useI18n();

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-black px-6">
      <View className="h-16 w-16 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950">
        <ActivityIndicator color="#3b82f6" />
      </View>
      <Text className="text-sm font-medium tracking-wide text-zinc-300">{label ?? copy.common.loading}</Text>
    </View>
  );
}
