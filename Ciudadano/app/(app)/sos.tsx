import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppCard } from '@/components/ui/app-card';
import { ScreenView } from '@/components/ui/screen-view';
import { useI18n } from '@/lib/i18n/language-provider';

export default function SosScreen() {
  const { copy } = useI18n();

  return (
    <ScreenView
      eyebrow={copy.sos.eyebrow}
      title={copy.sos.title}
      description={copy.sos.description}>
      <AppCard className="items-center gap-4 py-8">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-rose-950">
          <MaterialIcons color="#FCA5A5" name="sos" size={38} />
        </View>
        <View className="items-center gap-2">
          <Text className="text-2xl font-bold tracking-tight text-white">{copy.sos.broadcastTitle}</Text>
          <Text className="max-w-sm text-center text-sm leading-6 text-zinc-400">{copy.sos.broadcastDescription}</Text>
        </View>
      </AppCard>

      <View className="gap-3">
        {copy.sos.steps.map((step, index) => (
          <AppCard key={step} className="flex-row items-start gap-4">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-blue-950">
              <Text className="text-sm font-bold text-blue-200">{index + 1}</Text>
            </View>
            <Text className="flex-1 text-sm leading-6 text-zinc-300">{step}</Text>
          </AppCard>
        ))}
      </View>

      <AppCard className="gap-4 border-rose-900 bg-rose-950/20">
        <Text className="text-lg font-semibold text-white">{copy.sos.nextIntegrationTitle}</Text>
        <Text className="text-sm leading-6 text-zinc-300">{copy.sos.nextIntegrationDescription}</Text>
        <AppButton label={copy.sos.acknowledge} variant="danger" />
      </AppCard>
    </ScreenView>
  );
}
