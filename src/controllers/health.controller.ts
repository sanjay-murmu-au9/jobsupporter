import { Request, Response } from 'express';
import { db } from '../config/firebase.config';
import { getRedisClient } from '../config/redis.config';
import { config } from 'dotenv';

config();

// Get Redis client from our service
const redis = getRedisClient();

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
            service: 'Redis',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Redis health check failed',
            service: 'Redis',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const checkAllHealth = async (req: Request, res: Response) => {
    try {
        // Test all connections
        const [firebaseHealth, redisHealth] = await Promise.all([
            db.listCollections().then(() => true).catch(() => false),
            redis.ping().then(() => true).catch(() => false)
        ]);
        
        const allHealthy = firebaseHealth && redisHealth;
        
        res.status(allHealthy ? 200 : 503).json({
            status: allHealthy ? 'success' : 'partial',
            message: allHealthy ? 'All services are healthy' : 'Some services are unhealthy',
            services: {
                server: true,
                firebase: firebaseHealth,
                redis: redisHealth
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Health check failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });
    }
}; 