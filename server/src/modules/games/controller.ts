import { Request, Response, NextFunction } from 'express';
import { GamesService } from './service.js';
import { sendSuccess } from '../../utils/response.js';

export class GamesController {
  public static async getGames(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        search: req.query.search as string,
        energy: req.query.energy as string,
        pack: req.query.pack as string,
        players: req.query.players ? parseInt(req.query.players as string, 10) : undefined,
        status: req.query.status as string,
      };

      const games = await GamesService.getGames(req.orgId!, filters);
      sendSuccess(res, games);
    } catch (error) {
      next(error);
    }
  }

  public static async getGameById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gameId = req.params.id as string;
      const game = await GamesService.getGameById(gameId, req.orgId!);
      sendSuccess(res, game);
    } catch (error) {
      next(error);
    }
  }

  public static async createGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const game = await GamesService.createGameDraft(req.orgId!, req.user!.userId, req.body);
      sendSuccess(res, game, 'Game draft created', 201);
    } catch (error) {
      next(error);
    }
  }

  public static async updateGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gameId = req.params.id as string;
      const game = await GamesService.updateGame(gameId, req.orgId!, req.body);
      sendSuccess(res, game, 'Game updated');
    } catch (error) {
      next(error);
    }
  }

  public static async validateGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = GamesService.validateGame(req.body);
      sendSuccess(res, validation);
    } catch (error) {
      next(error);
    }
  }

  public static async submitGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gameId = req.params.id as string;
      const game = await GamesService.submitGame(gameId, req.orgId!);
      sendSuccess(res, game, 'Game submitted for approval');
    } catch (error) {
      next(error);
    }
  }

  public static async approveGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gameId = req.params.id as string;
      const game = await GamesService.approveGame(gameId, req.orgId!);
      sendSuccess(res, game, 'Game approved and published');
    } catch (error) {
      next(error);
    }
  }

  public static async dryRun(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const gameId = req.params.id as string;
      const result = await GamesService.dryRun(gameId, req.orgId!);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}
