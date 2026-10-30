'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Filter,
  RotateCcw,
  Gamepad2,
  Users,
  Clock,
  Zap,
  Package,
  Star,
  Check,
  ChevronRight,
  Sparkles,
  Plus,
  Layers,
  ShieldCheck,
  Eye,
  Volume2,
  Radio,
  HelpCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { apiRequest } from '@/lib/api';
import { Game } from '@/types';

// Fallback seed definitions matching official backend seed
const DEFAULT_GAMES_DATA: Game[] = [
  {
    _id: 'seed-game-1',
    name: 'Mafia / Werewolf',
    slug: 'mafia-werewolf',
    level: 2,
    status: 'published',
    version: 1,
    packs: ['classic', 'party', 'deception'],
    avgRating: 4.8,
    definition: {
      name: 'Mafia / Werewolf',
      slug: 'mafia-werewolf',
      level: 2,
      players: { min: 6, max: 20 },
      durationMin: 30,
      energy: 'medium',
      noise: 'medium',
      props: [],
      tags: ['Social Deduction', 'Bluffing', 'Secret Roles'],
      teamMode: 'individual',
      tools: ['secretRole', 'timer', 'voting'],
      roles: [
        { key: 'mafia', label: 'Mafia', count: 2 },
        { key: 'detective', label: 'Detective', count: 1 },
        { key: 'doctor', label: 'Doctor', count: 1 },
        { key: 'villager', label: 'Villager', count: 6 },
      ],
      rulesShort:
        'Night falls and Mafia eliminates in secret. Day arrives: colleagues debate and vote out suspects.',
      rulesFull:
        'The app deals secret roles privately to each phone. During the night phase, Mafia players secretly choose a target on their phones; Doctor picks someone to protect; Detective checks one suspect. During the day phase, the eliminated coworker is revealed, a discussion timer starts, and all surviving members cast their vote.',
    },
  },
  {
    _id: 'seed-game-2',
    name: 'Chor-Police',
    slug: 'chor-police',
    level: 2,
    status: 'published',
    version: 1,
    packs: ['desi-classics', 'quick', 'office'],
    avgRating: 4.9,
    definition: {
      name: 'Chor-Police',
      slug: 'chor-police',
      level: 2,
      players: { min: 4, max: 12 },
      durationMin: 15,
      energy: 'medium',
      noise: 'high',
      props: [],
      tags: ['Desi Classic', 'Bluffing', 'Fast Rounds'],
      teamMode: 'rounds-of-n',
      tools: ['secretRole', 'timer', 'scorekeeper'],
      roles: [
        { key: 'raja', label: 'Raja (1000 pts)', count: 1 },
        { key: 'mantri', label: 'Mantri (800 pts)', count: 1 },
        { key: 'chor', label: 'Chor (0 pts)', count: 1 },
        { key: 'sipahi', label: 'Sipahi (500 pts)', count: 1 },
      ],
      rulesShort:
        'Raja commands Mantri to deduce who is the Chor. Mantri has 60 seconds to pick the suspect.',
      rulesFull:
        'Roles (Raja, Mantri, Chor, Sipahi) are dealt privately on phones. The Raja announces "Mantri, find the Chor!" The Mantri has 60 seconds to deduce and select who is holding the Chor role. If correct, Mantri scores 800 pts; if wrong, the Chor scores 800 pts. Raja and Sipahi keep standard points.',
    },
  },
  {
    _id: 'seed-game-3',
    name: 'Team Trivia with Buzzer',
    slug: 'team-trivia-buzzer',
    level: 2,
    status: 'published',
    version: 1,
    packs: ['corporate', 'trivia', 'competitive'],
    avgRating: 4.7,
    definition: {
      name: 'Team Trivia with Buzzer',
      slug: 'team-trivia-buzzer',
      level: 2,
      players: { min: 6, max: 40 },
      durationMin: 20,
      energy: 'high',
      noise: 'high',
      props: [],
      tags: ['Buzzer Battle', 'Trivia', 'Team vs Team'],
      teamMode: 'teams',
      tools: ['buzzer', 'timer', 'scorekeeper'],
      rulesShort:
        'Projector displays the trivia question; the fastest team to slam the phone buzzer answers.',
      rulesFull:
        'The cafeteria projector displays questions on company trivia, tech culture, and general knowledge. Teams huddle and tap their phone buzzer. The server records millisecond-accurate lockout. First team gets 30 seconds to answer verbally. Correct answer scores 100 pts; wrong answer unlocks buzzer for opponents.',
    },
  },
  {
    _id: 'seed-game-4',
    name: 'Two Truths and a Lie',
    slug: 'two-truths-and-a-lie',
    level: 2,
    status: 'published',
    version: 1,
    packs: ['icebreaker', 'office'],
    avgRating: 4.6,
    definition: {
      name: 'Two Truths and a Lie',
      slug: 'two-truths-and-a-lie',
      level: 2,
      players: { min: 4, max: 20 },
      durationMin: 15,
      energy: 'low',
      noise: 'low',
      props: [],
      tags: ['Icebreaker', 'Getting to Know You', 'Conversational'],
      teamMode: 'individual',
      tools: ['timer', 'voting'],
      rulesShort:
        'Colleagues submit 3 statements with 1 lie. The room votes to sniff out the deception.',
      rulesFull:
        'Each coworker enters 2 true facts and 1 convincing lie in the app. One by one, their statements appear on the room screen and player phones. Everyone has 45 seconds to vote for which statement is a lie. Earn points for guessing right, and bonus deception points for coworkers fooled!',
    },
  },
  {
    _id: 'seed-game-5',
    name: 'Jargon Charades',
    slug: 'jargon-charades',
    level: 1,
    status: 'published',
    version: 1,
    packs: ['office', 'acting', 'humor'],
    avgRating: 4.5,
    definition: {
      name: 'Jargon Charades',
      slug: 'jargon-charades',
      level: 1,
      players: { min: 6, max: 30 },
      durationMin: 20,
      energy: 'high',
      noise: 'high',
      props: [],
      tags: ['Charades', 'Acting', 'Corporate Humor'],
      teamMode: 'teams',
      tools: ['timer', 'scorekeeper'],
      rulesShort:
        'Actor receives secret tech/office jargon on their phone and acts it out silently for their team.',
      rulesFull:
        'The designated actor receives a secret corporate term or jargon (e.g. "Sprint Retrospective", "Production Outage", "Synergy") on their phone. They have 60 seconds to act it out without speaking. Team shouts guesses; host records passes and correct scores.',
    },
  },
  {
    _id: 'seed-game-6',
    name: 'Blind Pictionary',
    slug: 'blind-pictionary',
    level: 1,
    status: 'published',
    version: 1,
    packs: ['creative', 'drawing', 'party'],
    avgRating: 4.6,
    definition: {
      name: 'Blind Pictionary',
      slug: 'blind-pictionary',
      level: 1,
      players: { min: 4, max: 20 },
      durationMin: 15,
      energy: 'medium',
      noise: 'medium',
      props: ['Paper', 'Markers / Whiteboard'],
      tags: ['Drawing', 'Creative', 'Hilarious', 'Physical Props'],
      teamMode: 'teams',
      tools: ['timer', 'voting', 'scorekeeper'],
      rulesShort:
        'Drawer gets a secret prompt and must sketch it blindfolded while teammates guess.',
      rulesFull:
        'The drawer gets a secret prompt on their phone and must close their eyes or wear a blindfold while sketching on paper or whiteboard. The team has 60 seconds to guess what is being drawn. Everyone votes on funniest sketches for bonus points!',
    },
  },
  {
    _id: 'seed-game-7',
    name: 'Marshmallow Tower',
    slug: 'marshmallow-tower',
    level: 1,
    status: 'published',
    version: 1,
    packs: ['engineering', 'physical', 'team-building'],
    avgRating: 4.4,
    definition: {
      name: 'Marshmallow Tower',
      slug: 'marshmallow-tower',
      level: 1,
      players: { min: 4, max: 24 },
      durationMin: 15,
      energy: 'medium',
      noise: 'medium',
      props: ['Spaghetti Sticks', 'Marshmallows', 'Masking Tape'],
      tags: ['Team Building', 'Hands-On', 'Physical Props'],
      teamMode: 'teams',
      tools: ['timer', 'scorekeeper', 'voting'],
      rulesShort:
        'Build the tallest freestanding tower using raw spaghetti and marshmallows in 15 minutes.',
      rulesFull:
        'Each team receives 20 sticks of raw spaghetti, 1 meter of tape, and 1 marshmallow. Teams have 15 minutes to erect the tallest freestanding tower with the marshmallow sitting on top. Structures must stand unsupported.',
    },
  },
  {
    _id: 'seed-game-8',
    name: 'Antakshari Team Battle',
    slug: 'antakshari-team-battle',
    level: 2,
    status: 'published',
    version: 1,
    packs: ['desi-classics', 'music', 'high-energy'],
    avgRating: 4.9,
    definition: {
      name: 'Antakshari Team Battle',
      slug: 'antakshari-team-battle',
      level: 2,
      players: { min: 8, max: 40 },
      durationMin: 25,
      energy: 'high',
      noise: 'high',
      props: [],
      tags: ['Music', 'Desi Classic', 'Buzzer Battle', 'Audience Favorite'],
      teamMode: 'teams',
      tools: ['buzzer', 'timer', 'scorekeeper'],
      rulesShort:
        'Relay song competition with live buzzer lockout and strict 15-second response timers.',
      rulesFull:
        'Host triggers a starting syllable or theme on the screen. Teams hit their phone buzzer to lock in. The fastest team has 15 seconds to sing a 2-line verse starting with the required letter. No repeat songs permitted.',
    },
  },
];

