import { ActivityIndicator, Pressable, Text } from 'react-native';

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
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || isLoading}
      onPress={onPress}
      className={`${size === 'compact' ? 'min-h-10 px-4' : 'min-h-14 px-5'} items-center justify-center rounded-2xl border ${
        containerStyles[variant]
      } ${(disabled || isLoading) ? 'opacity-60' : 'active:scale-[0.98]'}`}>
      {isLoading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text className={`${size === 'compact' ? 'text-xs' : 'text-sm'} font-semibold tracking-wide ${textStyles[variant]}`}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
