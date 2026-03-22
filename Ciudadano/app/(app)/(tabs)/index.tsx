import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoadingScreen } from '@/components/ui/loading-screen';
import { BouncyPressable } from '@/components/ui/bouncy-pressable';
import { alertsRepository, homeRepository } from '@/lib/data/mock-repositories';
import { useI18n } from '@/lib/i18n/language-provider';
import type { HomeDashboard, Incident, MapRegion } from '@/lib/data/types';

const isIOS = process.env.EXPO_OS === 'ios';
const MAP_ACTION_SIZE = 50;
const FILTERS = ['all', 'police', 'medical', 'fire'] as const;
type FilterKey = (typeof FILTERS)[number];
type UserCoordinate = Pick<MapRegion, 'latitude' | 'longitude'>;

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1d2a38' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8b9fb3' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#101721' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#33485d' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1a2430' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#243624' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#34495e' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#41596f' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#566b82' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#243140' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#132536' }] },
];

function GlassPanel({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.glassShell, style]}>
      <BlurView intensity={isIOS ? 100 : 70} tint={isIOS ? 'systemChromeMaterialDark' : 'dark'} style={StyleSheet.absoluteFillObject} />
      <View style={styles.glassTint} />
      {children}
    </View>
  );
}

function getIncidentFilter(incident: Incident): Exclude<FilterKey, 'all'> {
  const title = `${incident.title} ${incident.summary}`.toLowerCase();

  if (title.includes('medical') || title.includes('medic') || title.includes('medico')) {
    return 'medical';
  }

  if (title.includes('fire') || title.includes('incend')) {
    return 'fire';
  }

  return 'police';
}

function getUserMapRegion(coordinate: UserCoordinate): MapRegion {
  return {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    latitudeDelta: 0.018,
    longitudeDelta: 0.018,
  };
}

