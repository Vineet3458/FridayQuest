import { Request, Response, NextFunction } from 'express';
import { AuthService } from './service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import { ENV } from '../../config/env.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: ENV.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

export class AuthController {
  public static async registerOrg(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.registerOrganization(req.body);

      res.cookie('access_token', result.tokens.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000, // 15 mins
      });
      res.cookie('refresh_token', result.tokens.refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      sendSuccess(res, result, 'Organization and admin account created successfully', 201);
    } catch (error: any) {
      next(error);
    }
  }

  public static async registerEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.registerEmployee(req.body);

      res.cookie('access_token', result.tokens.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refresh_token', result.tokens.refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(res, result, 'Employee account registered successfully', 201);
    } catch (error: any) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);

      res.cookie('access_token', result.tokens.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refresh_token', result.tokens.refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(res, result, 'Login successful');
    } catch (error: any) {
      next(error);
    }
  }

  public static async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    sendSuccess(res, null, 'Logged out successfully');
  }

  public static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies?.refresh_token || req.body?.refreshToken;
      if (!refreshToken) {
        sendError(res, 'Refresh token is required', 400);
        return;
      }

      const result = await AuthService.refreshAccessToken(refreshToken);
      res.cookie('access_token', result.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
      });

      sendSuccess(res, result, 'Access token refreshed successfully');
    } catch (error: any) {
      next(error);
    }
  }

  public static async trialLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = req.body.role || 'player';
      const result = await AuthService.trialLogin(role);

      res.cookie('access_token', result.tokens.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refresh_token', result.tokens.refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(res, result, `Switched to trial role: ${role}`);
    } catch (error: any) {
      next(error);
    }
  }
}

