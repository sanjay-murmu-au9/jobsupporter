import { createClient } from 'redis';
import { config } from 'dotenv';

config();

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD || undefined
});

export const initializeRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Redis connection error:', error);
        throw error;
    }
};

export { redisClient }; 