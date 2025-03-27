import { Request, Response } from 'express';
import { auth } from '../config/firebase.config';
import { redisClient } from '../config/redis.config';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class AuthController {
    async verifyToken(req: Request, res: Response) {
        try {
            const { token } = req.body;
            
            if (!token) {
                return res.status(400).json({ message: 'Token is required' });
            }

            const decodedToken = await auth.verifyIdToken(token);
            
            // Store user session in Redis
            await redisClient.set(
                `session:${decodedToken.uid}`,
                JSON.stringify({
                    id: decodedToken.uid,
                    email: decodedToken.email,
                    name: decodedToken.name,
                }),
                { EX: 86400 } // 24 hours
            );

            return res.status(200).json({
                user: {
                    id: decodedToken.uid,
                    email: decodedToken.email,
                    name: decodedToken.name,
                },
            });
        } catch (error) {
            console.error('Token Verification Error:', error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    }

    async logout(req: AuthenticatedRequest, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader?.split(' ')[1];

            if (token && req.user?.id) {
                // Blacklist the token
                await redisClient.set(`blacklist:${token}`, '1', { EX: 86400 });
                // Remove user session
                await redisClient.del(`session:${req.user.id}`);
            }

            return res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error('Logout Error:', error);
            return res.status(500).json({ message: 'Error during logout' });
        }
    }

    async getCurrentUser(req: AuthenticatedRequest, res: Response) {
        try {
            if (!req.user?.id) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            const sessionData = await redisClient.get(`session:${req.user.id}`);
            
            if (!sessionData) {
                return res.status(401).json({ message: 'Session expired' });
            }

            return res.status(200).json({ user: JSON.parse(sessionData) });
        } catch (error) {
            console.error('Get Current User Error:', error);
            return res.status(500).json({ message: 'Error fetching user data' });
        }
    }
} 