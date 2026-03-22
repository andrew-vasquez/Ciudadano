import type {
  CitizenProfile,
  HomeDashboard,
  Incident,
  ReportCategory,
  SettingsItem,
} from '@/lib/data/types';

export type Language = 'en' | 'es';

type AppCopy = {
  nav: {
    back: string;
    tabs: {
      home: string;
      alerts: string;
      post: string;
      profile: string;
      settings: string;
    };
    stack: {
      incident: string;
      sos: string;
      safetyCircle: string;
    };
  };
  common: {
    loading: string;
    manage: string;
    share: string;
    call: string;
    close: string;
    active: string;
    paused: string;
    latest: string;
    verifiedCommunity: string;
    minutesAgo: (minutes: number) => string;
  };
  auth: {
    welcome: {
      screenTitle: string;
      eyebrow: string;
      title: string;
      description: string;
      footer: string;
      createAccount: string;
      signIn: string;
      highlights: { icon: string; title: string; subtitle: string }[];
    };
    signIn: {
      screenTitle: string;
      eyebrow: string;
      title: string;
      description: string;
      footerPrefix: string;
      footerLink: string;
      emailLabel: string;
      emailPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      passwordHelper: string;
      submit: string;
      genericError: string;
      validationError: string;
    };
    signUp: {
      screenTitle: string;
      eyebrow: string;
      title: string;
      description: string;
      footerPrefix: string;
      footerLink: string;
      fullNameLabel: string;
      fullNamePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      homeZoneLabel: string;
      homeZonePlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      submit: string;
      genericError: string;
      validationError: string;
    };
  };
  home: {
    loading: string;
    eyebrow: string;
    title: string;
    description: string;
    searchPlaceholder: string;
    selectedAlert: string;
    nearbyIncidentsStat: string;
    coverageStat: string;
    explore: string;
    silentModeTitle: string;
    silentModeDescription: string;
    emergencyBroadcastTitle: string;
    openSosFlow: string;
    featuredAlert: string;
    noAlertsTitle: string;
    noAlertsDescription: string;
    actions: {
      recenter: string;
      createAlert: string;
    };
    filters: {
      all: string;
      police: string;
      medical: string;
      fire: string;
      timeframe: string;
    };
  };
  alerts: {
    loading: string;
    eyebrow: string;
    title: string;
    description: string;
    intro: string;
    noAlertsTitle: string;
    noAlertsDescription: string;
    tones: {
      critical: string;
      warning: string;
      info: string;
    };
  };
  incident: {
    loading: string;
    notFoundTitle: string;
    notFoundDescription: string;
    verifiedAlert: string;
    confirmedBy: (count: number) => string;
    actions: {
      update: string;
      navigate: string;
      safeList: string;
      emergency: string;
    };
    communityTimeline: string;
    timelineLabels: {
      verified: string;
      community: string;
      location: string;
      reply: string;
    };
  };
  post: {
    loading: string;
    eyebrow: string;
    title: string;
    description: string;
    headlineLabel: string;
    headlinePlaceholder: string;
    detailsLabel: string;
    detailsPlaceholder: string;
    preview: string;
    submit: string;
    successTitle: string;
    successDescription: string;
  };
  profile: {
    loading: string;
    eyebrow: string;
    memberSince: string;
    profileReady: string;
    reputationLabel: string;
    reputationDescription: string;
    reportsLabel: string;
    reportsDescription: string;
    alertsLabel: string;
    alertsDescription: string;
    recentActivity: string;
    monitoringZones: string;
    safetyCircle: string;
  };
  safetyCircle: {
    loading: string;
    eyebrow: string;
    title: string;
    description: string;
    nextStepTitle: string;
    nextStepDescription: string;
    addContact: string;
    importFromPhone: string;
  };
  sos: {
    eyebrow: string;
    title: string;
    description: string;
    broadcastTitle: string;
    broadcastDescription: string;
    nextIntegrationTitle: string;
    nextIntegrationDescription: string;
    acknowledge: string;
    steps: string[];
  };
  settings: {
    loading: string;
    eyebrow: string;
    title: string;
    description: string;
    biometricsTitle: string;
    biometricsDescription: string;
    zoneDigestTitle: string;
    zoneDigestDescription: string;
    languageTitle: string;
    languageDescription: string;
    english: string;
    spanish: string;
    leaveDemoTitle: string;
    leaveDemoDescription: string;
    signOut: string;
  };
  mockData: {
    dashboard: HomeDashboard;
    incidents: Incident[];
    profile: CitizenProfile;
    reportCategories: ReportCategory[];
    settingsItems: SettingsItem[];
  };
};

