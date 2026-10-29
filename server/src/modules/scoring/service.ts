import mongoose from 'mongoose';
import { ScoreEvent, IScoreEvent } from '../../models/ScoreEvent.js';
import { SessionState } from '../../models/SessionState.js';
import { Team } from '../../models/Team.js';
import { User } from '../../models/User.js';

export class ScoringService {
  public static async awardScore(
    sessionId: string,
    orgId: string,
    createdByUserId: string,
    data: {
      gameId?: string;
      round?: number;
      teamId?: string;
      userId?: string;
      points: number;
      reason: string;
    }
  ) {
    const event = await ScoreEvent.create({
      sessionId,
      orgId,
      gameId: data.gameId,
      round: data.round || 1,
      teamId: data.teamId ? new mongoose.Types.ObjectId(data.teamId) : undefined,
      userId: data.userId ? new mongoose.Types.ObjectId(data.userId) : undefined,
      points: data.points,
      reason: data.reason,
      createdBy: createdByUserId,
    });

    // Update SessionState cache
    const targetKey = data.teamId || data.userId;
    if (targetKey) {
      const state = await SessionState.findOne({ sessionId });
      if (state) {
        state.scores = state.scores || {};
        state.scores[targetKey] = (state.scores[targetKey] || 0) + data.points;
        state.markModified('scores');
        await state.save();
      }
    }

    return event;
  }

  public static async getSessionScores(sessionId: string, orgId: string) {
    const events = await ScoreEvent.find({ sessionId, orgId })
      .populate('userId', 'name avatar')
      .populate('teamId', 'name color')
      .sort({ createdAt: -1 });

    const teamScores: Record<string, { id: string; name: string; color: string; total: number }> = {};
    const userScores: Record<string, { id: string; name: string; total: number }> = {};

    // Get all teams for this session to show 0 if not scored yet
    const teams = await Team.find({ sessionId, orgId });
    for (const t of teams) {
      teamScores[t._id.toString()] = {
        id: t._id.toString(),
        name: t.name,
        color: t.color,
        total: 0,
      };
    }

    for (const ev of events) {
      if (ev.teamId) {
        const tId = ev.teamId._id ? ev.teamId._id.toString() : ev.teamId.toString();
        if (teamScores[tId]) {
          teamScores[tId].total += ev.points;
        }
      }
      if (ev.userId) {
        const uId = ev.userId._id ? ev.userId._id.toString() : ev.userId.toString();
        const userName = (ev.userId as any).name || 'Player';
        if (!userScores[uId]) {
          userScores[uId] = { id: uId, name: userName, total: 0 };
        }
        userScores[uId].total += ev.points;
      }
    }

    const teamLeaderboard = Object.values(teamScores).sort((a, b) => b.total - a.total);
    const playerLeaderboard = Object.values(userScores).sort((a, b) => b.total - a.total);

    return {
      teamLeaderboard,
      playerLeaderboard,
      events,
    };
  }
}

