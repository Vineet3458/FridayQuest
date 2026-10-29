import { Request, Response, NextFunction } from 'express';
import { PlannerService } from './service.js';
import { sendSuccess } from '../../utils/response.js';

export class PlannerController {
  public static async generatePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;
      const result = await PlannerService.generatePlanForSession(
        sessionId,
        req.orgId!,
        req.body?.targetDurationMin
      );
      sendSuccess(res, result, 'Plan generated successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async getAlternatives(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;
      const slotOrder = parseInt((req.query.slot as string) || '1', 10);
      const result = await PlannerService.getAlternativesForSlot(sessionId, req.orgId!, slotOrder);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}
