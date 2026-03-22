import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppCard } from '@/components/ui/app-card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { StatusPill } from '@/components/ui/status-pill';
import { alertsRepository } from '@/lib/data/mock-repositories';
import { useI18n } from '@/lib/i18n/language-provider';
import type { Incident } from '@/lib/data/types';

export default function IncidentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { copy, language } = useI18n();
  const [incident, setIncident] = useState<Incident | null | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      setIncident(null);
      return;
    }

    alertsRepository.getIncidentById(id, language).then(setIncident);
  }, [id, language]);

  if (incident === undefined) {
    return <LoadingScreen label={copy.incident.loading} />;
  }

  if (!incident) {
    return (
      <ScrollView className="flex-1 bg-black" contentInsetAdjustmentBehavior="automatic">
        <View className="px-5 py-10">
          <EmptyState
            icon="search-off"
            title={copy.incident.notFoundTitle}
            description={copy.incident.notFoundDescription}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: incident.title }} />
      <ScrollView
        className="flex-1 bg-black"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 40, gap: 20 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}>
          {incident.imageUrls.map((imageUrl) => (
            <Image
              key={imageUrl}
              contentFit="cover"
              source={{ uri: imageUrl }}
              style={{ width: 320, height: 220, borderRadius: 24 }}
            />
          ))}
        </ScrollView>

        <View className="gap-5 px-5">
          <View className="gap-3">
            <View className="flex-row items-center justify-between gap-4">
              <StatusPill
                label={`${copy.common.minutesAgo(incident.minutesAgo)} • ${incident.neighborhood}`}
                tone={incident.tone}
              />
              <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-zinc-500">{incident.city}</Text>
            </View>
            <Text className="text-4xl font-black tracking-tight text-white">{incident.title}</Text>
            <Text className="text-base leading-7 text-zinc-400">{incident.fullDescription}</Text>
          </View>

          <AppCard className="items-center gap-4">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-950">
              <MaterialIcons color="#93C5FD" name="verified" size={30} />
            </View>
            <View className="items-center gap-1">
              <Text className="text-xl font-semibold text-white">{copy.incident.verifiedAlert}</Text>
              <Text className="text-sm leading-6 text-zinc-400">{copy.incident.confirmedBy(incident.verifiedCount)}</Text>
            </View>
          </AppCard>

          <View className="flex-row flex-wrap gap-3">
            <View className="min-w-[47%] flex-1">
              <AppButton label={copy.incident.actions.update} />
            </View>
            <View className="min-w-[47%] flex-1">
              <AppButton label={copy.incident.actions.navigate} variant="secondary" />
            </View>
            <View className="min-w-[47%] flex-1">
              <AppButton label={copy.incident.actions.safeList} variant="secondary" />
            </View>
            <View className="min-w-[47%] flex-1">
              <AppButton label={copy.incident.actions.emergency} variant="danger" />
            </View>
          </View>

          <View className="gap-3">
            <Text className="text-2xl font-bold tracking-tight text-white">{copy.incident.communityTimeline}</Text>
            {incident.timeline.map((entry) => (
              <AppCard key={entry.id} className="gap-3">
                <View className="flex-row items-start justify-between gap-4">
                  <View className="flex-1 gap-2">
                    <StatusPill
                      label={
                        entry.type === 'verified'
                          ? copy.incident.timelineLabels.verified
                          : entry.type === 'community'
                            ? entry.author || copy.incident.timelineLabels.community
                            : copy.incident.timelineLabels.location
                      }
                      tone={entry.type === 'verified' ? 'info' : entry.type === 'community' ? 'warning' : 'neutral'}
                    />
                    <Text className="text-lg font-semibold text-white">{entry.title}</Text>
                    <Text className="text-sm leading-6 text-zinc-400">{entry.body}</Text>
                  </View>
                  <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-zinc-500">
                    {copy.common.minutesAgo(entry.minutesAgo)}
                  </Text>
                </View>
                {entry.mapImage ? (
                  <Image
                    contentFit="cover"
                    source={{ uri: entry.mapImage }}
                    style={{ width: '100%', height: 140, borderRadius: 20, opacity: 0.7 }}
                  />
                ) : null}
                {entry.likes ? (
                  <View className="flex-row items-center gap-5">
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons color="#A1A1AA" name="thumb-up" size={16} />
                      <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-zinc-500">{entry.likes}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons color="#A1A1AA" name="chat-bubble-outline" size={16} />
                      <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-zinc-500">
                        {copy.incident.timelineLabels.reply}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </AppCard>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
