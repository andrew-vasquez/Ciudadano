import { useEffect, useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppCard } from '@/components/ui/app-card';
import { ListRow } from '@/components/ui/list-row';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { ScreenView } from '@/components/ui/screen-view';
import { settingsRepository } from '@/lib/data/mock-repositories';
import { useI18n } from '@/lib/i18n/language-provider';
import { useSession } from '@/lib/session/session-provider';
import type { SettingsItem } from '@/lib/data/types';

export default function SettingsScreen() {
  const { copy, language, setLanguage } = useI18n();
  const { signOut } = useSession();
  const [settings, setSettings] = useState<SettingsItem[] | null>(null);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [zoneDigestEnabled, setZoneDigestEnabled] = useState(true);

  useEffect(() => {
    settingsRepository.listItems(language).then(setSettings);
  }, [language]);

  if (!settings) {
    return <LoadingScreen label={copy.settings.loading} />;
  }

  return (
    <ScreenView
      eyebrow={copy.settings.eyebrow}
      title={copy.settings.title}
      description={copy.settings.description}>
      <View className="gap-3">
        {settings.map((item) => (
          <ListRow key={item.id} icon={item.icon as any} title={item.title} subtitle={item.description} trailing={item.value} />
        ))}
      </View>

      <AppCard className="gap-4">
        <View className="flex-row items-center justify-between gap-4">
          <View className="flex-1 gap-1">
            <Text className="text-base font-semibold text-white">{copy.settings.biometricsTitle}</Text>
            <Text className="text-sm leading-6 text-zinc-400">{copy.settings.biometricsDescription}</Text>
          </View>
          <Switch
            value={biometricsEnabled}
            onValueChange={setBiometricsEnabled}
            thumbColor={biometricsEnabled ? '#0070F3' : '#A1A1AA'}
            trackColor={{ false: '#27272A', true: '#172554' }}
          />
        </View>
        <View className="flex-row items-center justify-between gap-4">
          <View className="flex-1 gap-1">
            <Text className="text-base font-semibold text-white">{copy.settings.zoneDigestTitle}</Text>
            <Text className="text-sm leading-6 text-zinc-400">{copy.settings.zoneDigestDescription}</Text>
          </View>
          <Switch
            value={zoneDigestEnabled}
            onValueChange={setZoneDigestEnabled}
            thumbColor={zoneDigestEnabled ? '#0070F3' : '#A1A1AA'}
            trackColor={{ false: '#27272A', true: '#172554' }}
          />
        </View>
      </AppCard>

      <AppCard className="gap-4">
        <View className="gap-1">
          <Text className="text-base font-semibold text-white">{copy.settings.languageTitle}</Text>
          <Text className="text-sm leading-6 text-zinc-400">{copy.settings.languageDescription}</Text>
        </View>
        <View className="flex-row gap-3">
          {(['en', 'es'] as const).map((option) => {
            const selected = language === option;
            const label = option === 'en' ? copy.settings.english : copy.settings.spanish;

            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                onPress={() => {
                  void setLanguage(option);
                }}
                className={`flex-1 rounded-2xl border px-4 py-4 ${selected ? 'border-blue-500 bg-blue-950/30' : 'border-zinc-800 bg-zinc-950'}`}>
                <Text className={`text-center text-sm font-semibold ${selected ? 'text-blue-200' : 'text-zinc-200'}`}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </AppCard>

      <AppCard className="gap-4 border-rose-900 bg-rose-950/20">
        <Text className="text-lg font-semibold text-white">{copy.settings.leaveDemoTitle}</Text>
        <Text className="text-sm leading-6 text-zinc-300">{copy.settings.leaveDemoDescription}</Text>
        <AppButton label={copy.settings.signOut} onPress={signOut} variant="danger" />
      </AppCard>
    </ScreenView>
  );
}
