import { Request, Response, NextFunction } from 'express';
import { TeamsService } from './service.js';
import { sendSuccess } from '../../utils/response.js';

export class TeamsController {
  public static async generateTeams(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;
      const { numTeams, mode } = req.body;
      const teams = await TeamsService.generateSessionTeams(sessionId, req.orgId!, numTeams, mode);
      sendSuccess(res, teams, 'Teams generated successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  public static async getTeams(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;
      const teams = await TeamsService.getSessionTeams(sessionId, req.orgId!);
      sendSuccess(res, teams);
    } catch (error) {
      next(error);
    }
  }

  public static async updateTeams(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;
      const teams = await TeamsService.updateSessionTeams(sessionId, req.orgId!, req.body.teams);
      sendSuccess(res, teams, 'Teams updated successfully');
    } catch (error) {
      next(error);
    }
  }
}