export default function GameLibraryPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlayerRange, setSelectedPlayerRange] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [selectedEnergy, setSelectedEnergy] = useState<string>('all');
  const [selectedProps, setSelectedProps] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Modals state
  const [selectedGameForDetails, setSelectedGameForDetails] = useState<Game | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const canBuildGames =
    user?.role === 'superAdmin' || user?.role === 'orgAdmin' || user?.role === 'organizer';

  // Fetch games from backend API
  const fetchGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<Game[]>('/games');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setGames(res.data);
      } else {
        // Fallback to official seed if empty
        setGames(DEFAULT_GAMES_DATA);
      }
    } catch {
      // In offline / local fallback mode, gracefully use default official games
      setGames(DEFAULT_GAMES_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Category quick tabs
  const categories = [
    { id: 'all', label: 'All Games' },
    { id: 'icebreaker', label: 'Icebreakers & Social' },
    { id: 'buzzer', label: 'Buzzer Battles' },
    { id: 'acting', label: 'Charades & Acting' },
    { id: 'desi', label: 'Desi Classics' },
    { id: 'hands-on', label: 'Physical & Props' },
  ];

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedPlayerRange('all');
    setSelectedDuration('all');
    setSelectedEnergy('all');
    setSelectedProps('all');
    setSelectedType('all');
  };

  // Check if any filter is active
  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedPlayerRange !== 'all' ||
    selectedDuration !== 'all' ||
    selectedEnergy !== 'all' ||
    selectedProps !== 'all' ||
    selectedType !== 'all';

  // Filtered games logic
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const def = game.definition || {};

      // 1. Search term (matches name, short rules, full rules, tags, or tools)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const nameMatch = game.name.toLowerCase().includes(query);
        const rulesShortMatch = (def.rulesShort || '').toLowerCase().includes(query);
        const rulesFullMatch = (def.rulesFull || '').toLowerCase().includes(query);
        const tagsMatch = (def.tags || []).some((t) => t.toLowerCase().includes(query));
        const toolsMatch = (def.tools || []).some((t) => t.toLowerCase().includes(query));

        if (!nameMatch && !rulesShortMatch && !rulesFullMatch && !tagsMatch && !toolsMatch) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'all') {
        const tagsAndPacks = [
          ...(def.tags || []).map((t) => t.toLowerCase()),
          ...(game.packs || []).map((p) => p.toLowerCase()),
        ];
        const tools = (def.tools || []).map((t) => t.toLowerCase());

        if (selectedCategory === 'icebreaker') {
          if (
            !tagsAndPacks.includes('icebreaker') &&
            !tagsAndPacks.includes('getting to know you') &&
            !tagsAndPacks.includes('social deduction')
          ) {
            return false;
          }
        } else if (selectedCategory === 'buzzer') {
          if (!tools.includes('buzzer') && !tagsAndPacks.includes('buzzer battle')) {
            return false;
          }
        } else if (selectedCategory === 'acting') {
          if (!tagsAndPacks.includes('charades') && !tagsAndPacks.includes('drawing')) {
            return false;
          }
        } else if (selectedCategory === 'desi') {
          if (!tagsAndPacks.includes('desi classic') && !tagsAndPacks.includes('desi-classics')) {
            return false;
          }
        } else if (selectedCategory === 'hands-on') {
          if ((def.props || []).length === 0 && !tagsAndPacks.includes('physical props')) {
            return false;
          }
        }
      }

      // 3. Player Count Filter
      if (selectedPlayerRange !== 'all') {
        const minP = def.players?.min || 1;
        const maxP = def.players?.max || 100;
        if (selectedPlayerRange === 'small' && !(minP <= 10 && maxP >= 4)) {
          return false; // Fits 4-10 players
        }
        if (selectedPlayerRange === 'medium' && !(maxP >= 10 && minP <= 20)) {
          return false; // Fits 10-20 players
        }
        if (selectedPlayerRange === 'large' && maxP < 20) {
          return false; // Fits 20+ players
        }
      }

      // 4. Duration Filter
      if (selectedDuration !== 'all') {
        const dur = def.durationMin || 15;
        if (selectedDuration === 'quick' && dur > 15) return false;
        if (selectedDuration === 'standard' && (dur <= 15 || dur > 25)) return false;
        if (selectedDuration === 'extended' && dur <= 25) return false;
      }

      // 5. Energy Level Filter
      if (selectedEnergy !== 'all') {
        if (def.energy !== selectedEnergy) return false;
      }

      // 6. Required Props Filter
      if (selectedProps !== 'all') {
        const hasProps = (def.props || []).length > 0;
        if (selectedProps === 'none' && hasProps) return false;
        if (selectedProps === 'required' && !hasProps) return false;
      }

      // 7. Game Type / Level Filter
      if (selectedType !== 'all') {
        if (selectedType === 'level1' && game.level !== 1) return false;
        if (selectedType === 'level2' && game.level !== 2) return false;
      }

      return true;
    });
  }, [
    games,
    searchTerm,
    selectedCategory,
    selectedPlayerRange,
    selectedDuration,
    selectedEnergy,
    selectedProps,
    selectedType,
  ]);

  // Tool label helper
  const formatToolName = (tool: string) => {
    switch (tool) {
      case 'secretRole':
        return 'Secret Role Card';
      case 'buzzer':
        return 'Phone Buzzer';
      case 'timer':
        return 'Sync Timer';
      case 'voting':
        return 'Live Voting';
      case 'scorekeeper':
        return 'Scorekeeper';
      default:
        return tool;
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-500/20">
              Activity Catalog
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              • {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'} available
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Discover Your Next Game
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Explore office Fun Friday games designed for real-world interaction. Filter by team
            headcount, energy, phone tools, or physical props.
          </p>
        </div>

        {canBuildGames && (
          <button
            onClick={() => setBuilderOpen(true)}
            className="self-start sm:self-auto py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Custom Game Builder</span>
          </button>
        )}
      </div>

      {/* 2. Search & Category Quick Tabs */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by game name, rules, tags, or phone tools (e.g. Buzzer, Mafia)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Toggle Deep Filter Panel Button */}
          <button
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
              showFiltersPanel || hasActiveFilters
                ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-300 dark:border-blue-500/40 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
            )}
          </button>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs select-none no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all cursor-pointer text-xs ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Deep Filter Panel (Players, Duration, Energy, Props, Game Type) */}
      {showFiltersPanel && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Filter By Parameters
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            {/* Filter 1: Number of players */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>Player Headcount</span>
              </label>
              <select
                value={selectedPlayerRange}
                onChange={(e) => setSelectedPlayerRange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">Any Headcount</option>
                <option value="small">Small (4–10 players)</option>
                <option value="medium">Medium (10–20 players)</option>
                <option value="large">Large (20+ players)</option>
              </select>
            </div>

            {/* Filter 2: Duration */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Duration</span>
              </label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">Any Duration</option>
                <option value="quick">Quick (≤ 15 mins)</option>
                <option value="standard">Standard (15–25 mins)</option>
                <option value="extended">Extended (25+ mins)</option>
              </select>
            </div>

            {/* Filter 3: Energy Level */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Energy Level</span>
              </label>
              <select
                value={selectedEnergy}
                onChange={(e) => setSelectedEnergy(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Energy Levels</option>
                <option value="low">Calm / Low Energy</option>
                <option value="medium">Medium Energy</option>
                <option value="high">High Energy / Active</option>
              </select>
            </div>

            {/* Filter 4: Required Props */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Package className="w-3.5 h-3.5" />
                <span>Required Props</span>
              </label>
              <select
                value={selectedProps}
                onChange={(e) => setSelectedProps(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All (Digital & Physical)</option>
                <option value="none">Zero Props (100% Digital)</option>
                <option value="required">Requires Physical Props</option>
              </select>
            </div>

            {/* Filter 5: Game Type */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Game Type</span>
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="level1">Level 1: Rule Card</option>
                <option value="level2">Level 2: Tool-Based</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 4. Active Filter Summary Tag Pill */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/60 px-3.5 py-2 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white">Active Filters:</span>
            <span>Showing {filteredGames.length} of {games.length} games</span>
          </div>
          <button
            onClick={handleResetFilters}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear filters</span>
          </button>
        </div>
      )}

      {/* 5. Main Content Area: Loading / Error / Empty / Cards Grid */}
      {loading ? (
        // Skeleton Loading Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
              </div>
              <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
              <div className="pt-2 flex gap-2">
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        // Error State
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl p-8 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Unable to load Game Library
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">{error}</p>
          <button
            onClick={fetchGames}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      ) : filteredGames.length === 0 ? (
        // Empty State (Zero Search Results)
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Gamepad2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No games match your search criteria
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              We couldn’t find any games matching the active filters. Try adjusting your search term
              or clearing filters to see all available games.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        // Responsive Game Cards Grid (1 col mobile, 2 col tablet, 3 col desktop)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGames.map((game) => {
            const def = game.definition || {};
            const propsCount = (def.props || []).length;
            const isLevel2 = game.level === 2;

            // Energy badge styling
            const energyConfig =
              def.energy === 'high'
                ? { label: 'High Energy', color: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' }
                : def.energy === 'low'
                ? { label: 'Calm', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' }
                : { label: 'Medium', color: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' };

            return (
              <div
                key={game._id || game.slug}
                className="group bg-white dark:bg-slate-900/90 hover:bg-slate-50/50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400/50 dark:hover:border-blue-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md"
              >
                <div>
                  {/* Card Top Header: Level Badge, Energy, Rating */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${
                          isLevel2
                            ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20'
                            : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                        }`}
                      >
                        {isLevel2 ? 'Tool-Based' : 'Rule Card'}
                      </span>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${energyConfig.color}`}
                      >
                        <Zap className="w-3 h-3 fill-current" />
                        <span>{energyConfig.label}</span>
                      </span>
                    </div>

                    {/* Average Rating */}
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-500/20">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{game.avgRating ? game.avgRating.toFixed(1) : '4.5'}</span>
                    </div>
                  </div>

                  {/* Game Name */}
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {game.name}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {def.rulesShort || 'A collaborative team activity for office Fun Friday sessions.'}
                  </p>

                  {/* Metadata Specs Row */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                    {/* Players */}
                    <div className="flex items-center gap-1.5" title="Player count bounds">
                      <Users className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
                      <span className="truncate">
                        {def.players?.min || 4}–{def.players?.max || 20}p
                      </span>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-1.5" title="Estimated game duration">
                      <Clock className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                      <span className="truncate">{def.durationMin || 15} min</span>
                    </div>

                    {/* Props */}
                    <div className="flex items-center gap-1.5" title="Physical props required">
                      <Package className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                      <span className="truncate">
                        {propsCount === 0 ? 'No props' : `${propsCount} props`}
                      </span>
                    </div>
                  </div>

                  {/* Tools preview tags */}
                  {def.tools && def.tools.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {def.tools.slice(0, 3).map((tool) => (
                        <span
                          key={tool}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                        >
                          {formatToolName(tool)}
                        </span>
                      ))}
                      {def.tools.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          +{def.tools.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                    {def.teamMode === 'teams' ? 'Team Battle' : def.teamMode === 'rounds-of-n' ? 'Rotating Groups' : 'Individual'}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedGameForDetails(game)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Game Details Modal / Slide-over Drawer */}
      {selectedGameForDetails && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${
                      selectedGameForDetails.level === 2
                        ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20'
                        : 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                    }`}
                  >
                    Level {selectedGameForDetails.level}: {selectedGameForDetails.level === 2 ? 'Tool-Based Game' : 'Rule Card Only'}
                  </span>

                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-500/20 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{selectedGameForDetails.avgRating?.toFixed(1) || '4.5'}</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {selectedGameForDetails.name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedGameForDetails(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs text-slate-700 dark:text-slate-300">
              {/* Quick Specification Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-500" /> Players
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedGameForDetails.definition?.players?.min}–{selectedGameForDetails.definition?.players?.max} players
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" /> Duration
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedGameForDetails.definition?.durationMin} minutes
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Energy
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5 capitalize">
                    {selectedGameForDetails.definition?.energy} energy
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-500" /> Noise Level
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5 capitalize">
                    {selectedGameForDetails.definition?.noise || 'Moderate'}
                  </div>
                </div>
              </div>

              {/* Game Overview / Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Game Overview
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedGameForDetails.definition?.rulesShort}
                </p>
              </div>

              {/* Detailed How It Runs / Rules */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Official Rules & Flow
                </h4>
                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-slate-800 dark:text-blue-100 leading-relaxed text-xs">
                  {selectedGameForDetails.definition?.rulesFull || selectedGameForDetails.definition?.rulesShort}
                </div>
              </div>

              {/* Tools Required */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Phone-as-Prop Tools Used
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(selectedGameForDetails.definition?.tools || ['timer', 'scorekeeper']).map((tool) => (
                    <div
                      key={tool}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5"
                    >
                      <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                        ✓
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {formatToolName(tool)}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {tool === 'secretRole'
                            ? 'Private role card deal with press-and-hold reveal'
                            : tool === 'buzzer'
                            ? 'Millisecond lockout live phone buzzer'
                            : tool === 'voting'
                            ? 'Instant anonymous team voting'
                            : tool === 'timer'
                            ? 'Synchronized room countdown timer'
                            : 'Scorekeeper and bonus points allocation'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roles Breakdown (if tool uses roles like Mafia or Chor-Police) */}
              {selectedGameForDetails.definition?.roles &&
                selectedGameForDetails.definition.roles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Secret Roles Roster
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedGameForDetails.definition.roles.map((r) => (
                        <div
                          key={r.key}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 flex items-center gap-2 text-purple-900 dark:text-purple-300 font-semibold"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{r.label}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 font-bold">
                            ×{r.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Physical Props Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Required Physical Props
                </h4>
                {selectedGameForDetails.definition?.props &&
                selectedGameForDetails.definition.props.length > 0 ? (
                  <ul className="space-y-1.5">
                    {selectedGameForDetails.definition.props.map((prop, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                      >
                        <Package className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="font-medium text-slate-900 dark:text-white">{prop}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>No physical props required — 100% digital and runs on player phones.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Team Mode: <span className="font-semibold capitalize text-slate-700 dark:text-slate-300">{selectedGameForDetails.definition?.teamMode}</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedGameForDetails(null)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Close
                </button>

                {canBuildGames ? (
                  <Link
                    href="/sessions"
                    onClick={() => setSelectedGameForDetails(null)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <span>Use in Friday Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedGameForDetails(null)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    Got It
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Custom Game Builder Preview Modal (Preserved for Admins & Organizers) */}
      {builderOpen && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Custom Game Builder
                </h2>
              </div>
              <button
                onClick={() => setBuilderOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 text-blue-800 dark:text-blue-300">
                The Custom Game Builder schema, tool step registry, and validation endpoints are
                fully connected. Any custom activity submitted by Org Admins or Hosts can be tested
                via dry-run and approved into your organization's catalog.
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 dark:text-white">
                  Supported Flow Steps in Engine:
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'deal_roles',
                    'announce',
                    'timer',
                    'buzz_round',
                    'vote',
                    'score',
                    'reveal',
                  ].map((step) => (
                    <span
                      key={step}
                      className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 text-[11px] font-mono"
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setBuilderOpen(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-semibold cursor-pointer border border-slate-200 dark:border-transparent transition-colors"
            >
              Close Template Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
