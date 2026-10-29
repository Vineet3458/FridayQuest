import { Request, Response, NextFunction } from 'express';
import { RatingsService } from './service.js';
import { sendSuccess } from '../../utils/response.js';

export class RatingsController {
  public static async submitRating(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;
      const rating = await RatingsService.submitRating(
        sessionId,
        req.user!.userId,
        req.orgId!,
        req.body
      );
      sendSuccess(res, rating, 'Rating submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async getRatings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;
      const ratings = await RatingsService.getSessionRatings(sessionId, req.orgId!);
      sendSuccess(res, ratings);
    } catch (error) {
      next(error);
    }
  }
}
