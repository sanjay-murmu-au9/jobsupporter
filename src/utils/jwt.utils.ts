import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config';

interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export const generateToken = (userId: string): string => {
  const payload: JWTPayload = {
    userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };

  return jwt.sign(payload, JWT_SECRET as jwt.Secret);
};

export const verifyToken = (token: string): jwt.JwtPayload => {
  return jwt.verify(token, JWT_SECRET as jwt.Secret) as jwt.JwtPayload;
}; 