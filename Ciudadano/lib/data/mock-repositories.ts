import type {
  AlertsRepository,
  HomeRepository,
  ProfileRepository,
  ReportingRepository,
  SettingsRepository,
} from '@/lib/data/types';
import type { Language } from '@/lib/i18n/translations';
import { translations } from '@/lib/i18n/translations';

const wait = async () => {
  await Promise.resolve();
};

export const alertsRepository: AlertsRepository = {
  async listIncidents(language) {
    await wait();
    return translations[language].mockData.incidents;
  },
  async getIncidentById(id, language) {
    await wait();
    return translations[language].mockData.incidents.find((incident) => incident.id === id) ?? null;
  },
};

export const homeRepository: HomeRepository = {
  async getDashboard(language: Language) {
    await wait();
    return translations[language].mockData.dashboard;
  },
};

export const profileRepository: ProfileRepository = {
  async getProfile(language: Language) {
    await wait();
    return translations[language].mockData.profile;
  },
};

export const reportingRepository: ReportingRepository = {
  async listCategories(language: Language) {
    await wait();
    return translations[language].mockData.reportCategories;
  },
};

export const settingsRepository: SettingsRepository = {
  async listItems(language: Language) {
    await wait();
    return translations[language].mockData.settingsItems;
  },
};
