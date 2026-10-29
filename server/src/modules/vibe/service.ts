import { VibeCheck } from '../../models/VibeCheck.js';
import { User } from '../../models/User.js';

export class VibeService {
  public static async submitVibe(
    sessionId: string,
    userId: string,
    orgId: string,
    data: {
      attending: 'yes' | 'no' | 'maybe';
      energy: number;
      style: 'active' | 'calm' | 'brainy';
      skipGameIds: string[];
    }
  ) {
    const vibe = await VibeCheck.findOneAndUpdate(
      { sessionId, userId },
      {
        $set: {
          orgId,
          attending: data.attending,
          energy: data.energy,
          style: data.style,
          skipGameIds: data.skipGameIds,
        },
      },
      { upsert: true, new: true }
    );
    return vibe;
  }

  public static async getVibeSummary(sessionId: string, orgId: string) {
    const vibes = await VibeCheck.find({ sessionId, orgId }).populate('userId', 'name department');

    let yesCount = 0;
    let noCount = 0;
    let maybeCount = 0;
    let totalEnergy = 0;
    const styleSplit = { active: 0, calm: 0, brainy: 0 };
    const skipGameCounts: Record<string, number> = {};

    for (const v of vibes) {
      if (v.attending === 'yes') {
        yesCount++;
        totalEnergy += v.energy;
        styleSplit[v.style] = (styleSplit[v.style] || 0) + 1;
      } else if (v.attending === 'no') {
        noCount++;
      } else {
        maybeCount++;
      }

      if (v.skipGameIds && Array.isArray(v.skipGameIds)) {
        for (const gameId of v.skipGameIds) {
          skipGameCounts[gameId] = (skipGameCounts[gameId] || 0) + 1;
        }
      }
    }

    const avgEnergy = yesCount > 0 ? parseFloat((totalEnergy / yesCount).toFixed(1)) : 3.0;

    return {
      totals: {
        attendingCount: yesCount,
        maybeCount,
        noCount,
        totalResponses: vibes.length,
        avgEnergy,
      },
      styleSplit,
      skipGameCounts,
      responses: vibes,
    };
  }
}

