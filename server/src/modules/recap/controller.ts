import { Request, Response, NextFunction } from 'express';
import { RecapService } from './service.js';
import { sendSuccess } from '../../utils/response.js';

export class RecapController {
  public static async getRecap(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;
      const recap = await RecapService.getSessionRecap(sessionId, req.orgId!);
      sendSuccess(res, recap);
    } catch (error) {
      next(error);
    }
  }
}
