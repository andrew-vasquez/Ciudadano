import { Redirect, Stack } from 'expo-router';

import { LoadingScreen } from '@/components/ui/loading-screen';
import { useSession } from '@/lib/session/session-provider';

export default function AuthLayout() {
  const { isLoading, user } = useSession();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: '#000000' },
      }}
    />
  );
}
