import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs, VectorIcon } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS } from 'react-native';

import { useI18n } from '@/lib/i18n/language-provider';

const isIOS = process.env.EXPO_OS === 'ios';

export default function TabLayout() {
  const { copy } = useI18n();

  if (isIOS) {
    const iosTabTint = DynamicColorIOS({
      light: '#0A84FF',
      dark: '#4DA3FF',
    });

    return (
      <NativeTabs tintColor={iosTabTint}>
        <NativeTabs.Trigger name="index">
          <Icon sf={{ default: 'map', selected: 'map.fill' }} />
          <Label hidden>{copy.nav.tabs.home}</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="alerts">
          <Icon sf={{ default: 'bell.badge', selected: 'bell.badge.fill' }} />
          <Label hidden>{copy.nav.tabs.alerts}</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Icon sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }} />
          <Label hidden>{copy.nav.tabs.profile}</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} />
          <Label hidden>{copy.nav.tabs.settings}</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 3,
        },
        tabBarStyle: {
          backgroundColor: '#0B0C10',
          borderTopColor: 'rgba(255,255,255,0.08)',
          borderTopWidth: 1,
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: copy.nav.tabs.home,
          tabBarIcon: ({ color, size }) => <MaterialIcons color={color} name="location-on" size={size} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: copy.nav.tabs.alerts,
          tabBarIcon: ({ color, size }) => <MaterialIcons color={color} name="notifications-none" size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: copy.nav.tabs.profile,
          tabBarIcon: ({ color, size }) => <MaterialIcons color={color} name="person-outline" size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: copy.nav.tabs.settings,
          tabBarIcon: ({ color, size }) => <MaterialIcons color={color} name="settings" size={size} />,
        }}
      />
    </Tabs>
  );
}
