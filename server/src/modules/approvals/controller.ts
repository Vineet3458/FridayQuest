import { Request, Response, NextFunction } from 'express';
import { ApprovalsService } from './service.js';
import { sendSuccess } from '../../utils/response.js';

export class ApprovalsController {
  public static async getPending(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await ApprovalsService.getPendingApprovals(req.orgId!, req.user!.role);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  public static async approveUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetUserId = req.params.id as string;
      const user = await ApprovalsService.approveUser(req.orgId!, targetUserId);
      sendSuccess(res, user, 'User approved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async rejectUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetUserId = req.params.id as string;
      const result = await ApprovalsService.rejectUser(req.orgId!, targetUserId);
      sendSuccess(res, result, 'User request rejected');
    } catch (error) {
      next(error);
    }
  }

  public static async approveGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetGameId = req.params.id as string;
      const game = await ApprovalsService.approveGame(req.orgId!, targetGameId);
      sendSuccess(res, game, 'Game approved and published to catalog');
    } catch (error) {
      next(error);
    }
  }

  public static async rejectGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetGameId = req.params.id as string;
      const result = await ApprovalsService.rejectGame(req.orgId!, targetGameId, req.body.reason);
      sendSuccess(res, result, 'Game reverted to draft');
    } catch (error) {
      next(error);
    }
  }
}

