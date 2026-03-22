import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface BouncyPressableProps extends PressableProps {
  className?: string;
  containerStyle?: StyleProp<ViewStyle>;
  pressScale?: number;
}

const SPRING_IN = {
  damping: 15,
  stiffness: 260,
  mass: 0.75,
} as const;

const SPRING_OUT = {
  damping: 14,
  stiffness: 220,
  mass: 0.8,
} as const;

export function BouncyPressable({
  children,
  className,
  containerStyle,
  disabled,
  onPressIn,
  onPressOut,
  pressScale = 0.97,
  style,
  ...props
}: BouncyPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[containerStyle, animatedStyle]}>
      <Pressable
        {...props}
        className={className}
        disabled={disabled}
        onPressIn={(event) => {
          if (!disabled) {
            scale.value = withSpring(pressScale, SPRING_IN);
          }

          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scale.value = withSpring(1, SPRING_OUT);
          onPressOut?.(event);
        }}
        style={style}>
        {children}
      </Pressable>
    </Animated.View>
  );
}
