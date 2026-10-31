import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './service.js';
import { sendSuccess } from '../../utils/response.js';

export class AnalyticsController {
  public static async getOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isSuperAdmin = req.user?.role === 'superAdmin';
      const timeRange = (req.query.timeRange as string) || 'Last 30 Days';
      const department = req.query.department as string;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      if (isSuperAdmin && req.query.scope === 'platform') {
        const platformData = await AnalyticsService.getPlatformOverview({ timeRange, startDate, endDate });
        sendSuccess(res, platformData);
        return;
      }

      // Organization level analytics
      const orgData = await AnalyticsService.getOrgOverview(req.orgId!, {
        timeRange,
        department,
        startDate,
        endDate,
      });
      sendSuccess(res, orgData);
    } catch (error) {
      next(error);
    }
  }

  public static async getPlatformOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const timeRange = (req.query.timeRange as string) || 'Last 30 Days';
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      const data = await AnalyticsService.getPlatformOverview({ timeRange, startDate, endDate });
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }
}

