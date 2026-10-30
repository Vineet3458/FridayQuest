import { Server, Socket } from 'socket.io';
import { SessionState, ISessionState } from '../models/SessionState.js';
import { Session } from '../models/Session.js';
import { Game } from '../models/Game.js';
import { GameRunner } from '../engine/gameRunner.js';
import { attemptBuzz, resetBuzzer } from '../engine/tools/buzzer.js';
import { recordVote } from '../engine/tools/voting.js';
import { pauseTimer, resumeTimer } from '../engine/tools/timer.js';
import { ScoringService } from '../modules/scoring/service.js';
import { logger } from '../utils/logger.js';
import { AuthUserPayload } from '../types/index.js';

export function registerSessionHandlers(io: Server, socket: Socket) {
  const user = (socket.data as { user?: AuthUserPayload }).user;

  // 1. Join live session room
  socket.on('session:join', async (data: { sessionId: string }) => {
    try {
      const { sessionId } = data;
      const session = await Session.findById(sessionId);
      if (!session) {
        socket.emit('error:session', { message: 'Session not found' });
        return;
      }

      const roomName = `session:${sessionId}`;
      socket.join(roomName);

      // Fetch or initialize state
      let state = await SessionState.findOne({ sessionId });
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
      }

      // Send sanitized public state to client
      const publicState = getPublicState(state, session);
      socket.emit('state:update', publicState);

      // If user has a secret role assignment in this state, send it privately
      if (user) {
        const assignment = state.roleAssignments.find((r) => r.userId === user.userId);
        if (assignment) {
          socket.emit('role:assigned', {
            roleKey: assignment.roleKey,
            roleLabel: assignment.roleLabel,
            secretValue: assignment.secretValue,
          });
        }
      }

      logger.info({ userId: user?.userId, sessionId }, 'User joined live session room');
    } catch (error: any) {
      logger.error({ error }, 'Error in session:join');
      socket.emit('error:session', { message: error.message });
    }
  });

  // 2. Player Action (buzz, vote, pickPlayer)
  socket.on('player:action', async (data: { sessionId: string; type: string; payload?: any }) => {
    try {
      if (!user) return;
      const { sessionId, type, payload } = data;
      const roomName = `session:${sessionId}`;

      const state = await SessionState.findOne({ sessionId });
      if (!state || state.status !== 'in_progress' || state.paused) return;

      if (type === 'buzz') {
        const result = attemptBuzz(state.buzzerState, user.userId, user.email);
        if (result.success) {
          state.buzzerState = result.state;
          await state.save();
          io.to(roomName).emit('buzzer:locked', {
            userId: user.userId,
            userName: user.email,
            lockedAt: result.state.lockedAt,
          });
        }
      } else if (type === 'vote') {
        if (payload?.targetId) {
          const voteResult = recordVote(state.votes, {
            userId: user.userId,
            targetId: payload.targetId,
          });
          state.votes = voteResult.updatedVotes;
          await state.save();
          io.to(roomName).emit('state:update', { votesCount: state.votes.length });
        }
      }
    } catch (error: any) {
      logger.error({ error }, 'Error in player:action');
    }
  });

  // 3. Organizer Host Control: Next Step / Advance
  socket.on('host:next', async (data: { sessionId: string }) => {
    try {
      if (!user || (user.role !== 'orgAdmin' && user.role !== 'organizer' && user.role !== 'superAdmin')) {
        socket.emit('error:session', { message: 'Unauthorized. Only organizers can control the game.' });
        return;
      }

      const { sessionId } = data;
      const roomName = `session:${sessionId}`;

      const session = await Session.findById(sessionId);
      if (!session || session.agenda.length === 0) return;

      const state = await SessionState.findOne({ sessionId });
      if (!state) return;

      const currentAgendaItem = session.agenda[state.currentGameIdx];
      if (!currentAgendaItem) return;

      const gameDoc = await Game.findById(currentAgendaItem.gameId);
      if (!gameDoc) return;

      // Collect sockets in room as current players
      const roomSockets = await io.in(roomName).fetchSockets();
      const playerIds = roomSockets
        .map((s) => (s.data?.user as AuthUserPayload | undefined)?.userId)
        .filter((id): id is string => Boolean(id));

      const advanceResult = GameRunner.advanceStep(
        gameDoc.definition,
        state,
        playerIds,
        {
          round: state.round,
          stepIdx: state.stepIdx,
        }
      );

      state.stepIdx = advanceResult.nextStepIdx;
      state.round = advanceResult.nextRound;

      if (advanceResult.isGameFinished) {
        // Move to next game in agenda if available
        if (state.currentGameIdx + 1 < session.agenda.length) {
          state.currentGameIdx += 1;
          state.stepIdx = 0;
          state.round = 1;
          state.roleAssignments = [];
          state.votes = [];
          state.buzzerState = resetBuzzer();
          io.to(roomName).emit('game:ended', { gameId: currentAgendaItem.gameId });
        } else {
          state.status = 'completed';
          session.status = 'done';
          await session.save();
          io.to(roomName).emit('session:ended', { sessionId });
        }
      }

      await state.save();

      // Broadcast public state update
      io.to(roomName).emit('state:update', getPublicState(state, session));

      // If roles were assigned, privately distribute to respective players
      if (advanceResult.effects.rolesAssigned && state.roleAssignments.length > 0) {
        for (const s of roomSockets) {
          const sUser = (s.data as { user?: AuthUserPayload }).user;
          if (sUser) {
            const assignment = state.roleAssignments.find((r) => r.userId === sUser.userId);
            if (assignment) {
              s.emit('role:assigned', {
                roleKey: assignment.roleKey,
                roleLabel: assignment.roleLabel,
              });
            }
          }
        }
      }

      // If scores were awarded by rule evaluation, persist ScoreEvents
      if (advanceResult.effects.scoresAwarded) {
        for (const award of advanceResult.effects.scoresAwarded) {
          await ScoringService.awardScore(sessionId, session.orgId.toString(), user.userId, {
            gameId: currentAgendaItem.gameId,
            round: state.round,
            userId: award.targetId,
            points: award.points,
            reason: award.reason,
          });
        }
        io.to(roomName).emit('score:update', { scores: state.scores });
      }
    } catch (error: any) {
      logger.error({ error }, 'Error in host:next');
    }
  });

  // 4. Organizer Host Control: Pause / Resume
  socket.on('host:pause', async (data: { sessionId: string }) => {
    try {
      if (!user || (user.role !== 'orgAdmin' && user.role !== 'organizer' && user.role !== 'superAdmin')) return;
      const { sessionId } = data;
      const roomName = `session:${sessionId}`;

      const state = await SessionState.findOne({ sessionId });
      if (!state) return;

      if (!state.paused) {
        state.paused = true;
        state.timers = pauseTimer({
          endsAt: state.timers.endsAt,
          durationSec: state.timers.durationSec || 0,
          remainingSec: 0,
          running: state.timers.running,
        });
      } else {
        state.paused = false;
        state.timers = resumeTimer({
          endsAt: state.timers.endsAt,
          durationSec: state.timers.durationSec || 0,
          remainingSec: 0,
          running: state.timers.running,
        });
      }

      await state.save();
      io.to(roomName).emit('state:update', { paused: state.paused, timers: state.timers });
    } catch (error: any) {
      logger.error({ error }, 'Error in host:pause');
    }
  });

  // 5. Organizer Host Control: Award Bonus Points
  socket.on('host:award', async (data: { sessionId: string; targetId: string; points: number; reason: string }) => {
    try {
      if (!user || (user.role !== 'orgAdmin' && user.role !== 'organizer' && user.role !== 'superAdmin')) return;
      const { sessionId, targetId, points, reason } = data;
      const session = await Session.findById(sessionId);
      if (!session) return;

      await ScoringService.awardScore(sessionId, session.orgId.toString(), user.userId, {
        userId: targetId,
        points,
        reason,
      });

      const scores = await ScoringService.getSessionScores(sessionId, session.orgId.toString());
      io.to(`session:${sessionId}`).emit('score:update', scores);
    } catch (error: any) {
      logger.error({ error }, 'Error in host:award');
    }
  });

  // 6. Organizer Host Control: Skip Current Game
  socket.on('host:skip', async (data: { sessionId: string }) => {
    try {
      if (!user || (user.role !== 'orgAdmin' && user.role !== 'organizer' && user.role !== 'superAdmin')) return;
      const { sessionId } = data;
      const roomName = `session:${sessionId}`;
      const session = await Session.findById(sessionId);
      if (!session) return;
      const state = await SessionState.findOne({ sessionId });
      if (!state) return;

      if (state.currentGameIdx + 1 < session.agenda.length) {
        state.currentGameIdx += 1;
        state.stepIdx = 0;
        state.round = 1;
        state.roleAssignments = [];
        state.votes = [];
        state.buzzerState = resetBuzzer();
        await state.save();
        io.to(roomName).emit('game:ended', { skipped: true });
        io.to(roomName).emit('state:update', getPublicState(state, session));
      } else {
        state.status = 'completed';
        session.status = 'done';
        await session.save();
        await state.save();
        io.to(roomName).emit('session:ended', { sessionId });
        io.to(roomName).emit('state:update', getPublicState(state, session));
      }
    } catch (error: any) {
      logger.error({ error }, 'Error in host:skip');
    }
  });

  // 7. Organizer Host Control: End Session
  socket.on('host:end', async (data: { sessionId: string }) => {
    try {
      if (!user || (user.role !== 'orgAdmin' && user.role !== 'organizer' && user.role !== 'superAdmin')) return;
      const { sessionId } = data;
      const roomName = `session:${sessionId}`;
      const session = await Session.findById(sessionId);
      if (!session) return;
      const state = await SessionState.findOne({ sessionId });
      if (!state) return;

      state.status = 'completed';
      session.status = 'done';
      await session.save();
      await state.save();
      io.to(roomName).emit('session:ended', { sessionId });
      io.to(roomName).emit('state:update', getPublicState(state, session));
    } catch (error: any) {
      logger.error({ error }, 'Error in host:end');
    }
  });

  // 8. Organizer Host Control: Reset Buzzer Lockout
  socket.on('host:reset_buzzer', async (data: { sessionId: string }) => {
    try {
      if (!user || (user.role !== 'orgAdmin' && user.role !== 'organizer' && user.role !== 'superAdmin')) return;
      const { sessionId } = data;
      const roomName = `session:${sessionId}`;
      const state = await SessionState.findOne({ sessionId });
      if (!state) return;

      state.buzzerState = resetBuzzer();
      await state.save();
      io.to(roomName).emit('buzzer:reset');
      io.to(roomName).emit('state:update', { buzzerState: state.buzzerState });
    } catch (error: any) {
      logger.error({ error }, 'Error in host:reset_buzzer');
    }
  });
}

/**
 * Strips secret role and word assignments before broadcasting state to public room.
 */
function getPublicState(state: ISessionState, session: any) {
  const currentGame = session.agenda[state.currentGameIdx] || null;

  return {
    sessionId: state.sessionId,
    currentGameIdx: state.currentGameIdx,
    currentGame,
    stepIdx: state.stepIdx,
    round: state.round,
    timers: state.timers,
    scores: state.scores,
    buzzerState: state.buzzerState,
    votesCount: state.votes.length,
    paused: state.paused,
    status: state.status,
  };
}

