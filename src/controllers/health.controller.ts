import { Request, Response } from 'express';
import { redisClient } from '../config/redis.config';
import { firebaseAdmin } from '../config/firebase.config';

interface ServiceHealth {
    status: string;
    error?: string;
    connected?: boolean;
}

interface HealthCheck {
    uptime: number;
    timestamp: number;
    status: string;
    services: {
        redis: ServiceHealth;
        firebase: ServiceHealth;
    };
}

export class HealthController {
    async checkHealth(req: Request, res: Response) {
        const health: HealthCheck = {
            uptime: process.uptime(),
            timestamp: Date.now(),
            status: 'OK',
            services: {
                redis: { status: 'unknown' },
                firebase: { status: 'unknown' }
            }
        };

        try {
            // Check Redis connection
            const redisStatus = await redisClient.ping();
            health.services.redis = {
                status: redisStatus === 'PONG' ? 'healthy' : 'unhealthy',
                connected: redisClient.isOpen
            };
        } catch (error) {
            health.services.redis = {
                status: 'unhealthy',
                error: error instanceof Error ? error.message : 'Redis connection failed',
                connected: false
            };
        }

        try {
            // Check Firebase connection
            if (!firebaseAdmin) {
                throw new Error('Firebase Admin not initialized');
            }

            // Try to get the project ID as a simple test
            const projectId = firebaseAdmin.options.projectId;
            if (!projectId) {
                throw new Error('Firebase project ID not found');
            }

            health.services.firebase = {
                status: 'healthy',
                connected: true
            };
        } catch (error) {
            health.services.firebase = {
                status: 'unhealthy',
                error: error instanceof Error ? error.message : 'Firebase connection failed',
                connected: false
            };
        }

        // Overall health status
        if (health.services.redis.status === 'unhealthy' && 
            health.services.firebase.status === 'unhealthy') {
            health.status = 'Unhealthy';
        } else if (health.services.redis.status === 'unhealthy' || 
                   health.services.firebase.status === 'unhealthy') {
            health.status = 'Degraded';
        }

        const statusCode = health.status === 'OK' ? 200 : 
                          health.status === 'Degraded' ? 200 : 503;

        return res.status(statusCode).json(health);
    }
} 