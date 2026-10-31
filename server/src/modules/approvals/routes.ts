import { Router } from 'express';
import { ApprovalsController } from './controller.js';
import { authenticate } from '../../middleware/auth.js';
import { enforceTenant } from '../../middleware/tenant.js';
import { requireRole } from '../../middleware/role.js';

const router = Router();

router.use(authenticate, enforceTenant);

router.get('/', requireRole('orgAdmin', 'superAdmin'), ApprovalsController.getPending);
router.post('/users/:id/approve', requireRole('orgAdmin', 'superAdmin'), ApprovalsController.approveUser);
router.post('/users/:id/reject', requireRole('orgAdmin', 'superAdmin'), ApprovalsController.rejectUser);
router.post('/games/:id/approve', requireRole('orgAdmin', 'superAdmin'), ApprovalsController.approveGame);
router.post('/games/:id/reject', requireRole('orgAdmin', 'superAdmin'), ApprovalsController.rejectGame);

export default router;

