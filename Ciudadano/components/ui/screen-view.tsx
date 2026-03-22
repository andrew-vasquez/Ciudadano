import type { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

interface ScreenViewProps extends PropsWithChildren {
  eyebrow?: string;
  title?: string;
  description?: string;
  headerAccessory?: ReactNode;
}

export function ScreenView({
  children,
  eyebrow,
  title,
  description,
  headerAccessory,
}: ScreenViewProps) {
  return (
    <ScrollView
      className="flex-1 bg-black"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 108, gap: 16 }}>
      {eyebrow || title || description || headerAccessory ? (
        <View className="gap-3 pt-2">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1 gap-1.5">
              {eyebrow ? (
                <Text className="text-[11px] font-semibold uppercase tracking-[1.5px] text-blue-300">{eyebrow}</Text>
              ) : null}
              {title ? <Text className="text-[34px] font-black tracking-tight text-white">{title}</Text> : null}
              {description ? <Text className="text-[15px] leading-6 text-zinc-400">{description}</Text> : null}
            </View>
            {headerAccessory}
          </View>
        </View>
      ) : null}
      {children}
    </ScrollView>
  );
}
