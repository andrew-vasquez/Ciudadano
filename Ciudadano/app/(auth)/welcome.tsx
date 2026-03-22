import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppCard } from '@/components/ui/app-card';
import { AuthShell } from '@/features/auth/auth-shell';
import { useI18n } from '@/lib/i18n/language-provider';

export default function WelcomeScreen() {
  const router = useRouter();
  const { copy } = useI18n();
  const welcomeCopy = copy.auth.welcome;

  return (
    <>
      <Stack.Screen options={{ title: welcomeCopy.screenTitle }} />
      <AuthShell
        eyebrow={welcomeCopy.eyebrow}
        title={welcomeCopy.title}
        description={welcomeCopy.description}
        footer={
          <Text className="text-center text-sm leading-6 text-zinc-500">{welcomeCopy.footer}</Text>
        }>
        <View className="gap-6">
          {welcomeCopy.highlights.map((item) => (
            <AppCard key={item.title} className="gap-3 bg-black px-4 py-4">
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-blue-950">
                <MaterialIcons color="#93C5FD" name={item.icon as keyof typeof MaterialIcons.glyphMap} size={22} />
              </View>
              <View className="gap-1">
                <Text className="text-lg font-semibold text-white">{item.title}</Text>
                <Text className="text-sm leading-6 text-zinc-400">{item.subtitle}</Text>
              </View>
            </AppCard>
          ))}

          <View className="gap-3">
            <AppButton label={welcomeCopy.createAccount} onPress={() => router.push('/sign-up')} />
            <AppButton label={welcomeCopy.signIn} onPress={() => router.push('/sign-in')} variant="secondary" />
          </View>
        </View>
      </AuthShell>
    </>
  );
}
