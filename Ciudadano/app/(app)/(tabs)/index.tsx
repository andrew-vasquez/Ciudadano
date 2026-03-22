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
import { StatusPill } from '@/components/ui/status-pill';
import { alertsRepository, homeRepository } from '@/lib/data/mock-repositories';
import { useI18n } from '@/lib/i18n/language-provider';
import type { HomeDashboard, Incident, MapRegion } from '@/lib/data/types';

const isIOS = process.env.EXPO_OS === 'ios';
const MAP_BOTTOM_SPACE = 94;
const ACTION_ROW_HEIGHT = 72;
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

function formatCoverage(label: string) {
  const value = label.match(/[0-9.]+/)?.[0];
  return value ? `${value} km` : label;
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
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
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
      setSelectedIncidentId((current) => current ?? nextIncidents[0]?.id ?? null);
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

  useEffect(() => {
    if (!filteredIncidents.length) {
      setSelectedIncidentId(null);
      return;
    }

    const currentStillVisible = filteredIncidents.some((incident) => incident.id === selectedIncidentId);

    if (!currentStillVisible) {
      setSelectedIncidentId(filteredIncidents[0]?.id ?? null);
    }
  }, [filteredIncidents, selectedIncidentId]);

  const selectedIncident = useMemo(
    () => filteredIncidents.find((incident) => incident.id === selectedIncidentId) ?? filteredIncidents[0] ?? null,
    [filteredIncidents, selectedIncidentId]
  );
  const showMapActions = hasLocationPermission && !!userCoordinate;

  const focusIncident = (incident: Incident) => {
    setSelectedIncidentId(incident.id);
    setIsMapCenteredOnUser(false);
    mapRef.current?.animateToRegion(
      {
        latitude: incident.latitude,
        longitude: incident.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      240
    );
  };

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
        rotateEnabled={false}
        showsCompass={false}
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
        showsUserLocation={hasLocationPermission}
        style={StyleSheet.absoluteFillObject}>
        {filteredIncidents.map((incident) => (
          <Marker
            key={incident.id}
            coordinate={{ latitude: incident.latitude, longitude: incident.longitude }}
            onPress={() => focusIncident(incident)}>
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

        <View
          style={[
            styles.bottomSection,
            {
              bottom: MAP_BOTTOM_SPACE + insets.bottom,
            },
          ]}>
          {selectedIncident ? (
            <View style={styles.selectedAlertWrap}>
              <GlassPanel>
                <BouncyPressable
                  accessibilityRole="button"
                  onPress={() => router.push(`/(app)/incidents/${selectedIncident.id}`)}
                  pressScale={0.988}
                  style={styles.selectedPressable}>
                  <View style={styles.selectedHeader}>
                    <StatusPill label={copy.home.selectedAlert} tone={selectedIncident.tone} />
                    <Text style={styles.selectedMeta}>{copy.common.minutesAgo(selectedIncident.minutesAgo)}</Text>
                  </View>
                  <Text style={styles.selectedTitle}>{selectedIncident.title}</Text>
                  <Text numberOfLines={2} style={styles.selectedSummary}>
                    {selectedIncident.summary}
                  </Text>
                </BouncyPressable>
              </GlassPanel>
            </View>
          ) : null}

          <View style={styles.bottomLane}>
            <View style={styles.bottomRow}>
              <GlassPanel style={styles.bottomCardLeft}>
                <Text style={styles.bottomValue}>{String(filteredIncidents.length).padStart(2, '0')}</Text>
                <Text style={styles.bottomLabel}>{copy.home.nearbyIncidentsStat}</Text>
              </GlassPanel>
              <GlassPanel style={styles.bottomExplore}>
                <BouncyPressable
                  accessibilityRole="button"
                  onPress={() => selectedIncident && router.push(`/(app)/incidents/${selectedIncident.id}`)}
                  pressScale={0.975}
                  style={styles.exploreButton}>
                  <View style={styles.exploreRow}>
                    <Text style={styles.exploreText}>{copy.home.explore}</Text>
                    <MaterialIcons color="#111111" name="north-east" size={16} />
                  </View>
                </BouncyPressable>
              </GlassPanel>
              <GlassPanel style={styles.bottomCardRight}>
                <Text style={styles.bottomValue}>{formatCoverage(dashboard.watchRadiusLabel)}</Text>
                <Text style={styles.bottomLabel}>{copy.home.coverageStat}</Text>
              </GlassPanel>
            </View>

            {showMapActions ? (
              <View pointerEvents="box-none" style={styles.mapActionStack}>
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
                  onPress={() => router.navigate('/(app)/(tabs)/post')}
                  pressScale={0.94}
                  style={styles.fab}>
                  <MaterialIcons color="#FFFFFF" name="add-alert" size={22} />
                </BouncyPressable>
              </View>
            ) : null}
          </View>
        </View>
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
    minHeight: 50,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 18,
    paddingVertical: 0,
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
  selectedAlertWrap: {
    marginBottom: 12,
    width: '100%',
    zIndex: 2,
  },
  selectedPressable: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  selectedMeta: {
    color: '#AAB3C2',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  selectedTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  selectedSummary: {
    color: '#C4CCD8',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
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
  bottomSection: {
    position: 'absolute',
    left: 18,
    right: 18,
  },
  bottomLane: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    zIndex: 1,
  },
  bottomRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  bottomCardLeft: {
    width: 82,
    minHeight: ACTION_ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  bottomExplore: {
    flex: 1,
    minHeight: 66,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 999,
  },
  bottomCardRight: {
    width: 90,
    minHeight: ACTION_ROW_HEIGHT,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  bottomValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: -0.6,
    fontVariant: ['tabular-nums'],
  },
  bottomLabel: {
    color: '#C2CAD5',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 3,
  },
  exploreButton: {
    width: '100%',
  },
  exploreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  exploreText: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '700',
  },
});
