import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, type GestureResponderEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  interpolate,
  type SharedValue,
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
const MAX_STRETCH_SCALE = 1.34;
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 230,
  mass: 0.72,
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

function getStretchProgress(centerX: number, itemWidth: number) {
  'worklet';

  if (!itemWidth) {
    return 0;
  }

  const relative = centerX - BAR_HORIZONTAL_PADDING - itemWidth / 2;
  const nearestIndex = Math.round(relative / itemWidth);
  const nearestCenter = BAR_HORIZONTAL_PADDING + itemWidth / 2 + nearestIndex * itemWidth;
  const distance = Math.abs(centerX - nearestCenter);
  const midpoint = itemWidth / 2;

  return clamp(distance / midpoint, 0, 1);
}

function TabIcon({
  accessibilityLabel,
  centerX,
  dragProgress,
  icon,
  itemWidth,
  lensCenterX,
}: {
  accessibilityLabel: string;
  centerX: number;
  dragProgress: SharedValue<number>;
  icon: keyof typeof MaterialIcons.glyphMap;
  itemWidth: number;
  lensCenterX: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const distance = Math.abs(lensCenterX.value - centerX);
    const focusStrength = itemWidth ? 1 - clamp(distance / itemWidth, 0, 1) : 0;
    const dragLift = dragProgress.value * 0.02;

    return {
      transform: [{ scale: 0.94 + focusStrength * 0.18 + dragLift }],
      opacity: 0.58 + focusStrength * 0.42,
    };
  });

  const activeIconStyle = useAnimatedStyle(() => {
    const distance = Math.abs(lensCenterX.value - centerX);
    const focusStrength = itemWidth ? 1 - clamp(distance / itemWidth, 0, 1) : 0;

    return {
      opacity: focusStrength,
    };
  });

  const inactiveIconStyle = useAnimatedStyle(() => {
    const distance = Math.abs(lensCenterX.value - centerX);
    const focusStrength = itemWidth ? 1 - clamp(distance / itemWidth, 0, 1) : 0;

    return {
      opacity: 1 - focusStrength,
    };
  });

  return (
    <Animated.View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tab"
      style={[styles.tabButton, { width: itemWidth }, animatedStyle]}>
      <View style={styles.iconStack}>
        <Animated.View style={[styles.iconLayer, inactiveIconStyle]}>
          <MaterialIcons color="#B7C0CF" name={icon} size={23} />
        </Animated.View>
        <Animated.View style={[styles.iconLayer, activeIconStyle]}>
          <MaterialIcons color="#FFFFFF" name={icon} size={23} />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

export function LiquidTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [layoutWidth, setLayoutWidth] = useState(0);
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
  const basePillCenter = useMemo(
    () => BAR_HORIZONTAL_PADDING + state.index * itemWidth + itemWidth / 2,
    [itemWidth, state.index]
  );

  const getTabCenterX = (index: number) => BAR_HORIZONTAL_PADDING + index * itemWidth + itemWidth / 2;

  const getIndexFromCenter = (centerX: number) => {
    'worklet';
    if (!itemWidth) {
      return state.index;
    }

    const firstCenter = BAR_HORIZONTAL_PADDING + itemWidth / 2;
    const raw = Math.round((centerX - firstCenter) / itemWidth);
    return clamp(raw, 0, routeCount - 1);
  };

  const lensCenterX = useSharedValue(0);
  const dragProgress = useSharedValue(0);

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

    const minCenter = getTabCenterX(0);
    const maxCenter = getTabCenterX(routeCount - 1);
    const nextCenter = clamp(touchX, minCenter, maxCenter);
    const nextIndex = getIndexFromCenter(nextCenter);

    dragIndexRef.current = nextIndex;
    dragProgress.value = withSpring(1, SPRING_CONFIG);
    lensCenterX.value = withSpring(nextCenter, SPRING_CONFIG);
    triggerMediumHaptic();
  };

  const updateDrag = (touchX: number) => {
    if (!itemWidth || !isDraggingRef.current) {
      return;
    }

    const minCenter = getTabCenterX(0);
    const maxCenter = getTabCenterX(routeCount - 1);
    const nextCenter = clamp(touchX, minCenter, maxCenter);
    const nextIndex = getIndexFromCenter(nextCenter);

    if (nextIndex !== dragIndexRef.current) {
      dragIndexRef.current = nextIndex;
      triggerLightHaptic();
    }

    lensCenterX.value = nextCenter;
  };

  const endDrag = () => {
    clearLongPressTimer();

    if (!itemWidth || !isDraggingRef.current) {
      return;
    }

    const nextIndex = dragIndexRef.current;
    isDraggingRef.current = false;
    dragProgress.value = withSpring(0, SPRING_CONFIG);
    lensCenterX.value = withSpring(getTabCenterX(nextIndex), SPRING_CONFIG);
    navigateToIndex(nextIndex);
  };

  useEffect(() => {
    if (!itemWidth || isDraggingRef.current) {
      return;
    }

    dragIndexRef.current = state.index;
    lensCenterX.value = withSpring(basePillCenter, SPRING_CONFIG);
  }, [basePillCenter, itemWidth, lensCenterX, state.index]);

  useEffect(() => {
    return () => {
      clearLongPressTimer();
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
    lensCenterX.value = withSpring(getTabCenterX(tappedIndex), SPRING_CONFIG);
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
    dragProgress.value = withSpring(0, SPRING_CONFIG);
    lensCenterX.value = withSpring(getTabCenterX(state.index), SPRING_CONFIG);
  };

  const pillStyle = useAnimatedStyle(() => ({
    width: pillWidth,
    opacity: 0.98 + dragProgress.value * 0.02,
    transform: [
      { translateX: lensCenterX.value - pillWidth / 2 },
      {
        scaleX: interpolate(
          getStretchProgress(lensCenterX.value, itemWidth) * dragProgress.value,
          [0, 1],
          [1, MAX_STRETCH_SCALE]
        ),
      },
      {
        scaleY: interpolate(
          getStretchProgress(lensCenterX.value, itemWidth) * dragProgress.value,
          [0, 1],
          [1, 0.95]
        ),
      },
    ],
  }));

  const chromaLeftStyle = useAnimatedStyle(() => {
    const stretch = getStretchProgress(lensCenterX.value, itemWidth) * dragProgress.value;

    return {
      opacity: interpolate(stretch, [0, 1], [0.1, 0.3]),
      transform: [{ translateX: interpolate(stretch, [0, 1], [0, -2]) }],
    };
  });

  const chromaRightStyle = useAnimatedStyle(() => {
    const stretch = getStretchProgress(lensCenterX.value, itemWidth) * dragProgress.value;

    return {
      opacity: interpolate(stretch, [0, 1], [0.08, 0.26]),
      transform: [{ translateX: interpolate(stretch, [0, 1], [0, 2]) }],
    };
  });

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
              <Animated.View style={[styles.chromaticFringeLeft, chromaLeftStyle]} />
              <Animated.View style={[styles.chromaticFringeRight, chromaRightStyle]} />
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
                  centerX={getTabCenterX(index)}
                  dragProgress={dragProgress}
                  icon={ICONS[routeName]}
                  itemWidth={itemWidth}
                  lensCenterX={lensCenterX}
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
    backgroundColor: 'rgba(255,255,255,0.026)',
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
    borderColor: isIOS ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.10)',
    boxShadow: isIOS ? '0 0 18px rgba(140, 208, 255, 0.16)' : '0 8px 16px rgba(0,0,0,0.2)',
  },
  chromaticFringeLeft: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    backgroundColor: 'rgba(120, 222, 255, 0.18)',
  },
  chromaticFringeRight: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    backgroundColor: 'rgba(180, 130, 255, 0.14)',
  },
  activeTint: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    backgroundColor: isIOS ? 'rgba(186, 226, 255, 0.075)' : 'rgba(255,255,255,0.04)',
  },
  activePill: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: isIOS ? 'rgba(255,255,255,0.17)' : 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: isIOS ? 'rgba(255,255,255,0.24)' : 'rgba(255,255,255,0.12)',
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
  iconStack: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLayer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
