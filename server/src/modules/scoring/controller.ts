import { Request, Response, NextFunction } from 'express';
import { ScoringService } from './service.js';
import { sendSuccess } from '../../utils/response.js';

export class ScoringController {
  public static async awardScore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;
      const event = await ScoringService.awardScore(
        sessionId,
        req.orgId!,
        req.user!.userId,
        req.body
      );
      sendSuccess(res, event, 'Score awarded', 201);
    } catch (error) {
      next(error);
    }
  }

  public static async getScores(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;
      const scores = await ScoringService.getSessionScores(sessionId, req.orgId!);
      sendSuccess(res, scores);
    } catch (error) {
      next(error);
    }
  }
}
