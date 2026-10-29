export interface Vote {
  userId: string;
  targetId: string;
}

export function recordVote(
  existingVotes: Vote[],
  newVote: Vote
): { updatedVotes: Vote[]; isNew: boolean } {
  const index = existingVotes.findIndex((v) => v.userId === newVote.userId);
  if (index >= 0) {
    // Replace existing vote for this user
    const updated = [...existingVotes];
    updated[index] = newVote;
    return { updatedVotes: updated, isNew: false };
  }

  return {
    updatedVotes: [...existingVotes, newVote],
    isNew: true,
  };
}

export function tallyVotes(votes: Vote[]): Record<string, number> {
  const tally: Record<string, number> = {};
  for (const v of votes) {
    tally[v.targetId] = (tally[v.targetId] || 0) + 1;
  }
  return tally;
}

