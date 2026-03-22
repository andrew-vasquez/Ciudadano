import { Link, Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { InputField } from '@/components/ui/input-field';
import { AuthShell } from '@/features/auth/auth-shell';
import { useI18n } from '@/lib/i18n/language-provider';
import { useSession } from '@/lib/session/session-provider';

export default function SignInScreen() {
  const router = useRouter();
  const { copy } = useI18n();
  const { signIn } = useSession();
  const signInCopy = copy.auth.signIn;
  const [email, setEmail] = useState('mateo@ciudadano.mx');
  const [password, setPassword] = useState('segura123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    try {
      if (!email.trim() || !password.trim()) {
        setError(signInCopy.validationError);
        return;
      }

      setIsSubmitting(true);
      setError(null);
      await signIn({ email, password });
      router.replace('/(app)/(tabs)');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : signInCopy.genericError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: signInCopy.screenTitle }} />
      <AuthShell
        eyebrow={signInCopy.eyebrow}
        title={signInCopy.title}
        description={signInCopy.description}
        footer={
          <Text className="text-center text-sm text-zinc-500">
            {signInCopy.footerPrefix}{' '}
            <Link href="/sign-up" className="font-semibold text-blue-300">
              {signInCopy.footerLink}
            </Link>
          </Text>
        }>
        <View className="gap-5">
          <InputField
            label={signInCopy.emailLabel}
            value={email}
            onChangeText={setEmail}
            placeholder={signInCopy.emailPlaceholder}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <InputField
            label={signInCopy.passwordLabel}
            value={password}
            onChangeText={setPassword}
            placeholder={signInCopy.passwordPlaceholder}
            secureTextEntry
            autoCapitalize="none"
            helperText={signInCopy.passwordHelper}
          />
          {error ? <Text className="text-sm leading-6 text-rose-300">{error}</Text> : null}
          <AppButton label={signInCopy.submit} onPress={handleSignIn} isLoading={isSubmitting} />
        </View>
      </AuthShell>
    </>
  );
}
