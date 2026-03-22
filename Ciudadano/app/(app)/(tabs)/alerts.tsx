import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { EmptyState } from '@/components/ui/empty-state';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { ScreenView } from '@/components/ui/screen-view';
import { StatusPill } from '@/components/ui/status-pill';
import { IncidentCard } from '@/features/alerts/incident-card';
import { alertsRepository } from '@/lib/data/mock-repositories';
import { useI18n } from '@/lib/i18n/language-provider';
import type { Incident } from '@/lib/data/types';

export default function AlertsScreen() {
  const { copy, language } = useI18n();
  const [incidents, setIncidents] = useState<Incident[] | null>(null);

  useEffect(() => {
    alertsRepository.listIncidents(language).then(setIncidents);
  }, [language]);

  if (!incidents) {
    return <LoadingScreen label={copy.alerts.loading} />;
  }

  return (
    <ScreenView
      eyebrow={copy.alerts.eyebrow}
      title={copy.alerts.title}
      description={copy.alerts.description}
      headerAccessory={<StatusPill label={`${incidents.length} ${copy.common.active.toLowerCase()}`} tone="info" />}>
      <View className="gap-3">
        <Text className="text-sm leading-6 text-zinc-400">{copy.alerts.intro}</Text>
        {incidents.length ? (
          incidents.map((incident) => <IncidentCard key={incident.id} incident={incident} />)
        ) : (
          <EmptyState
            icon="verified"
            title={copy.alerts.noAlertsTitle}
            description={copy.alerts.noAlertsDescription}
          />
        )}
      </View>
    </ScreenView>
  );
}
