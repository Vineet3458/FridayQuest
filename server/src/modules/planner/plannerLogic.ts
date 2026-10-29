import { GameDefinition, SessionAgendaItem } from '../../types/index.js';

export interface PlannerVibeInput {
  attendingCount: number;
  avgEnergy: number; // 1 to 5
  styleDistribution: {
    active: number;
    calm: number;
    brainy: number;
  };
  skippedGameSlugs: string[];
}

export interface PlannerGameCandidate {
  id: string;
  name: string;
  slug: string;
  version: number;
  definition: GameDefinition;
  avgRating: number;
  lastPlayedFridaysAgo?: number; // e.g. 1 means last Friday, 2 means 2 Fridays ago
}

export interface PlannerHistoryInput {
  recentPlayedGameSlugs: string[]; // Slugs of games played recently
}

export interface GeneratedPlan {
  agenda: SessionAgendaItem[];
  propsChecklist: string[];
  totalDurationMin: number;
}

/**
 * Pure function: Calculate suitability score for a game based on the formula:
 * score = avgRating * 0.4 + energyMatch * 0.25 + freshness * 0.2 + preferenceMatch * 0.15
 */
export function calculateGameScore(
  game: PlannerGameCandidate,
  vibe: PlannerVibeInput
): number {
  const normRating = Math.min(5, Math.max(1, game.avgRating || 4.0)) / 5.0; // 0.2 to 1.0

  // Energy Match: Map game energy ('low', 'medium', 'high') to 1-5 scale
  const targetEnergy = vibe.avgEnergy || 3.0;
  const gameEnergyVal =
    game.definition.energy === 'low' ? 1.5 : game.definition.energy === 'medium' ? 3.0 : 4.5;
  const energyDiff = Math.abs(targetEnergy - gameEnergyVal);
  const energyMatch = Math.max(0, 1 - energyDiff / 4.0); // 0.0 to 1.0

  // Freshness: Drops if played in the last 3 Fridays
  let freshness = 1.0;
  if (game.lastPlayedFridaysAgo !== undefined) {
    if (game.lastPlayedFridaysAgo <= 1) freshness = 0.2;
    else if (game.lastPlayedFridaysAgo <= 2) freshness = 0.5;
    else if (game.lastPlayedFridaysAgo <= 3) freshness = 0.8;
  }

  // Preference match based on dominant team style
  const totalVotes =
    (vibe.styleDistribution.active || 0) +
    (vibe.styleDistribution.calm || 0) +
    (vibe.styleDistribution.brainy || 0) || 1;

  let preferenceMatch = 0.7; // default good baseline
  if (game.definition.energy === 'high' && vibe.styleDistribution.active) {
    preferenceMatch = vibe.styleDistribution.active / totalVotes;
  } else if (game.definition.energy === 'low' && vibe.styleDistribution.calm) {
    preferenceMatch = vibe.styleDistribution.calm / totalVotes;
  }

  return (
    normRating * 0.4 +
    energyMatch * 0.25 +
    freshness * 0.2 +
    preferenceMatch * 0.15
  );
}

/**
 * Pure function: Filter, score and arrange agenda flow:
 * Flow: Warm-up (low energy, short) -> Main Event (highest score) -> Finale
 * 5-minute buffer between games.
 */
export function generateAgendaPlan(
  vibe: PlannerVibeInput,
  availableGames: PlannerGameCandidate[],
  totalSessionDurationMin: number = 90
): GeneratedPlan {
  const attending = vibe.attendingCount;
  const skipSet = new Set(vibe.skippedGameSlugs);

  // 1. Filter viable games
  const viable = availableGames.filter((g) => {
    // If skipped by team vibe, remove
    if (skipSet.has(g.slug) || skipSet.has(g.id)) return false;

    // Check player headcount constraints
    const minP = g.definition.players?.min ?? 2;
    const maxP = g.definition.players?.max ?? 50;
    if (attending < minP || attending > maxP) return false;

    // Check duration doesn't exceed total session time
    if (g.definition.durationMin > totalSessionDurationMin) return false;

    return true;
  });

  if (viable.length === 0) {
    return {
      agenda: [],
      propsChecklist: [],
      totalDurationMin: 0,
    };
  }

  // 2. Score viable games
  const scored = viable.map((game) => ({
    game,
    score: calculateGameScore(game, vibe),
  }));

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // 3. Arrange in flow: warm-up (low energy, <= 20 min), main (highest score), finale
  const warmUpCandidate = scored.find(
    (item) => item.game.definition.energy === 'low' && item.game.definition.durationMin <= 20
  ) || scored[scored.length - 1]; // fallback to lowest intensity

  const remainingAfterWarmup = scored.filter((item) => item.game.id !== warmUpCandidate?.game.id);

  const mainCandidate = remainingAfterWarmup[0] || warmUpCandidate;
  const remainingAfterMain = remainingAfterWarmup.filter((item) => item.game.id !== mainCandidate?.game.id);

  const finaleCandidate = remainingAfterMain[0] || null;

  const agendaCandidates: PlannerGameCandidate[] = [];
  let allocatedTime = 0;
  const BUFFER_MIN = 5;

  // Add Warm-up
  if (warmUpCandidate && allocatedTime + warmUpCandidate.game.definition.durationMin <= totalSessionDurationMin) {
    agendaCandidates.push(warmUpCandidate.game);
    allocatedTime += warmUpCandidate.game.definition.durationMin + BUFFER_MIN;
  }

  // Add Main event
  if (
    mainCandidate &&
    mainCandidate.game.id !== warmUpCandidate?.game.id &&
    allocatedTime + mainCandidate.game.definition.durationMin <= totalSessionDurationMin
  ) {
    agendaCandidates.push(mainCandidate.game);
    allocatedTime += mainCandidate.game.definition.durationMin + BUFFER_MIN;
  }

  // Add Finale
  if (
    finaleCandidate &&
    allocatedTime + finaleCandidate.game.definition.durationMin <= totalSessionDurationMin
  ) {
    agendaCandidates.push(finaleCandidate.game);
    allocatedTime += finaleCandidate.game.definition.durationMin;
  }

  // Assemble Agenda Items
  const agenda: SessionAgendaItem[] = agendaCandidates.map((g, index) => ({
    gameId: g.id,
    gameName: g.name,
    version: g.version || 1,
    order: index + 1,
    durationMin: g.definition.durationMin,
  }));

  // Collect unique props
  const propsSet = new Set<string>();
  for (const g of agendaCandidates) {
    if (g.definition.props && Array.isArray(g.definition.props)) {
      for (const p of g.definition.props) {
        if (p && p.trim()) propsSet.add(p.trim());
      }
    }
  }

  return {
    agenda,
    propsChecklist: Array.from(propsSet),
    totalDurationMin: allocatedTime,
  };
}

