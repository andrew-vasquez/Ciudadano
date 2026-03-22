import { Redirect, Stack } from 'expo-router';

import { LoadingScreen } from '@/components/ui/loading-screen';
import { useI18n } from '@/lib/i18n/language-provider';
import { useSession } from '@/lib/session/session-provider';

export default function AppLayout() {
  const { isLoading, user } = useSession();
  const { copy } = useI18n();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Redirect href="/welcome" />;
  }

  return (
    <Stack
      screenOptions={{
        headerTintColor: '#FFFFFF',
        headerStyle: { backgroundColor: '#000000' },
        headerShadowVisible: false,
        headerBackTitle: copy.nav.back,
        contentStyle: { backgroundColor: '#000000' },
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="incidents/[id]" options={{ title: copy.nav.stack.incident }} />
      <Stack.Screen name="sos" options={{ title: copy.nav.stack.sos, presentation: 'modal' }} />
      <Stack.Screen name="safety-circle" options={{ title: copy.nav.stack.safetyCircle }} />
    </Stack>
  );
}
