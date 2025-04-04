import { Router } from 'express';
import {
    checkServerHealth,
    checkFirebaseHealth,
    checkAllHealth
} from '../controllers/health.controller';

const router = Router();

// Individual health check endpoints
router.get('/server', checkServerHealth);
router.get('/firebase', checkFirebaseHealth);

// Combined health check endpoint
router.get('/', checkAllHealth);

export default router; 