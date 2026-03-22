import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
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
const HOLD_DELAY_MS = 120;
const MAX_STRETCH_SCALE = 1.52;
const DRAG_SPRING_CONFIG = {
  damping: 15,
  stiffness: 230,
  mass: 0.72,
} as const;
const SNAP_SPRING_CONFIG = {
  damping: 12,
  stiffness: 260,
  mass: 0.68,
} as const;
const RELEASE_PROGRESS_CONFIG = {
  damping: 11,
  stiffness: 240,
  mass: 0.66,
} as const;
const TAP_PULSE_CONFIG = {
  damping: 14,
  stiffness: 250,
  mass: 0.7,
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
  const glassSupported = isIOS && isLiquidGlassAvailable();

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
    if (!itemWidth) {
      return dragIndex.value;
    }

    const firstCenter = BAR_HORIZONTAL_PADDING + itemWidth / 2;
    const raw = Math.round((centerX - firstCenter) / itemWidth);
    return clamp(raw, 0, routeCount - 1);
  };

  const lensCenterX = useSharedValue(0);
  const dragProgress = useSharedValue(0);
  const dragIndex = useSharedValue(state.index);

  useEffect(() => {
    if (!itemWidth) {
      return;
    }

    dragIndex.value = state.index;
    lensCenterX.value = withSpring(basePillCenter, SNAP_SPRING_CONFIG);
  }, [basePillCenter, dragIndex, itemWidth, lensCenterX, state.index]);

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

  const updateLensForTouch = (touchX: number, triggerHaptic: boolean) => {
    if (!itemWidth) {
      return;
    }

    const minCenter = getTabCenterX(0);
    const maxCenter = getTabCenterX(routeCount - 1);
    const nextCenter = clamp(touchX, minCenter, maxCenter);
    const nextIndex = getIndexFromCenter(nextCenter);

    if (nextIndex !== dragIndex.value) {
      dragIndex.value = nextIndex;
      if (triggerHaptic) {
        triggerLightHaptic();
      }
    }

    lensCenterX.value = nextCenter;
  };

  const triggerTapPulse = () => {
    dragProgress.value = withSequence(
      withSpring(0.36, TAP_PULSE_CONFIG),
      withSpring(0, RELEASE_PROGRESS_CONFIG)
    );
  };

  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .maxDuration(220)
    .onEnd((event, success) => {
      if (!success || !itemWidth) {
        return;
      }

      const tappedIndex = getIndexFromCenter(event.x);
      dragIndex.value = tappedIndex;
      lensCenterX.value = withSpring(getTabCenterX(tappedIndex), SNAP_SPRING_CONFIG);
      triggerTapPulse();
      triggerLightHaptic();
      navigateToIndex(tappedIndex);
    });

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .activateAfterLongPress(HOLD_DELAY_MS)
    .minDistance(0)
    .maxPointers(1)
    .onBegin((event) => {
      if (!itemWidth) {
        return;
      }

      dragProgress.value = withSpring(1, DRAG_SPRING_CONFIG);
      updateLensForTouch(event.x, false);
      triggerMediumHaptic();
    })
    .onUpdate((event) => {
      updateLensForTouch(event.x, true);
    })
    .onFinalize(() => {
      if (!itemWidth) {
        return;
      }

      const nextIndex = dragIndex.value;
      dragProgress.value = withSpring(0, RELEASE_PROGRESS_CONFIG);
      lensCenterX.value = withSpring(getTabCenterX(nextIndex), SNAP_SPRING_CONFIG);
      navigateToIndex(nextIndex);
    });

  const gesture = Gesture.Race(panGesture, tapGesture);

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
          [1, 0.92]
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

  const haloStyle = useAnimatedStyle(() => {
    const stretch = getStretchProgress(lensCenterX.value, itemWidth) * dragProgress.value;

    return {
      opacity: interpolate(dragProgress.value, [0, 0.36, 1], [0.92, 1, 1]),
      transform: [{ scale: interpolate(stretch, [0, 1], [1, 1.015]) }],
    };
  });

  const tintStyle = useAnimatedStyle(() => {
    const stretch = getStretchProgress(lensCenterX.value, itemWidth) * dragProgress.value;

    return {
      opacity: interpolate(dragProgress.value, [0, 0.36, 1], [0.94, 1, 1]),
      transform: [{ scale: interpolate(stretch, [0, 1], [1, 1.01]) }],
    };
  });

  const shineStyle = useAnimatedStyle(() => ({
    opacity: interpolate(dragProgress.value, [0, 0.36, 1], [isIOS ? 0.82 : 0.42, isIOS ? 0.94 : 0.54, 1]),
    transform: [{ scaleX: interpolate(dragProgress.value, [0, 1], [1, 1.06]) }],
  }));

  const innerShadowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(dragProgress.value, [0, 0.36, 1], [0.9, 0.82, 0.72]),
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
      <GestureDetector gesture={gesture}>
        <View
          onLayout={(event) => {
            const width = event.nativeEvent.layout.width;
            setLayoutWidth((current) => (current === width ? current : width));
          }}
          style={styles.shell}>
          <View style={styles.clip}>
            {glassSupported ? (
              <GlassView isInteractive style={StyleSheet.absoluteFillObject} />
            ) : isIOS ? (
              <BlurView intensity={100} tint="systemChromeMaterialDark" style={StyleSheet.absoluteFillObject} />
            ) : (
              <View style={[StyleSheet.absoluteFillObject, styles.androidShell]} />
            )}
            <View style={styles.chrome} />
            <View style={styles.edgeHighlight} />

            {itemWidth ? (
              <Animated.View style={[styles.activePillWrap, pillStyle]}>
                <Animated.View style={[styles.activeHalo, haloStyle]} />
                <Animated.View style={[styles.chromaticFringeLeft, chromaLeftStyle]} />
                <Animated.View style={[styles.chromaticFringeRight, chromaRightStyle]} />
                <View style={styles.activeClip}>
                  <Animated.View style={[styles.activeTint, tintStyle]} />
                  <View style={styles.activePill} />
                  <Animated.View style={[styles.activeShine, shineStyle]} />
                  <Animated.View style={[styles.activeInnerShadow, innerShadowStyle]} />
                </View>
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
      </GestureDetector>
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
  activeClip: {
    flex: 1,
    borderRadius: 999,
    overflow: 'hidden',
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
