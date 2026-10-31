import { Request, Response, NextFunction } from 'express';
import { RatingsService } from './service.js';
import { sendSuccess } from '../../utils/response.js';
import { safeGetIO } from '../../sockets/index.js';

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

      const io = safeGetIO();
      if (io) {
        io.to(`session:${sessionId}`).emit('rating:submitted', rating);
        io.to(`org:${req.orgId}`).emit('rating:submitted', rating);
        io.to(`org:${req.orgId}`).emit('analytics:update');
        io.to(`org:${req.orgId}`).emit('dashboard:update');
      }

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
