import { Router } from 'express';
import { signIn, login, listUsers } from '../controllers/auth.controller';

const router = Router();

// Auth routes
router.post('/signin', signIn);
router.post('/login', login);
router.get('/users', listUsers);

export default router; 