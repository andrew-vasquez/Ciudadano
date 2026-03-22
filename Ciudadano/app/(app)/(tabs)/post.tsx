import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppCard } from '@/components/ui/app-card';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { ScreenView } from '@/components/ui/screen-view';
import { reportingRepository } from '@/lib/data/mock-repositories';
import { useI18n } from '@/lib/i18n/language-provider';
import type { ReportCategory } from '@/lib/data/types';

export default function PostScreen() {
  const { copy, language } = useI18n();
  const [categories, setCategories] = useState<ReportCategory[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('suspicious-activity');
  const [headline, setHeadline] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    reportingRepository.listCategories(language).then(setCategories);
  }, [language]);

  useEffect(() => {
    if (language === 'en') {
      setHeadline('Suspicious movement by the side entrance');
      setDetails('Two people have been lingering near the service entrance for approximately ten minutes.');
      return;
    }

    setHeadline('Movimiento sospechoso en acceso lateral');
    setDetails('Dos personas merodeando por la entrada de servicio desde hace aproximadamente diez minutos.');
  }, [language]);

  if (!categories) {
    return <LoadingScreen label={copy.post.loading} />;
  }

  return (
    <ScreenView
      eyebrow={copy.post.eyebrow}
      title={copy.post.title}
      description={copy.post.description}>
      <View className="gap-3">
        {categories.map((category) => {
          const selected = category.id === selectedCategory;

          return (
            <Pressable
              key={category.id}
              accessibilityRole="button"
              onPress={() => setSelectedCategory(category.id)}
              className={`rounded-3xl border px-4 py-4 ${
                selected ? 'border-blue-500 bg-blue-950/40' : 'border-zinc-800 bg-zinc-950'
              }`}>
              <View className="flex-row items-center gap-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-black/40">
                  <MaterialIcons
                    color={selected ? '#93C5FD' : '#A1A1AA'}
                    name={category.icon as keyof typeof MaterialIcons.glyphMap}
                    size={22}
                  />
                </View>
                <View className="flex-1 gap-1">
                  <Text className="text-base font-semibold text-white">{category.title}</Text>
                  <Text className="text-sm leading-5 text-zinc-400">{category.subtitle}</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      <AppCard className="gap-4">
        <View className="gap-2">
          <Text className="text-sm font-medium text-zinc-200">{copy.post.headlineLabel}</Text>
          <TextInput
            value={headline}
            onChangeText={setHeadline}
            placeholder={copy.post.headlinePlaceholder}
            placeholderTextColor="#71717A"
            className="min-h-14 rounded-2xl border border-zinc-800 bg-black px-4 text-base text-white"
          />
        </View>
        <View className="gap-2">
          <Text className="text-sm font-medium text-zinc-200">{copy.post.detailsLabel}</Text>
          <TextInput
            value={details}
            onChangeText={setDetails}
            multiline
            placeholder={copy.post.detailsPlaceholder}
            placeholderTextColor="#71717A"
            className="min-h-36 rounded-2xl border border-zinc-800 bg-black px-4 py-4 text-base text-white"
            textAlignVertical="top"
          />
        </View>
        <View className="rounded-2xl border border-zinc-800 bg-black px-4 py-4">
          <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-zinc-500">{copy.post.preview}</Text>
          <Text className="mt-2 text-lg font-semibold text-white">{headline}</Text>
          <Text className="mt-2 text-sm leading-6 text-zinc-400">{details}</Text>
        </View>
        <AppButton label={copy.post.submit} onPress={() => setSubmitted(true)} />
      </AppCard>

      {submitted ? (
        <AppCard className="gap-3 border-blue-800 bg-blue-950/30">
          <Text className="text-lg font-semibold text-white">{copy.post.successTitle}</Text>
          <Text className="text-sm leading-6 text-zinc-300">{copy.post.successDescription}</Text>
        </AppCard>
      ) : null}
    </ScreenView>
  );
}
