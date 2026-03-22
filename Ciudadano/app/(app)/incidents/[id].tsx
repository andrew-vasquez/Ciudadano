import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { AppButton } from '@/components/ui/app-button';
import { AppCard } from '@/components/ui/app-card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { StatusPill } from '@/components/ui/status-pill';
import { alertsRepository } from '@/lib/data/mock-repositories';
import { IncidentCard } from '@/features/alerts/incident-card';
import { useI18n } from '@/lib/i18n/language-provider';
import type { Incident } from '@/lib/data/types';

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1d2a38' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8b9fb3' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#101721' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#34495e' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#41596f' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#566b82' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#132536' }] },
] as const;

function distanceScore(left: Incident, right: Incident) {
  const latitudeDelta = left.latitude - right.latitude;
  const longitudeDelta = left.longitude - right.longitude;

  return latitudeDelta * latitudeDelta + longitudeDelta * longitudeDelta;
}

export default function IncidentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { copy, language } = useI18n();
  const [incident, setIncident] = useState<Incident | null | undefined>(undefined);
  const [allIncidents, setAllIncidents] = useState<Incident[] | null>(null);

  useEffect(() => {
    if (!id) {
      setIncident(null);
      setAllIncidents([]);
      return;
    }

    Promise.all([alertsRepository.getIncidentById(id, language), alertsRepository.listIncidents(language)]).then(
      ([nextIncident, nextIncidents]) => {
        setIncident(nextIncident);
        setAllIncidents(nextIncidents);
      }
    );
  }, [id, language]);

  if (incident === undefined || allIncidents === null) {
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

  const nearbyIncidents = allIncidents
    .filter((candidate) => candidate.id !== incident.id)
    .sort((left, right) => distanceScore(left, incident) - distanceScore(right, incident))
    .slice(0, 3);

  return (
    <>
      <Stack.Screen options={{ title: incident.title }} />
      <ScrollView
        className="flex-1 bg-black"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 40, gap: 20 }}>
        <View className="overflow-hidden border-b border-zinc-900">
          <MapView
            customMapStyle={process.env.EXPO_OS === 'android' ? (DARK_MAP_STYLE as never) : undefined}
            initialRegion={{
              latitude: incident.latitude,
              longitude: incident.longitude,
              latitudeDelta: 0.012,
              longitudeDelta: 0.012,
            }}
            mapType={process.env.EXPO_OS === 'ios' ? 'mutedStandard' : 'standard'}
            pitchEnabled={false}
            rotateEnabled={false}
            scrollEnabled={false}
            showsCompass={false}
            style={{ height: 310, width: '100%' }}
            toolbarEnabled={false}
            zoomEnabled={false}>
            <Marker coordinate={{ latitude: incident.latitude, longitude: incident.longitude }}>
              <View className="h-8 w-8 items-center justify-center rounded-full border border-amber-100 bg-amber-500">
                <MaterialIcons color="#111827" name="warning" size={18} />
              </View>
            </Marker>
          </MapView>
        </View>

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
            <Text className="text-base font-medium text-amber-300">
              {copy.common.minutesAgo(incident.minutesAgo)} • {incident.neighborhood}
            </Text>
            <Text className="text-base leading-7 text-zinc-400">{incident.fullDescription}</Text>
          </View>

          <AppCard className="gap-4">
            <View className="flex-row items-center gap-4">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-blue-950">
                <MaterialIcons color="#93C5FD" name="verified" size={26} />
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-xl font-semibold text-white">{copy.incident.verifiedAlert}</Text>
                <Text className="text-sm leading-6 text-zinc-400">{copy.incident.confirmedBy(incident.verifiedCount)}</Text>
              </View>
            </View>
            <View className="rounded-[20px] border border-amber-700/30 bg-amber-950/20 px-4 py-3">
              <View className="flex-row items-center gap-2">
                <MaterialIcons color="#FBBF24" name="description" size={18} />
                <Text className="text-sm font-semibold text-zinc-100">Reported</Text>
                <Text className="text-sm text-zinc-500">• Via 911 call</Text>
              </View>
            </View>
          </AppCard>

          <View className="flex-row flex-wrap gap-3">
            <View className="min-w-[47%] flex-1">
              <AppButton label={copy.common.share} />
            </View>
            <View className="min-w-[47%] flex-1">
              <AppButton label={copy.incident.actions.follow} variant="secondary" />
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

          <View className="gap-3">
            <View className="gap-1">
              <Text className="text-2xl font-bold tracking-tight text-white">{copy.incident.inThisArea}</Text>
              <Text className="text-sm leading-6 text-zinc-400">{copy.incident.areaDescription}</Text>
            </View>
            {nearbyIncidents.length ? (
              nearbyIncidents.map((nearbyIncident) => <IncidentCard key={nearbyIncident.id} incident={nearbyIncident} />)
            ) : (
              <EmptyState icon="pin-drop" title={copy.incident.inThisArea} description={copy.incident.areaDescription} />
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
