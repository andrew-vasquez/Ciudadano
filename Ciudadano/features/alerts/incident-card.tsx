import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';

import { AppCard } from '@/components/ui/app-card';
import { BouncyPressable } from '@/components/ui/bouncy-pressable';
import { StatusPill } from '@/components/ui/status-pill';
import { useI18n } from '@/lib/i18n/language-provider';
import type { Incident } from '@/lib/data/types';

interface IncidentCardProps {
  incident: Incident;
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const { copy } = useI18n();

  return (
    <Link href={`/(app)/incidents/${incident.id}`} asChild>
      <BouncyPressable accessibilityRole="button" pressScale={0.988}>
        <AppCard className="gap-3">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1 gap-2">
              <StatusPill label={copy.alerts.tones[incident.tone]} tone={incident.tone} />
              <Text className="text-[22px] font-bold tracking-tight text-white">{incident.title}</Text>
              <Text className="text-sm leading-5 text-zinc-400">{incident.summary}</Text>
            </View>
            <View className="items-end gap-1.5">
              <Text className="text-xs font-semibold uppercase tracking-[1px] text-zinc-500">
                {copy.common.minutesAgo(incident.minutesAgo)}
              </Text>
              <View className="flex-row items-center gap-1">
                <MaterialIcons color="#60A5FA" name="verified" size={16} />
                <Text className="text-xs font-semibold uppercase tracking-[1px] text-blue-300">
                  {incident.verifiedCount}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-row items-center justify-between rounded-[18px] bg-zinc-900/80 px-4 py-3">
            <View className="gap-1">
              <Text className="text-sm font-semibold text-zinc-100">
                {incident.neighborhood}, {incident.city}
              </Text>
              <Text className="text-xs uppercase tracking-[1px] text-zinc-500">{copy.common.verifiedCommunity}</Text>
            </View>
            <MaterialIcons color="#A1A1AA" name="chevron-right" size={22} />
          </View>
        </AppCard>
      </BouncyPressable>
    </Link>
  );
}
