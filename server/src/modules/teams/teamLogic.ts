export interface Attendee {
  userId: string;
  name: string;
  department?: string;
}

export interface PairingInteraction {
  userA: string;
  userB: string;
  count: number;
}

export interface TeamGroup {
  teamIndex: number;
  name: string;
  color: string;
  members: Attendee[];
}

export type TeamMakerMode = 'mixed' | 'random' | 'by_department';

const TEAM_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
];

const TEAM_NAMES = [
  'Team Red Dragons',
  'Team Blue Falcons',
  'Team Green Ninjas',
  'Team Golden Lions',
  'Team Purple Wizards',
  'Team Silver Foxes',
  'Team Cosmic Sharks',
  'Team Solar Sparks',
];

/**
 * Calculates a cost score for a team partition:
 * - Penalizes placing colleagues from the same department on the same team (weight 10)
 * - Penalizes pairs who have already played together frequently in past sessions (weight 5 per interaction)
 * - Lower cost is better!
 */
export function calculatePartitionCost(
  teams: Attendee[][],
  interactionsMap: Map<string, number>
): number {
  let cost = 0;

  for (const team of teams) {
    const deptCounts: Record<string, number> = {};

    for (let i = 0; i < team.length; i++) {
      const userA = team[i];
      const dept = userA.department || 'General';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;

      for (let j = i + 1; j < team.length; j++) {
        const userB = team[j];
        // Create canonical key for pairing (lexicographical order)
        const pairKey = userA.userId < userB.userId
          ? `${userA.userId}:${userB.userId}`
          : `${userB.userId}:${userA.userId}`;

        const pastCount = interactionsMap.get(pairKey) || 0;
        cost += pastCount * 5;
      }
    }

    // Penalize same-department clustering
    for (const count of Object.values(deptCounts)) {
      if (count > 1) {
        cost += (count - 1) * 10;
      }
    }
  }

  return cost;
}

/**
 * Team Maker pure function:
 * Randomized greedy assignment with ~200 attempts to find lowest cost distribution.
 */
export function generateTeams(
  attendees: Attendee[],
  numTeams: number,
  pastInteractions: PairingInteraction[] = [],
  mode: TeamMakerMode = 'mixed'
): TeamGroup[] {
  if (attendees.length === 0 || numTeams <= 0) {
    return [];
  }

  const effectiveNumTeams = Math.min(numTeams, attendees.length);

  // Map past pairings for O(1) lookup
  const interactionsMap = new Map<string, number>();
  for (const inter of pastInteractions) {
    const key = inter.userA < inter.userB
      ? `${inter.userA}:${inter.userB}`
      : `${inter.userB}:${inter.userA}`;
    interactionsMap.set(key, inter.count);
  }

  if (mode === 'random') {
    const shuffled = [...attendees].sort(() => Math.random() - 0.5);
    const buckets: Attendee[][] = Array.from({ length: effectiveNumTeams }, () => []);
    shuffled.forEach((attendee, index) => {
      buckets[index % effectiveNumTeams].push(attendee);
    });
    return formatTeamOutput(buckets);
  }

  if (mode === 'by_department') {
    // Group members of the same department together
    const sorted = [...attendees].sort((a, b) =>
      (a.department || '').localeCompare(b.department || '')
    );
    const buckets: Attendee[][] = Array.from({ length: effectiveNumTeams }, () => []);
    sorted.forEach((attendee, index) => {
      buckets[index % effectiveNumTeams].push(attendee);
    });
    return formatTeamOutput(buckets);
  }

  // 'mixed' mode: run 200 random permutations and pick lowest cost
  let bestPartition: Attendee[][] = [];
  let lowestCost = Infinity;
  const attempts = 200;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const shuffled = [...attendees].sort(() => Math.random() - 0.5);
    const candidateBuckets: Attendee[][] = Array.from({ length: effectiveNumTeams }, () => []);

    shuffled.forEach((att, idx) => {
      candidateBuckets[idx % effectiveNumTeams].push(att);
    });

    const cost = calculatePartitionCost(candidateBuckets, interactionsMap);
    if (cost < lowestCost) {
      lowestCost = cost;
      bestPartition = candidateBuckets;
      if (cost === 0) break; // Perfect distribution found
    }
  }

  return formatTeamOutput(bestPartition);
}

function formatTeamOutput(buckets: Attendee[][]): TeamGroup[] {
  return buckets.map((members, idx) => ({
    teamIndex: idx,
    name: TEAM_NAMES[idx % TEAM_NAMES.length],
    color: TEAM_COLORS[idx % TEAM_COLORS.length],
    members,
  }));
}

