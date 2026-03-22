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
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, gap: 20 }}>
      {eyebrow || title || description || headerAccessory ? (
        <View className="gap-4 pt-3">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1 gap-2">
              {eyebrow ? (
                <Text className="text-[11px] font-semibold uppercase tracking-[1.5px] text-blue-300">{eyebrow}</Text>
              ) : null}
              {title ? <Text className="text-4xl font-black tracking-tight text-white">{title}</Text> : null}
              {description ? <Text className="text-base leading-7 text-zinc-400">{description}</Text> : null}
            </View>
            {headerAccessory}
          </View>
        </View>
      ) : null}
      {children}
    </ScrollView>
  );
}
