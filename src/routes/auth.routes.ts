import { Router } from 'express';
import { signIn, login } from '../controllers/auth.controller';

const router = Router();

// Auth routes
router.post('/signin', signIn);
router.post('/login', login);

export default router; 