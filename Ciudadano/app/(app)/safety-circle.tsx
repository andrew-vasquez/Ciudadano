import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppCard } from '@/components/ui/app-card';
import { ListRow } from '@/components/ui/list-row';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { ScreenView } from '@/components/ui/screen-view';
import { profileRepository } from '@/lib/data/mock-repositories';
import { useI18n } from '@/lib/i18n/language-provider';
import type { CitizenProfile } from '@/lib/data/types';

export default function SafetyCircleScreen() {
  const { copy, language } = useI18n();
  const [profile, setProfile] = useState<CitizenProfile | null>(null);

  useEffect(() => {
    profileRepository.getProfile(language).then(setProfile);
  }, [language]);

  if (!profile) {
    return <LoadingScreen label={copy.safetyCircle.loading} />;
  }

  return (
    <ScreenView
      eyebrow={copy.safetyCircle.eyebrow}
      title={copy.safetyCircle.title}
      description={copy.safetyCircle.description}>
      <View className="gap-3">
        {profile.safetyCircle.map((member) => (
          <ListRow
            key={member.id}
            icon="phone-in-talk"
            title={member.name}
            subtitle={`${member.role} • ${member.phone}`}
            trailing="Listo"
          />
        ))}
      </View>

      <AppCard className="gap-4">
        <Text className="text-lg font-semibold text-white">{copy.safetyCircle.nextStepTitle}</Text>
        <Text className="text-sm leading-6 text-zinc-400">{copy.safetyCircle.nextStepDescription}</Text>
        <View className="gap-3">
          <AppButton label={copy.safetyCircle.addContact} />
          <AppButton label={copy.safetyCircle.importFromPhone} variant="secondary" />
        </View>
      </AppCard>
    </ScreenView>
  );
}
