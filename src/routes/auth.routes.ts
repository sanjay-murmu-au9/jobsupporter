import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/verify-token', authController.verifyToken);

// Protected routes
router.post('/logout', authenticateToken, authController.logout);
router.get('/me', authenticateToken, authController.getCurrentUser);

export default router; 