import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

export function enforceTenant(req: Request, res: Response, next: NextFunction): void {
  if (!req.orgId) {
    sendError(res, 'Organization scope is missing from authentication context', 403);
    return;
  }
  next();
}

