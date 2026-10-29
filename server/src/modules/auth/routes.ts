import { Router } from 'express';
import { AuthController } from './controller.js';
import { validate } from '../../middleware/validate.js';
import {
  registerOrgSchema,
  registerEmployeeSchema,
  loginSchema,
  refreshTokenSchema,
  trialRoleSchema,
} from './schema.js';

const router = Router();

router.post('/register-org', validate({ body: registerOrgSchema }), AuthController.registerOrg);
router.post('/register', validate({ body: registerEmployeeSchema }), AuthController.registerEmployee);
router.post('/login', validate({ body: loginSchema }), AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/refresh', validate({ body: refreshTokenSchema }), AuthController.refresh);
router.post('/trial', validate({ body: trialRoleSchema }), AuthController.trialLogin);


export default router;

