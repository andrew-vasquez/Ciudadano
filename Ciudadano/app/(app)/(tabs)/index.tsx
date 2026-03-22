import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppCard } from '@/components/ui/app-card';
import { EmptyState } from '@/components/ui/empty-state';
import { ListRow } from '@/components/ui/list-row';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { ScreenView } from '@/components/ui/screen-view';
import { StatusPill } from '@/components/ui/status-pill';
import { IncidentCard } from '@/features/alerts/incident-card';
import { ServiceTile } from '@/features/home/service-tile';
import { alertsRepository, homeRepository } from '@/lib/data/mock-repositories';
import { useI18n } from '@/lib/i18n/language-provider';
import type { HomeDashboard, Incident } from '@/lib/data/types';

export default function HomeScreen() {
  const router = useRouter();
  const { copy, language } = useI18n();
  const [silentMode, setSilentMode] = useState(true);
  const [dashboard, setDashboard] = useState<HomeDashboard | null>(null);
  const [featuredIncident, setFeaturedIncident] = useState<Incident | null>(null);

  useEffect(() => {
    async function load() {
      const [nextDashboard, incidents] = await Promise.all([
        homeRepository.getDashboard(language),
        alertsRepository.listIncidents(language),
      ]);

      setDashboard(nextDashboard);
      setFeaturedIncident(incidents[0] ?? null);
    }

    load();
  }, [language]);

  if (!dashboard) {
    return <LoadingScreen label={copy.home.loading} />;
  }

  return (
    <ScreenView
      eyebrow={copy.home.eyebrow}
      title={copy.home.title}
      description={copy.home.description}
      headerAccessory={<StatusPill label={dashboard.liveStatus} tone="critical" />}>
      <AppCard className="gap-4">
        <View className="flex-row items-center justify-between gap-4">
          <View className="flex-1 gap-1">
            <Text className="text-lg font-semibold text-white">{copy.home.silentModeTitle}</Text>
            <Text className="text-sm leading-6 text-zinc-400">{copy.home.silentModeDescription}</Text>
          </View>
          <Switch
            value={silentMode}
            onValueChange={setSilentMode}
            thumbColor={silentMode ? '#0070F3' : '#A1A1AA'}
            trackColor={{ false: '#27272A', true: '#172554' }}
          />
        </View>
      </AppCard>

      <AppCard className="items-center gap-6 py-8">
        <View className="items-center gap-3">
          <View className="h-52 w-52 items-center justify-center rounded-full border border-rose-800 bg-rose-950/50">
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/(app)/sos')}
              className="h-44 w-44 items-center justify-center rounded-full bg-rose-600 active:scale-[0.98]">
              <Text className="text-5xl font-black tracking-tight text-white">SOS</Text>
              <Text className="mt-2 text-[11px] font-semibold uppercase tracking-[2px] text-rose-100">
                Mantener 3 s
              </Text>
            </Pressable>
          </View>
          <Text className="text-2xl font-bold tracking-tight text-white">{copy.home.emergencyBroadcastTitle}</Text>
          <Text className="max-w-xs text-center text-sm leading-6 text-zinc-400">{dashboard.emergencyMessage}</Text>
        </View>
        <AppButton label={copy.home.openSosFlow} onPress={() => router.push('/(app)/sos')} />
      </AppCard>

      <View className="flex-row gap-3">
        {dashboard.services.map((service) => (
          <ServiceTile key={service.id} service={service} />
        ))}
      </View>

      <AppCard className="gap-4 overflow-hidden px-0 py-0">
        <View className="flex-row items-center justify-between px-5 pt-5">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-blue-950">
              <MaterialIcons color="#93C5FD" name="location-on" size={22} />
            </View>
            <View className="gap-1">
              <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-zinc-500">
                {dashboard.locationLabel}
              </Text>
              <Text className="text-base font-semibold text-white">{dashboard.locationAddress}</Text>
            </View>
          </View>
          <AppButton label={copy.common.share} variant="ghost" size="compact" />
        </View>
        <View className="h-48 overflow-hidden">
          <Image
            contentFit="cover"
            source={{ uri: dashboard.locationImage }}
            style={{ width: '100%', height: '100%', opacity: 0.62 }}
          />
          <View className="absolute inset-0 items-center justify-center">
            <View className="h-5 w-5 rounded-full border-4 border-white bg-blue-500" />
          </View>
          <View className="absolute inset-x-0 bottom-0 h-24 bg-black/50" />
        </View>
      </AppCard>

      <View className="gap-3">
        <View className="flex-row items-center justify-between">
        <Text className="text-xl font-bold tracking-tight text-white">{copy.home.priorityContacts}</Text>
          <Link href="/(app)/safety-circle" className="text-sm font-semibold text-blue-300">
            {copy.common.manage}
          </Link>
        </View>
        {dashboard.priorityContacts.map((contact) => (
          <ListRow
            key={contact.id}
            icon="call"
            title={contact.name}
            subtitle={`${contact.role} • ${contact.phone}`}
            trailing={copy.common.call}
          />
        ))}
      </View>

      <View className="gap-3">
        <Text className="text-xl font-bold tracking-tight text-white">{copy.home.featuredAlert}</Text>
        {featuredIncident ? (
          <IncidentCard incident={featuredIncident} />
        ) : (
          <EmptyState
            icon="notifications-active"
            title={copy.home.noAlertsTitle}
            description={copy.home.noAlertsDescription}
          />
        )}
      </View>
    </ScreenView>
  );
}
