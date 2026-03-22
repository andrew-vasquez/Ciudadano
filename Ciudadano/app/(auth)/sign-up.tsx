import { Link, Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { InputField } from '@/components/ui/input-field';
import { AuthShell } from '@/features/auth/auth-shell';
import { useI18n } from '@/lib/i18n/language-provider';
import { useSession } from '@/lib/session/session-provider';

export default function SignUpScreen() {
  const router = useRouter();
  const { copy } = useI18n();
  const { signUp } = useSession();
  const signUpCopy = copy.auth.signUp;
  const [fullName, setFullName] = useState('Mateo Estrada');
  const [email, setEmail] = useState('mateo@ciudadano.mx');
  const [homeZone, setHomeZone] = useState('San Angel, CDMX');
  const [password, setPassword] = useState('segura123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignUp() {
    try {
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        setError(signUpCopy.validationError);
        return;
      }

      setIsSubmitting(true);
      setError(null);
      await signUp({ fullName, email, password, homeZone });
      router.replace('/(app)/(tabs)');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : signUpCopy.genericError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: signUpCopy.screenTitle }} />
      <AuthShell
        eyebrow={signUpCopy.eyebrow}
        title={signUpCopy.title}
        description={signUpCopy.description}
        footer={
          <Text className="text-center text-sm text-zinc-500">
            {signUpCopy.footerPrefix}{' '}
            <Link href="/sign-in" className="font-semibold text-blue-300">
              {signUpCopy.footerLink}
            </Link>
          </Text>
        }>
        <View className="gap-5">
          <InputField
            label={signUpCopy.fullNameLabel}
            value={fullName}
            onChangeText={setFullName}
            placeholder={signUpCopy.fullNamePlaceholder}
            autoCapitalize="words"
          />
          <InputField
            label={signUpCopy.emailLabel}
            value={email}
            onChangeText={setEmail}
            placeholder={signUpCopy.emailPlaceholder}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <InputField
            label={signUpCopy.homeZoneLabel}
            value={homeZone}
            onChangeText={setHomeZone}
            placeholder={signUpCopy.homeZonePlaceholder}
          />
          <InputField
            label={signUpCopy.passwordLabel}
            value={password}
            onChangeText={setPassword}
            placeholder={signUpCopy.passwordPlaceholder}
            secureTextEntry
            autoCapitalize="none"
          />
          {error ? <Text className="text-sm leading-6 text-rose-300">{error}</Text> : null}
          <AppButton label={signUpCopy.submit} onPress={handleSignUp} isLoading={isSubmitting} />
        </View>
      </AuthShell>
    </>
  );
}
