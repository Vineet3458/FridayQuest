import { Router } from 'express';
import { VibeController } from './controller.js';
import { authenticate } from '../../middleware/auth.js';
import { enforceTenant } from '../../middleware/tenant.js';
import { validate } from '../../middleware/validate.js';
import { submitVibeSchema } from './schema.js';

const router = Router({ mergeParams: true });

router.use(authenticate, enforceTenant);

router.post('/', validate({ body: submitVibeSchema }), VibeController.submitVibe);
router.get('/summary', VibeController.getSummary);

export default router;

