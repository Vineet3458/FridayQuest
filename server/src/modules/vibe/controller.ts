import { Request, Response, NextFunction } from 'express';
import { VibeService } from './service.js';
import { sendSuccess } from '../../utils/response.js';
import { safeGetIO } from '../../sockets/index.js';

export class VibeController {
  public static async submitVibe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;
      const vibe = await VibeService.submitVibe(
        sessionId,
        req.user!.userId,
        req.orgId!,
        req.body
      );

      // Broadcast real-time update
      const io = safeGetIO();
      if (io) {
        const summary = await VibeService.getVibeSummary(sessionId, req.orgId!);
        io.to(`session:${sessionId}`).emit('vibe:updated', {
          sessionId,
          vibe,
          summary,
        });
        io.to('dashboard').emit('vibe:updated', {
          sessionId,
          vibe,
          summary,
        });
      }

      sendSuccess(res, vibe, 'Vibe check recorded');
    } catch (error) {
      next(error);
    }
  }

  public static async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;
      const summary = await VibeService.getVibeSummary(sessionId, req.orgId!);
      sendSuccess(res, summary);
    } catch (error) {
      next(error);
    }
  }
}
