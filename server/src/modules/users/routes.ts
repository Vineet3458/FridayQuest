import { Router } from 'express';
import { UsersController } from './controller.js';
import { authenticate } from '../../middleware/auth.js';
import { enforceTenant } from '../../middleware/tenant.js';
import { requireRole } from '../../middleware/role.js';
import { validate } from '../../middleware/validate.js';
import { updateMeSchema, updateRoleSchema } from './schema.js';

const router = Router();

router.use(authenticate, enforceTenant);

router.get('/me', UsersController.getMe);
router.patch('/me', validate({ body: updateMeSchema }), UsersController.updateMe);
router.get('/', requireRole('orgAdmin', 'organizer', 'superAdmin'), UsersController.getOrgUsers);
router.patch('/:id/approve', requireRole('orgAdmin', 'superAdmin'), UsersController.approveUser);
router.patch('/:id/role', requireRole('orgAdmin', 'superAdmin'), validate({ body: updateRoleSchema }), UsersController.updateUserRole);

export default router;
