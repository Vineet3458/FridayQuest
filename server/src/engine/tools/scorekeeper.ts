export interface ScoreDelta {
  targetId: string; // userId or teamId
  points: number;
}

export function updateScores(
  currentScores: Record<string, number>,
  delta: ScoreDelta
): Record<string, number> {
  const next = { ...currentScores };
  next[delta.targetId] = (next[delta.targetId] || 0) + delta.points;
  return next;
}

export function getLeaderboard(
  scores: Record<string, number>,
  namesMap: Record<string, string>
): Array<{ id: string; name: string; score: number; rank: number }> {
  const entries = Object.entries(scores).map(([id, score]) => ({
    id,
    name: namesMap[id] || id,
    score,
  }));

  entries.sort((a, b) => b.score - a.score);

  return entries.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
  }));
}

