import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase.config';
import { redisClient } from '../config/redis.config';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string;
    };
}

export const authenticateToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];
        
        try {
            // Check if token is blacklisted in Redis
            const isBlacklisted = await redisClient.get(`blacklist:${token}`);
            if (isBlacklisted) {
                return res.status(401).json({ message: 'Unauthorized: Token has been revoked' });
            }
        } catch (redisError) {
            console.warn('Redis unavailable for token blacklist check:', redisError);
            // Continue without Redis - tokens won't be revocable but basic auth still works
        }

        // Verify Firebase token
        const decodedToken = await auth.verifyIdToken(token);
        
        req.user = {
            id: decodedToken.uid,
            email: decodedToken.email || '',
            name: decodedToken.name || '',
        };

        next();
    } catch (error) {
        console.error('Authentication Error:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}; 