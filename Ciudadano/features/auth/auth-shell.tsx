import type { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface AuthShellProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
  description: string;
  footer?: ReactNode;
}

export function AuthShell({ eyebrow, title, description, footer, children }: AuthShellProps) {
  return (
    <ScrollView
      className="flex-1 bg-black"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 40, paddingTop: 22, gap: 22 }}>
      <Animated.View entering={FadeInDown.duration(260).springify().damping(18).stiffness(170)} className="gap-5">
        <View className="gap-3">
          <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-blue-300">{eyebrow}</Text>
          <View className="gap-2.5">
            <Text className="text-[40px] font-black leading-[46px] tracking-tight text-white">{title}</Text>
            <Text className="text-[15px] leading-6 text-zinc-400">{description}</Text>
          </View>
        </View>
        <View className="rounded-[24px] border border-zinc-800 bg-zinc-950/88 p-4">{children}</View>
        {footer}
      </Animated.View>
    </ScrollView>
  );
}
