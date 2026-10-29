import { Session } from '../../models/Session.js';
import { ScoringService } from '../scoring/service.js';
import { RatingsService } from '../ratings/service.js';
import { VibeService } from '../vibe/service.js';

export class RecapService {
  public static async getSessionRecap(sessionId: string, orgId: string) {
    const session = await Session.findOne({ _id: sessionId, orgId });
    if (!session) throw new Error('Session not found');

    const scores = await ScoringService.getSessionScores(sessionId, orgId);
    const ratings = await RatingsService.getSessionRatings(sessionId, orgId);
    const vibe = await VibeService.getVibeSummary(sessionId, orgId);

    const winningTeam = scores.teamLeaderboard[0] || null;
    const mvpPlayer = scores.playerLeaderboard[0] || null;

    let avgRating = 0;
    if (ratings.length > 0) {
      const sum = ratings.reduce((acc, r) => acc + r.score, 0);
      avgRating = parseFloat((sum / ratings.length).toFixed(1));
    }

    return {
      session: {
        id: session._id,
        title: session.title,
        date: session.date,
        location: session.location,
        status: session.status,
        agendaCount: session.agenda.length,
      },
      winningTeam,
      mvpPlayer,
      teamLeaderboard: scores.teamLeaderboard,
      playerLeaderboard: scores.playerLeaderboard,
      totalAttendees: vibe.totals.attendingCount,
      avgRating,
      ratingsCount: ratings.length,
      recentRatings: ratings.slice(0, 5),
    };
  }
}

