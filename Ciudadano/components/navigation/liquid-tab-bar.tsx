import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, type GestureResponderEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type RouteName = 'index' | 'alerts' | 'post' | 'profile' | 'settings';

const ICONS: Record<RouteName, keyof typeof MaterialIcons.glyphMap> = {
  index: 'location-on',
  alerts: 'notifications-none',
  post: 'add-alert',
  profile: 'person-outline',
  settings: 'settings',
};

const isIOS = process.env.EXPO_OS === 'ios';
const BAR_HORIZONTAL_PADDING = 10;
const BAR_HEIGHT = 74;
const PILL_HEIGHT = 54;
const PILL_INSET = 6;
const LONG_PRESS_DELAY_MS = 140;
const SPRING_CONFIG = {
  damping: 16,
  stiffness: 210,
  mass: 0.78,
} as const;

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

function triggerLightHaptic() {
  if (process.env.EXPO_OS === 'ios') {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

function triggerMediumHaptic() {
  if (process.env.EXPO_OS === 'ios') {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}

function TabIcon({
  accessibilityLabel,
  icon,
  isFocused,
  itemWidth,
}: {
  accessibilityLabel: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  isFocused: boolean;
  itemWidth: number;
}) {
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      style={[styles.tabButton, { width: itemWidth }]}>
      <MaterialIcons color={isFocused ? '#FFFFFF' : '#C4CBD7'} name={icon} size={23} />
    </View>
  );
}

export function LiquidTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [dragPreviewIndex, setDragPreviewIndex] = useState<number | null>(null);
  const routeCount = state.routes.length;
  const dragIndexRef = useRef(state.index);
  const isDraggingRef = useRef(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchXRef = useRef(0);

  const itemWidth = useMemo(() => {
    if (!layoutWidth) {
      return 0;
    }

    return (layoutWidth - BAR_HORIZONTAL_PADDING * 2) / routeCount;
  }, [layoutWidth, routeCount]);

  const pillWidth = Math.max(itemWidth - PILL_INSET * 2, 0);
  const basePillX = useMemo(
    () => BAR_HORIZONTAL_PADDING + state.index * itemWidth + (itemWidth - pillWidth) / 2,
    [itemWidth, pillWidth, state.index]
  );

  const getPillX = (index: number) => BAR_HORIZONTAL_PADDING + index * itemWidth + (itemWidth - pillWidth) / 2;

  const getIndexFromCenter = (centerX: number) => {
    'worklet';
    if (!itemWidth) {
      return state.index;
    }

    const firstCenter = BAR_HORIZONTAL_PADDING + itemWidth / 2;
    const raw = Math.round((centerX - firstCenter) / itemWidth);
    return clamp(raw, 0, routeCount - 1);
  };

  const pillX = useSharedValue(0);
  const dragProgress = useSharedValue(0);
  const activeIndex = dragPreviewIndex ?? state.index;

  const clearLongPressTimer = () => {
    if (!longPressTimerRef.current) {
      return;
    }

    clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  };

  const beginDrag = (touchX: number) => {
    if (!itemWidth) {
      return;
    }

    isDraggingRef.current = true;

    const minX = getPillX(0);
    const maxX = getPillX(routeCount - 1);
    const nextX = clamp(touchX - pillWidth / 2, minX, maxX);
    const nextIndex = getIndexFromCenter(nextX + pillWidth / 2);

    dragIndexRef.current = nextIndex;
    setDragPreviewIndex(nextIndex);
    dragProgress.value = withSpring(1, SPRING_CONFIG);
    pillX.value = withSpring(nextX, SPRING_CONFIG);
    triggerMediumHaptic();
  };

  const updateDrag = (touchX: number) => {
    if (!itemWidth || !isDraggingRef.current) {
      return;
    }

    const minX = getPillX(0);
    const maxX = getPillX(routeCount - 1);
    const nextX = clamp(touchX - pillWidth / 2, minX, maxX);
    const nextIndex = getIndexFromCenter(nextX + pillWidth / 2);

    if (nextIndex !== dragIndexRef.current) {
      dragIndexRef.current = nextIndex;
      setDragPreviewIndex(nextIndex);
      triggerLightHaptic();
    }

    pillX.value = nextX;
  };

  const endDrag = () => {
    clearLongPressTimer();

    if (!itemWidth || !isDraggingRef.current) {
      return;
    }

    const nextIndex = dragIndexRef.current;
    isDraggingRef.current = false;
    setDragPreviewIndex(null);
    dragProgress.value = withSpring(0, SPRING_CONFIG);
    pillX.value = withSpring(getPillX(nextIndex), SPRING_CONFIG);
    navigateToIndex(nextIndex);
  };

  useEffect(() => {
    if (!itemWidth || isDraggingRef.current) {
      return;
    }

    dragIndexRef.current = state.index;
    pillX.value = withSpring(basePillX, SPRING_CONFIG);
  }, [basePillX, itemWidth, pillX, state.index]);

  useEffect(() => {
    return () => {
      clearLongPressTimer();
      setDragPreviewIndex(null);
    };
  }, []);

  const navigateToIndex = (index: number) => {
    const route = state.routes[index];
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (state.index !== index && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const handleTap = (touchX: number) => {
    if (!itemWidth) {
      return;
    }

    const tappedIndex = getIndexFromCenter(touchX);
    triggerLightHaptic();
    dragIndexRef.current = tappedIndex;
    setDragPreviewIndex(null);
    pillX.value = withSpring(getPillX(tappedIndex), SPRING_CONFIG);
    navigateToIndex(tappedIndex);
  };

  const handleTouchStart = (event: GestureResponderEvent) => {
    clearLongPressTimer();

    touchXRef.current = event.nativeEvent.locationX;
    longPressTimerRef.current = setTimeout(() => {
      beginDrag(touchXRef.current);
    }, LONG_PRESS_DELAY_MS);
  };

  const handleTouchMove = (event: GestureResponderEvent) => {
    touchXRef.current = event.nativeEvent.locationX;
    updateDrag(touchXRef.current);
  };

  const handleTouchEnd = () => {
    if (isDraggingRef.current) {
      endDrag();
      return;
    }

    clearLongPressTimer();
    handleTap(touchXRef.current);
  };

  const handleTouchCancel = () => {
    clearLongPressTimer();

    if (!isDraggingRef.current) {
      return;
    }

    isDraggingRef.current = false;
    setDragPreviewIndex(null);
    dragProgress.value = withSpring(0, SPRING_CONFIG);
    pillX.value = withSpring(getPillX(state.index), SPRING_CONFIG);
  };

  const pillStyle = useAnimatedStyle(() => ({
    width: pillWidth,
    opacity: 0.98 + dragProgress.value * 0.02,
    transform: [
      { translateX: pillX.value },
      { scale: 1 + dragProgress.value * 0.035 },
    ],
  }));

  return (
    <Animated.View
      entering={FadeInDown.duration(220).springify().damping(18).stiffness(160)}
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        {
          bottom: Math.max(insets.bottom, 8),
        },
      ]}>
      <View
        onLayout={(event) => {
          const width = event.nativeEvent.layout.width;
          setLayoutWidth((current) => (current === width ? current : width));
        }}
        onTouchCancel={handleTouchCancel}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        style={styles.shell}>
        <View style={styles.clip}>
          {isIOS ? (
            <BlurView intensity={100} tint="systemChromeMaterialDark" style={StyleSheet.absoluteFillObject} />
          ) : (
            <View style={[StyleSheet.absoluteFillObject, styles.androidShell]} />
          )}
          <View style={styles.chrome} />
          <View style={styles.edgeHighlight} />

          {itemWidth ? (
            <Animated.View style={[styles.activePillWrap, pillStyle]}>
              <View style={styles.activeHalo} />
              <View style={styles.activeTint} />
              <View style={styles.activePill} />
              <View style={styles.activeShine} />
              <View style={styles.activeInnerShadow} />
            </Animated.View>
          ) : null}

          <View style={styles.row}>
            {state.routes.map((route, index) => {
              const descriptor = descriptors[route.key];
              const routeName = route.name as RouteName;
              const accessibilityLabel =
                descriptor.options.tabBarAccessibilityLabel ??
                (typeof descriptor.options.title === 'string' ? descriptor.options.title : route.name);

              return (
                <TabIcon
                  key={route.key}
                  accessibilityLabel={accessibilityLabel}
                  icon={ICONS[routeName]}
                  isFocused={activeIndex === index}
                  itemWidth={itemWidth}
                />
              );
            })}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    left: 20,
    right: 20,
    position: 'absolute',
  },
  shell: {
    borderRadius: 999,
    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.36)',
  },
  clip: {
    height: BAR_HEIGHT,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isIOS ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)',
    backgroundColor: isIOS ? 'rgba(9, 12, 18, 0.16)' : 'rgba(14, 16, 22, 0.94)',
  },
  androidShell: {
    backgroundColor: 'rgba(14, 16, 22, 0.94)',
  },
  chrome: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.028)',
  },
  edgeHighlight: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  activePillWrap: {
    position: 'absolute',
    top: 10,
    left: 0,
    height: PILL_HEIGHT,
  },
  activeHalo: {
    position: 'absolute',
    inset: -2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: isIOS ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.10)',
    boxShadow: isIOS ? '0 0 18px rgba(110, 184, 255, 0.18)' : '0 8px 16px rgba(0,0,0,0.2)',
  },
  activeTint: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    backgroundColor: isIOS ? 'rgba(182, 221, 255, 0.06)' : 'rgba(255,255,255,0.04)',
  },
  activePill: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: isIOS ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: isIOS ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.12)',
  },
  activeShine: {
    position: 'absolute',
    top: 1,
    left: 10,
    right: 10,
    height: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    opacity: isIOS ? 0.85 : 0.45,
  },
  activeInnerShadow: {
    position: 'absolute',
    left: 1,
    right: 1,
    bottom: 1,
    height: 18,
    borderBottomLeftRadius: 999,
    borderBottomRightRadius: 999,
    backgroundColor: 'rgba(10, 14, 22, 0.08)',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: BAR_HORIZONTAL_PADDING,
    paddingVertical: 10,
  },
  tabButton: {
    height: PILL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
