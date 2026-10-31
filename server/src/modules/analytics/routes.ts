import { Router } from 'express';
import { AnalyticsController } from './controller.js';
import { authenticate } from '../../middleware/auth.js';
import { enforceTenant } from '../../middleware/tenant.js';
import { requireRole } from '../../middleware/role.js';

const router = Router();

router.use(authenticate, enforceTenant);

// Player Dashboard Overview (All authenticated users including player)
router.get('/player', AnalyticsController.getPlayerOverview);

// Organization Analytics (OrgAdmin, Organizer, SuperAdmin)
router.get(
  '/overview',
  requireRole('orgAdmin', 'organizer', 'superAdmin'),
  AnalyticsController.getOverview
);

// Platform Overview (SuperAdmin only)
router.get(
  '/platform',
  requireRole('superAdmin'),
  AnalyticsController.getPlatformOverview
);

export default router;

