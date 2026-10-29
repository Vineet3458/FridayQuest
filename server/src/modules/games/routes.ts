import { Router } from 'express';
import { GamesController } from './controller.js';
import { authenticate } from '../../middleware/auth.js';
import { enforceTenant } from '../../middleware/tenant.js';
import { requireRole } from '../../middleware/role.js';
import { validate } from '../../middleware/validate.js';
import { createGameSchema, updateGameSchema, gameDefinitionSchema } from './schema.js';

const router = Router();

router.use(authenticate, enforceTenant);

router.get('/', GamesController.getGames);
router.get('/:id', GamesController.getGameById);
router.post('/', validate({ body: createGameSchema }), GamesController.createGame);
router.patch('/:id', validate({ body: updateGameSchema }), GamesController.updateGame);
router.post('/validate-definition', validate({ body: gameDefinitionSchema }), GamesController.validateGame);
router.post('/:id/submit', GamesController.submitGame);
router.post('/:id/approve', requireRole('orgAdmin', 'superAdmin'), GamesController.approveGame);
router.post('/:id/dryrun', GamesController.dryRun);

export default router;

