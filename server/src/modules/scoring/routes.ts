import { Router } from 'express';
import { ScoringController } from './controller.js';
import { authenticate } from '../../middleware/auth.js';
import { enforceTenant } from '../../middleware/tenant.js';
import { requireRole } from '../../middleware/role.js';
import { validate } from '../../middleware/validate.js';
import { awardScoreSchema } from './schema.js';

const router = Router({ mergeParams: true });

router.use(authenticate, enforceTenant);

router.get('/', ScoringController.getScores);
router.post(
  '/',
  requireRole('orgAdmin', 'organizer', 'superAdmin'),
  validate({ body: awardScoreSchema }),
  ScoringController.awardScore
);

export default router;

