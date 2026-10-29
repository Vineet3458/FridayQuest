import mongoose from 'mongoose';
import { Team, ITeam } from '../../models/Team.js';
import { VibeCheck } from '../../models/VibeCheck.js';
import { User } from '../../models/User.js';
import { generateTeams, Attendee, TeamMakerMode } from './teamLogic.js';

export class TeamsService {
  public static async generateSessionTeams(
    sessionId: string,
    orgId: string,
    numTeams: number = 2,
    mode: TeamMakerMode = 'mixed'
  ) {
    // 1. Identify attendees from vibe checks (attending == 'yes' or 'maybe')
    const vibeAttendees = await VibeCheck.find({
      sessionId,
      orgId,
      attending: { $in: ['yes', 'maybe'] },
    }).populate('userId', 'name department');

    let attendees: Attendee[] = [];

    if (vibeAttendees.length >= 2) {
      attendees = vibeAttendees
        .filter((v) => v.userId)
        .map((v: any) => ({
          userId: v.userId._id.toString(),
          name: v.userId.name,
          department: v.userId.department,
        }));
    } else {
      // Fallback: use active organization users
      const orgUsers = await User.find({ orgId, status: 'active' }).limit(30);
      attendees = orgUsers.map((u) => ({
        userId: u._id.toString(),
        name: u.name,
        department: u.department,
      }));
    }

    if (attendees.length === 0) {
      throw new Error('No attendees found to make teams.');
    }

    // 2. Generate team groups using fair-mix algorithm
    const teamGroups = generateTeams(attendees, numTeams, [], mode);

    // 3. Clear existing session teams
    await Team.deleteMany({ sessionId, orgId });

    // 4. Save new teams
    const createdTeams = await Promise.all(
      teamGroups.map((group) =>
        Team.create({
          sessionId,
          orgId,
          name: group.name,
          color: group.color,
          memberIds: group.members.map((m) => new mongoose.Types.ObjectId(m.userId)),
          scope: 'session',
        })
      )
    );

    return createdTeams;
  }

  public static async getSessionTeams(sessionId: string, orgId: string) {
    return Team.find({ sessionId, orgId }).populate('memberIds', 'name email department avatar');
  }

  public static async updateSessionTeams(
    sessionId: string,
    orgId: string,
    teamsInput: Array<{ id?: string; name: string; color: string; memberIds: string[] }>
  ) {
    await Team.deleteMany({ sessionId, orgId });

    const created = await Promise.all(
      teamsInput.map((t) =>
        Team.create({
          sessionId,
          orgId,
          name: t.name,
          color: t.color,
          memberIds: t.memberIds.map((id) => new mongoose.Types.ObjectId(id)),
          scope: 'session',
        })
      )
    );

    return created;
  }
}

