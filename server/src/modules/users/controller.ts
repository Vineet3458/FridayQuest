import { Request, Response, NextFunction } from 'express';
import { UsersService } from './service.js';
import { sendSuccess } from '../../utils/response.js';

export class UsersController {
  public static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UsersService.getMe(req.user!.userId);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  public static async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await UsersService.updateMe(req.user!.userId, req.body);
      sendSuccess(res, updated, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async getOrgUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await UsersService.getOrgUsers(req.orgId!);
      sendSuccess(res, users);
    } catch (error) {
      next(error);
    }
  }

  public static async approveUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetUserId = req.params.id as string;
      const approved = await UsersService.approveUser(req.orgId!, targetUserId);
      sendSuccess(res, approved, 'User approved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetUserId = req.params.id as string;
      const updated = await UsersService.updateUserRole(req.orgId!, targetUserId, req.body.role);
      sendSuccess(res, updated, 'User role updated successfully');
    } catch (error) {
      next(error);
    }
  }
}
