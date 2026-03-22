import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';

import { LiquidTabBar } from '@/components/navigation/liquid-tab-bar';
import { useI18n } from '@/lib/i18n/language-provider';

export default function TabLayout() {
  const { copy } = useI18n();

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
