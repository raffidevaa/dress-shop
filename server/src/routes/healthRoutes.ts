import { Router } from 'express';
import { healthCheck } from '../controllers/healthController';

const router = Router();

router.route('/').get(healthCheck);

export { router as healthRoutes };
