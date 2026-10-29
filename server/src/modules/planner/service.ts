import { Session } from '../../models/Session.js';
import { Game } from '../../models/Game.js';
import { VibeService } from '../vibe/service.js';
import {
  generateAgendaPlan,
  PlannerGameCandidate,
  PlannerVibeInput,
} from './plannerLogic.js';

export class PlannerService {
  public static async generatePlanForSession(
    sessionId: string,
    orgId: string,
    targetDuration?: number
  ) {
    const session = await Session.findOne({ _id: sessionId, orgId });
    if (!session) throw new Error('Session not found');

    const vibeSummary = await VibeService.getVibeSummary(sessionId, orgId);

    // Get all published games available to this organization
    const availableGamesDocs = await Game.find({
      $or: [{ orgId }, { orgId: null }],
      status: 'published',
    });

    const candidates: PlannerGameCandidate[] = availableGamesDocs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      version: doc.version,
      definition: doc.definition,
      avgRating: doc.avgRating || 4.2,
    }));

    // Find skipped game slugs/ids
    const skippedKeys: string[] = [];
    for (const [idOrSlug, count] of Object.entries(vibeSummary.skipGameCounts)) {
      if (count >= 2) {
        skippedKeys.push(idOrSlug);
      }
    }

    const vibeInput: PlannerVibeInput = {
      attendingCount: Math.max(vibeSummary.totals.attendingCount, 4), // default at least 4 if no responses yet
      avgEnergy: vibeSummary.totals.avgEnergy,
      styleDistribution: vibeSummary.styleSplit,
      skippedGameSlugs: skippedKeys,
    };

    const duration = targetDuration || session.durationMin || 90;
    const plan = generateAgendaPlan(vibeInput, candidates, duration);

    // Persist to session
    session.agenda = plan.agenda;
    session.propsChecklist = plan.propsChecklist;
    await session.save();

    return {
      session,
      plan,
      vibeInput,
    };
  }

  public static async getAlternativesForSlot(
    sessionId: string,
    orgId: string,
    slotOrder: number
  ) {
    const session = await Session.findOne({ _id: sessionId, orgId });
    if (!session) throw new Error('Session not found');

    const currentItem = session.agenda.find((a) => a.order === slotOrder);
    const existingGameIds = new Set(session.agenda.map((a) => a.gameId));

    // Find other published games not currently in the agenda
    const alternatives = await Game.find({
      $or: [{ orgId }, { orgId: null }],
      status: 'published',
      _id: { $nin: Array.from(existingGameIds) },
    }).limit(5);

    return {
      currentSlot: currentItem,
      alternatives,
    };
  }
}

