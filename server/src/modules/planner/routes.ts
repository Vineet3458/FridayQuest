import { Router } from 'express';
import { PlannerController } from './controller.js';
import { authenticate } from '../../middleware/auth.js';
import { enforceTenant } from '../../middleware/tenant.js';
import { requireRole } from '../../middleware/role.js';
import { validate } from '../../middleware/validate.js';
import { generatePlanSchema } from './schema.js';

const router = Router({ mergeParams: true });

router.use(authenticate, enforceTenant);

router.post(
  '/',
  requireRole('orgAdmin', 'organizer', 'superAdmin'),
  validate({ body: generatePlanSchema }),
  PlannerController.generatePlan
);
router.get('/alternatives', PlannerController.getAlternatives);

export default router;

