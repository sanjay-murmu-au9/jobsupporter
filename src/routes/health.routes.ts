import { Router } from 'express';
import {
    checkServerHealth,
    checkFirebaseHealth,
    checkRedisHealth,
    checkAllHealth
} from '../controllers/health.controller';

const router = Router();

// Individual health check endpoints
router.get('/server', checkServerHealth);
router.get('/firebase', checkFirebaseHealth);
router.get('/redis', checkRedisHealth);

// Combined health check endpoint
router.get('/', checkAllHealth);

export default router; 