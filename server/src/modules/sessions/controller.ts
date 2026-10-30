import { Request, Response, NextFunction } from 'express';
import { SessionsService } from './service.js';
import { sendSuccess } from '../../utils/response.js';
import { safeGetIO } from '../../sockets/index.js';

export class SessionsController {
  public static async createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await SessionsService.createSession(req.orgId!, req.user!.userId, req.body);
      const io = safeGetIO();
      if (io) {
        io.to('dashboard').emit('session:created', session);
        io.to('dashboard').emit('dashboard:update');
      }
      sendSuccess(res, session, 'Session created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  public static async getSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessions = await SessionsService.getSessions(req.orgId!);
      sendSuccess(res, sessions);
    } catch (error) {
      next(error);
    }
  }

  public static async getSessionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;
      const session = await SessionsService.getSessionById(sessionId, req.orgId!);
      sendSuccess(res, session);
    } catch (error) {
      next(error);
    }
  }

  public static async getSessionByJoinCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const code = req.params.code as string;
      const session = await SessionsService.getSessionByJoinCode(code);
      sendSuccess(res, session);
    } catch (error) {
      next(error);
    }
  }

  public static async updateSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;
      const session = await SessionsService.updateSession(sessionId, req.orgId!, req.body);
      const io = safeGetIO();
      if (io) {
        io.to(`session:${sessionId}`).emit('session:updated', session);
        io.to('dashboard').emit('session:updated', session);
        io.to('dashboard').emit('dashboard:update');
      }
      sendSuccess(res, session, 'Session updated successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async publishSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;
      const session = await SessionsService.publishSession(sessionId, req.orgId!);
      const io = safeGetIO();
      if (io) {
        io.to(`session:${sessionId}`).emit('session:updated', session);
        io.to('dashboard').emit('dashboard:update');
      }
      sendSuccess(res, session, 'Session agenda published');
    } catch (error) {
      next(error);
    }
  }

  public static async startSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;
      const result = await SessionsService.startSession(sessionId, req.orgId!);
      const io = safeGetIO();
      if (io) {
        io.to(`session:${sessionId}`).emit('session:started', result);
        io.to('dashboard').emit('session:updated', result.session);
        io.to('dashboard').emit('dashboard:update');
      }
      sendSuccess(res, result, 'Session started live');
    } catch (error) {
      next(error);
    }
  }

  public static async finishSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string;
      const session = await SessionsService.finishSession(sessionId, req.orgId!);
      const io = safeGetIO();
      if (io) {
        io.to(`session:${sessionId}`).emit('session:ended', session);
        io.to('dashboard').emit('session:updated', session);
        io.to('dashboard').emit('dashboard:update');
      }
      sendSuccess(res, session, 'Session concluded');
    } catch (error) {
      next(error);
    }
  }
}
