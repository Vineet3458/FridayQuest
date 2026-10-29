import { Router } from 'express';
import { RecapController } from './controller.js';
import { authenticate } from '../../middleware/auth.js';
import { enforceTenant } from '../../middleware/tenant.js';

const router = Router({ mergeParams: true });

router.use(authenticate, enforceTenant);

router.get('/', RecapController.getRecap);

export default router;

