import { Router } from 'express';
import { SessionsController } from './controller.js';
import { authenticate } from '../../middleware/auth.js';
import { enforceTenant } from '../../middleware/tenant.js';
import { requireRole } from '../../middleware/role.js';
import { validate } from '../../middleware/validate.js';
import { createSessionSchema, updateSessionSchema } from './schema.js';

const router = Router();

// Public route to resolve joinCode to a session
router.get('/join/:code', SessionsController.getSessionByJoinCode);

router.use(authenticate, enforceTenant);

router.get('/', SessionsController.getSessions);
router.post(
  '/',
  requireRole('orgAdmin', 'organizer', 'superAdmin'),
  validate({ body: createSessionSchema }),
  SessionsController.createSession
);
router.get('/:id', SessionsController.getSessionById);
router.patch(
  '/:id',
  requireRole('orgAdmin', 'organizer', 'superAdmin'),
  validate({ body: updateSessionSchema }),
  SessionsController.updateSession
);
router.post('/:id/publish', requireRole('orgAdmin', 'organizer', 'superAdmin'), SessionsController.publishSession);
router.post('/:id/start', requireRole('orgAdmin', 'organizer', 'superAdmin'), SessionsController.startSession);
router.post('/:id/finish', requireRole('orgAdmin', 'organizer', 'superAdmin'), SessionsController.finishSession);

export default router;

