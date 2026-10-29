import { Router } from 'express';
import { TeamsController } from './controller.js';
import { authenticate } from '../../middleware/auth.js';
import { enforceTenant } from '../../middleware/tenant.js';
import { requireRole } from '../../middleware/role.js';
import { validate } from '../../middleware/validate.js';
import { generateTeamsSchema, updateTeamsSchema } from './schema.js';

const router = Router({ mergeParams: true });

router.use(authenticate, enforceTenant);

router.get('/', TeamsController.getTeams);
router.post(
  '/generate',
  requireRole('orgAdmin', 'organizer', 'superAdmin'),
  validate({ body: generateTeamsSchema }),
  TeamsController.generateTeams
);
router.put(
  '/',
  requireRole('orgAdmin', 'organizer', 'superAdmin'),
  validate({ body: updateTeamsSchema }),
  TeamsController.updateTeams
);

export default router;

