import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';
import { User } from '../models/User.js';
import { AuthUserPayload } from '../types/index.js';

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  let token = req.cookies?.access_token;
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    sendError(res, 'Authentication required. No token provided.', 401);
    return;
  }

  let payload: AuthUserPayload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    sendError(res, 'Invalid or expired authentication token', 401);
    return;
  }

  try {
    if (!payload.userId) {
      sendError(res, 'Invalid or expired authentication token', 401);
      return;
    }
    const user = await User.findById(payload.userId).select('_id orgId role email status +tokenVersion');
    if (
      !user ||
      user.status !== 'active' ||
      (payload.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)
    ) {
      sendError(res, 'Invalid or expired authentication token', 401);
      return;
    }

    req.user = {
      userId: user._id.toString(),
      orgId: user.orgId.toString(),
      role: user.role,
      email: user.email,
    };
    req.orgId = user.orgId.toString();
    next();
  } catch (error) {
    next(error);
  }
}
