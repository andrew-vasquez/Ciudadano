import { ActivityIndicator, Text, type ViewStyle } from 'react-native';

import { BouncyPressable } from '@/components/ui/bouncy-pressable';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

const containerStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-500 border-blue-400',
  secondary: 'bg-zinc-900 border-zinc-800',
  danger: 'bg-rose-600 border-rose-500',
  ghost: 'bg-transparent border-zinc-800',
};

const textStyles: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-zinc-100',
  danger: 'text-white',
  ghost: 'text-zinc-200',
};

interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
  size?: 'default' | 'compact';
}

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  size = 'default',
}: AppButtonProps) {
  const buttonStyle: ViewStyle =
    size === 'compact'
      ? {
          minHeight: 44,
          borderRadius: 18,
          paddingHorizontal: 16,
          justifyContent: 'center',
        }
      : {
          minHeight: 54,
          borderRadius: 20,
          paddingHorizontal: 20,
          justifyContent: 'center',
        };

  return (
    <BouncyPressable
      accessibilityRole="button"
      disabled={disabled || isLoading}
      onPress={onPress}
      pressScale={0.975}
      style={buttonStyle}
      className={`items-center justify-center self-stretch border ${
        containerStyles[variant]
      } ${(disabled || isLoading) ? 'opacity-60' : ''}`}>
      {isLoading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text
          className={`${
            size === 'compact' ? 'text-[13px]' : 'text-sm'
          } font-semibold tracking-[0.2px] ${textStyles[variant]}`}>
          {label}
        </Text>
      )}
    </BouncyPressable>
  );
}
