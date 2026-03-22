import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { useI18n } from '@/lib/i18n/language-provider';

const tintColor = '#0070F3';
const mutedColor = '#71717A';

export default function TabLayout() {
  const { copy } = useI18n();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: mutedColor,
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          height: 76,
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 28,
          overflow: 'hidden',
        },
        tabBarBackground: () => (
          <View
            style={{
              flex: 1,
              borderRadius: 28,
              overflow: 'hidden',
              backgroundColor: 'rgba(10, 10, 11, 0.25)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.08)',
            }}>
            <BlurView
              tint="dark"
              intensity={75}
              style={{
                flex: 1,
                backgroundColor: 'rgba(17, 17, 17, 0.35)',
              }}
            />
          </View>
        ),
        tabBarItemStyle: {
          borderRadius: 20,
          marginHorizontal: 4,
          marginVertical: 6,
        },
        tabBarActiveBackgroundColor: 'rgba(255,255,255,0.09)',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: copy.nav.tabs.home,
          tabBarIcon: ({ color, size }) => <MaterialIcons color={color} name="map" size={size} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: copy.nav.tabs.alerts,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons color={color} name="notifications-active" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: copy.nav.tabs.post,
          tabBarIcon: ({ color, size }) => <MaterialIcons color={color} name="add-alert" size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: copy.nav.tabs.profile,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons color={color} name="account-circle" size={size} />
          ),
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
