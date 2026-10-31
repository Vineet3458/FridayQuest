export type DashboardRole = 'player' | 'organizer' | 'orgAdmin' | 'superAdmin';

export interface RoleThemeConfig {
  role: DashboardRole;
  roleLabel: string;
  roleSubtitle: string;
  visualTheme: string;
  defaultUserName: string;
  defaultUserTitle: string;
  brand: {
    logoBadgeClass: string;
    logoTextClass: string;
    logoSubClass?: string;
  };
  shell: {
    pageBgClass: string;
    textColorClass: string;
    sidebarBgClass: string;
    sidebarBorderClass: string;
    sidebarActivePillClass: string;
    sidebarInactiveTextClass: string;
    sidebarHoverClass: string;
    headerBgClass: string;
    headerBorderClass: string;
    searchInputClass: string;
    searchPlaceholder: string;
    avatarBgClass: string;
    avatarBadgeClass: string;
  };
  cards: {
    cardBgClass: string;
    cardBorderClass: string;
    cardShadowClass: string;
    bannerGradientClass: string;
    bannerBorderClass: string;
    quoteBoxClass: string;
    primaryButtonClass: string;
    secondaryButtonClass: string;
    accentPillClass: string;
  };
  visualizations: {
    barChartColor: string;
    donutColors: string[];
    lineChartGlow: string;
  };
}

