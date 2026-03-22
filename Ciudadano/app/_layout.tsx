import './global.css';

import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { LanguageProvider } from '@/lib/i18n/language-provider';
import { SessionProvider } from '@/lib/session/session-provider';

const ciudadanoNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000000',
    card: '#111111',
    primary: '#0070F3',
    border: '#27272A',
    text: '#FFFFFF',
  },
};

export default function RootLayout() {
  return (
    <SessionProvider>
      <LanguageProvider>
        <ThemeProvider value={ciudadanoNavigationTheme}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000000' } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
