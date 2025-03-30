import { Request, Response } from 'express';
import { db } from '../config/firebase.config';
import Redis from 'ioredis';
import { config } from 'dotenv';

config();

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
});

export const checkServerHealth = async (req: Request, res: Response) => {
    try {
        res.status(200).json({
            status: 'success',
            message: 'Server is healthy',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server health check failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const checkFirebaseHealth = async (req: Request, res: Response) => {
    try {
        // Test Firestore connection
        await db.listCollections();
        
        res.status(200).json({
            status: 'success',
            message: 'Firebase connection is healthy',
            service: 'Firestore',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Firebase health check failed',
            service: 'Firestore',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const checkRedisHealth = async (req: Request, res: Response) => {
    try {
        // Test Redis connection
        await redis.ping();
        
        res.status(200).json({
            status: 'success',
            message: 'Redis connection is healthy',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Redis health check failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const checkAllHealth = async (req: Request, res: Response) => {
    try {
        const healthChecks = {
            server: true,
            firebase: false,
            redis: false
        };

        // Check Firebase
        try {
            await db.listCollections();
            healthChecks.firebase = true;
        } catch (error) {
            console.error('Firebase health check failed:', error);
        }

        // Check Redis
        try {
            await redis.ping();
            healthChecks.redis = true;
        } catch (error) {
            console.error('Redis health check failed:', error);
        }

        const allHealthy = Object.values(healthChecks).every(check => check === true);

        res.status(allHealthy ? 200 : 503).json({
            status: allHealthy ? 'success' : 'partial',
            message: allHealthy ? 'All services are healthy' : 'Some services are unhealthy',
            services: healthChecks,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Health check failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}; 