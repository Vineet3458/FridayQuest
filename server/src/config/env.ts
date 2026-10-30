import dotenv from 'dotenv';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET ||
  (NODE_ENV === 'production' ? '' : 'fridayquest_access_super_secret_jwt_key_2026_dev');
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  (NODE_ENV === 'production' ? '' : 'fridayquest_refresh_super_secret_jwt_key_2026_dev');
const COOKIE_SECRET =
  process.env.COOKIE_SECRET ||
  (NODE_ENV === 'production' ? '' : 'fridayquest_cookie_secret_key_2026');
const CLIENT_URL = process.env.CLIENT_URL || (NODE_ENV === 'production' ? '' : 'http://localhost:3000');

if (NODE_ENV === 'production') {
  const missingOrWeakSecrets = [
    ['JWT_ACCESS_SECRET', JWT_ACCESS_SECRET],
    ['JWT_REFRESH_SECRET', JWT_REFRESH_SECRET],
    ['COOKIE_SECRET', COOKIE_SECRET],
  ]
    .filter(([, value]) => value.length < 32)
    .map(([name]) => name);

  if (missingOrWeakSecrets.length > 0) {
    throw new Error(`Production requires secrets of at least 32 characters: ${missingOrWeakSecrets.join(', ')}`);
  }
  if (!process.env.MONGO_URI || !process.env.CLIENT_URL) {
    throw new Error('Production requires MONGO_URI and CLIENT_URL to be configured.');
  }
}

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/fridayquest',
  CLIENT_URL,
  CORS_ORIGINS:
    NODE_ENV === 'production'
      ? [CLIENT_URL]
      : [CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || '15m',
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '7d',
  COOKIE_SECRET,
};
