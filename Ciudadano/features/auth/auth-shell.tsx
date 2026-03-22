import type { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

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
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 28, gap: 28 }}>
      <View className="gap-6">
        <View className="gap-4">
          <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-blue-300">{eyebrow}</Text>
          <View className="gap-3">
            <Text className="text-5xl font-black leading-[56px] tracking-tight text-white">{title}</Text>
            <Text className="text-base leading-7 text-zinc-400">{description}</Text>
          </View>
        </View>
        <View className="rounded-[28px] border border-zinc-800 bg-zinc-950 p-5">{children}</View>
        {footer}
      </View>
    </ScrollView>
  );
}
