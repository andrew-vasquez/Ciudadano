import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { AppCard } from '@/components/ui/app-card';
import { ListRow } from '@/components/ui/list-row';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { MetricCard } from '@/components/ui/metric-card';
import { ScreenView } from '@/components/ui/screen-view';
import { StatusPill } from '@/components/ui/status-pill';
import { profileRepository } from '@/lib/data/mock-repositories';
import { useI18n } from '@/lib/i18n/language-provider';
import type { CitizenProfile } from '@/lib/data/types';

const activityToneClass = {
  critical: 'bg-rose-950 text-rose-200',
  warning: 'bg-amber-950 text-amber-200',
  info: 'bg-blue-950 text-blue-200',
  success: 'bg-emerald-950 text-emerald-200',
} as const;

export default function ProfileScreen() {
  const { copy, language } = useI18n();
  const [profile, setProfile] = useState<CitizenProfile | null>(null);

  useEffect(() => {
    profileRepository.getProfile(language).then(setProfile);
  }, [language]);

  if (!profile) {
    return <LoadingScreen label={copy.profile.loading} />;
  }

  return (
    <ScreenView
      eyebrow={copy.profile.eyebrow}
      title={profile.name}
      description={profile.bio}
      headerAccessory={<StatusPill label={profile.badge} tone="info" />}>
      <AppCard className="gap-5">
        <View className="flex-row items-center gap-4">
          <Image source={{ uri: profile.avatarUrl }} style={{ width: 92, height: 92, borderRadius: 999 }} />
          <View className="flex-1 gap-1">
            <Text className="text-xl font-semibold text-white">{profile.district}</Text>
            <Text className="text-sm leading-6 text-zinc-400">{copy.profile.memberSince}</Text>
            <Text className="text-sm leading-6 text-zinc-400">{copy.profile.profileReady}</Text>
          </View>
        </View>
      </AppCard>

      <View className="flex-row gap-3">
        <MetricCard
          label={copy.profile.reputationLabel}
          value={profile.reputation}
          description={copy.profile.reputationDescription}
          icon="star"
        />
      </View>
      <View className="flex-row gap-3">
        <MetricCard
          label={copy.profile.reportsLabel}
          value={profile.reports}
          description={copy.profile.reportsDescription}
          icon="emergency-share"
        />
        <MetricCard
          label={copy.profile.alertsLabel}
          value={profile.alertsShared}
          description={copy.profile.alertsDescription}
          icon="campaign"
        />
      </View>

      <View className="gap-3">
        <Text className="text-xl font-bold tracking-tight text-white">{copy.profile.recentActivity}</Text>
        {profile.activity.map((item) => (
          <AppCard key={item.id} className="gap-3">
            <View className="flex-row items-start justify-between gap-4">
              <View className="flex-1 gap-2">
                <View className={`self-start rounded-full px-3 py-1 ${activityToneClass[item.tone]}`}>
                  <Text className="text-[11px] font-semibold uppercase tracking-[1.5px]">{item.minutesAgoLabel}</Text>
                </View>
                <Text className="text-lg font-semibold text-white">{item.title}</Text>
                <Text className="text-sm leading-6 text-zinc-400">{item.description}</Text>
              </View>
            </View>
          </AppCard>
        ))}
      </View>

      <View className="gap-3">
        <Text className="text-xl font-bold tracking-tight text-white">{copy.profile.monitoringZones}</Text>
        {profile.monitoringZones.map((zone) => (
          <ListRow
            key={zone.id}
            icon="location-on"
            title={zone.name}
            subtitle={`${zone.radiusLabel} • ${zone.scheduleLabel}`}
            trailing={zone.enabled ? copy.common.active : copy.common.paused}
          />
        ))}
      </View>

      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold tracking-tight text-white">{copy.profile.safetyCircle}</Text>
          <Link href="/(app)/safety-circle" className="text-sm font-semibold text-blue-300">
            {copy.common.manage}
          </Link>
        </View>
        {profile.safetyCircle.map((member) => (
          <ListRow
            key={member.id}
            icon="call"
            title={member.name}
            subtitle={`${member.role} • ${member.phone}`}
            trailing={copy.common.active}
          />
        ))}
      </View>
    </ScreenView>
  );
}
