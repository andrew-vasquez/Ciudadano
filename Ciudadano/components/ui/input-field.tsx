import { Text, TextInput, View } from 'react-native';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words';
  keyboardType?: 'default' | 'email-address';
  helperText?: string;
}

export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  autoCapitalize = 'sentences',
  keyboardType = 'default',
  helperText,
}: InputFieldProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-medium text-zinc-200">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#71717a"
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        className="min-h-14 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 text-base text-white"
      />
      {helperText ? <Text className="text-xs leading-5 text-zinc-400">{helperText}</Text> : null}
    </View>
  );
}
