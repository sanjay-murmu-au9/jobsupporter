import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

const router = Router();
const healthController = new HealthController();

router.get('/', healthController.checkHealth.bind(healthController));
router.get('/ping', (_, res) => res.status(200).json({ status: 'OK' }));

export default router; 