export const translations: Record<Language, AppCopy> = {
  en: {
    nav: {
      back: 'Back',
      tabs: { home: 'Home', alerts: 'Alerts', post: 'Report', profile: 'Profile', settings: 'Settings' },
      stack: { incident: 'Incident', sos: 'SOS', safetyCircle: 'Safety Circle' },
    },
    common: {
      loading: 'Loading Ciudadano...',
      manage: 'Manage',
      share: 'Share',
      call: 'Call',
      close: 'Close',
      active: 'Active',
      paused: 'Paused',
      latest: 'Latest first',
      verifiedCommunity: 'Community verified',
      minutesAgo: (minutes) => `${minutes} min ago`,
    },
    auth: {
      welcome: {
        screenTitle: 'Welcome',
        eyebrow: 'Ciudadano',
        title: 'A civic network built to respond faster.',
        description:
          'Follow nearby alerts, see them on a live map, and stay ready to respond with context instead of noise.',
        footer: 'Designed as a first-release shell with demo data and an architecture ready for a real backend.',
        createAccount: 'Create account',
        signIn: 'I already have an account',
        highlights: [
          {
            icon: 'verified-user',
            title: 'Verified alerts',
            subtitle: 'See community-prioritized incidents before they escalate.',
          },
          {
            icon: 'emergency-share',
            title: 'Fast emergency response',
            subtitle: 'Trigger SOS and escalate an urgent situation through a single flow.',
          },
          {
            icon: 'map',
            title: 'Neighborhood zones',
            subtitle: 'Monitor key areas and stay aware of what is happening nearby.',
          },
        ],
      },
      signIn: {
        screenTitle: 'Sign in',
        eyebrow: 'Access',
        title: 'Return to your trusted network.',
        description: 'Use the demo credentials or type your own to enter the full app shell.',
        footerPrefix: "Don't have an account yet?",
        footerLink: 'Create one',
        emailLabel: 'Email',
        emailPlaceholder: 'you@email.com',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Enter your password',
        passwordHelper: 'For this first version, any non-empty password works.',
        submit: 'Continue',
        genericError: 'We could not sign you in.',
        validationError: 'Enter your email and password to continue.',
      },
      signUp: {
        screenTitle: 'Create account',
        eyebrow: 'Onboarding',
        title: 'Activate your citizen profile.',
        description:
          'Create a demo account to walk through reporting, zone monitoring, and community safety flows.',
        footerPrefix: 'Already have an account?',
        footerLink: 'Sign in',
        fullNameLabel: 'Full name',
        fullNamePlaceholder: 'How you want to appear in your community',
        emailLabel: 'Email',
        emailPlaceholder: 'you@email.com',
        homeZoneLabel: 'Primary zone',
        homeZonePlaceholder: 'Ex. Polanco, CDMX',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Minimum 1 character for this demo',
        submit: 'Create account',
        genericError: 'We could not create your account.',
        validationError: 'Complete the required fields to create your account.',
      },
    },
    home: {
      loading: 'Loading the live map around you...',
      eyebrow: 'Ciudadano live',
      title: 'Live map',
      description:
        'See nearby reports on the map, track where incidents were posted, and open the latest alert details in one place.',
      searchPlaceholder: 'Search location...',
      selectedAlert: 'Selected alert',
      nearbyIncidentsStat: 'Nearby active incidents',
      coverageStat: 'Coverage radius',
      explore: 'Explore further',
      silentModeTitle: 'Quiet notifications',
      silentModeDescription: 'Lower sound and vibration for lower-priority activity.',
      emergencyBroadcastTitle: 'Emergency access',
      openSosFlow: 'Open SOS',
      featuredAlert: 'Latest reports',
      noAlertsTitle: 'No active alerts',
      noAlertsDescription: 'When your zone picks up incidents that matter, they will show up here first.',
      actions: {
        recenter: 'Center on me',
        createAlert: 'Create alert',
      },
      filters: {
        all: 'All',
        police: 'Police',
        medical: 'Medical',
        fire: 'Fire',
        timeframe: 'Timeframe',
      },
    },
    alerts: {
      loading: 'Loading alerts for your area...',
      eyebrow: 'Live incidents',
      title: 'Alerts and follow-up',
      description:
        'Community-verified incidents ordered to prioritize response and context before action.',
      intro: 'This first release shows demo data with a structure ready for realtime updates and moderation.',
      noAlertsTitle: 'Your area is calm',
      noAlertsDescription:
        'There are no active incidents right now. Ciudadano will let you know when that changes.',
      tones: {
        critical: 'Critical alert',
        warning: 'Under watch',
        info: 'Follow-up',
      },
    },
    incident: {
      loading: 'Loading incident details...',
      notFoundTitle: 'Incident not found',
      notFoundDescription: 'This record does not exist or is no longer available in the current demo.',
      verifiedAlert: 'Verified alert',
      confirmedBy: (count) => `Confirmed by ${count} community members.`,
      actions: {
        update: 'Update',
        navigate: 'Navigate',
        safeList: 'Safe list',
        emergency: 'Emergency',
      },
      communityTimeline: 'Community timeline',
      timelineLabels: {
        verified: 'Verified',
        community: 'Community',
        location: 'Location',
        reply: 'Reply',
      },
    },
    post: {
      loading: 'Preparing reporting flow...',
      eyebrow: 'New report',
      title: 'Publish a clear alert',
      description:
        'Share useful context so your neighborhood can see what is happening, where it is happening, and what level of response is needed.',
      headlineLabel: 'Headline',
      headlinePlaceholder: 'Summarize the incident',
      detailsLabel: 'Details',
      detailsPlaceholder: 'Describe what you see, the risk, and any useful references.',
      preview: 'Preview',
      submit: 'Submit report',
      successTitle: 'Report ready for distribution',
      successDescription:
        'In this demo build, the report is confirmed visually here. The next step is connecting it to a real backend and neighborhood moderation.',
    },
    profile: {
      loading: 'Loading citizen profile...',
      eyebrow: 'Safety profile',
      memberSince: 'Verified member since 2022',
      profileReady: 'Profile surface ready to connect to real reputation, verification, and audit trails.',
      reputationLabel: 'Reputation',
      reputationDescription: 'Top 2% contributors',
      reportsLabel: 'Reports',
      reportsDescription: 'Confirmed incidents',
      alertsLabel: 'Alerts',
      alertsDescription: 'Neighbors notified',
      recentActivity: 'Recent activity',
      monitoringZones: 'Monitoring zones',
      safetyCircle: 'Safety circle',
    },
    safetyCircle: {
      loading: 'Loading your safety circle...',
      eyebrow: 'Trusted contacts',
      title: 'Safety circle',
      description:
        'Keep the people who should receive your location, context, and priorities close at hand when you trigger an alert.',
      nextStepTitle: 'What comes next',
      nextStepDescription:
        'This flow already defines the UX for managing trusted contacts. The next step is saving real relationships per user and connecting calling, messaging, and audit permissions.',
      addContact: 'Add contact',
      importFromPhone: 'Import from phone',
    },
    sos: {
      eyebrow: 'Immediate action',
      title: 'SOS flow',
      description:
        'This modal outlines the expected SOS trigger behavior and leaves the right space for real integrations later.',
      broadcastTitle: 'Emergency broadcast',
      broadcastDescription:
        'Designed to combine geolocated context, emergency escalation, and a local response channel.',
      nextIntegrationTitle: 'Recommended next integration',
      nextIntegrationDescription:
        'Connect this flow to live location, real authentication, and a transactional backend for evidence, delivery audit, and confirmations.',
      acknowledge: 'Got it',
      steps: [
        'Share your live incident context with responders.',
        'Notify priority services based on the emergency type.',
        'Create a visible alert for nearby residents and moderators.',
      ],
    },
    settings: {
      loading: 'Syncing preferences...',
      eyebrow: 'Settings',
      title: 'Preferences and safety',
      description: 'Control how you receive alerts, share your location, and keep your session protected.',
      biometricsTitle: 'Local biometrics',
      biometricsDescription:
        'Keep this surface ready for future real sessions protected by Face ID or fingerprint.',
      zoneDigestTitle: 'Daily zone digest',
      zoneDigestDescription: 'Receive a daily digest with the most relevant activity across your active neighborhoods.',
      languageTitle: 'App language',
      languageDescription: 'Choose the language used across the app. Only English and Spanish are available.',
      english: 'English',
      spanish: 'Spanish',
      leaveDemoTitle: 'Leave demo session',
      leaveDemoDescription:
        'Sign out locally and return to onboarding. The storage layer is already ready to swap for real auth later.',
      signOut: 'Sign out',
    },
    mockData: {
      dashboard: {
        locationLabel: 'Current location',
        locationAddress: 'Av. Reforma 222, CDMX',
          mapRegion: {
            latitude: 19.4318,
            longitude: -99.1677,
            latitudeDelta: 0.055,
            longitudeDelta: 0.055,
          },
          watchRadiusLabel: '2.5 km watch radius',
        liveStatus: 'Live alert',
          emergencyMessage: 'Nearby incidents are plotted live so you can see what is happening around your current zone.',
        services: [
          { id: 'police', label: 'Police', description: 'Patrol and preventive response', icon: 'local-police', tone: 'info' },
          { id: 'medical', label: 'Medical', description: 'First aid and ambulance support', icon: 'medical-services', tone: 'critical' },
          { id: 'fire', label: 'Fire', description: 'Fire or structural risk response', icon: 'local-fire-department', tone: 'warning' },
        ],
      },
      incidents: [
        {
          id: 'unauthorized-entry-polanco',
          title: 'Unauthorized entry attempt',
          summary: 'Two people tried to jump the perimeter on Calle Emerson.',
          fullDescription:
            'Security staff reported two individuals attempting to breach the perimeter on Calle Emerson. The local patrol already notified authorities and the incident remains active.',
            latitude: 19.4323,
            longitude: -99.1942,
          minutesAgo: 3,
          neighborhood: 'Polanco',
          city: 'CDMX',
          tone: 'critical',
          verifiedCount: 14,
          imageUrls: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBthzTqiSWZXQrTtCFBkMnwe6Z4408czUdyiiOKIUhtYzVGAeKP1Ykk_GA78WQWuDPwzCUaw9S-524G8zrShpGkaVI9ZTUPdLdGvjgsnszNgYTEMsQngkNE_XptQzQokYs9JL81HmwQakl3Z137lQtE7_9BZTQaP-VcIHzLv3K9Jgka3PQE6nq_ZsXKlWXPxRf4JjGyileT7hWFga_HMWV_iUhq7VOUN39-eRbIWgdmDoJUD6AXJHp-Gnl0RtwSebTeDNP6r00wLutb',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDKo3GnZIrl-3ocfa-8K3v8Ej8a_f1k_2yTfIxNUqT-vy5s9pU7wfrCf5Y2fwOBTzWY7vrcksNNcstc6_OlT3L1cQ01l5sp6dSwYalUykErnpMzLAF9lR37GGGsPVv85sKwuFo-Xan_HyqcNCxF5sYKO3-NfJFfAvd_ZNc5KeTjx4k-0W9weXlAErsth-H7tGcMHKPH_zlzoYnJwbUSXUOUMIPdRpeaVnR57c_X_tTp73jC7wZqL9bHhN3pxdW3vTrQV_BRQyYdtYLw',
          ],
          timeline: [
            {
              id: 'verified-update',
              type: 'verified',
              title: 'Verified update',
              body: 'Local patrol is already on site checking the perimeter wall. Residents are advised to remain indoors until further notice.',
              minutesAgo: 1,
            },
            {
              id: 'community-update',
              type: 'community',
              title: 'Community witness',
              author: 'Marcos R.',
              body: 'I saw two men in dark hoodies running toward the park when the alarm went off.',
              minutesAgo: 12,
              likes: 12,
            },
            {
              id: 'location-tagged',
              type: 'location',
              title: 'Tagged location',
              body: 'Calle Emerson 42, Polanco V Seccion.',
              minutesAgo: 15,
              locationLabel: 'Calle Emerson 42, Polanco V Seccion',
              mapImage:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuAdYoeGwOXmlB8F4muJU9vkI3FX8oUiWI-eOufgEcWbclNVaRliG-UbNSAmUoHaaEXOBI0r9AydMKRLl-VFSBG6-aWX6P3XuVfvRmYtZ5lJ_4gvhuv8-k9LXkyROB_gKGIMu4uv-LRh84tMCEliUMOBvuku5vF422a3GxBdZXU_B_bu05-wWwQuQQOAuvr7zFOY00wEDa7gEwYB0ErVtci89ZnoqMwUaOvZn6Nottzfjj3wb3hMqHulCFg2o0eKzBieNgFIdrVIOT9q',
            },
          ],
        },
        {
          id: 'street-obstruction-san-angel',
          title: 'Street obstruction and dispute',
          summary: 'A vehicle is blocking the pedestrian exit by Plaza San Jacinto.',
          fullDescription:
            'Residents reported a vehicle parked over the pedestrian exit beside Plaza San Jacinto. A verbal dispute was also detected and the incident is being monitored.',
            latitude: 19.3448,
            longitude: -99.1912,
          minutesAgo: 11,
          neighborhood: 'San Angel',
          city: 'CDMX',
          tone: 'warning',
          verifiedCount: 8,
          imageUrls: ['https://images.unsplash.com/photo-1520038410233-7141be7e6f97?auto=format&fit=crop&w=1200&q=80'],
          timeline: [
            {
              id: 'street-verified',
              type: 'verified',
              title: 'Confirmed by neighbors',
              body: 'The pedestrian exit remains blocked. Two zone moderators have already submitted evidence.',
              minutesAgo: 4,
            },
          ],
        },
        {
          id: 'medical-support-reforma',
          title: 'Medical support request',
          summary: 'Medical assistance was requested for an older adult at Reforma 222.',
          fullDescription:
              'A medical alert was reported for an older adult with dizziness symptoms at Reforma 222. The first-aid team is on the way.',
            latitude: 19.4276,
            longitude: -99.1581,
          minutesAgo: 18,
          neighborhood: 'Juarez',
          city: 'CDMX',
          tone: 'info',
          verifiedCount: 5,
          imageUrls: ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80'],
          timeline: [
            {
              id: 'medical-update',
              type: 'verified',
              title: 'Support on the way',
              body: 'The ambulance is approximately five minutes away.',
              minutesAgo: 6,
            },
          ],
        },
      ],
      profile: {
        name: 'Mateo Estrada',
        badge: 'Elite Guardian',
        district: 'San Angel, CDMX',
        bio: 'Neighborhood watch member since 2022. Committed to building a safer civic network for his community.',
        avatarUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBwHCt-Q5podL1D98UzW_yJ6CasQFZEMCIlUbBz421REIcTU79IU3wPRvcpj73VRBXZ05PDLibgADzGd_hvF7I1idbVTsyFmSUONL10-MYUOaiOpIZZaKOHopxJR2ZCHG4proGnkJ2CcvnjuBqXdUKV1xEzS3HEkKfRcajsWLQY0muNDXI_N1_aXBrP6JHZdOnl92QuzJQ6hnsOCzvVn1oq2jCsN41UxAupkJSiYwGQQ4zSE9rTVvqh_iEYUOpE29Ke68NST3eNxpi1',
        reputation: '4.9',
        reports: '142',
        alertsShared: '856',
        activity: [
          { id: 'activity-1', title: 'Street obstruction reported', description: 'Confirmed by 12 residents in San Angel.', minutesAgoLabel: '2h ago', icon: 'report', tone: 'critical' },
          { id: 'activity-2', title: 'Reputation bonus awarded', description: 'You reached 10 verified reports in a row.', minutesAgoLabel: 'Yesterday', icon: 'workspace-premium', tone: 'success' },
          { id: 'activity-3', title: 'Zone alert distributed', description: 'You shared suspicious activity with your primary zone.', minutesAgoLabel: '3 days ago', icon: 'campaign', tone: 'info' },
        ],
        monitoringZones: [
          { id: 'san-angel', name: 'San Angel Central', radiusLabel: '2 km', scheduleLabel: 'Active all day', enabled: true },
          { id: 'santa-fe', name: 'Santa Fe Business', radiusLabel: '500 m', scheduleLabel: 'Weekdays only', enabled: false },
        ],
        safetyCircle: [
          {
            id: 'elena',
            name: 'Elena Estrada',
            role: 'Primary contact',
            phone: '+52 55 4488 9001',
            imageUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCn0yEiGwCWACDhBgQEe7f9TNn5B_-q6XLRGngmACNCmLH_m9aZYivmbyrN5KqJjq32aFcFpVHP177amNBewmprVcqermAbPlCHaNacgEl8iPioELKL35VORgg6nDAkSfQsa9Os7mDvQI3C20kvo6zr6Vau6hEXy-wBEtVrxbrYD-aGl9s5fzDC6p8PjZ2f4S0SQrlc6jYrFpr7bVOMDXM3KFaP6s1Y4C_z2ZymEb_wZs3_BDMOQsv0hKKuRmwDFo-Ae-FIBQPRpNjd',
          },
          {
            id: 'victor',
            name: 'Victor Ross',
            role: 'Neighborhood liaison',
            phone: '+52 55 8822 4040',
            imageUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuD4gmnie4O1CMVf7HFXxm2qt02N2RKkto6_8V17xHvHqIJW-xUjcF8jhzF22knfRivE8ydO4rEZ_MYDV26tpkd4JcKHAoBE7cY1I1Gr-ASQbCyUK4tlzaw8c2at81OzekleDxEAMR0NkAKd2sg9rliuD9mMjjH6qIT_xb1_Fxc9pYLPw-iIBPRvM9WNdM6OEPr3Se6UT-KAHBoocJWVvIaqb8HGZmzFVDeBpdSeWi2ET2neCfrfQoCZnijmOFuYHnI71wpSBEAsncR9',
          },
        ],
      },
      reportCategories: [
        { id: 'suspicious-activity', title: 'Suspicious activity', subtitle: 'People, vehicles, or movements that look out of place', icon: 'visibility' },
        { id: 'medical', title: 'Medical emergency', subtitle: 'Immediate support request and first-aid response', icon: 'favorite' },
        { id: 'infrastructure', title: 'Infrastructure and traffic', subtitle: 'Obstructions, lighting issues, or urban risk points', icon: 'traffic' },
      ],
      settingsItems: [
        { id: 'notifications', title: 'Smart notifications', description: 'Receive only alerts that matter based on your area and priority level.', icon: 'notifications-active', value: 'Enabled' },
        { id: 'privacy', title: 'Location privacy', description: 'Control when your approximate position is attached to your reports and incident context.', icon: 'shield', value: 'Approximate only' },
        { id: 'community', title: 'Community moderation', description: 'Adjust the verification threshold required to show local incidents.', icon: 'groups', value: 'Balanced' },
      ],
    },
  },
  es: {
    nav: {
      back: 'Atras',
      tabs: { home: 'Inicio', alerts: 'Alertas', post: 'Reporte', profile: 'Perfil', settings: 'Ajustes' },
      stack: { incident: 'Incidente', sos: 'SOS', safetyCircle: 'Circulo de seguridad' },
    },
    common: {
      loading: 'Cargando Ciudadano...',
      manage: 'Administrar',
      share: 'Compartir',
      call: 'Llamar',
      close: 'Cerrar',
      active: 'Activa',
      paused: 'Pausada',
      latest: 'Mas recientes',
      verifiedCommunity: 'Comunidad verificada',
      minutesAgo: (minutes) => `Hace ${minutes} min`,
    },
    auth: {
      welcome: {
        screenTitle: 'Bienvenido',
        eyebrow: 'Ciudadano',
        title: 'Una red ciudadana para reaccionar mejor.',
        description:
          'Sigue alertas cercanas, velas en un mapa vivo y mantente listo para responder con contexto, no con ruido.',
        footer: 'Diseñado para un flujo inicial con datos demo y una arquitectura lista para backend real.',
        createAccount: 'Crear cuenta',
        signIn: 'Ya tengo cuenta',
        highlights: [
          { icon: 'verified-user', title: 'Alertas verificadas', subtitle: 'Ve incidentes priorizados por tu comunidad antes de que escalen.' },
          { icon: 'emergency-share', title: 'Respuesta rapida', subtitle: 'Activa el flujo SOS y escala una situacion urgente en un solo paso.' },
          { icon: 'map', title: 'Zonas para tu colonia', subtitle: 'Monitorea puntos clave y mantente al tanto de lo que pasa cerca de ti.' },
        ],
      },
      signIn: {
        screenTitle: 'Iniciar sesion',
        eyebrow: 'Acceso',
        title: 'Entra a tu red de confianza.',
        description: 'Usa las credenciales demo o captura las tuyas para entrar al flujo completo del app shell.',
        footerPrefix: '¿Aun no tienes cuenta?',
        footerLink: 'Crear cuenta',
        emailLabel: 'Correo',
        emailPlaceholder: 'tu@correo.mx',
        passwordLabel: 'Contrasena',
        passwordPlaceholder: 'Ingresa tu contrasena',
        passwordHelper: 'Para esta primera version basta con cualquier contrasena no vacia.',
        submit: 'Continuar',
        genericError: 'No fue posible iniciar sesion.',
        validationError: 'Ingresa tu correo y contrasena para continuar.',
      },
      signUp: {
        screenTitle: 'Crear cuenta',
        eyebrow: 'Onboarding',
        title: 'Activa tu perfil ciudadano.',
        description: 'Crea una cuenta demo para recorrer el flujo completo de reportes, monitoreo de zonas y seguridad comunitaria.',
        footerPrefix: '¿Ya tienes cuenta?',
        footerLink: 'Inicia sesion',
        fullNameLabel: 'Nombre completo',
        fullNamePlaceholder: 'Como quieres aparecer en tu comunidad',
        emailLabel: 'Correo',
        emailPlaceholder: 'tu@correo.mx',
        homeZoneLabel: 'Zona principal',
        homeZonePlaceholder: 'Ej. Polanco, CDMX',
        passwordLabel: 'Contrasena',
        passwordPlaceholder: 'Minimo 1 caracter para esta demo',
        submit: 'Crear cuenta',
        genericError: 'No fue posible crear tu cuenta.',
        validationError: 'Completa los campos obligatorios para crear tu cuenta.',
      },
    },
    home: {
      loading: 'Cargando el mapa vivo a tu alrededor...',
      eyebrow: 'Ciudadano live',
      title: 'Mapa en vivo',
      description: 'Ve reportes cercanos en el mapa, ubica donde se publico cada incidente y abre el detalle mas reciente desde un solo lugar.',
      searchPlaceholder: 'Buscar ubicacion...',
      selectedAlert: 'Alerta seleccionada',
      nearbyIncidentsStat: 'Incidentes activos cercanos',
      coverageStat: 'Radio de cobertura',
      explore: 'Explorar mas',
      silentModeTitle: 'Notificaciones discretas',
      silentModeDescription: 'Reduce sonido y vibracion para actividad de menor prioridad.',
      emergencyBroadcastTitle: 'Acceso de emergencia',
      openSosFlow: 'Abrir SOS',
      featuredAlert: 'Reportes recientes',
      noAlertsTitle: 'Sin alertas activas',
      noAlertsDescription: 'Cuando tu zona registre incidentes de interes, apareceran aqui con prioridad.',
      actions: {
        recenter: 'Centrar en mi',
        createAlert: 'Crear alerta',
      },
      filters: {
        all: 'Todo',
        police: 'Policia',
        medical: 'Medico',
        fire: 'Bomberos',
        timeframe: 'Horario',
      },
    },
    alerts: {
      loading: 'Cargando alertas de tu zona...',
      eyebrow: 'Incidentes vivos',
      title: 'Alertas y seguimiento',
      description: 'Incidentes verificados por tu comunidad, ordenados para priorizar respuesta y contexto antes de actuar.',
      intro: 'La version inicial muestra datos demo con estructura lista para realtime y moderacion comunitaria.',
      noAlertsTitle: 'Tu zona esta tranquila',
      noAlertsDescription: 'No hay incidentes activos por el momento. Ciudadano te avisara cuando eso cambie.',
      tones: { critical: 'Alerta critica', warning: 'En observacion', info: 'Seguimiento' },
    },
    incident: {
      loading: 'Cargando detalle del incidente...',
      notFoundTitle: 'Incidente no encontrado',
      notFoundDescription: 'Este registro no existe o ya no esta disponible en la demo actual.',
      verifiedAlert: 'Alerta verificada',
      confirmedBy: (count) => `Confirmada por ${count} miembros de la comunidad.`,
      actions: { update: 'Actualizar', navigate: 'Navegar', safeList: 'Safe List', emergency: 'Emergencia' },
      communityTimeline: 'Timeline comunitario',
      timelineLabels: { verified: 'Verificado', community: 'Comunidad', location: 'Ubicacion', reply: 'Responder' },
    },
    post: {
      loading: 'Preparando el flujo de reporte...',
      eyebrow: 'Nuevo reporte',
      title: 'Publica una alerta clara',
      description: 'Comparte contexto util para que tu colonia vea que sucede, donde ocurre y que nivel de respuesta hace falta.',
      headlineLabel: 'Titular',
      headlinePlaceholder: 'Resume el incidente',
      detailsLabel: 'Detalles',
      detailsPlaceholder: 'Describe lo que ves, el riesgo y referencias utiles.',
      preview: 'Preview',
      submit: 'Enviar reporte',
      successTitle: 'Reporte listo para difusion',
      successDescription: 'En la implementacion demo, el reporte se confirma visualmente aqui. El siguiente paso natural es conectarlo a un backend real y moderacion vecinal.',
    },
    profile: {
      loading: 'Cargando perfil ciudadano...',
      eyebrow: 'Perfil de seguridad',
      memberSince: 'Miembro verificado desde 2022',
      profileReady: 'Perfil listo para conectar con reputacion, verificaciones y trazabilidad real.',
      reputationLabel: 'Reputacion',
      reputationDescription: 'Top 2% de contribuidores',
      reportsLabel: 'Reportes',
      reportsDescription: 'Incidentes confirmados',
      alertsLabel: 'Alertas',
      alertsDescription: 'Vecinos notificados',
      recentActivity: 'Actividad reciente',
      monitoringZones: 'Zonas monitoreadas',
      safetyCircle: 'Circulo de seguridad',
    },
    safetyCircle: {
      loading: 'Cargando tu circulo de seguridad...',
      eyebrow: 'Contactos de confianza',
      title: 'Circulo de seguridad',
      description: 'Mantiene a la mano a quienes deben recibir ubicacion, contexto y prioridades cuando activas una alerta.',
      nextStepTitle: 'Que sigue despues',
      nextStepDescription: 'Este flujo ya marca el espacio de UX para administrar contactos confiables. El siguiente paso es guardar relaciones reales por usuario y conectar permisos de llamada, mensajes y trazabilidad.',
      addContact: 'Agregar contacto',
      importFromPhone: 'Importar desde telefono',
    },
    sos: {
      eyebrow: 'Accion inmediata',
      title: 'Flujo SOS',
      description: 'Este modal resume el comportamiento esperado del disparador SOS y deja listo el espacio para integraciones reales.',
      broadcastTitle: 'Broadcast de emergencia',
      broadcastDescription: 'Diseñado para combinar contexto geolocalizado, escalamiento de emergencia y un canal de respuesta local.',
      nextIntegrationTitle: 'Siguiente integracion recomendada',
      nextIntegrationDescription: 'Conectar este flujo con geolocalizacion, autenticacion real y un backend transaccional para conservar evidencia, auditoria y confirmaciones de entrega.',
      acknowledge: 'Entendido',
      steps: [
        'Compartir contexto del incidente en tiempo real con personal de respuesta.',
        'Notificar servicios prioritarios segun el tipo de emergencia.',
        'Crear una alerta visible para vecinos y moderadores cercanos.',
      ],
    },
    settings: {
      loading: 'Sincronizando preferencias...',
      eyebrow: 'Ajustes',
      title: 'Preferencias y seguridad',
      description: 'Controla como quieres recibir alertas, compartir ubicacion y mantener tu sesion protegida.',
      biometricsTitle: 'Biometria local',
      biometricsDescription: 'Lista la superficie para proteger futuras sesiones reales con Face ID o huella.',
      zoneDigestTitle: 'Resumen diario por zona',
      zoneDigestDescription: 'Recibe un digest con la actividad mas relevante de tus colonias activas.',
      languageTitle: 'Idioma de la app',
      languageDescription: 'Elige el idioma usado en toda la app. Solo hay ingles y espanol disponibles.',
      english: 'English',
      spanish: 'Espanol',
      leaveDemoTitle: 'Salir de la demo',
      leaveDemoDescription: 'Cierra la sesion local y regresa al onboarding. La capa de almacenamiento ya queda lista para sustituirse por auth real despues.',
      signOut: 'Cerrar sesion',
    },
    mockData: {
      dashboard: {
        locationLabel: 'Ubicacion actual',
        locationAddress: 'Av. Reforma 222, CDMX',
          mapRegion: {
            latitude: 19.4318,
            longitude: -99.1677,
            latitudeDelta: 0.055,
            longitudeDelta: 0.055,
          },
          watchRadiusLabel: 'Radio de vigilancia de 2.5 km',
        liveStatus: 'Alerta activa',
          emergencyMessage: 'Los incidentes cercanos se muestran en vivo para que veas lo que sucede en tu zona actual.',
        services: [
          { id: 'police', label: 'Policia', description: 'Patrulla y apoyo preventivo', icon: 'local-police', tone: 'info' },
          { id: 'medical', label: 'Medico', description: 'Primeros auxilios y ambulancia', icon: 'medical-services', tone: 'critical' },
          { id: 'fire', label: 'Bomberos', description: 'Incendio o riesgo estructural', icon: 'local-fire-department', tone: 'warning' },
        ],
      },
      incidents: [
        {
          id: 'unauthorized-entry-polanco',
          title: 'Intento de acceso no autorizado',
          summary: 'Dos personas intentaron saltar el perimetro en Calle Emerson.',
          fullDescription:
            'Personal de seguridad reporto a dos individuos intentando vulnerar el perimetro en Calle Emerson. La patrulla comunitaria ya notifico a las autoridades y el incidente sigue activo.',
            latitude: 19.4323,
            longitude: -99.1942,
          minutesAgo: 3,
          neighborhood: 'Polanco',
          city: 'CDMX',
          tone: 'critical',
          verifiedCount: 14,
          imageUrls: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBthzTqiSWZXQrTtCFBkMnwe6Z4408czUdyiiOKIUhtYzVGAeKP1Ykk_GA78WQWuDPwzCUaw9S-524G8zrShpGkaVI9ZTUPdLdGvjgsnszNgYTEMsQngkNE_XptQzQokYs9JL81HmwQakl3Z137lQtE7_9BZTQaP-VcIHzLv3K9Jgka3PQE6nq_ZsXKlWXPxRf4JjGyileT7hWFga_HMWV_iUhq7VOUN39-eRbIWgdmDoJUD6AXJHp-Gnl0RtwSebTeDNP6r00wLutb',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDKo3GnZIrl-3ocfa-8K3v8Ej8a_f1k_2yTfIxNUqT-vy5s9pU7wfrCf5Y2fwOBTzWY7vrcksNNcstc6_OlT3L1cQ01l5sp6dSwYalUykErnpMzLAF9lR37GGGsPVv85sKwuFo-Xan_HyqcNCxF5sYKO3-NfJFfAvd_ZNc5KeTjx4k-0W9weXlAErsth-H7tGcMHKPH_zlzoYnJwbUSXUOUMIPdRpeaVnR57c_X_tTp73jC7wZqL9bHhN3pxdW3vTrQV_BRQyYdtYLw',
          ],
          timeline: [
            { id: 'verified-update', type: 'verified', title: 'Actualizacion verificada', body: 'La patrulla local ya se encuentra en sitio y revisa el muro perimetral. Se recomienda permanecer en interiores hasta nuevo aviso.', minutesAgo: 1 },
            { id: 'community-update', type: 'community', title: 'Testigo comunitario', author: 'Marcos R.', body: 'Vi a dos hombres con sudadera oscura correr hacia el parque cuando se activo la alarma.', minutesAgo: 12, likes: 12 },
            { id: 'location-tagged', type: 'location', title: 'Ubicacion etiquetada', body: 'Calle Emerson 42, Polanco V Seccion.', minutesAgo: 15, locationLabel: 'Calle Emerson 42, Polanco V Seccion', mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdYoeGwOXmlB8F4muJU9vkI3FX8oUiWI-eOufgEcWbclNVaRliG-UbNSAmUoHaaEXOBI0r9AydMKRLl-VFSBG6-aWX6P3XuVfvRmYtZ5lJ_4gvhuv8-k9LXkyROB_gKGIMu4uv-LRh84tMCEliUMOBvuku5vF422a3GxBdZXU_B_bu05-wWwQuQQOAuvr7zFOY00wEDa7gEwYB0ErVtci89ZnoqMwUaOvZn6Nottzfjj3wb3hMqHulCFg2o0eKzBieNgFIdrVIOT9q' },
          ],
        },
        {
          id: 'street-obstruction-san-angel',
          title: 'Obstruccion vial y disputa',
          summary: 'Un vehiculo bloquea la salida peatonal frente a Plaza San Jacinto.',
          fullDescription: 'Vecinos reportaron un vehiculo estacionado sobre la salida peatonal junto a Plaza San Jacinto. Se detecto una disputa verbal y se marco como incidente en observacion.',
            latitude: 19.3448,
            longitude: -99.1912,
          minutesAgo: 11,
          neighborhood: 'San Angel',
          city: 'CDMX',
          tone: 'warning',
          verifiedCount: 8,
          imageUrls: ['https://images.unsplash.com/photo-1520038410233-7141be7e6f97?auto=format&fit=crop&w=1200&q=80'],
          timeline: [{ id: 'street-verified', type: 'verified', title: 'Confirmado por vecinos', body: 'La salida peatonal sigue bloqueada. Dos moderadores de zona ya enviaron evidencia.', minutesAgo: 4 }],
        },
        {
          id: 'medical-support-reforma',
          title: 'Solicitud de apoyo medico',
          summary: 'Se solicito asistencia medica para un adulto mayor en Reforma 222.',
          fullDescription: 'Se reporto una alerta medica para un adulto mayor con sintomas de mareo en Reforma 222. El equipo de primeros auxilios va en camino.',
            latitude: 19.4276,
            longitude: -99.1581,
          minutesAgo: 18,
          neighborhood: 'Juarez',
          city: 'CDMX',
          tone: 'info',
          verifiedCount: 5,
          imageUrls: ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80'],
          timeline: [{ id: 'medical-update', type: 'verified', title: 'Apoyo en camino', body: 'La ambulancia se encuentra a cinco minutos de distancia.', minutesAgo: 6 }],
        },
      ],
      profile: {
        name: 'Mateo Estrada',
        badge: 'Guardian Elite',
        district: 'San Angel, CDMX',
        bio: 'Vigilante vecinal desde 2022. Comprometido con una red ciudadana mas segura para su colonia.',
        avatarUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBwHCt-Q5podL1D98UzW_yJ6CasQFZEMCIlUbBz421REIcTU79IU3wPRvcpj73VRBXZ05PDLibgADzGd_hvF7I1idbVTsyFmSUONL10-MYUOaiOpIZZaKOHopxJR2ZCHG4proGnkJ2CcvnjuBqXdUKV1xEzS3HEkKfRcajsWLQY0muNDXI_N1_aXBrP6JHZdOnl92QuzJQ6hnsOCzvVn1oq2jCsN41UxAupkJSiYwGQQ4zSE9rTVvqh_iEYUOpE29Ke68NST3eNxpi1',
        reputation: '4.9',
        reports: '142',
        alertsShared: '856',
        activity: [
          { id: 'activity-1', title: 'Obstruccion vial reportada', description: 'Confirmada por 12 vecinos de San Angel.', minutesAgoLabel: 'Hace 2 h', icon: 'report', tone: 'critical' },
          { id: 'activity-2', title: 'Bono de reputacion', description: 'Llevas 10 reportes verificados de forma consecutiva.', minutesAgoLabel: 'Ayer', icon: 'workspace-premium', tone: 'success' },
          { id: 'activity-3', title: 'Alerta de zona distribuida', description: 'Compartiste actividad sospechosa con tu zona principal.', minutesAgoLabel: 'Hace 3 dias', icon: 'campaign', tone: 'info' },
        ],
        monitoringZones: [
          { id: 'san-angel', name: 'San Angel Central', radiusLabel: '2 km', scheduleLabel: 'Activa todo el dia', enabled: true },
          { id: 'santa-fe', name: 'Santa Fe Business', radiusLabel: '500 m', scheduleLabel: 'Solo dias laborales', enabled: false },
        ],
        safetyCircle: [
          { id: 'elena', name: 'Elena Estrada', role: 'Contacto principal', phone: '+52 55 4488 9001', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCn0yEiGwCWACDhBgQEe7f9TNn5B_-q6XLRGngmACNCmLH_m9aZYivmbyrN5KqJjq32aFcFpVHP177amNBewmprVcqermAbPlCHaNacgEl8iPioELKL35VORgg6nDAkSfQsa9Os7mDvQI3C20kvo6zr6Vau6hEXy-wBEtVrxbrYD-aGl9s5fzDC6p8PjZ2f4S0SQrlc6jYrFpr7bVOMDXM3KFaP6s1Y4C_z2ZymEb_wZs3_BDMOQsv0hKKuRmwDFo-Ae-FIBQPRpNjd' },
          { id: 'victor', name: 'Victor Ross', role: 'Enlace vecinal', phone: '+52 55 8822 4040', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4gmnie4O1CMVf7HFXxm2qt02N2RKkto6_8V17xHvHqIJW-xUjcF8jhzF22knfRivE8ydO4rEZ_MYDV26tpkd4JcKHAoBE7cY1I1Gr-ASQbCyUK4tlzaw8c2at81OzekleDxEAMR0NkAKd2sg9rliuD9mMjjH6qIT_xb1_Fxc9pYLPw-iIBPRvM9WNdM6OEPr3Se6UT-KAHBoocJWVvIaqb8HGZmzFVDeBpdSeWi2ET2neCfrfQoCZnijmOFuYHnI71wpSBEAsncR9' },
        ],
      },
      reportCategories: [
        { id: 'suspicious-activity', title: 'Actividad sospechosa', subtitle: 'Personas, vehiculos o movimientos fuera de contexto', icon: 'visibility' },
        { id: 'medical', title: 'Emergencia medica', subtitle: 'Solicitud inmediata de apoyo y primeros auxilios', icon: 'favorite' },
        { id: 'infrastructure', title: 'Infraestructura y vialidad', subtitle: 'Obstrucciones, luminarias o riesgos urbanos', icon: 'traffic' },
      ],
      settingsItems: [
        { id: 'notifications', title: 'Notificaciones inteligentes', description: 'Recibe solo alertas relevantes segun tu zona y nivel de prioridad.', icon: 'notifications-active', value: 'Activadas' },
        { id: 'privacy', title: 'Privacidad de ubicacion', description: 'Controla cuando tu posicion aproximada se adjunta a tus reportes y al contexto del incidente.', icon: 'shield', value: 'Solo aproximada' },
        { id: 'community', title: 'Moderacion comunitaria', description: 'Ajusta el nivel de verificacion requerido para ver incidentes locales.', icon: 'groups', value: 'Balanceado' },
      ],
    },
  },
};
