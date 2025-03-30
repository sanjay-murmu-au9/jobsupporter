import { Router } from 'express';
import { signIn } from '../controllers/auth.controller';

const router = Router();

// Auth routes
router.post('/signin', signIn);

export default router; 