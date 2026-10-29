import jwt, { SignOptions } from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { AuthUserPayload } from '../types/index.js';

export function signAccessToken(payload: AuthUserPayload): string {
  const options: SignOptions = {
    expiresIn: (ENV.JWT_ACCESS_EXPIRATION || '15m') as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign(payload, ENV.JWT_ACCESS_SECRET, options);
}

export function signRefreshToken(payload: AuthUserPayload): string {
  const options: SignOptions = {
    expiresIn: (ENV.JWT_REFRESH_EXPIRATION || '7d') as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string): AuthUserPayload {
  return jwt.verify(token, ENV.JWT_ACCESS_SECRET) as AuthUserPayload;
}

export function verifyRefreshToken(token: string): AuthUserPayload {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as AuthUserPayload;
}

