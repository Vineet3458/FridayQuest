import { Router } from 'express';
import { AuthController } from './controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import {
  registerOrgSchema,
  registerEmployeeSchema,
  loginSchema,
  refreshTokenSchema,
} from './schema.js';

const router = Router();

router.get('/me', authenticate, AuthController.getMe);
router.post('/register-org', validate({ body: registerOrgSchema }), AuthController.registerOrg);
router.post('/register', validate({ body: registerEmployeeSchema }), AuthController.registerEmployee);
router.post('/login', validate({ body: loginSchema }), AuthController.login);
router.post('/logout', authenticate, AuthController.logout);
router.post('/refresh', validate({ body: refreshTokenSchema }), AuthController.refresh);

export default router;
