import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS } from 'react-native';

import { LiquidTabBar } from '@/components/navigation/liquid-tab-bar';
import { useI18n } from '@/lib/i18n/language-provider';

const isIOS = process.env.EXPO_OS === 'ios';
const iosTabTint = DynamicColorIOS({
  light: '#0A84FF',
  dark: '#4DA3FF',
});

export default function TabLayout() {
  const { copy } = useI18n();

  if (isIOS) {
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
        <NativeTabs.Trigger name="post">
          <Icon sf={{ default: 'plus.circle', selected: 'plus.circle.fill' }} />
          <Label hidden>{copy.nav.tabs.post}</Label>
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
      tabBar={(props) => <LiquidTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: copy.nav.tabs.home,
          tabBarIcon: ({ color }) => <MaterialIcons color={color} name="location-on" size={24} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: copy.nav.tabs.alerts,
          tabBarIcon: ({ color }) => <MaterialIcons color={color} name="notifications-none" size={24} />,
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: copy.nav.tabs.post,
          tabBarIcon: ({ color }) => <MaterialIcons color={color} name="add-alert" size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: copy.nav.tabs.profile,
          tabBarIcon: ({ color }) => <MaterialIcons color={color} name="person-outline" size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: copy.nav.tabs.settings,
          tabBarIcon: ({ color }) => <MaterialIcons color={color} name="settings" size={24} />,
        }}
      />
    </Tabs>
  );
}