export const ROLE_THEME_CONFIGS: Record<DashboardRole, RoleThemeConfig> = {
  // 1. EMPLOYEE DASHBOARD (Player)
  // Soft, dreamy lavender/periwinkle pastel aura with vibrant gamified indigo-blue accents
  player: {
    role: 'player',
    roleLabel: 'Employee',
    roleSubtitle: 'Player / Participant',
    visualTheme: 'Playful Gamified Lavender & Vibrant Indigo',
    defaultUserName: 'Kirxa',
    defaultUserTitle: 'Player',
    brand: {
      logoBadgeClass: 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white shadow-md shadow-blue-500/25',
      logoTextClass: 'text-slate-900 dark:text-white',
    },
    shell: {
      pageBgClass: 'bg-[#F4F5FD] dark:bg-slate-900',
      textColorClass: 'text-slate-900 dark:text-slate-100',
      sidebarBgClass: 'bg-white/95 dark:bg-slate-950/80 backdrop-blur',
      sidebarBorderClass: 'border-slate-200/80 dark:border-slate-800/80',
      sidebarActivePillClass: 'bg-blue-600 text-white shadow-xs',
      sidebarInactiveTextClass: 'text-slate-600 dark:text-slate-400',
      sidebarHoverClass: 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60',
      headerBgClass: 'bg-white/90 dark:bg-slate-950/80 backdrop-blur',
      headerBorderClass: 'border-slate-200/80 dark:border-slate-800/80',
      searchInputClass: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400',
      searchPlaceholder: 'Search games, sessions, or anything...',
      avatarBgClass: 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white',
      avatarBadgeClass: 'text-slate-400',
    },
    cards: {
      cardBgClass: 'bg-white dark:bg-slate-900',
      cardBorderClass: 'border-slate-200/80 dark:border-slate-800/80',
      cardShadowClass: 'shadow-xs',
      bannerGradientClass: 'bg-gradient-to-r from-blue-50 via-indigo-50/70 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/15 dark:to-purple-950/20',
      bannerBorderClass: 'border-blue-200/60 dark:border-blue-900/30',
      quoteBoxClass: 'bg-white/90 dark:bg-slate-900/90 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900/40',
      primaryButtonClass: 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-xs',
      secondaryButtonClass: 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
      accentPillClass: 'bg-blue-600 text-white',
    },
    visualizations: {
      barChartColor: '#3B82F6',
      donutColors: ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981'],
      lineChartGlow: '#3B82F6',
    },
  },

  // 2. ORGANIZER DASHBOARD (Organizer)
  // Warm Sunset Peach, Apricot, Golden Amber & Violet/Purple accents
  organizer: {
    role: 'organizer',
    roleLabel: 'Organizer',
    roleSubtitle: 'Fun Friday Host / Emcee',
    visualTheme: 'Warm Sunset Peach, Apricot & Violet Accents',
    defaultUserName: 'Riya Sharma',
    defaultUserTitle: 'Organizer',
    brand: {
      logoBadgeClass: 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/25',
      logoTextClass: 'text-slate-900 dark:text-white',
    },
    shell: {
      pageBgClass: 'bg-[#FAF5EF] dark:bg-slate-900',
      textColorClass: 'text-slate-900 dark:text-slate-100',
      sidebarBgClass: 'bg-[#FFFDF9]/95 dark:bg-slate-950/80 backdrop-blur',
      sidebarBorderClass: 'border-amber-200/70 dark:border-slate-800/80',
      sidebarActivePillClass: 'bg-[#7C3AED] text-white shadow-xs',
      sidebarInactiveTextClass: 'text-slate-600 dark:text-slate-400',
      sidebarHoverClass: 'hover:text-amber-900 dark:hover:text-white hover:bg-amber-50/80 dark:hover:bg-slate-800/60',
      headerBgClass: 'bg-[#FFFDF9]/90 dark:bg-slate-950/80 backdrop-blur',
      headerBorderClass: 'border-amber-200/70 dark:border-slate-800/80',
      searchInputClass: 'bg-white dark:bg-slate-900 border-amber-200/70 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-amber-700/40 dark:placeholder:text-slate-500',
      searchPlaceholder: 'Search sessions, games...',
      avatarBgClass: 'bg-gradient-to-tr from-orange-500 to-amber-600 text-white',
      avatarBadgeClass: 'text-amber-600 dark:text-amber-400',
    },
    cards: {
      cardBgClass: 'bg-white dark:bg-slate-900',
      cardBorderClass: 'border-amber-100 dark:border-slate-800/80',
      cardShadowClass: 'shadow-xs',
      bannerGradientClass: 'bg-gradient-to-r from-orange-100/70 via-amber-100/50 to-rose-100/60 dark:from-orange-950/20 dark:via-amber-950/15 dark:to-rose-950/20',
      bannerBorderClass: 'border-orange-200/80 dark:border-orange-900/30',
      quoteBoxClass: 'bg-white/90 dark:bg-slate-900/90 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900/40',
      primaryButtonClass: 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-xs',
      secondaryButtonClass: 'border-amber-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-50/50 dark:hover:bg-slate-800',
      accentPillClass: 'bg-[#7C3AED] text-white',
    },
    visualizations: {
      barChartColor: '#F97316',
      donutColors: ['#F97316', '#8B5CF6', '#10B981', '#3B82F6'],
      lineChartGlow: '#F97316',
    },
  },

  // 3. ADMIN DASHBOARD (Org Admin)
  // Crisp Enterprise Corporate SaaS, Ice Blue, Clean Sky Blue, Pristine White
  orgAdmin: {
    role: 'orgAdmin',
    roleLabel: 'Org Admin',
    roleSubtitle: 'Company Admin / HR',
    visualTheme: 'Crisp Enterprise Ice Blue & Pristine SaaS',
    defaultUserName: 'Amit Verma',
    defaultUserTitle: 'Org Admin',
    brand: {
      logoBadgeClass: 'bg-gradient-to-tr from-blue-600 via-sky-600 to-blue-500 text-white shadow-md shadow-blue-500/25',
      logoTextClass: 'text-slate-900 dark:text-white',
    },
    shell: {
      pageBgClass: 'bg-[#F0F7FF] dark:bg-slate-900',
      textColorClass: 'text-slate-900 dark:text-slate-100',
      sidebarBgClass: 'bg-white/95 dark:bg-slate-950/80 backdrop-blur',
      sidebarBorderClass: 'border-slate-200/80 dark:border-slate-800/80',
      sidebarActivePillClass: 'bg-[#2563EB] text-white shadow-xs',
      sidebarInactiveTextClass: 'text-slate-600 dark:text-slate-400',
      sidebarHoverClass: 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60',
      headerBgClass: 'bg-white/90 dark:bg-slate-950/80 backdrop-blur',
      headerBorderClass: 'border-slate-200/80 dark:border-slate-800/80',
      searchInputClass: 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400',
      searchPlaceholder: 'Search employees, sessions...',
      avatarBgClass: 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white',
      avatarBadgeClass: 'text-blue-600 dark:text-blue-400',
    },
    cards: {
      cardBgClass: 'bg-white dark:bg-slate-900',
      cardBorderClass: 'border-slate-200/80 dark:border-slate-800/80',
      cardShadowClass: 'shadow-xs',
      bannerGradientClass: 'bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 dark:from-blue-950/20 dark:via-sky-950/15 dark:to-indigo-950/20',
      bannerBorderClass: 'border-blue-200/70 dark:border-blue-900/30',
      quoteBoxClass: 'bg-white/90 dark:bg-slate-900/90 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/40',
      primaryButtonClass: 'bg-[#2563EB] hover:bg-blue-600 text-white shadow-xs',
      secondaryButtonClass: 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
      accentPillClass: 'bg-[#2563EB] text-white',
    },
    visualizations: {
      barChartColor: '#2563EB',
      donutColors: ['#2563EB', '#8B5CF6', '#F59E0B', '#10B981', '#EC4899'],
      lineChartGlow: '#2563EB',
    },
  },

  // 4. SUPER ADMIN DASHBOARD (Super Admin)
  // Deep Slate / Midnight Navy Futuristic Platform Console
  superAdmin: {
    role: 'superAdmin',
    roleLabel: 'Super Admin',
    roleSubtitle: 'Platform Owner',
    visualTheme: 'Deep Slate / Midnight Navy High-Tech Console',
    defaultUserName: 'Kirxa',
    defaultUserTitle: 'Super Admin',
    brand: {
      logoBadgeClass: 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white shadow-md shadow-blue-500/25',
      logoTextClass: 'text-white',
    },
    shell: {
      pageBgClass: 'bg-[#0B101D] text-white',
      textColorClass: 'text-white',
      sidebarBgClass: 'bg-[#090D16] border-slate-800/80',
      sidebarBorderClass: 'border-slate-800/80',
      sidebarActivePillClass: 'bg-[#2563EB] text-white shadow-xs',
      sidebarInactiveTextClass: 'text-slate-400',
      sidebarHoverClass: 'hover:text-white hover:bg-slate-800/60',
      headerBgClass: 'bg-[#0B0F19] border-slate-800',
      headerBorderClass: 'border-slate-800',
      searchInputClass: 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500',
      searchPlaceholder: 'Search organizations, users...',
      avatarBgClass: 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white',
      avatarBadgeClass: 'text-blue-400',
    },
    cards: {
      cardBgClass: 'bg-[#0F172A] border-slate-800/80 text-white',
      cardBorderClass: 'border-slate-800/80',
      cardShadowClass: 'shadow-lg shadow-black/20',
      bannerGradientClass: 'bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40',
      bannerBorderClass: 'border-blue-900/40',
      quoteBoxClass: 'bg-slate-900/90 text-blue-300 border-blue-900/40',
      primaryButtonClass: 'bg-[#2563EB] hover:bg-blue-600 text-white shadow-xs',
      secondaryButtonClass: 'border-slate-800 text-slate-300 hover:bg-slate-800',
      accentPillClass: 'bg-[#2563EB] text-white',
    },
    visualizations: {
      barChartColor: '#38BDF8',
      donutColors: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#64748B'],
      lineChartGlow: '#3B82F6',
    },
  },
};

