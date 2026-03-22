import type { Language } from '@/lib/i18n/translations';

export type AlertTone = 'critical' | 'warning' | 'info';

export type TimelineEntryType = 'verified' | 'community' | 'location';

export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  homeZone: string;
  memberSince: string;
}

export interface EmergencyService {
  id: string;
  label: string;
  description: string;
  icon: string;
  tone: AlertTone;
}

export interface PriorityContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  initials: string;
}

export interface HomeDashboard {
  locationLabel: string;
  locationAddress: string;
  locationImage: string;
  liveStatus: string;
  emergencyMessage: string;
  services: EmergencyService[];
  priorityContacts: PriorityContact[];
}

export interface IncidentTimelineEntry {
  id: string;
  type: TimelineEntryType;
  title: string;
  body: string;
  minutesAgo: number;
  author?: string;
  likes?: number;
  locationLabel?: string;
  mapImage?: string;
}

export interface Incident {
  id: string;
  title: string;
  summary: string;
  fullDescription: string;
  minutesAgo: number;
  neighborhood: string;
  city: string;
  tone: AlertTone;
  verifiedCount: number;
  imageUrls: string[];
  timeline: IncidentTimelineEntry[];
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  minutesAgoLabel: string;
  icon: string;
  tone: AlertTone | 'success';
}

export interface MonitoringZone {
  id: string;
  name: string;
  radiusLabel: string;
  scheduleLabel: string;
  enabled: boolean;
}

export interface SafetyCircleMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  imageUrl: string;
}

export interface CitizenProfile {
  name: string;
  badge: string;
  district: string;
  bio: string;
  avatarUrl: string;
  reputation: string;
  reports: string;
  alertsShared: string;
  activity: ActivityItem[];
  monitoringZones: MonitoringZone[];
  safetyCircle: SafetyCircleMember[];
}

export interface ReportCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

export interface SettingsItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  value?: string;
}

export interface AlertsRepository {
  listIncidents(language: Language): Promise<Incident[]>;
  getIncidentById(id: string, language: Language): Promise<Incident | null>;
}

export interface HomeRepository {
  getDashboard(language: Language): Promise<HomeDashboard>;
}

export interface ProfileRepository {
  getProfile(language: Language): Promise<CitizenProfile>;
}

export interface ReportingRepository {
  listCategories(language: Language): Promise<ReportCategory[]>;
}

export interface SettingsRepository {
  listItems(language: Language): Promise<SettingsItem[]>;
}
