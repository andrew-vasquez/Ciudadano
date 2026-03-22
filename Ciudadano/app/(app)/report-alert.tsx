import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { AppCard } from '@/components/ui/app-card';
import { BouncyPressable } from '@/components/ui/bouncy-pressable';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { homeRepository, reportingRepository } from '@/lib/data/mock-repositories';
import { useI18n } from '@/lib/i18n/language-provider';
import type { MapRegion, ReportCategory } from '@/lib/data/types';

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1d2a38' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8b9fb3' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#101721' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#34495e' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#41596f' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#566b82' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#132536' }] },
] as const;

function formatAddress(place: Location.LocationGeocodedAddress | null | undefined, fallback: string) {
  if (!place) {
    return fallback;
  }

  const primary = [place.streetNumber, place.street].filter(Boolean).join(' ').trim();
  const locality = [place.district, place.city, place.region].filter(Boolean).join(', ').trim();

  return primary || locality || fallback;
}

export default function ReportAlertScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { copy, language } = useI18n();
  const [categories, setCategories] = useState<ReportCategory[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('suspicious-activity');
  const [headline, setHeadline] = useState('');
  const [details, setDetails] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [locationLabel, setLocationLabel] = useState(copy.post.locationFallback);
  const [region, setRegion] = useState<MapRegion | null>(null);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);

  const updateLocationLabel = async (latitude: number, longitude: number) => {
    setIsResolvingLocation(true);

    try {
      const reverse = await Location.reverseGeocodeAsync({ latitude, longitude });
      setLocationLabel(formatAddress(reverse[0], copy.post.locationFallback));
    } catch {
      setLocationLabel(copy.post.locationFallback);
    } finally {
      setIsResolvingLocation(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const [nextCategories, dashboard] = await Promise.all([
        reportingRepository.listCategories(language),
        homeRepository.getDashboard(language),
      ]);

      if (!isMounted) {
        return;
      }

      setCategories(nextCategories);
      setSelectedCategory((current) => current || nextCategories[0]?.id || 'suspicious-activity');
      setRegion(dashboard.mapRegion);
      setLocationLabel(dashboard.locationAddress || dashboard.locationLabel || copy.post.locationFallback);

      try {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (!isMounted || permission.status !== 'granted') {
          return;
        }

        const lastKnown = await Location.getLastKnownPositionAsync();
        const currentPosition =
          lastKnown ??
          (await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          }));

        if (!isMounted || !currentPosition) {
          return;
        }

        const nextRegion: MapRegion = {
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        };

        setRegion(nextRegion);
        await updateLocationLabel(currentPosition.coords.latitude, currentPosition.coords.longitude);
      } catch {
        // Fall back to dashboard location copy in the demo flow.
      }
    }

    if (language === 'en') {
      setHeadline('Suspicious movement by the side entrance');
      setDetails('Two people have been lingering near the service entrance for approximately ten minutes.');
    } else {
      setHeadline('Movimiento sospechoso en acceso lateral');
      setDetails('Dos personas merodeando por la entrada de servicio desde hace aproximadamente diez minutos.');
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, [copy.post.locationFallback, language]);

  if (!categories || !region) {
    return <LoadingScreen label={copy.post.loading} />;
  }

  const selectedCategoryData = categories.find((category) => category.id === selectedCategory) ?? categories[0];
  const detailsValid = details.trim().length >= 15;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 bg-[#08090B]"
      contentContainerStyle={{
        paddingTop: insets.top + 18,
        paddingBottom: insets.bottom + 28,
        paddingHorizontal: 18,
        gap: 18,
      }}>
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 gap-2">
          <Text className="text-[15px] font-semibold uppercase tracking-[1.6px] text-zinc-500">{copy.post.eyebrow}</Text>
          <Text className="text-[40px] font-semibold tracking-[-1.4px] text-white">{copy.post.title}</Text>
          <View className="flex-row items-center gap-2">
            <MaterialIcons color="#737373" name="person-outline" size={16} />
            <Text className="text-base text-zinc-400">{copy.post.nearbyUsers(57)}</Text>
          </View>
        </View>

        <BouncyPressable
          accessibilityLabel={copy.common.close}
          accessibilityRole="button"
          onPress={() => router.back()}
          pressScale={0.95}
          className="h-14 w-14 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/90">
          <MaterialIcons color="#E5E7EB" name="close" size={28} />
        </BouncyPressable>
      </View>

      {submitted ? (
        <AppCard className="gap-4 rounded-[28px] border-blue-900 bg-blue-950/30 p-5">
          <Text className="text-2xl font-semibold text-white">{copy.post.successTitle}</Text>
          <Text className="text-sm leading-6 text-zinc-300">{copy.post.successDescription}</Text>
          <AppButton label={copy.common.close} onPress={() => router.back()} />
        </AppCard>
      ) : null}

      {!submitted && step === 1 ? (
        <>
          <View className="gap-3 border-t border-zinc-900 pt-6">
            <View className="gap-2">
              <Text className="text-[28px] font-semibold tracking-[-0.6px] text-white">{copy.post.whatsHappeningTitle}</Text>
              <Text className="text-sm leading-6 text-zinc-400">
                {copy.post.whatsHappeningDescription}{' '}
                <Text className="font-semibold text-blue-300">*{copy.post.required.toLowerCase()}</Text>
              </Text>
            </View>

            <AppCard className="gap-3 rounded-[28px] border-zinc-900 bg-zinc-950/92 p-5">
              <View className="gap-2">
                <Text className="text-sm font-medium text-zinc-200">{copy.post.headlineLabel}</Text>
                <TextInput
                  value={headline}
                  onChangeText={setHeadline}
                  placeholder={copy.post.headlinePlaceholder}
                  placeholderTextColor="#71717A"
                  className="min-h-12 rounded-[18px] border border-zinc-800 bg-black/80 px-4 text-base text-white"
                  style={{ lineHeight: 20, paddingTop: 0, paddingBottom: 0, textAlignVertical: 'center' }}
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
                  className="min-h-32 rounded-[24px] border border-zinc-800 bg-black/80 px-4 py-4 text-base text-white"
                  style={{ lineHeight: 22, paddingTop: 14, paddingBottom: 14 }}
                  textAlignVertical="top"
                />
                <Text className="text-right text-xs text-zinc-500">{copy.post.characterMinimum}</Text>
              </View>
            </AppCard>
          </View>

          <View className="gap-3 border-t border-zinc-900 pt-6">
            <Text className="text-[28px] font-semibold tracking-[-0.6px] text-white">{copy.post.incidentLocationTitle}</Text>
            <Text className="text-lg text-zinc-300">{locationLabel}</Text>
            <Text className="text-sm leading-6 text-zinc-500">
              {isResolvingLocation ? `${copy.common.loading}` : copy.post.adjustPinHint}
            </Text>
            <View className="overflow-hidden rounded-[28px] border border-zinc-900">
              <MapView
                customMapStyle={DARK_MAP_STYLE as never}
                region={region}
                onRegionChangeComplete={(nextRegion) => {
                  setRegion(nextRegion);
                }}
                pitchEnabled={false}
                rotateEnabled={false}
                style={{ height: 292, width: '100%' }}
                toolbarEnabled={false}
                zoomEnabled>
                <Marker
                  draggable
                  coordinate={{ latitude: region.latitude, longitude: region.longitude }}
                  onDragEnd={(event) => {
                    const nextCoordinate = event.nativeEvent.coordinate;

                    setRegion((current) =>
                      current
                        ? {
                            ...current,
                            latitude: nextCoordinate.latitude,
                            longitude: nextCoordinate.longitude,
                          }
                        : null
                    );

                    void updateLocationLabel(nextCoordinate.latitude, nextCoordinate.longitude);
                  }}>
                  <View className="h-5 w-5 rounded-full border-2 border-white bg-amber-400" />
                </Marker>
              </MapView>
            </View>
          </View>

          <AppButton disabled={!detailsValid} label={copy.post.next} onPress={() => setStep(2)} />
        </>
      ) : null}

      {!submitted && step === 2 ? (
        <>
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text className="text-[28px] font-semibold tracking-[-0.6px] text-white">{copy.post.categoryStepTitle}</Text>
              <Text className="text-sm leading-6 text-zinc-400">{copy.post.categoryStepDescription}</Text>
            </View>
            <BouncyPressable
              accessibilityRole="button"
              onPress={() => setStep(1)}
              pressScale={0.97}
              className="rounded-full border border-zinc-800 bg-zinc-950/80 px-4 py-2.5">
              <Text className="text-sm font-semibold text-zinc-200">{copy.nav.back}</Text>
            </BouncyPressable>
          </View>

          <View className="gap-2.5">
            {categories.map((category) => {
              const selected = category.id === selectedCategory;

              return (
                <BouncyPressable
                  key={category.id}
                  accessibilityRole="button"
                  onPress={() => setSelectedCategory(category.id)}
                  pressScale={0.988}
                  className={`rounded-[22px] border px-4 py-4 ${
                    selected ? 'border-blue-500/80 bg-blue-950/30' : 'border-zinc-800 bg-zinc-950/80'
                  }`}>
                  <View className="flex-row items-center gap-4">
                    <View className="h-11 w-11 items-center justify-center rounded-[18px] bg-black/35">
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
                </BouncyPressable>
              );
            })}
          </View>

          <AppCard className="gap-4 rounded-[28px] border-zinc-900 bg-zinc-950/92 p-5">
            <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-zinc-500">{copy.post.preview}</Text>
            <View className="gap-2">
              <Text className="text-lg font-semibold text-blue-200">{selectedCategoryData?.title}</Text>
              <Text className="text-2xl font-semibold text-white">{headline}</Text>
              <Text className="text-sm leading-6 text-zinc-300">{details}</Text>
            </View>
            <View className="rounded-[20px] border border-zinc-800 bg-black/60 px-4 py-3">
              <Text className="text-xs font-semibold uppercase tracking-[1.3px] text-zinc-500">{copy.post.incidentLocationTitle}</Text>
              <Text className="mt-2 text-sm text-zinc-200">{locationLabel}</Text>
            </View>
            <AppButton label={copy.post.submit} onPress={() => setSubmitted(true)} />
          </AppCard>
        </>
      ) : null}
    </ScrollView>
  );
}
