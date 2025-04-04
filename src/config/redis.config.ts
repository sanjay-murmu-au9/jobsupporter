import Redis from 'ioredis';
import { config } from 'dotenv';

config();

class RedisService {
    private static instance: RedisService;
    private client: Redis;

    private constructor() {
        try {
            // Create Redis client
            this.client = new Redis({
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                password: process.env.REDIS_PASSWORD,
                retryStrategy: (times) => {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                }
            });

            // Handle connection events
            this.client.on('connect', () => {
                console.log('Redis client connected');
            });

            this.client.on('error', (err) => {
                console.error('Redis client error:', err);
            });

            this.client.on('ready', () => {
                console.log('Redis client ready');
            });

            console.log('Redis client initialized successfully');
        } catch (error) {
            console.error('Error initializing Redis client:', error);
            throw error;
        }
    }

    public static getInstance(): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }

    public getClient(): Redis {
        return this.client;
    }

    public async verifyConnection(): Promise<boolean> {
        try {
            await this.client.ping();
            return true;
        } catch (error) {
            console.error('Redis connection verification failed:', error);
            return false;
        }
    }
}

// Create a singleton instance
const redisService = RedisService.getInstance();

// Export the verification function
export const verifyRedisConnection = () => redisService.verifyConnection();

// Export the Redis client
export const getRedisClient = () => redisService.getClient(); 