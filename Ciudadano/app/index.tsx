import { Redirect } from 'expo-router';

import { LoadingScreen } from '@/components/ui/loading-screen';
import { useSession } from '@/lib/session/session-provider';

export default function IndexRoute() {
  const { isLoading, user } = useSession();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <Redirect href={user ? '/(app)/(tabs)' : '/welcome'} />;
}
