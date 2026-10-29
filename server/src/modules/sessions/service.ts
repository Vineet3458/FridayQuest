import crypto from 'crypto';
import { Session, ISession } from '../../models/Session.js';
import { SessionState } from '../../models/SessionState.js';

function generateJoinCode(): string {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

export class SessionsService {
  public static async createSession(orgId: string, organizerId: string, data: any) {
    let joinCode = generateJoinCode();
    // Ensure uniqueness
    while (await Session.findOne({ joinCode })) {
      joinCode = generateJoinCode();
    }

    const session = await Session.create({
      orgId,
      organizerId,
      title: data.title,
      date: new Date(data.date),
      startTime: data.startTime,
      durationMin: data.durationMin || 90,
      location: data.location || 'Cafeteria',
      status: 'voting', // open for Vibe Check
      joinCode,
      agenda: [],
      propsChecklist: [],
    });

    return session;
  }

  public static async getSessions(orgId: string) {
    return Session.find({ orgId }).sort({ date: -1, createdAt: -1 });
  }

  public static async getSessionById(sessionId: string, orgId: string) {
    const session = await Session.findOne({ _id: sessionId, orgId });
    if (!session) throw new Error('Session not found');
    return session;
  }

  public static async getSessionByJoinCode(joinCode: string) {
    const session = await Session.findOne({ joinCode: joinCode.toUpperCase().trim() });
    if (!session) throw new Error('Invalid session code');
    return session;
  }

  public static async updateSession(sessionId: string, orgId: string, data: any) {
    const session = await Session.findOne({ _id: sessionId, orgId });
    if (!session) throw new Error('Session not found');

    if (data.title) session.title = data.title;
    if (data.date) session.date = new Date(data.date);
    if (data.startTime) session.startTime = data.startTime;
    if (data.durationMin) session.durationMin = data.durationMin;
    if (data.location) session.location = data.location;
    if (data.agenda) session.agenda = data.agenda;
    if (data.propsChecklist) session.propsChecklist = data.propsChecklist;

    await session.save();
    return session;
  }

  public static async publishSession(sessionId: string, orgId: string) {
    const session = await Session.findOne({ _id: sessionId, orgId });
    if (!session) throw new Error('Session not found');

    if (session.agenda.length === 0) {
      throw new Error('Cannot publish session without any games in the agenda');
    }

    session.status = 'planned';
    await session.save();
    return session;
  }

  public static async startSession(sessionId: string, orgId: string) {
    const session = await Session.findOne({ _id: sessionId, orgId });
    if (!session) throw new Error('Session not found');

    session.status = 'live';
    await session.save();

    // Initialize or reset session live state
    let state = await SessionState.findOne({ sessionId: session._id });
    if (!state) {
      state = await SessionState.create({
        sessionId: session._id,
        orgId: session.orgId,
        currentGameIdx: 0,
        stepIdx: 0,
        round: 1,
        timers: { durationSec: 0, running: false },
        roleAssignments: [],
        scores: {},
        buzzerState: { locked: false },
        votes: [],
        paused: false,
        status: 'in_progress',
      });
    } else {
      state.status = 'in_progress';
      state.paused = false;
      await state.save();
    }

    return { session, state };
  }

  public static async finishSession(sessionId: string, orgId: string) {
    const session = await Session.findOne({ _id: sessionId, orgId });
    if (!session) throw new Error('Session not found');

    session.status = 'done';
    await session.save();

    await SessionState.findOneAndUpdate(
      { sessionId: session._id },
      { $set: { status: 'completed', paused: false } }
    );

    return session;
  }
}

