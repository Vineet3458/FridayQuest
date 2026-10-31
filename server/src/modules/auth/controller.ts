import { Request, Response, NextFunction } from 'express';
import { AuthService } from './service.js';
import { sendError, sendSuccess } from '../../utils/response.js';
import { ENV } from '../../config/env.js';
import { safeGetIO } from '../../sockets/index.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: ENV.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
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

      const { tokens: _tokens, ...safeResult } = result;
      sendSuccess(
        res,
        { ...safeResult, accessToken: result.tokens.accessToken },
        'Organization and admin account created successfully',
        201
      );
    } catch (error: any) {
      next(error);
    }
  }

  public static async registerEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.registerEmployee(req.body);

      if (result.tokens) {
        res.cookie('access_token', result.tokens.accessToken, {
          ...COOKIE_OPTIONS,
          maxAge: 15 * 60 * 1000,
        });
        res.cookie('refresh_token', result.tokens.refreshToken, {
          ...COOKIE_OPTIONS,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }

      const { tokens: _tokens, ...safeResult } = result;
      sendSuccess(
        res,
        { ...safeResult, accessToken: result.tokens?.accessToken },
        'Employee account registered successfully',
        201
      );
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

      const { tokens: _tokens, ...safeResult } = result;
      sendSuccess(
        res,
        { ...safeResult, accessToken: result.tokens.accessToken },
        'Login successful'
      );
    } catch (error: any) {
      next(error);
    }
  }

  public static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.logout(req.user!.userId);
      safeGetIO()?.in(`user:${req.user!.userId}`).disconnectSockets(true);
      res.clearCookie('access_token', COOKIE_OPTIONS);
      res.clearCookie('refresh_token', COOKIE_OPTIONS);
      sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
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

      sendSuccess(res, null, 'Access token refreshed successfully');
    } catch (error: any) {
      next(error);
    }
  }

  public static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await AuthService.getMe(req.user!.userId);
      sendSuccess(res, { user }, 'User profile retrieved successfully');
    } catch (error: any) {
      next(error);
    }
  }
}