function isRegionNearUser(region: MapRegion, coordinate: UserCoordinate) {
  const latitudeThreshold = Math.max(region.latitudeDelta * 0.28, 0.0035);
  const longitudeThreshold = Math.max(region.longitudeDelta * 0.28, 0.0035);

  return (
    Math.abs(region.latitude - coordinate.latitude) <= latitudeThreshold &&
    Math.abs(region.longitude - coordinate.longitude) <= longitudeThreshold
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { copy, language } = useI18n();
  const [dashboard, setDashboard] = useState<HomeDashboard | null>(null);
  const [incidents, setIncidents] = useState<Incident[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(true);
  const [isMapCenteredOnUser, setIsMapCenteredOnUser] = useState(true);
  const [userCoordinate, setUserCoordinate] = useState<UserCoordinate | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const recenterToUser = async (options?: { forceRefresh?: boolean }) => {
    if (!hasLocationPermission) {
      return false;
    }

    if (!options?.forceRefresh && userCoordinate) {
      setIsMapCenteredOnUser(true);
      mapRef.current?.animateToRegion(getUserMapRegion(userCoordinate), 280);
      return true;
    }

    setIsLocatingUser(true);

    try {
      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const nextCoordinate = {
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      };

      if (!isMountedRef.current) {
        return false;
      }

      setUserCoordinate(nextCoordinate);
      setIsMapCenteredOnUser(true);
      mapRef.current?.animateToRegion(getUserMapRegion(nextCoordinate), 280);
      return true;
    } catch {
      if (userCoordinate) {
        setIsMapCenteredOnUser(true);
        mapRef.current?.animateToRegion(getUserMapRegion(userCoordinate), 280);
        return true;
      }

      return false;
    } finally {
      if (isMountedRef.current) {
        setIsLocatingUser(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const [nextDashboard, nextIncidents] = await Promise.all([
        homeRepository.getDashboard(language),
        alertsRepository.listIncidents(language),
      ]);

      if (!isMounted) {
        return;
      }

      setDashboard(nextDashboard);
      setIncidents(nextIncidents);
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, [language]);

  useEffect(() => {
    let isMounted = true;

    async function loadLocation() {
      setIsLocatingUser(true);
      const permission = await Location.requestForegroundPermissionsAsync();
      const granted = permission.status === 'granted';

      if (!isMounted) {
        return;
      }

      setHasLocationPermission(granted);

      if (!granted) {
        setIsLocatingUser(false);
        return;
      }

      const lastKnown = await Location.getLastKnownPositionAsync();

      if (!isMounted) {
        return;
      }

      if (lastKnown) {
        const nextCoordinate = {
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
        };

        setUserCoordinate(nextCoordinate);
        setIsMapCenteredOnUser(true);
        mapRef.current?.animateToRegion(getUserMapRegion(nextCoordinate), 300);
        setIsLocatingUser(false);
        return;
      }

      try {
        const currentPosition = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!isMounted) {
          return;
        }

        const nextCoordinate = {
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
        };

        setUserCoordinate(nextCoordinate);
        setIsMapCenteredOnUser(true);
        mapRef.current?.animateToRegion(getUserMapRegion(nextCoordinate), 300);
      } finally {
        if (isMounted) {
          setIsLocatingUser(false);
        }
      }
    }

    void loadLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredIncidents = useMemo(() => {
    if (!incidents) {
      return [];
    }

    return incidents.filter((incident) => {
      const matchesSearch =
        !searchQuery ||
        `${incident.title} ${incident.summary} ${incident.neighborhood} ${incident.city}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesFilter = activeFilter === 'all' || getIncidentFilter(incident) === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, incidents, searchQuery]);

  const showMapActions = hasLocationPermission && !!userCoordinate;

  if (!dashboard || !incidents) {
    return <LoadingScreen label={copy.home.loading} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        customMapStyle={process.env.EXPO_OS === 'android' ? DARK_MAP_STYLE : undefined}
        initialRegion={dashboard.mapRegion}
        mapType={process.env.EXPO_OS === 'ios' ? 'mutedStandard' : 'standard'}
        onRegionChangeComplete={(region) => {
          if (!userCoordinate) {
            return;
          }

          setIsMapCenteredOnUser(isRegionNearUser(region, userCoordinate));
        }}
        pitchEnabled={false}
        rotateEnabled={false}
        showsCompass={false}
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
        showsUserLocation={hasLocationPermission}
        zoomEnabled
        style={StyleSheet.absoluteFillObject}>
        {filteredIncidents.map((incident) => (
          <Marker
            key={incident.id}
            coordinate={{ latitude: incident.latitude, longitude: incident.longitude }}
            onPress={() => router.push(`/(app)/incidents/${incident.id}`)}>
            <View
              style={[
                styles.marker,
                incident.tone === 'critical'
                  ? styles.markerCritical
                  : incident.tone === 'warning'
                    ? styles.markerWarning
                    : styles.markerInfo,
              ]}>
              <View style={styles.markerInner}>
                <MaterialIcons color="#FFFFFF" name="warning" size={14} />
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      <View pointerEvents="none" style={styles.mapShade} />

      <View
        pointerEvents="box-none"
        style={[
          styles.overlay,
          {
            paddingTop: insets.top + 10,
          },
        ]}>
        <View style={styles.topStack}>
          <GlassPanel style={styles.searchShell}>
            <View style={styles.searchRow}>
              <MaterialIcons color="#C7CDD7" name="search" size={22} />
              <TextInput
                placeholder={copy.home.searchPlaceholder}
                placeholderTextColor="#A4ABB8"
                selectionColor="#FFFFFF"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </GlassPanel>

          <GlassPanel style={styles.filterShell}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              <Pressable
                onPress={() => {
                  setActiveFilter('all');
                }}
                style={[styles.filterChipPrimary, activeFilter === 'all' ? styles.filterChipPrimaryActive : null]}>
                <MaterialIcons color="#FFFFFF" name="layers" size={16} />
                <Text style={styles.filterChipPrimaryText}>{copy.home.filters.all}</Text>
              </Pressable>
              <Pressable style={[styles.filterChip, styles.filterChipWithIcon]}>
                <MaterialIcons color="#FFFFFF" name="schedule" size={16} />
                <Text style={styles.filterChipText}>{copy.home.filters.timeframe}</Text>
              </Pressable>
              {FILTERS.filter((filter) => filter !== 'all').map((filter) => {
                const selected = activeFilter === filter;
                const label =
                  filter === 'police'
                    ? copy.home.filters.police
                    : filter === 'medical'
                      ? copy.home.filters.medical
                      : copy.home.filters.fire;

                return (
                  <Pressable
                    key={filter}
                    onPress={() => {
                      setActiveFilter((current) => (current === filter ? 'all' : filter));
                    }}
                    style={[styles.filterChip, selected ? styles.filterChipSelected : null]}>
                    <Text style={[styles.filterChipText, selected ? styles.filterChipSelectedText : null]}>{label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </GlassPanel>
        </View>

        {showMapActions ? (
          <View
            pointerEvents="box-none"
            style={[
              styles.mapActionStack,
              {
                bottom: insets.bottom + 88,
              },
            ]}>
            <GlassPanel style={[styles.mapActionButtonShell, isMapCenteredOnUser ? styles.mapActionButtonShellActive : null]}>
              <BouncyPressable
                accessibilityLabel={copy.home.actions.recenter}
                accessibilityRole="button"
                disabled={isLocatingUser}
                onPress={() => {
                  void recenterToUser();
                }}
                pressScale={0.93}
                style={[styles.mapActionButton, isLocatingUser ? styles.mapActionButtonDisabled : null]}>
                <MaterialIcons color="#FFFFFF" name="my-location" size={20} />
              </BouncyPressable>
            </GlassPanel>

            <BouncyPressable
              accessibilityLabel={copy.home.actions.createAlert}
              accessibilityRole="button"
              onPress={() => router.push('/(app)/report-alert')}
              pressScale={0.94}
              style={styles.fab}>
              <MaterialIcons color="#FFFFFF" name="add-alert" size={22} />
            </BouncyPressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mapShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 8, 18, 0.18)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 18,
  },
  topStack: {
    gap: 8,
  },
  glassShell: {
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.11)',
    backgroundColor: 'rgba(8, 12, 18, 0.24)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
  },
  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  searchShell: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 34,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'center',
  },
  filterShell: {
    paddingVertical: 4,
  },
  filterScroll: {
    gap: 6,
    paddingHorizontal: 8,
  },
  filterChipPrimary: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 18,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(10,10,12,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  filterChipPrimaryActive: {
    backgroundColor: 'rgba(10,10,12,0.9)',
  },
  filterChipPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  filterChip: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  filterChipWithIcon: {
    gap: 6,
    paddingHorizontal: 14,
  },
  filterChipSelected: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderColor: 'rgba(255,255,255,0.16)',
  },
  filterChipText: {
    color: '#DCE1EA',
    fontSize: 13,
    fontWeight: '700',
  },
  filterChipSelectedText: {
    color: '#FFFFFF',
  },
  marker: {
    width: 26,
    height: 26,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
  },
  markerCritical: {
    backgroundColor: '#F43F5E',
    borderColor: '#FECDD3',
  },
  markerWarning: {
    backgroundColor: '#F59E0B',
    borderColor: '#FDE68A',
  },
  markerInfo: {
    backgroundColor: '#2563EB',
    borderColor: '#BFDBFE',
  },
  markerInner: {
    width: 20,
    height: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    boxShadow: '0 18px 36px rgba(37, 99, 235, 0.32)',
  },
  mapActionStack: {
    position: 'absolute',
    right: 18,
    gap: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapActionButtonShell: {
    borderRadius: 999,
  },
  mapActionButtonShellActive: {
    borderColor: 'rgba(96, 165, 250, 0.32)',
  },
  mapActionButton: {
    width: MAP_ACTION_SIZE,
    height: MAP_ACTION_SIZE,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapActionButtonDisabled: {
    opacity: 0.65,
  },
});
