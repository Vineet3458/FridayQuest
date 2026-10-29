import { GameDefinition, GameFlowStep } from '../types/index.js';
import { ISessionState } from '../models/SessionState.js';
import { assignRoles } from './tools/secretRole.js';
import { startTimer, resetBuzzer } from './tools/index.js';
import { evaluateCondition } from './scoringEvaluator.js';

export interface StepAdvanceResult {
  nextStepIdx: number;
  nextRound: number;
  isGameFinished: boolean;
  stepConfig?: GameFlowStep;
  effects: {
    timerStarted?: { durationSec: number; endsAt: Date };
    rolesAssigned?: boolean;
    buzzerReset?: boolean;
    scoresAwarded?: Array<{ targetId: string; points: number; reason: string }>;
  };
}

export class GameRunner {
  /**
   * Advances the game state to the next flow step or round.
   */
  public static advanceStep(
    gameDef: GameDefinition,
    currentState: ISessionState,
    playerIds: string[],
    roundContext: Record<string, unknown> = {}
  ): StepAdvanceResult {
    const flow = gameDef.flow || [];
    const totalSteps = flow.length;
    const maxRounds = gameDef.rounds || 1;

    let nextStepIdx = currentState.stepIdx + 1;
    let nextRound = currentState.round;
    let isGameFinished = false;

    // Check if current round has completed all steps
    if (nextStepIdx >= totalSteps) {
      if (nextRound >= maxRounds) {
        isGameFinished = true;
        return {
          nextStepIdx: totalSteps - 1,
          nextRound,
          isGameFinished: true,
          effects: {},
        };
      } else {
        // Advance to next round, reset step index to 0
        nextRound += 1;
        nextStepIdx = 0;
      }
    }

    const currentStep = flow[nextStepIdx];
    const effects: StepAdvanceResult['effects'] = {};

    if (currentStep) {
      switch (currentStep.step) {
        case 'deal_roles': {
          if (gameDef.roles && gameDef.roles.length > 0) {
            currentState.roleAssignments = assignRoles(playerIds, gameDef.roles);
            effects.rolesAssigned = true;
          }
          break;
        }

        case 'timer': {
          const duration = (currentStep.timerSec as number) || 60;
          const timer = startTimer(duration);
          currentState.timers = {
            durationSec: duration,
            endsAt: timer.endsAt,
            running: true,
          };
          effects.timerStarted = { durationSec: duration, endsAt: timer.endsAt! };
          break;
        }

        case 'buzz_round': {
          currentState.buzzerState = resetBuzzer();
          effects.buzzerReset = true;
          break;
        }

        case 'score': {
          // Evaluate scoring rules if present
          if (gameDef.scoring && gameDef.scoring.length > 0) {
            const awards: Array<{ targetId: string; points: number; reason: string }> = [];
            for (const rule of gameDef.scoring) {
              const matches = evaluateCondition(rule.when, roundContext);
              if (matches && rule.award) {
                for (const aw of rule.award) {
                  let targetId = aw.role || aw.team || 'winner';
                  // Resolve role to player ID if role was given
                  if (aw.role) {
                    const found = currentState.roleAssignments.find((r) => r.roleKey === aw.role);
                    if (found) targetId = found.userId;
                  }
                  awards.push({
                    targetId,
                    points: aw.points,
                    reason: `Rule met: ${typeof rule.when === 'string' ? rule.when : 'Condition satisfied'}`,
                  });
                }
              }
            }
            effects.scoresAwarded = awards;
          }
          break;
        }
      }
    }

    return {
      nextStepIdx,
      nextRound,
      isGameFinished,
      stepConfig: currentStep,
      effects,
    };
  }
}

