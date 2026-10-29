import { Router } from 'express';
import { RatingsController } from './controller.js';
import { authenticate } from '../../middleware/auth.js';
import { enforceTenant } from '../../middleware/tenant.js';
import { validate } from '../../middleware/validate.js';
import { submitRatingSchema } from './schema.js';

const router = Router({ mergeParams: true });

router.use(authenticate, enforceTenant);

router.get('/', RatingsController.getRatings);
router.post('/', validate({ body: submitRatingSchema }), RatingsController.submitRating);

export default router;

