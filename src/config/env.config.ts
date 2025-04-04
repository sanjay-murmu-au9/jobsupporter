import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3001;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Firebase Config
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || '';
export const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY || '';
export const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL || '';

// Redis Config
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || ''; 